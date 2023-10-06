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
import { createTRPCRouter } from "@/server/trpc";
import { privateProcedure } from "@/server/trpc";
import { userRouter } from "@/server/routers/user";

export const DueMarkAsPaidRouter = createTRPCRouter({
  dueMarkAsPaid: privateProcedure
    .input(
      z.object({
        dueId: z.number(),
        updatedDueStatus: z.enum(["paid", "pending"]),
        accountTransferType: z
          .enum(["want", "need", "savings", "miscellaneous"])
          .nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const caller = userRouter.createCaller(ctx);
      const currentUser = await caller.getCurrentUser();

      const existingDueEntries = await db
        .select()
        .from(dues)
        .where(eq(dues.id, input.dueId));

      if (existingDueEntries.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Due entry not found",
        });
      }

      const existingDueEntry = existingDueEntries[0]; // since we are querying by id, there will be only one entry

      let transferAccountId: number | null = null;
      let transferAccountType = input.accountTransferType;

      //updating user balance
      if (existingDueEntry.dueType === "payable") {
        //to pay
        if (existingDueEntry.dueStatus === "pending") {
          //status to 'paid'
          if (input.accountTransferType === "miscellaneous") {
            const { insertId } = await db.insert(miscellaneous).values({
              userId: ctx.userId,
              amount: existingDueEntry.amount,
              entryName: existingDueEntry.entryName,
              dueType: "payable",
              entryType: "out",
            });

            transferAccountId = parseInt(insertId);

            await db
              .update(users)
              .set({
                miscellanousBalance:
                  currentUser.miscellanousBalance - existingDueEntry.amount,
              })
              .where(eq(users.id, ctx.userId));
          } else if (input.accountTransferType === "savings") {
            if (existingDueEntry.amount > currentUser.savingsBalance) {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Not enough saving balance",
              });
            }

            const { insertId } = await db.insert(savings).values({
              userId: ctx.userId,
              amount: existingDueEntry.amount,
              entryName: existingDueEntry.entryName,
              dueType: "payable",
              entryType: "out",
            });

            transferAccountId = parseInt(insertId);

            await db
              .update(users)
              .set({
                savingsBalance:
                  currentUser.savingsBalance - existingDueEntry.amount,
              })
              .where(eq(users.id, ctx.userId));
          } else {
            //wants and needs
            const currentMonthBooks = await db
              .select()
              .from(books)
              .where(
                and(
                  eq(books.userId, ctx.userId),
                  sql`MONTH(books.createdAt) = MONTH(NOW())`,
                  sql`YEAR(books.createdAt) = YEAR(NOW())`
                )
              );

            let bookId;
            let totalSpendings = 0;

            if (currentMonthBooks.length === 0) {
              const newlyCreatedBook = await db.insert(books).values({
                userId: ctx.userId,
                monthIncome: currentUser.monthlyIncome ?? 0,
                needsPercentage: currentUser.needsPercentage,
                wantsPercentage: currentUser.wantsPercentage,
                investmentsPercentage: currentUser.investmentsPercentage,
              });

              bookId = parseInt(newlyCreatedBook.insertId);
            } else {
              bookId = currentMonthBooks[0].id;
              totalSpendings = currentMonthBooks[0].totalSpendings;
            }

            await db
              .update(books)
              .set({
                totalSpendings: totalSpendings + existingDueEntry.amount,
              })
              .where(eq(books.id, bookId));

            if (input.accountTransferType === "need") {
              const { insertId } = await db.insert(needs).values({
                amount: existingDueEntry.amount,
                description: existingDueEntry.entryName,
                dueType: "payable",
                bookId,
                userId: ctx.userId,
              });

              transferAccountId = parseInt(insertId);
            } else if (input.accountTransferType === "want") {
              const { insertId } = await db.insert(wants).values({
                amount: existingDueEntry.amount,
                description: existingDueEntry.entryName,
                dueType: "payable",
                bookId,
                userId: ctx.userId,
              });

              transferAccountId = parseInt(insertId);
            }
          }
          await db
            .update(users)
            .set({
              duePayable: currentUser.duePayable - existingDueEntry.amount,
            })
            .where(eq(users.id, ctx.userId));
        } else {
          //undo status to 'pending'
          if (!existingDueEntry.transferAccountId) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Due not paid yet.",
            });
          }

          if (existingDueEntry.transferAccountType === "miscellaneous") {
            const existingMiscEntry = await db
              .select()
              .from(miscellaneous)
              .where(eq(miscellaneous.id, existingDueEntry.transferAccountId));

            if (existingMiscEntry.length > 0) {
              const promises = [
                db
                  .update(users)
                  .set({
                    miscellanousBalance:
                      currentUser.miscellanousBalance + existingDueEntry.amount,
                  })
                  .where(eq(users.id, ctx.userId)),
                db
                  .delete(miscellaneous)
                  .where(
                    eq(miscellaneous.id, existingDueEntry.transferAccountId)
                  ),
              ];

              await Promise.all(promises);
            }
          } else if (existingDueEntry.transferAccountType === "savings") {
            const existingSavingsEntry = await db
              .select()
              .from(savings)
              .where(eq(savings.id, existingDueEntry.transferAccountId));

            if (existingSavingsEntry.length > 0) {
              const promises = [
                db
                  .update(users)
                  .set({
                    savingsBalance:
                      currentUser.savingsBalance + existingDueEntry.amount,
                  })
                  .where(eq(users.id, ctx.userId)),
                db
                  .delete(savings)
                  .where(eq(savings.id, existingDueEntry.transferAccountId)),
              ];

              await Promise.all(promises);
            }
          } else {
            const currentMonthBooks = await db
              .select()
              .from(books)
              .where(
                and(
                  eq(books.userId, ctx.userId),
                  sql`MONTH(books.createdAt) = MONTH(NOW())`,
                  sql`YEAR(books.createdAt) = YEAR(NOW())`
                )
              );

            if (currentMonthBooks.length === 0) {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message: "No book found",
              });
            }

            let allowTotalSpendingUpdation = true; //to check if the 'totalSpendings' field needs to be updated

            if (existingDueEntry.transferAccountType === "need") {
              const existingNeedEntry = await db
                .select()
                .from(needs)
                .where(eq(needs.id, existingDueEntry.transferAccountId));

              if (existingNeedEntry.length === 0) {
                allowTotalSpendingUpdation = false;
              } else {
                await db
                  .delete(needs)
                  .where(eq(needs.id, existingDueEntry.transferAccountId));
              }
            } else {
              const existingWantEntry = await db
                .select()
                .from(wants)
                .where(eq(wants.id, existingDueEntry.transferAccountId));

              if (existingWantEntry.length === 0) {
                allowTotalSpendingUpdation = false;
              } else {
                await db
                  .delete(wants)
                  .where(eq(wants.id, existingDueEntry.transferAccountId));
              }
            }

            if (allowTotalSpendingUpdation) {
              await db
                .update(books)
                .set({
                  totalSpendings:
                    currentMonthBooks[0].totalSpendings -
                    existingDueEntry.amount,
                })
                .where(eq(books.id, currentMonthBooks[0].id));
            }
          }

          await db
            .update(users)
            .set({
              duePayable: currentUser.duePayable + existingDueEntry.amount,
            })
            .where(eq(users.id, ctx.userId));
        }
      } else {
        //to receive
        if (
          input.accountTransferType === "need" ||
          input.accountTransferType === "want"
        ) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Cannot transfer to need or want.",
          });
        }

        if (existingDueEntry.dueStatus === "pending") {
          // status to 'paid'
          if (input.accountTransferType === "miscellaneous") {
            const { insertId } = await db.insert(miscellaneous).values({
              userId: ctx.userId,
              amount: existingDueEntry.amount,
              entryName: existingDueEntry.entryName,
              dueType: "receivable",
              entryType: "in",
            });

            transferAccountId = parseInt(insertId);

            await db
              .update(users)
              .set({
                miscellanousBalance:
                  currentUser.miscellanousBalance + existingDueEntry.amount,
              })
              .where(eq(users.id, ctx.userId));
          } else if (input.accountTransferType === "savings") {
            const { insertId } = await db.insert(savings).values({
              userId: ctx.userId,
              amount: existingDueEntry.amount,
              entryName: existingDueEntry.entryName,
              dueType: "receivable",
              entryType: "in",
            });

            transferAccountId = parseInt(insertId);

            await db
              .update(users)
              .set({
                savingsBalance:
                  currentUser.savingsBalance + existingDueEntry.amount,
              })
              .where(eq(users.id, ctx.userId));
          }

          await db
            .update(users)
            .set({
              dueReceivable:
                currentUser.dueReceivable - existingDueEntry.amount,
            })
            .where(eq(users.id, ctx.userId));
        } else {
          //undo status to 'pending'
          if (!existingDueEntry.transferAccountId) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "No transfer account found",
            });
          }

          if (existingDueEntry.transferAccountType === "miscellaneous") {
            const existingMiscEntry = await db
              .select()
              .from(miscellaneous)
              .where(eq(miscellaneous.id, existingDueEntry.transferAccountId));

            if (existingMiscEntry.length > 0) {
              const promises = [
                db
                  .update(users)
                  .set({
                    miscellanousBalance:
                      currentUser.miscellanousBalance - existingDueEntry.amount,
                  })
                  .where(eq(users.id, ctx.userId)),
                db
                  .delete(miscellaneous)
                  .where(
                    eq(miscellaneous.id, existingDueEntry.transferAccountId)
                  ),
              ];

              await Promise.all(promises);
            }
          } else if (existingDueEntry.transferAccountType === "savings") {
            const existingSavingsEntry = await db
              .select()
              .from(savings)
              .where(eq(savings.id, existingDueEntry.transferAccountId));

            if (existingSavingsEntry.length > 0) {
              const promises = [
                db
                  .update(users)
                  .set({
                    savingsBalance:
                      currentUser.savingsBalance - existingDueEntry.amount,
                  })
                  .where(eq(users.id, ctx.userId)),
                db
                  .delete(savings)
                  .where(eq(savings.id, existingDueEntry.transferAccountId)),
              ];

              await Promise.all(promises);
            }
          }

          await db
            .update(users)
            .set({
              dueReceivable:
                currentUser.dueReceivable + existingDueEntry.amount,
            })
            .where(eq(users.id, ctx.userId));
        }
      }

      await db
        .update(dues)
        .set({
          dueStatus: input.updatedDueStatus,
          transferAccountType,
          transferAccountId,
        })
        .where(eq(dues.id, existingDueEntry.id));
    }),
});
