import { z } from "zod";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { TRPCError } from "@trpc/server";
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
      .orderBy(dues.dueDate);

    return miscTransactions;
  }),
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
  editDueEntry: privateProcedure
    .input(
      z.object({
        dueId: z.number(),
        amount: z.number().positive(),
        description: z.string().min(1).max(100),
        dueDate: z.date().min(new Date()),
        dueType: z.enum(["payable", "receivable"]),
        duePayableBalance: z.number(),
        dueReceivableBalance: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingDueEntry = await db
        .select()
        .from(dues)
        .where(eq(dues.id, input.dueId));

      if (existingDueEntry.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Due entry not found",
        });
      }

      const existingDueEntryData = existingDueEntry[0]; // since we are querying by id, there will be only one entry

      if (input.dueType !== existingDueEntryData.dueType) {
        if (input.dueType === "payable") {
          await db
            .update(users)
            .set({
              duePayable: input.duePayableBalance + input.amount,
              dueReceivable:
                input.dueReceivableBalance - existingDueEntryData.amount,
            })
            .where(eq(users.id, ctx.userId));
        } else {
          await db
            .update(users)
            .set({
              duePayable: input.duePayableBalance - existingDueEntryData.amount,
              dueReceivable: input.dueReceivableBalance + input.amount,
            })
            .where(eq(users.id, ctx.userId));
        }
      } else {
        if (input.dueType === "payable") {
          await db
            .update(users)
            .set({
              duePayable:
                input.duePayableBalance -
                existingDueEntryData.amount +
                input.amount,
            })
            .where(eq(users.id, ctx.userId));
        } else {
          await db
            .update(users)
            .set({
              dueReceivable:
                input.dueReceivableBalance -
                existingDueEntryData.amount +
                input.amount,
            })
            .where(eq(users.id, ctx.userId));
        }
      }

      await db
        .update(dues)
        .set({
          amount: input.amount,
          entryName: input.description,
          dueDate: input.dueDate,
          dueType: input.dueType,
        })
        .where(eq(dues.id, input.dueId));
    }),
  deleteDueEntry: privateProcedure
    .input(
      z.object({
        dueId: z.number(),
        dueType: z.enum(["payable", "receivable"]),
        duePayableBalance: z.number(),
        dueReceivableBalance: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingDueEntry = await db
        .select()
        .from(dues)
        .where(eq(dues.id, input.dueId));

      if (existingDueEntry.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Due entry not found",
        });
      }

      const existingDueEntryData = existingDueEntry[0]; // since we are querying by id, there will be only one entry

      if (input.dueType === "payable") {
        await db
          .update(users)
          .set({
            duePayable: input.duePayableBalance - existingDueEntryData.amount,
          })
          .where(eq(users.id, ctx.userId));
      } else {
        await db
          .update(users)
          .set({
            dueReceivable:
              input.dueReceivableBalance - existingDueEntryData.amount,
          })
          .where(eq(users.id, ctx.userId));
      }

      await db.delete(dues).where(eq(dues.id, input.dueId));
    }),
  dueMarkPaid: privateProcedure
    .input(
      z.object({
        dueId: z.number(),
        updatedDueStatus: z.enum(["paid", "pending"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingDueEntry = await db
        .select()
        .from(dues)
        .where(eq(dues.id, input.dueId));

      if (existingDueEntry.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Due entry not found",
        });
      }

      await db
        .update(dues)
        .set({
          dueStatus: input.updatedDueStatus,
        })
        .where(eq(dues.id, input.dueId));
    }),
});
