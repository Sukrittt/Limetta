import { z } from "zod";
import { desc, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

import { db } from "@/db";
import { userRouter } from "./user";
import { getUpdatedBalance } from "@/lib/utils";
import { miscellaneous, users } from "@/db/schema";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { createTRPCRouter, privateProcedure } from "@/server/trpc";

export const miscRouter = createTRPCRouter({
  getMiscTransactions: privateProcedure.query(async ({ ctx }) => {
    const miscTransactions = await db
      .select()
      .from(miscellaneous)
      .where(eq(miscellaneous.userId, ctx.userId))
      .limit(INFINITE_SCROLLING_PAGINATION_RESULTS)
      .orderBy(desc(miscellaneous.createdAt));

    return miscTransactions;
  }),
  addMiscEntry: privateProcedure
    .input(
      z.object({
        amount: z.number().positive(),
        description: z.string().min(1).max(100),
        entryType: z.enum(["in", "out"]),
        entryDate: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const caller = userRouter.createCaller(ctx);
      const currentUser = await caller.getCurrentUser();

      if (input.entryType === "in") {
        await db
          .update(users)
          .set({
            miscellanousBalance: (
              parseFloat(currentUser.miscellanousBalance) + input.amount
            ).toString(),
          })
          .where(eq(users.id, ctx.userId));
      } else {
        await db
          .update(users)
          .set({
            miscellanousBalance: (
              parseFloat(currentUser.miscellanousBalance) - input.amount
            ).toString(),
          })
          .where(eq(users.id, ctx.userId));
      }

      await db.insert(miscellaneous).values({
        userId: ctx.userId,
        amount: input.amount.toString(),
        entryName: input.description,
        entryType: input.entryType,
        createdAt: input.entryDate,
      });
    }),
  editMiscEntry: privateProcedure
    .input(
      z.object({
        miscId: z.number(),
        amount: z.number().positive(),
        description: z.string().min(1).max(100),
        entryType: z.enum(["in", "out"]),
        entryDate: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const caller = userRouter.createCaller(ctx);
      const currentUser = await caller.getCurrentUser();

      const existingMiscEntry = await db
        .select()
        .from(miscellaneous)
        .where(eq(miscellaneous.id, input.miscId));

      if (existingMiscEntry.length === 0)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Entry not found",
        });

      const miscEntry = existingMiscEntry[0]; // there should only be one entry with that id

      const updatedBalance = getUpdatedBalance(
        parseFloat(currentUser.miscellanousBalance),
        parseFloat(miscEntry.amount),
        input.amount,
        input.entryType,
        miscEntry.entryType
      );

      const promises = [
        db
          .update(users)
          .set({
            miscellanousBalance: updatedBalance.toString(),
          })
          .where(eq(users.id, ctx.userId)),
        db
          .update(miscellaneous)
          .set({
            amount: input.amount.toString(),
            entryName: input.description,
            entryType: input.entryType,
            createdAt: input.entryDate,
          })
          .where(eq(miscellaneous.id, input.miscId)),
      ];

      await Promise.all(promises);
    }),
  deleteMiscEntry: privateProcedure
    .input(
      z.object({
        entryType: z.enum(["in", "out"]),
        miscId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const caller = userRouter.createCaller(ctx);
      const currentUser = await caller.getCurrentUser();

      const existingMiscEntry = await db
        .select()
        .from(miscellaneous)
        .where(eq(miscellaneous.id, input.miscId));

      if (existingMiscEntry.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Entry not found",
        });
      }

      let updatedBalance: number;

      if (input.entryType === "in") {
        updatedBalance =
          parseFloat(currentUser.miscellanousBalance) -
          parseFloat(existingMiscEntry[0].amount);
      } else {
        updatedBalance =
          parseFloat(currentUser.miscellanousBalance) +
          parseFloat(existingMiscEntry[0].amount);
      }

      const promises = [
        db
          .update(users)
          .set({
            miscellanousBalance: updatedBalance.toString(),
          })
          .where(eq(users.id, ctx.userId)),
        db.delete(miscellaneous).where(eq(miscellaneous.id, input.miscId)),
      ];

      await Promise.all(promises);
    }),
});
