import { z } from "zod";
import { and, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { books, users } from "@/db/schema";
import { createTRPCRouter, privateProcedure } from "@/server/trpc";

export const userRouter = createTRPCRouter({
  getCurrentUser: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    const currentUser = await db
      .select()
      .from(users)
      .limit(1)
      .where(eq(users.id, userId));

    const firstUser = currentUser[0]; // there will be only one user with this userId

    return firstUser;
  }),
  updateMonthlyIncome: privateProcedure
    .input(
      z.object({
        monthlyIncome: z.number(),
        needsPercentage: z.number(),
        wantsPercentage: z.number(),
        investmentsPercentage: z.number(),
        currency: z.string().min(1).max(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const promises = [
        db
          .update(books)
          .set({
            monthIncome: input.monthlyIncome.toString(),
            needsPercentage: input.needsPercentage.toString(),
            wantsPercentage: input.wantsPercentage.toString(),
            investmentsPercentage: input.investmentsPercentage.toString(),
          })
          .where(
            and(
              eq(books.userId, ctx.userId),
              sql`EXTRACT(MONTH FROM books."createdAt") = EXTRACT(MONTH FROM NOW())`,
              sql`EXTRACT(YEAR FROM books."createdAt") = EXTRACT(YEAR FROM NOW())`
            )
          ),
        db
          .update(users)
          .set({
            monthlyIncome: input.monthlyIncome.toString(),
            needsPercentage: input.needsPercentage.toString(),
            wantsPercentage: input.wantsPercentage.toString(),
            investmentsPercentage: input.investmentsPercentage.toString(),
            currency: input.currency,
          })
          .where(eq(users.id, ctx.userId)),
      ];

      await Promise.all(promises);
    }),
});
