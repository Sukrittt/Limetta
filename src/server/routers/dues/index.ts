import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { dues } from "@/db/schema";
import { DueAddRouter } from "./due-add";
import { DueEditRouter } from "./due-edit";
import { DueDeleteRouter } from "./due-delete";
import { DueMarkAsPaidRouter } from "./due-paid";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { createTRPCRouter, privateProcedure } from "@/server/trpc";

export const dueRouter = createTRPCRouter({
  getDueEntries: privateProcedure.query(async ({ ctx }) => {
    const miscTransactions = await db
      .select()
      .from(dues)
      .where(eq(dues.userId, ctx.userId))
      .limit(INFINITE_SCROLLING_PAGINATION_RESULTS)
      .orderBy(desc(dues.dueStatus), dues.dueDate);

    return miscTransactions;
  }),
  add: DueAddRouter,
  edit: DueEditRouter,
  delete: DueDeleteRouter,
  markAsPaid: DueMarkAsPaidRouter,
});
