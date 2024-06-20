import { and, eq, gte, sql } from "drizzle-orm";

import { db } from "@/db";
import { createTRPCRouter, privateProcedure } from "@/server/trpc";
import { Books, Needs, Wants, books, needs, wants } from "@/db/schema";

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

export const bookRouter = createTRPCRouter({
  getUserBooks: privateProcedure.query(async ({ ctx }) => {
    const userBooks = await db
      .select()
      .from(books)
      .where(
        and(
          eq(books.userId, ctx.userId),
          sql`books."createdAt" >= NOW() - INTERVAL '12 months'`
        )
      )
      .leftJoin(needs, eq(books.id, needs.bookId))
      .leftJoin(wants, eq(books.id, wants.bookId));

    if (userBooks.length === 0) {
      return [];
    }

    const bookMap = new Map();

    userBooks.forEach((row) => {
      const bookId = row.books.id;

      if (!bookMap.has(bookId)) {
        bookMap.set(bookId, {
          books: [row.books],
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

    const structuredData: { books: Books[]; needs: Needs[]; wants: Wants[] }[] =
      Array.from(bookMap.values());

    structuredData.forEach((bookData) => {
      bookData.needs = filterUniqueObjects(bookData.needs);
      bookData.wants = filterUniqueObjects(bookData.wants);
    });

    return structuredData;
  }),
  getCurrentMonthBooks: privateProcedure.query(async ({ ctx }) => {
    const currentMonthBooks = await db
      .select()
      .from(books)
      .where(
        and(
          eq(books.userId, ctx.userId),
          sql`EXTRACT(MONTH FROM books."createdAt") = EXTRACT(MONTH FROM NOW())`,
          sql`EXTRACT(YEAR FROM books."createdAt") = EXTRACT(YEAR FROM NOW())`
        )
      )
      .leftJoin(needs, eq(books.id, needs.bookId))
      .leftJoin(wants, eq(books.id, wants.bookId));

    if (currentMonthBooks.length === 0) {
      return {
        books: [],
        needs: [],
        wants: [],
      };
    }

    const bookMap = new Map();

    currentMonthBooks.forEach((row) => {
      const bookId = row.books.id;

      if (!bookMap.has(bookId)) {
        bookMap.set(bookId, {
          books: [row.books],
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

    const structuredData: { books: Books[]; needs: Needs[]; wants: Wants[] }[] =
      Array.from(bookMap.values());

    const firstBook = structuredData[0];
    firstBook.needs = filterUniqueObjects(firstBook.needs);
    firstBook.wants = filterUniqueObjects(firstBook.wants);

    return firstBook;
  }),
});
