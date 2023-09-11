import { number, z } from "zod";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { Books, Needs, Wants, books, needs, users, wants } from "@/db/schema";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  getMessages: publicProcedure.query(async () => {
    return [1, 2, 3, 4];
  }),
  getCurrentUser: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    const currentUser = await db
      .select()
      .from(users)
      .limit(1)
      .where(eq(users.id, userId));

    const firstUser = currentUser[0]; // there will be only one user with this userId

    return firstUser;
  }),
  updateMonthlyIncome: privateProcedure
    .input(
      z.object({
        monthlyIncome: z.number(),
        needsPercentage: z.number(),
        wantsPercentage: z.number(),
        investmentsPercentage: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await db
        .update(users)
        .set({
          monthlyIncome: input.monthlyIncome,
          needsPercentage: input.needsPercentage,
          wantsPercentage: input.wantsPercentage,
          investmentsPercentage: input.investmentsPercentage,
        })
        .where(eq(users.id, ctx.userId));
    }),
  getCurrentMonthBooks: privateProcedure.query(async ({ ctx }) => {
    const currentMonthBooks = await db
      .select()
      .from(books)
      .where(eq(books.userId, ctx.userId))
      .leftJoin(needs, eq(books.id, needs.bookId))
      .leftJoin(wants, eq(books.id, wants.bookId));

    //where condition for fetching only the current month book

    const bookMap = new Map();

    currentMonthBooks.forEach((row) => {
      const bookId = row.books.id;

      if (!bookMap.has(bookId)) {
        bookMap.set(bookId, {
          books: row.books,
          needs: [],
          wants: [],
        });
      }

      if (row.needs) {
        bookMap.get(bookId).needs.push(row.needs);
      }

      if (row.wants) {
        bookMap.get(bookId).wants.push(row.wants);
      }
    });

    const structuredData: { books: Books; needs: Needs[]; wants: Wants[] }[] =
      Array.from(bookMap.values());

    const firstBook = structuredData[0];
    firstBook.needs = filterUniqueObjects(firstBook.needs);
    firstBook.wants = filterUniqueObjects(firstBook.wants);

    return firstBook;
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
        bookId: number(),
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

export type AppRouter = typeof appRouter;

function filterUniqueObjects(arr: any) {
  const uniqueMap = new Map();
  return arr.filter((obj: any) => {
    const id = obj.id;
    if (!uniqueMap.has(id)) {
      uniqueMap.set(id, true);
      return true;
    }
    return false;
  });
}
