import { z } from "zod";
import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { dues, users } from "@/db/schema";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { createTRPCRouter, privateProcedure } from "@/server/trpc";

export const dueRouter = createTRPCRouter({
  getDueEntries: privateProcedure.query(async ({ ctx }) => {
    const miscTransactions = await db
      .select()
      .from(dues)
      .where(eq(dues.userId, ctx.userId))
      .limit(INFINITE_SCROLLING_PAGINATION_RESULTS)
      .orderBy(desc(dues.createdAt));

    return miscTransactions;
  }),
  addDueEntry: privateProcedure
    .input(
      z.object({
        amount: z.number().positive(),
        description: z.string().min(1).max(100),
        dueDate: z.date().min(getTomorrowDate()),
        dueType: z.enum(["payable", "receivable"]),
        initialBalance: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.dueType === "payable") {
        await db
          .update(users)
          .set({
            duePayable: input.initialBalance + input.amount,
          })
          .where(eq(users.id, ctx.userId));
      } else {
        await db
          .update(users)
          .set({
            dueReceivable: input.initialBalance + input.amount,
          })
          .where(eq(users.id, ctx.userId));
      }

      await db.insert(dues).values({
        userId: ctx.userId,
        amount: input.amount,
        entryName: input.description,
        dueDate: input.dueDate,
        dueType: input.dueType,
      });
    }),
});

function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return tomorrow;
}
