import { and, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { books, savings, users } from "@/db/schema";

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

      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, book.userId));

      const overboundAmount = Math.min(totalSavings, 0);

      const promises = [
        db
          .update(users)
          .set({
            savingsBalance: user[0].savingsBalance + totalSavings,
            miscellanousBalance: user[0].miscellanousBalance - overboundAmount, //incase user spends more than their monthly income
          })
          .where(eq(users.id, book.userId)),
        db.insert(savings).values({
          amount: Math.max(totalSavings, 0),
          userId: book.userId,
          entryName: `Monthly savings for ${savingMonth} ${savingYear}`,
          entryType: "in",
        }),
      ];

      await Promise.all(promises);
    });

    return new Response("OK");
  } catch (error) {
    return new Response("Something went wrong", { status: 500 });
  }
}
