import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { and, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { books, needs, wants } from "@/db/schema";
import { createTRPCRouter, privateProcedure } from "@/server/trpc";

export const entryRouter = createTRPCRouter({
  addEntry: privateProcedure
    .input(
      z.object({
        expenseType: z.enum(["need", "want"]),
        amount: z.number().positive(),
        description: z.string().min(1).max(50),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const currentMonthBooks = await db
        .select()
        .from(books)
        .where(
          and(
            eq(books.userId, ctx.userId),
            sql`MONTH(books.createdAt) = MONTH(NOW())`,
            sql`YEAR(books.createdAt) = YEAR(NOW())`
          )
        );

      let bookId;

      if (currentMonthBooks.length === 0) {
        const newlyCreatedBook = await db.insert(books).values({
          userId: ctx.userId,
        });

        bookId = parseInt(newlyCreatedBook.insertId);
      } else {
        bookId = currentMonthBooks[0].id;
      }

      if (input.expenseType === "need") {
        await db.insert(needs).values({
          amount: input.amount,
          description: input.description,
          bookId,
          userId: ctx.userId,
        });
      } else if (input.expenseType === "want") {
        await db.insert(wants).values({
          amount: input.amount,
          description: input.description,
          bookId,
          userId: ctx.userId,
        });
      }
    }),
  deleteEntry: privateProcedure
    .input(
      z.object({ expenseId: z.number(), expenseType: z.enum(["need", "want"]) })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.expenseType === "need") {
        const existingNeedEntry = await db
          .select()
          .from(needs)
          .where(eq(needs.id, input.expenseId));

        if (existingNeedEntry.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "No such entry found",
          });
        }

        if (existingNeedEntry[0].userId !== ctx.userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You are not authorized to delete this entry",
          });
        }

        await db.delete(needs).where(eq(needs.id, input.expenseId));
      } else if (input.expenseType === "want") {
        const existingWantEntry = await db
          .select()
          .from(wants)
          .where(eq(wants.id, input.expenseId));

        if (existingWantEntry.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "No such entry found",
          });
        }

        if (existingWantEntry[0].userId !== ctx.userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You are not authorized to delete this entry",
          });
        }

        await db.delete(wants).where(eq(wants.id, input.expenseId));
      }
    }),
  editEntry: privateProcedure
    .input(
      z.object({
        bookId: z.number(),
        expenseId: z.number(),
        initialExpenseType: z.enum(["need", "want"]),
        expenseType: z.enum(["need", "want"]),
        amount: z.number().positive(),
        description: z.string().min(1).max(50),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.initialExpenseType === "need") {
        const existingNeedEntry = await db
          .select()
          .from(needs)
          .where(eq(needs.id, input.expenseId));

        if (existingNeedEntry.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "No such entry found",
          });
        }

        if (existingNeedEntry[0].userId !== ctx.userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You are not authorized to update this entry",
          });
        }

        if (input.expenseType !== input.initialExpenseType) {
          await db.delete(needs).where(eq(needs.id, input.expenseId));

          await db.insert(wants).values({
            amount: input.amount,
            description: input.description,
            bookId: input.bookId,
            userId: ctx.userId,
            createdAt: existingNeedEntry[0].createdAt,
          });
        } else {
          await db
            .update(needs)
            .set({ amount: input.amount, description: input.description })
            .where(eq(needs.id, input.expenseId));
        }
      } else if (input.initialExpenseType === "want") {
        const existingWantEntry = await db
          .select()
          .from(wants)
          .where(eq(wants.id, input.expenseId));

        if (existingWantEntry.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "No such entry found",
          });
        }

        if (existingWantEntry[0].userId !== ctx.userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You are not authorized to update this entry",
          });
        }

        if (input.expenseType !== input.initialExpenseType) {
          await db.delete(wants).where(eq(wants.id, input.expenseId));

          await db.insert(needs).values({
            amount: input.amount,
            description: input.description,
            bookId: input.bookId,
            userId: ctx.userId,
            createdAt: existingWantEntry[0].createdAt,
          });
        } else {
          await db
            .update(wants)
            .set({ amount: input.amount, description: input.description })
            .where(eq(wants.id, input.expenseId));
        }
      }
    }),
});
