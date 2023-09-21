import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { savings } from "@/db/schema";
import { createTRPCRouter, privateProcedure } from "@/server/trpc";

export const savingsRouter = createTRPCRouter({
  getSavingsEntries: privateProcedure.query(async ({ ctx }) => {
    const savingsEntries = await db
      .select()
      .from(savings)
      .where(eq(savings.userId, ctx.userId))
      .orderBy(desc(savings.createdAt));

    //put a limit on the number of transactions returned

    return savingsEntries;
  }),
});
