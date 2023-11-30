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
            monthIncome: input.monthlyIncome,
            needsPercentage: input.needsPercentage,
            wantsPercentage: input.wantsPercentage,
            investmentsPercentage: input.investmentsPercentage,
          })
          .where(
            and(
              eq(books.userId, ctx.userId),
              sql`MONTH(books.createdAt) = MONTH(NOW())`,
              sql`YEAR(books.createdAt) = YEAR(NOW())`
            )
          ),
        db
          .update(users)
          .set({
            monthlyIncome: input.monthlyIncome,
            needsPercentage: input.needsPercentage,
            wantsPercentage: input.wantsPercentage,
            investmentsPercentage: input.investmentsPercentage,
            currency: input.currency,
          })
          .where(eq(users.id, ctx.userId)),
      ];

      await Promise.all(promises);
    }),
});
