import { z } from "zod";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { Books, Needs, Wants, books, needs, users, wants } from "@/db/schema";
import { privateProcedure, publicProcedure, router } from "./trpc";

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
