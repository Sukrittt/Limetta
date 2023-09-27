import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { savings } from "@/db/schema";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { createTRPCRouter, privateProcedure } from "@/server/trpc";

export const savingsRouter = createTRPCRouter({
  getSavingsEntries: privateProcedure.query(async ({ ctx }) => {
    const savingsEntries = await db
      .select()
      .from(savings)
      .where(eq(savings.userId, ctx.userId))
      .limit(INFINITE_SCROLLING_PAGINATION_RESULTS)
      .orderBy(desc(savings.createdAt));

    return savingsEntries;
  }),
});
