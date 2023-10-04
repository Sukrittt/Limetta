import { z } from "zod";
import { and, eq, sql } from "drizzle-orm";

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
import { userRouter } from "./user";
import { TRPCError } from "@trpc/server";
import { getMaxSpendLimitForSavingAmount } from "@/lib/utils";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { createTRPCRouter, privateProcedure } from "@/server/trpc";

export const dueRouter = createTRPCRouter({
  getDueEntries: privateProcedure.query(async ({ ctx }) => {
    const miscTransactions = await db
      .select()
      .from(dues)
      .where(eq(dues.userId, ctx.userId))
      .limit(INFINITE_SCROLLING_PAGINATION_RESULTS)
      .orderBy(dues.dueDate);

    return miscTransactions;
  }),
  addDueEntry: privateProcedure
    .input(
      z.object({
        amount: z.number().positive(),
        description: z.string().min(1).max(100),
        dueDate: z.date().min(new Date()),
        dueType: z.enum(["payable", "receivable"]),
        initialBalance: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.dueType === "payable") {
        await db
          .update(users)
          .set({
            duePayable: input.initialBalance + input.amount,
          })
          .where(eq(users.id, ctx.userId));
      } else {
        await db
          .update(users)
          .set({
            dueReceivable: input.initialBalance + input.amount,
          })
          .where(eq(users.id, ctx.userId));
      }

      await db.insert(dues).values({
        userId: ctx.userId,
        amount: input.amount,
        entryName: input.description,
        dueDate: input.dueDate,
        dueType: input.dueType,
      });
    }),
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
  deleteDueEntry: privateProcedure
    .input(
      z.object({
        dueId: z.number(),
        dueStatus: z.enum(["pending", "paid"]),
        dueType: z.enum(["payable", "receivable"]),
        duePayableBalance: z.number(),
        dueReceivableBalance: z.number(),
        miscBalance: z.number(),
        savingBalance: z.number(),
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
              input.miscBalance + existingDueEntryData.amount;
          } else if (existingDueEntryData.transferAccountType === "savings") {
            updatedSavingsBalance =
              input.savingBalance + existingDueEntryData.amount;
          }
        } else {
          if (existingDueEntryData.transferAccountType === "miscellaneous") {
            updatedMiscBalance =
              input.miscBalance - existingDueEntryData.amount;
          } else if (existingDueEntryData.transferAccountType === "savings") {
            updatedSavingsBalance =
              input.savingBalance - existingDueEntryData.amount;
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
                  miscellanousBalance: updatedMiscBalance,
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
                  savingsBalance: updatedSavingsBalance,
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
                  existingDueEntryData.amount,
              })
              .where(eq(books.id, currentMonthBooks[0].id));
          }
        }
      } else {
        if (input.dueType === "payable") {
          await db
            .update(users)
            .set({
              duePayable: input.duePayableBalance - existingDueEntryData.amount,
            })
            .where(eq(users.id, ctx.userId));
        } else {
          await db
            .update(users)
            .set({
              dueReceivable:
                input.dueReceivableBalance - existingDueEntryData.amount,
            })
            .where(eq(users.id, ctx.userId));
        }
      }

      await db.delete(dues).where(eq(dues.id, input.dueId));
    }),
  dueMarkAsPaid: privateProcedure
    .input(
      z.object({
        dueId: z.number(),
        updatedDueStatus: z.enum(["paid", "pending"]),
        accountTransferType: z
          .enum(["want", "need", "savings", "miscellaneous"])
          .nullable(),
        initialDueBalance: z.number(),
        miscBalance: z.number(),
        savingBalance: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
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
              entryName: `${existingDueEntry.entryName} (due paid)`,
              entryType: "out",
            });

            transferAccountId = parseInt(insertId);

            await db
              .update(users)
              .set({
                miscellanousBalance:
                  input.miscBalance - existingDueEntry.amount,
              })
              .where(eq(users.id, ctx.userId));
          } else if (input.accountTransferType === "savings") {
            if (existingDueEntry.amount > input.savingBalance) {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Not enough saving balance",
              });
            }

            const { insertId } = await db.insert(savings).values({
              userId: ctx.userId,
              amount: existingDueEntry.amount,
              entryName: `${existingDueEntry.entryName} (due paid)`,
              entryType: "out",
            });

            transferAccountId = parseInt(insertId);

            await db
              .update(users)
              .set({
                savingsBalance: input.savingBalance - existingDueEntry.amount,
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
              const caller = userRouter.createCaller(ctx);
              const currentUser = await caller.getCurrentUser();

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
                description: `${existingDueEntry.entryName} (due paid)`,
                bookId,
                userId: ctx.userId,
              });

              transferAccountId = parseInt(insertId);
            } else if (input.accountTransferType === "want") {
              const { insertId } = await db.insert(wants).values({
                amount: existingDueEntry.amount,
                description: `${existingDueEntry.entryName} (due paid)`,
                bookId,
                userId: ctx.userId,
              });

              transferAccountId = parseInt(insertId);
            }
          }
          await db
            .update(users)
            .set({
              duePayable: input.initialDueBalance - existingDueEntry.amount,
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
                      input.miscBalance + existingDueEntry.amount,
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
                      input.savingBalance + existingDueEntry.amount,
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
              duePayable: input.initialDueBalance + existingDueEntry.amount,
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
              entryName: `${existingDueEntry.entryName} (due received)`,
              entryType: "in",
            });

            transferAccountId = parseInt(insertId);

            await db
              .update(users)
              .set({
                miscellanousBalance:
                  input.miscBalance + existingDueEntry.amount,
              })
              .where(eq(users.id, ctx.userId));
          } else if (input.accountTransferType === "savings") {
            const { insertId } = await db.insert(savings).values({
              userId: ctx.userId,
              amount: existingDueEntry.amount,
              entryName: `${existingDueEntry.entryName} (due received)`,
              entryType: "in",
            });

            transferAccountId = parseInt(insertId);

            await db
              .update(users)
              .set({
                savingsBalance: input.savingBalance + existingDueEntry.amount,
              })
              .where(eq(users.id, ctx.userId));
          }

          await db
            .update(users)
            .set({
              dueReceivable: input.initialDueBalance - existingDueEntry.amount,
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
                      input.miscBalance - existingDueEntry.amount,
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
                      input.savingBalance - existingDueEntry.amount,
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
              dueReceivable: input.initialDueBalance + existingDueEntry.amount,
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
