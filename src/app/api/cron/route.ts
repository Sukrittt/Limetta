import { and, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { books, savings } from "@/db/schema";

export async function GET() {
  try {
    const previousMonthBooks = await db
      .select()
      .from(books)
      .where(
        and(
          sql`MONTH(books.createdAt) = MONTH(NOW() - INTERVAL 1 MONTH)`,
          sql`YEAR(books.createdAt) = YEAR(NOW() - INTERVAL 1 MONTH)`
        )
      );

    if (previousMonthBooks.length === 0) {
      return new Response("No books to report");
    }

    previousMonthBooks.forEach(async (book) => {
      const totalSavings = book.monthIncome - book.totalSpendings;
      const savingMonth = book.createdAt.toLocaleString("en-US", {
        month: "long",
      });
      const savingYear = book.createdAt.getFullYear();

      const existingSavingEntry = await db
        .select()
        .from(savings)
        .where(
          and(
            eq(savings.userId, book.userId),
            eq(
              savings.entryName,
              `Monthly savings for ${savingMonth} ${savingYear}`
            )
          )
        );

      if (existingSavingEntry.length > 0) return;

      await db.insert(savings).values({
        amount: totalSavings > 0 ? totalSavings : 0,
        userId: book.userId,
        entryName: `Monthly savings for ${savingMonth} ${savingYear}`,
        entryType: "in",
      });
    });

    return new Response("OK");
  } catch (error) {
    return new Response("Something went wrong", { status: 500 });
  }
}
