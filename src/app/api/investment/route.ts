import { z } from "zod";
import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { investments } from "@/db/schema";
import { getAuthSession } from "@/lib/auth";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";

export async function GET(req: Request) {
  const url = new URL(req.url);

  try {
    const session = await getAuthSession();

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { page } = z
      .object({
        page: z.string(),
      })
      .parse({
        page: url.searchParams.get("page"),
      });

    const offsetValue =
      (parseFloat(page) - 1) * INFINITE_SCROLLING_PAGINATION_RESULTS;

    const investmentTransactions = await db
      .select()
      .from(investments)
      .where(eq(investments.userId, session.user.id))
      .offset(offsetValue)
      .limit(INFINITE_SCROLLING_PAGINATION_RESULTS)
      .orderBy(desc(investments.createdAt));

    return new Response(JSON.stringify(investmentTransactions));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("Something went wrong", { status: 500 });
  }
}
