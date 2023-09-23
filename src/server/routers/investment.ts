import { z } from "zod";
import { desc, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

import { db } from "@/db";
import { investments, users } from "@/db/schema";
import { createTRPCRouter, privateProcedure } from "@/server/trpc";

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
        //booking profit/loss
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
      });
    }),
});
