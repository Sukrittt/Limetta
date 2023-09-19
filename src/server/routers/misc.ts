import { z } from "zod";
import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { miscellaneous, users } from "@/db/schema";
import { createTRPCRouter, privateProcedure } from "@/server/trpc";

export const miscRouter = createTRPCRouter({
  getMiscTransactions: privateProcedure.query(async ({ ctx }) => {
    const miscTransactions = await db
      .select()
      .from(miscellaneous)
      .where(eq(miscellaneous.userId, ctx.userId))
      .orderBy(desc(miscellaneous.createdAt));

    return miscTransactions;
  }),
  addMiscEntry: privateProcedure
    .input(
      z.object({
        amount: z.number().positive(),
        description: z.string().min(1).max(100),
        entryType: z.enum(["in", "out"]),
        initialBalance: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.entryType === "in") {
        await db
          .update(users)
          .set({
            miscellanousBalance: input.initialBalance + input.amount,
          })
          .where(eq(users.id, ctx.userId));
      } else {
        await db
          .update(users)
          .set({
            miscellanousBalance: input.initialBalance - input.amount,
          })
          .where(eq(users.id, ctx.userId));
      }

      await db.insert(miscellaneous).values({
        userId: ctx.userId,
        amount: input.amount,
        entryName: input.description,
        entryType: input.entryType,
      });
    }),
});
