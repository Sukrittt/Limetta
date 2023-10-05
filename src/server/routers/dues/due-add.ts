import { createTRPCRouter } from "@/server/trpc";
import { z } from "zod";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { dues, users } from "@/db/schema";
import { privateProcedure } from "@/server/trpc";

export const DueAddRouter = createTRPCRouter({
  addDueEntry: privateProcedure
    .input(
      z.object({
        amount: z.number().positive(),
        description: z.string().min(1).max(100),
        dueDate: z.date().min(new Date()),
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
