import { z } from "zod";
import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { miscellaneous, users } from "@/db/schema";
import { createTRPCRouter, privateProcedure } from "@/server/trpc";
import { TRPCError } from "@trpc/server";

export const miscRouter = createTRPCRouter({
  getMiscTransactions: privateProcedure.query(async ({ ctx }) => {
    const miscTransactions = await db
      .select()
      .from(miscellaneous)
      .where(eq(miscellaneous.userId, ctx.userId))
      .orderBy(desc(miscellaneous.createdAt));

    //put a limit on the number of transactions returned

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
  editMiscEntry: privateProcedure
    .input(
      z.object({
        miscId: z.number(),
        amount: z.number().positive(),
        description: z.string().min(1).max(100),
        entryType: z.enum(["in", "out"]),
        initialBalance: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const rawMiscEntry = await db
        .select()
        .from(miscellaneous)
        .where(eq(miscellaneous.id, input.miscId));

      if (rawMiscEntry.length === 0)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Entry not found",
        });

      const miscEntry = rawMiscEntry[0]; // there should only be one entry with that id

      const updatedBalance = getUpdatedBalance(
        input.initialBalance,
        miscEntry.amount,
        input.amount,
        input.entryType,
        miscEntry.entryType
      );

      await db
        .update(users)
        .set({
          miscellanousBalance: updatedBalance,
        })
        .where(eq(users.id, ctx.userId));

      await db
        .update(miscellaneous)
        .set({
          amount: input.amount,
          entryName: input.description,
          entryType: input.entryType,
          createdAt: miscEntry.createdAt,
        })
        .where(eq(miscellaneous.id, input.miscId));
    }),
});

const getUpdatedBalance = (
  initialBalance: number,
  existingAmount: number,
  updatedAmount: number,
  updatedEntryType: "in" | "out",
  existingEntryType: "in" | "out"
) => {
  if (updatedEntryType === existingEntryType) {
    if (updatedEntryType === "in") {
      return initialBalance - existingAmount + updatedAmount;
    }
    return initialBalance + existingAmount - updatedAmount;
  } else {
    if (existingEntryType === "in") {
      return initialBalance - existingAmount - updatedAmount;
    }

    return initialBalance + existingAmount + updatedAmount;
  }
};
