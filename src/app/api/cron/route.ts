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
          sql`EXTRACT(MONTH FROM books."createdAt") = EXTRACT(MONTH FROM NOW() - INTERVAL 1 MONTH)`,
          sql`EXTRACT(YEAR FROM books."createdAt") = EXTRACT(YEAR FROM NOW() - INTERVAL 1 MONTH)`
        )
      );

    if (previousMonthBooks.length === 0) {
      return new Response("No books to report");
    }

    previousMonthBooks.forEach(async (book) => {
      const totalSavings =
        parseFloat(book.monthIncome) - parseFloat(book.totalSpendings);

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
        .select({
          savingsBalance: users.savingsBalance,
        })
        .from(users)
        .where(eq(users.id, book.userId));

      const promises = [
        db
          .update(users)
          .set({
            savingsBalance: (
              parseFloat(user[0].savingsBalance) + Math.max(totalSavings, 0)
            ).toString(),
          })
          .where(eq(users.id, book.userId)),
        db.insert(savings).values({
          amount: Math.max(totalSavings, 0).toString(),
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
