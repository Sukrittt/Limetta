import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { and, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { userRouter } from "./user";
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
      let totalSpendings = 0;

      if (currentMonthBooks.length === 0) {
        const caller = userRouter.createCaller(ctx);
        const currentUser = await caller.getCurrentUser();

        const newlyCreatedBook = await db.insert(books).values({
          userId: ctx.userId,
          monthIncome: currentUser.monthlyIncome ?? 0,
          needsPercentage: currentUser.needsPercentage,
          wantsPercentage: currentUser.wantsPercentage,
          investmentsPercentage: currentUser.investmentsPercentage,
        });

        bookId = parseInt(newlyCreatedBook.insertId);
      } else {
        bookId = currentMonthBooks[0].id;
        totalSpendings = currentMonthBooks[0].totalSpendings;
      }

      await db
        .update(books)
        .set({
          totalSpendings: totalSpendings + input.amount,
        })
        .where(eq(books.id, bookId));

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
      z.object({
        expenseId: z.number(),
        expenseType: z.enum(["need", "want"]),
        totalSpendings: z.number().positive(),
      })
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

        if (existingNeedEntry[0].dueType) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "You cannot delete a due entry from here.",
          });
        }

        if (existingNeedEntry[0].userId !== ctx.userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You are not authorized to delete this entry",
          });
        }

        await db
          .update(books)
          .set({
            totalSpendings: input.totalSpendings - existingNeedEntry[0].amount,
          })
          .where(eq(books.id, existingNeedEntry[0].bookId));

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

        if (existingWantEntry[0].dueType) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "You cannot delete a due entry from here.",
          });
        }

        if (existingWantEntry[0].userId !== ctx.userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You are not authorized to delete this entry",
          });
        }

        await db
          .update(books)
          .set({
            totalSpendings: input.totalSpendings - existingWantEntry[0].amount,
          })
          .where(eq(books.id, existingWantEntry[0].bookId));

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
        totalSpendings: z.number().positive(),
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

        if (existingNeedEntry[0].dueType) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "You cannot edit a due entry from here.",
          });
        }

        if (existingNeedEntry[0].userId !== ctx.userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You are not authorized to update this entry",
          });
        }

        const updatedSpendings =
          input.totalSpendings - existingNeedEntry[0].amount + input.amount;

        await db
          .update(books)
          .set({ totalSpendings: updatedSpendings })
          .where(eq(books.id, existingNeedEntry[0].bookId));

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

        if (existingWantEntry[0].dueType) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "You cannot edit a due entry",
          });
        }

        if (existingWantEntry[0].userId !== ctx.userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You are not authorized to update this entry",
          });
        }

        const updatedSpendings =
          input.totalSpendings - existingWantEntry[0].amount + input.amount;

        await db
          .update(books)
          .set({ totalSpendings: updatedSpendings })
          .where(eq(books.id, existingWantEntry[0].bookId));

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
