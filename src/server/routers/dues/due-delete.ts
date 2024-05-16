import { z } from "zod";
import { and, eq, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

import { db } from "@/db";
import {
  books,
  dues,
  miscellaneous,
  needs,
  savings,
  users,
  wants,
} from "@/db/schema";
import { userRouter } from "@/server/routers/user";
import { createTRPCRouter, privateProcedure } from "@/server/trpc";

export const DueDeleteRouter = createTRPCRouter({
  deleteDueEntry: privateProcedure
    .input(
      z.object({
        dueId: z.number(),
        dueStatus: z.enum(["pending", "paid"]),
        dueType: z.enum(["payable", "receivable"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const caller = userRouter.createCaller(ctx);
      const currentUser = await caller.getCurrentUser();

      const existingDueEntry = await db
        .select()
        .from(dues)
        .where(eq(dues.id, input.dueId));

      if (existingDueEntry.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Due entry not found",
        });
      }

      const existingDueEntryData = existingDueEntry[0]; // since we are querying by id, there will be only one entry

      if (input.dueStatus === "paid") {
        if (!existingDueEntryData.transferAccountId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Due not paid yet.",
          });
        }

        let updatedMiscBalance, updatedSavingsBalance;

        if (existingDueEntryData.dueType === "payable") {
          if (existingDueEntryData.transferAccountType === "miscellaneous") {
            updatedMiscBalance =
              parseFloat(currentUser.miscellanousBalance) +
              parseFloat(existingDueEntryData.amount);
          } else if (existingDueEntryData.transferAccountType === "savings") {
            updatedSavingsBalance =
              parseFloat(currentUser.savingsBalance) +
              parseFloat(existingDueEntryData.amount);
          }
        } else {
          if (existingDueEntryData.transferAccountType === "miscellaneous") {
            updatedMiscBalance =
              parseFloat(currentUser.miscellanousBalance) -
              parseFloat(existingDueEntryData.amount);
          } else if (existingDueEntryData.transferAccountType === "savings") {
            updatedSavingsBalance =
              parseFloat(currentUser.savingsBalance) -
              parseFloat(existingDueEntryData.amount);
          }
        }

        if (existingDueEntryData.transferAccountType === "miscellaneous") {
          const existingMiscEntry = await db
            .select()
            .from(miscellaneous)
            .where(
              eq(miscellaneous.id, existingDueEntryData.transferAccountId)
            );

          if (existingMiscEntry.length > 0) {
            const promises = [
              db
                .update(users)
                .set({
                  miscellanousBalance: updatedMiscBalance?.toString(),
                })
                .where(eq(users.id, ctx.userId)),
              db
                .delete(miscellaneous)
                .where(
                  eq(miscellaneous.id, existingDueEntryData.transferAccountId)
                ),
            ];

            await Promise.all(promises);
          }
        } else if (existingDueEntryData.transferAccountType === "savings") {
          const existingSavingsEntry = await db
            .select()
            .from(savings)
            .where(eq(savings.id, existingDueEntryData.transferAccountId));

          if (existingSavingsEntry.length > 0) {
            const promises = [
              db
                .update(users)
                .set({
                  savingsBalance: updatedSavingsBalance?.toString(),
                })
                .where(eq(users.id, ctx.userId)),

              db
                .delete(savings)
                .where(eq(savings.id, existingDueEntryData.transferAccountId)),
            ];

            await Promise.all(promises);
          }
        } else {
          let paymentDate;

          let allowTotalSpendingUpdation = true; //to check if the 'totalSpendings' field needs to be updated

          if (existingDueEntryData.transferAccountType === "need") {
            const existingNeedEntry = await db
              .select()
              .from(needs)
              .where(eq(needs.id, existingDueEntryData.transferAccountId));

            if (existingNeedEntry.length === 0) {
              allowTotalSpendingUpdation = false;
            } else {
              await db
                .delete(needs)
                .where(eq(needs.id, existingDueEntryData.transferAccountId));

              paymentDate = existingNeedEntry[0].createdAt;
            }
          } else {
            const existingWantEntry = await db
              .select()
              .from(wants)
              .where(eq(wants.id, existingDueEntryData.transferAccountId));

            if (existingWantEntry.length === 0) {
              allowTotalSpendingUpdation = false;
            } else {
              await db
                .delete(wants)
                .where(eq(wants.id, existingDueEntryData.transferAccountId));

              paymentDate = existingWantEntry[0].createdAt;
            }
          }

          if (allowTotalSpendingUpdation) {
            const currentMonthBooks = await db
              .select()
              .from(books)
              .where(
                and(
                  eq(books.userId, ctx.userId),
                  sql`EXTRACT(MONTH FROM books."createdAt") = EXTRACT(MONTH FROM ${paymentDate})`,
                  sql`EXTRACT(YEAR FROM books."createdAt") = EXTRACT(YEAR FROM ${paymentDate})`
                )
              );

            if (currentMonthBooks.length === 0) {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message: "No book found",
              });
            }

            await db
              .update(books)
              .set({
                totalSpendings: (
                  parseFloat(currentMonthBooks[0].totalSpendings) -
                  parseFloat(existingDueEntryData.amount)
                ).toString(),
              })
              .where(eq(books.id, currentMonthBooks[0].id));
          }
        }
      } else {
        if (input.dueType === "payable") {
          await db
            .update(users)
            .set({
              duePayable: (
                parseFloat(currentUser.duePayable) -
                parseFloat(existingDueEntryData.amount)
              ).toString(),
            })
            .where(eq(users.id, ctx.userId));
        } else {
          await db
            .update(users)
            .set({
              dueReceivable: (
                parseFloat(currentUser.dueReceivable) -
                parseFloat(existingDueEntryData.amount)
              ).toString(),
            })
            .where(eq(users.id, ctx.userId));
        }
      }

      await db.delete(dues).where(eq(dues.id, input.dueId));
    }),
});
