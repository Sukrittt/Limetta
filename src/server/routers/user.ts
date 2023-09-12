import { z } from "zod";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users } from "@/db/schema";
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
      })
    )
    .mutation(async ({ ctx, input }) => {
      await db
        .update(users)
        .set({
          monthlyIncome: input.monthlyIncome,
          needsPercentage: input.needsPercentage,
          wantsPercentage: input.wantsPercentage,
          investmentsPercentage: input.investmentsPercentage,
        })
        .where(eq(users.id, ctx.userId));
    }),
});
