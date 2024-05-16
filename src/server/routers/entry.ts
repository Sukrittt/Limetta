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
        entryDate: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const currentMonthBooks = await db
        .select()
        .from(books)
        .where(
          and(
            eq(books.userId, ctx.userId),
            sql`EXTRACT(MONTH FROM books."createdAt") = EXTRACT(MONTH FROM NOW())`,
            sql`EXTRACT(YEAR FROM books."createdAt") = EXTRACT(YEAR FROM NOW())`
          )
        );

      let bookId;
      let totalSpendings = 0;

      if (currentMonthBooks.length === 0) {
        const caller = userRouter.createCaller(ctx);
        const currentUser = await caller.getCurrentUser();

        const newlyCreatedBook = await db
          .insert(books)
          .values({
            userId: ctx.userId,
            monthIncome: currentUser.monthlyIncome ?? "0",
            needsPercentage: currentUser.needsPercentage,
            wantsPercentage: currentUser.wantsPercentage,
            investmentsPercentage: currentUser.investmentsPercentage,
          })
          .returning();

        bookId = newlyCreatedBook[0].id;
      } else {
        bookId = currentMonthBooks[0].id;
        totalSpendings = parseFloat(currentMonthBooks[0].totalSpendings);
      }

      await db
        .update(books)
        .set({
          totalSpendings: (totalSpendings + input.amount).toString(),
        })
        .where(eq(books.id, bookId));

      if (input.expenseType === "need") {
        await db.insert(needs).values({
          amount: input.amount.toString(),
          description: input.description,
          bookId,
          userId: ctx.userId,
          createdAt: input.entryDate,
        });
      } else if (input.expenseType === "want") {
        await db.insert(wants).values({
          amount: input.amount.toString(),
          description: input.description,
          bookId,
          userId: ctx.userId,
          createdAt: input.entryDate,
        });
      }
    }),
  deleteEntry: privateProcedure
    .input(
      z.object({
        expenseId: z.number(),
        expenseType: z.enum(["need", "want"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const currentMonthBooks = await db
        .select()
        .from(books)
        .where(
          and(
            eq(books.userId, ctx.userId),
            sql`EXTRACT(MONTH FROM books."createdAt") = EXTRACT(MONTH FROM NOW())`,
            sql`EXTRACT(YEAR FROM books."createdAt") = EXTRACT(YEAR FROM NOW())`
          )
        );

      if (currentMonthBooks.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No such book found.",
        });
      }

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

        const promises = [
          db
            .update(books)
            .set({
              totalSpendings: (
                parseFloat(currentMonthBooks[0].totalSpendings) -
                parseFloat(existingNeedEntry[0].amount)
              ).toString(),
            })
            .where(eq(books.id, existingNeedEntry[0].bookId)),
          db.delete(needs).where(eq(needs.id, input.expenseId)),
        ];

        await Promise.all(promises);
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

        const promises = [
          db
            .update(books)
            .set({
              totalSpendings: (
                parseFloat(currentMonthBooks[0].totalSpendings) -
                parseFloat(existingWantEntry[0].amount)
              ).toString(),
            })
            .where(eq(books.id, existingWantEntry[0].bookId)),
          db.delete(wants).where(eq(wants.id, input.expenseId)),
        ];

        await Promise.all(promises);
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
        entryDate: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const currentMonthBooks = await db
        .select()
        .from(books)
        .where(
          and(
            eq(books.userId, ctx.userId),
            sql`EXTRACT(MONTH FROM books."createdAt") = EXTRACT(MONTH FROM NOW())`,
            sql`EXTRACT(YEAR FROM books."createdAt") = EXTRACT(YEAR FROM NOW())`
          )
        );

      if (currentMonthBooks.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No such book found.",
        });
      }

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
          parseFloat(currentMonthBooks[0].totalSpendings) -
          parseFloat(existingNeedEntry[0].amount) +
          input.amount;

        await db
          .update(books)
          .set({ totalSpendings: updatedSpendings.toString() })
          .where(eq(books.id, existingNeedEntry[0].bookId));

        if (input.expenseType !== input.initialExpenseType) {
          const promises = [
            db.delete(needs).where(eq(needs.id, input.expenseId)),
            db.insert(wants).values({
              amount: input.amount.toString(),
              description: input.description,
              bookId: input.bookId,
              userId: ctx.userId,
              createdAt: input.entryDate,
            }),
          ];

          await Promise.all(promises);
        } else {
          await db
            .update(needs)
            .set({
              amount: input.amount.toString(),
              description: input.description,
              createdAt: input.entryDate,
            })
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
          parseFloat(currentMonthBooks[0].totalSpendings) -
          parseFloat(existingWantEntry[0].amount) +
          input.amount;

        await db
          .update(books)
          .set({ totalSpendings: updatedSpendings.toString() })
          .where(eq(books.id, existingWantEntry[0].bookId));

        if (input.expenseType !== input.initialExpenseType) {
          const promises = [
            db.delete(wants).where(eq(wants.id, input.expenseId)),

            db.insert(needs).values({
              amount: input.amount.toString(),
              description: input.description,
              bookId: input.bookId,
              userId: ctx.userId,
              createdAt: input.entryDate,
            }),
          ];

          await Promise.all(promises);
        } else {
          await db
            .update(wants)
            .set({
              amount: input.amount.toString(),
              description: input.description,
              createdAt: input.entryDate,
            })
            .where(eq(wants.id, input.expenseId));
        }
      }
    }),
});
