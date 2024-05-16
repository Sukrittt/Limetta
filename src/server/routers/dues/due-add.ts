import { z } from "zod";
import { eq } from "drizzle-orm";
import { createTRPCRouter } from "@/server/trpc";

import { db } from "@/db";
import { dues, users } from "@/db/schema";
import { privateProcedure } from "@/server/trpc";
import { userRouter } from "@/server/routers/user";

export const DueAddRouter = createTRPCRouter({
  addDueEntry: privateProcedure
    .input(
      z.object({
        amount: z.number().positive(),
        description: z.string().min(1).max(100),
        dueDate: z.date().min(new Date()),
        dueType: z.enum(["payable", "receivable"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const caller = userRouter.createCaller(ctx);
      const currentUser = await caller.getCurrentUser();

      if (input.dueType === "payable") {
        await db
          .update(users)
          .set({
            duePayable: currentUser.duePayable + input.amount,
          })
          .where(eq(users.id, ctx.userId));
      } else {
        await db
          .update(users)
          .set({
            dueReceivable: currentUser.dueReceivable + input.amount,
          })
          .where(eq(users.id, ctx.userId));
      }

      await db.insert(dues).values({
        userId: ctx.userId,
        amount: input.amount.toString(),
        entryName: input.description,
        dueDate: input.dueDate,
        dueType: input.dueType,
      });
    }),
});
