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
import { getMaxSpendLimitForSavingAmount } from "@/lib/utils";
import { createTRPCRouter, privateProcedure } from "@/server/trpc";

export const DueEditRouter = createTRPCRouter({
  editDueEntry: privateProcedure
    .input(
      z.object({
        dueId: z.number(),
        amount: z.number().positive(),
        description: z.string().min(1).max(100),
        dueDate: z.date().min(new Date()),
        dueType: z.enum(["payable", "receivable"]),
        dueStatus: z.enum(["pending", "paid"]),
        duePayableBalance: z.number(),
        dueReceivableBalance: z.number(),
        savingBalance: z.number(),
        miscBalance: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
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
        // already paid
        if (!existingDueEntryData.transferAccountId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Due not paid yet.",
          });
        }

        if (input.dueType === existingDueEntryData.dueType) {
          // due type is same
          if (input.dueType === "payable") {
            // paid
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
                      miscellanousBalance:
                        input.miscBalance +
                        existingMiscEntry[0].amount -
                        input.amount,
                    })
                    .where(eq(users.id, ctx.userId)),
                  db
                    .update(miscellaneous)
                    .set({
                      amount: input.amount,
                      entryName: input.description,
                    })
                    .where(
                      eq(
                        miscellaneous.id,
                        existingDueEntryData.transferAccountId
                      )
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
                const maxLimitForSavingAccount =
                  getMaxSpendLimitForSavingAmount(
                    input.savingBalance,
                    existingSavingsEntry[0].amount,
                    existingDueEntryData.dueType
                  );

                if (input.amount > maxLimitForSavingAccount) {
                  throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Not enough savings balance",
                  });
                }

                const promises = [
                  db
                    .update(users)
                    .set({
                      savingsBalance:
                        input.savingBalance +
                        existingSavingsEntry[0].amount -
                        input.amount,
                    })
                    .where(eq(users.id, ctx.userId)),
                  db
                    .update(savings)
                    .set({
                      amount: input.amount,
                      entryName: input.description,
                    })
                    .where(
                      eq(savings.id, existingDueEntryData.transferAccountId)
                    ),
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
                    .update(needs)
                    .set({
                      amount: input.amount,
                      description: input.description,
                      createdAt: existingNeedEntry[0].createdAt,
                    })
                    .where(
                      eq(needs.id, existingDueEntryData.transferAccountId)
                    );

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
                    .update(wants)
                    .set({
                      amount: input.amount,
                      description: input.description,
                      createdAt: existingWantEntry[0].createdAt,
                    })
                    .where(
                      eq(wants.id, existingDueEntryData.transferAccountId)
                    );

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
                      sql`MONTH(books.createdAt) = MONTH(${paymentDate})`,
                      sql`YEAR(books.createdAt) = YEAR(${paymentDate})`
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
                    totalSpendings:
                      currentMonthBooks[0].totalSpendings -
                      existingDueEntryData.amount +
                      input.amount,
                  })
                  .where(eq(books.id, currentMonthBooks[0].id));
              }
            }
          } else {
            //received
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
                      miscellanousBalance:
                        input.miscBalance -
                        existingMiscEntry[0].amount +
                        input.amount,
                    })
                    .where(eq(users.id, ctx.userId)),
                  db
                    .update(miscellaneous)
                    .set({
                      amount: input.amount,
                      entryName: input.description,
                    })
                    .where(
                      eq(
                        miscellaneous.id,
                        existingDueEntryData.transferAccountId
                      )
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
                      savingsBalance:
                        input.savingBalance -
                        existingSavingsEntry[0].amount +
                        input.amount,
                    })
                    .where(eq(users.id, ctx.userId)),
                  db
                    .update(savings)
                    .set({
                      amount: input.amount,
                      entryName: input.description,
                    })
                    .where(
                      eq(savings.id, existingDueEntryData.transferAccountId)
                    ),
                ];

                await Promise.all(promises);
              }
            }
          }
        } else {
          //due type changed
          if (input.dueType === "payable") {
            //from receivable to payable
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
                      miscellanousBalance:
                        input.miscBalance -
                        existingMiscEntry[0].amount -
                        input.amount,
                    })
                    .where(eq(users.id, ctx.userId)),
                  db
                    .update(miscellaneous)
                    .set({
                      amount: input.amount,
                      entryName: input.description,
                      dueType: "payable",
                      entryType: "out",
                    })
                    .where(
                      eq(
                        miscellaneous.id,
                        existingDueEntryData.transferAccountId
                      )
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
                const maxLimitForSavingAccount =
                  getMaxSpendLimitForSavingAmount(
                    input.savingBalance,
                    existingSavingsEntry[0].amount,
                    existingDueEntryData.dueType
                  );

                if (input.amount > maxLimitForSavingAccount) {
                  throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Not enough savings balance",
                  });
                }

                const promises = [
                  db
                    .update(users)
                    .set({
                      savingsBalance:
                        input.savingBalance -
                        existingSavingsEntry[0].amount -
                        input.amount,
                    })
                    .where(eq(users.id, ctx.userId)),
                  db
                    .update(savings)
                    .set({
                      amount: input.amount,
                      entryName: input.description,
                      dueType: "payable",
                      entryType: "out",
                    })
                    .where(
                      eq(savings.id, existingDueEntryData.transferAccountId)
                    ),
                ];

                await Promise.all(promises);
              }
            } else {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message:
                  "There will exist no need/want entry with due type: 'receivable'",
              });
            }
          } else {
            // from payable to receivable
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
                      miscellanousBalance:
                        input.miscBalance +
                        existingMiscEntry[0].amount +
                        input.amount,
                    })
                    .where(eq(users.id, ctx.userId)),
                  db
                    .update(miscellaneous)
                    .set({
                      amount: input.amount,
                      entryName: input.description,
                      dueType: "receivable",
                      entryType: "in",
                    })
                    .where(
                      eq(
                        miscellaneous.id,
                        existingDueEntryData.transferAccountId
                      )
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
                      savingsBalance:
                        input.savingBalance +
                        existingSavingsEntry[0].amount +
                        input.amount,
                    })
                    .where(eq(users.id, ctx.userId)),
                  db
                    .update(savings)
                    .set({
                      amount: input.amount,
                      entryName: input.description,
                      dueType: "receivable",
                      entryType: "in",
                    })
                    .where(
                      eq(savings.id, existingDueEntryData.transferAccountId)
                    ),
                ];

                await Promise.all(promises);
              }
            } else {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Cannot transfer from need or want.",
              });
            }
          }
        }
      } else {
        //not paid
        if (input.dueType !== existingDueEntryData.dueType) {
          if (input.dueType === "payable") {
            await db
              .update(users)
              .set({
                duePayable: input.duePayableBalance + input.amount,
                dueReceivable:
                  input.dueReceivableBalance - existingDueEntryData.amount,
              })
              .where(eq(users.id, ctx.userId));
          } else {
            await db
              .update(users)
              .set({
                duePayable:
                  input.duePayableBalance - existingDueEntryData.amount,
                dueReceivable: input.dueReceivableBalance + input.amount,
              })
              .where(eq(users.id, ctx.userId));
          }
        } else {
          if (input.dueType === "payable") {
            await db
              .update(users)
              .set({
                duePayable:
                  input.duePayableBalance -
                  existingDueEntryData.amount +
                  input.amount,
              })
              .where(eq(users.id, ctx.userId));
          } else {
            await db
              .update(users)
              .set({
                dueReceivable:
                  input.dueReceivableBalance -
                  existingDueEntryData.amount +
                  input.amount,
              })
              .where(eq(users.id, ctx.userId));
          }
        }
      }

      await db
        .update(dues)
        .set({
          amount: input.amount,
          entryName: input.description,
          dueDate: input.dueDate,
          dueType: input.dueType,
        })
        .where(eq(dues.id, input.dueId));
    }),
});
