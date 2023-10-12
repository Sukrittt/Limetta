import { z } from "zod";
import { desc, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

import { db } from "@/db";
import { userRouter } from "./user";
import { getUpdatedBalance } from "@/lib/utils";
import { investments, users } from "@/db/schema";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { createTRPCRouter, privateProcedure } from "@/server/trpc";

export const investmentRouter = createTRPCRouter({
  getInvestmentEntries: privateProcedure.query(async ({ ctx }) => {
    const investmentEntries = await db
      .select()
      .from(investments)
      .where(eq(investments.userId, ctx.userId))
      .limit(INFINITE_SCROLLING_PAGINATION_RESULTS)
      .orderBy(desc(investments.createdAt));

    return investmentEntries;
  }),
  addInvestmentEntry: privateProcedure
    .input(
      z.object({
        amount: z.number().positive(),
        description: z.string().min(1).max(100),
        entryType: z.enum(["in", "out"]),
        tradeBooking: z.boolean().optional().default(false),
        investedAmount: z.number().optional().default(0),
        entryDate: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const caller = userRouter.createCaller(ctx);
      const currentUser = await caller.getCurrentUser();

      if (input.tradeBooking) {
        await db.insert(investments).values({
          userId: ctx.userId,
          amount: input.investedAmount,
          entryName: input.description,
          entryType: input.entryType,
          createdAt: input.entryDate,
        });

        if (input.entryType === "in") {
          await db
            .update(users)
            .set({
              investmentsBalance:
                currentUser.investmentsBalance +
                input.investedAmount +
                input.amount,
            })
            .where(eq(users.id, ctx.userId));
        } else {
          await db
            .update(users)
            .set({
              investmentsBalance:
                currentUser.investmentsBalance +
                input.investedAmount -
                input.amount,
            })
            .where(eq(users.id, ctx.userId));
        }
      } else {
        if (input.amount > currentUser.investmentsBalance) {
          throw new TRPCError({
            code: "UNPROCESSABLE_CONTENT",
            message: "Amount is greater than balance",
          });
        }

        await db
          .update(users)
          .set({
            investmentsBalance: currentUser.investmentsBalance - input.amount,
            totalInvested: currentUser.totalInvested + input.amount,
          })
          .where(eq(users.id, ctx.userId));
      }

      await db.insert(investments).values({
        userId: ctx.userId,
        amount: input.amount,
        entryName: input.description,
        entryType: input.entryType,
        tradeBooks: input.tradeBooking,
        createdAt: input.entryDate,
      });
    }),
  editInvestmentEntry: privateProcedure
    .input(
      z.object({
        investId: z.number(),
        amount: z.number().positive(),
        description: z.string().min(1).max(100),
        entryType: z.enum(["in", "out"]),
        tradeBooking: z.boolean(),
        entryDate: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const caller = userRouter.createCaller(ctx);
      const currentUser = await caller.getCurrentUser();

      const existingInvestmentEntry = await db
        .select()
        .from(investments)
        .where(eq(investments.id, input.investId));

      if (existingInvestmentEntry.length === 0)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Entry not found",
        });

      const investmentEntry = existingInvestmentEntry[0]; // there should only be one entry with that id
      let updatedBalance, updatedTotalInvestedBalance;

      if (input.tradeBooking) {
        updatedBalance = getUpdatedBalance(
          currentUser.investmentsBalance,
          investmentEntry.amount,
          input.amount,
          input.entryType,
          investmentEntry.entryType
        );
      } else {
        updatedBalance =
          currentUser.investmentsBalance +
          investmentEntry.amount -
          input.amount;
        updatedTotalInvestedBalance =
          currentUser.totalInvested - investmentEntry.amount + input.amount;
      }

      const promises = [
        db
          .update(users)
          .set({
            investmentsBalance: updatedBalance,
            totalInvested: updatedTotalInvestedBalance,
          })
          .where(eq(users.id, ctx.userId)),
        db
          .update(investments)
          .set({
            amount: input.amount,
            entryName: input.description,
            entryType: input.entryType,
            createdAt: input.entryDate,
            tradeBooks: input.tradeBooking,
          })
          .where(eq(investments.id, input.investId)),
      ];

      await Promise.all(promises);
    }),
  deleteInvestmentEntry: privateProcedure
    .input(
      z.object({
        tradeBooking: z.boolean(),
        entryType: z.enum(["in", "out"]),
        investId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const caller = userRouter.createCaller(ctx);
      const currentUser = await caller.getCurrentUser();

      const existingInvestmentEntry = await db
        .select()
        .from(investments)
        .where(eq(investments.id, input.investId));

      if (existingInvestmentEntry.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Entry not found",
        });
      }

      let updatedBalance, updatedTotalInvestedBalance;

      if (input.entryType === "in") {
        updatedBalance =
          currentUser.investmentsBalance - existingInvestmentEntry[0].amount;
      } else {
        updatedBalance =
          currentUser.investmentsBalance + existingInvestmentEntry[0].amount;

        if (!input.tradeBooking) {
          updatedTotalInvestedBalance =
            currentUser.totalInvested - existingInvestmentEntry[0].amount;
        }
      }

      const promises = [
        db
          .update(users)
          .set({
            investmentsBalance: updatedBalance,
            totalInvested: updatedTotalInvestedBalance,
          })
          .where(eq(users.id, ctx.userId)),
        db.delete(investments).where(eq(investments.id, input.investId)),
      ];

      await Promise.all(promises);
    }),
});
