import { z } from "zod";
import { desc, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

import { db } from "@/db";
import { investments, users } from "@/db/schema";
import { createTRPCRouter, privateProcedure } from "@/server/trpc";
import { getUpdatedBalance } from "@/lib/utils";

export const investmentRouter = createTRPCRouter({
  getInvestmentEntries: privateProcedure.query(async ({ ctx }) => {
    const investmentEntries = await db
      .select()
      .from(investments)
      .where(eq(investments.userId, ctx.userId))
      .orderBy(desc(investments.createdAt));

    //put a limit on the number of transactions returned

    return investmentEntries;
  }),
  addInvestmentEntry: privateProcedure
    .input(
      z.object({
        amount: z.number().positive(),
        description: z.string().min(1).max(100),
        investmentType: z.string().min(1).max(100),
        entryType: z.enum(["in", "out"]),
        initialBalance: z.number(),
        initialTotalInvested: z.number().optional().default(0),
        tradeBooking: z.boolean().optional().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.entryType === "in") {
        await db
          .update(users)
          .set({
            investmentsBalance: input.initialBalance + input.amount,
          })
          .where(eq(users.id, ctx.userId));
      } else {
        if (input.tradeBooking) {
          await db
            .update(users)
            .set({
              investmentsBalance: input.initialBalance - input.amount,
            })
            .where(eq(users.id, ctx.userId));
        } else {
          if (input.initialBalance < input.amount) {
            throw new TRPCError({
              code: "UNPROCESSABLE_CONTENT",
              message: "Amount is greater than balance",
            });
          }

          await db
            .update(users)
            .set({
              investmentsBalance: input.initialBalance - input.amount,
              totalInvested: input.initialTotalInvested + input.amount,
            })
            .where(eq(users.id, ctx.userId));
        }
      }

      await db.insert(investments).values({
        userId: ctx.userId,
        amount: input.amount,
        entryName: input.description,
        entryType: input.entryType,
        investmentType: input.investmentType,
        tradeBooks: input.tradeBooking,
      });
    }),
  editInvestmentEntry: privateProcedure
    .input(
      z.object({
        investId: z.number(),
        amount: z.number().positive(),
        description: z.string().min(1).max(100),
        entryType: z.enum(["in", "out"]),
        initialBalance: z.number(),
        tradeBooking: z.boolean(),
        investmentType: z.string().min(1).max(100),
        initialTotalInvested: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
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
          input.initialBalance,
          investmentEntry.amount,
          input.amount,
          input.entryType,
          investmentEntry.entryType
        );
      } else {
        updatedBalance =
          input.initialBalance + investmentEntry.amount - input.amount;
        updatedTotalInvestedBalance =
          input.initialTotalInvested - investmentEntry.amount + input.amount;
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
            investmentType: input.investmentType,
            createdAt: investmentEntry.createdAt,
            tradeBooks: input.tradeBooking,
          })
          .where(eq(investments.id, input.investId)),
      ];

      await Promise.all(promises);
    }),
  deleteInvestmentEntry: privateProcedure
    .input(
      z.object({
        initialBalance: z.number(),
        entryType: z.enum(["in", "out"]),
        investId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
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

      let updatedBalance;

      if (input.entryType === "in") {
        updatedBalance =
          input.initialBalance - existingInvestmentEntry[0].amount;
      } else {
        updatedBalance =
          input.initialBalance + existingInvestmentEntry[0].amount;
      }

      const promises = [
        db
          .update(users)
          .set({
            investmentsBalance: updatedBalance,
          })
          .where(eq(users.id, ctx.userId)),
        db.delete(investments).where(eq(investments.id, input.investId)),
      ];

      await Promise.all(promises);
    }),
});
