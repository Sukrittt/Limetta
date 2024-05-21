import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Divider } from "@nextui-org/divider";
import { ScrollShadow } from "@nextui-org/scroll-shadow";

import { env } from "@/env.mjs";
import { cn } from "@/lib/utils";
import { CurrencyType } from "@/types";
import { Icons } from "@/components/icons";
import { getAuthSession } from "@/lib/auth";
import { serverClient } from "@/trpc/server-client";
import { AddExpense } from "@/components/expense/add-expense";
import { ExpenseCard } from "@/components/cards/expense-card";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: "Expense Tracker",
  description:
    "Manage your expenses and gain a clear overview of your monthly budget with our user-friendly dashboard. Easily add, edit, and delete expenses while tracking your financial progress for the month.",
};

const Dashboard = async () => {
  const session = await getAuthSession();
  const currentUser = await serverClient.user.getCurrentUser();

  if (!currentUser || !session) redirect("/sign-in");

  if (!currentUser.monthlyIncome) redirect("/onboarding");

  const currentMonthEntries = await serverClient.books.getCurrentMonthBooks();

  const expenses = [
    ...currentMonthEntries.needs.map((item) => ({
      ...item,
      amount: parseFloat(item.amount),
      type: "need" as const,
    })),
    ...currentMonthEntries.wants.map((item) => ({
      ...item,
      amount: parseFloat(item.amount),
      type: "want" as const,
    })),
  ];
  expenses.sort((a: any, b: any) => b.createdAt - a.createdAt);

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("en-US", { month: "long" });

  const needsTotal = currentMonthEntries.needs.reduce(
    (acc, item) => acc + parseFloat(item.amount),
    0
  );
  const wantsTotal = currentMonthEntries.wants.reduce(
    (acc, item) => acc + parseFloat(item.amount),
    0
  );

  const currentMonthIncome =
    currentMonthEntries.books.length > 0
      ? parseFloat(currentMonthEntries.books[0].monthIncome)
      : 0;
  const currentMonthNeedPercetange =
    currentMonthEntries.books.length > 0
      ? parseFloat(currentMonthEntries.books[0].needsPercentage)
      : 0;
  const currentMonthWantPercetange =
    currentMonthEntries.books.length > 0
      ? parseFloat(currentMonthEntries.books[0].wantsPercentage)
      : 0;
  const currentMonthInvestmentPercetange =
    currentMonthEntries.books.length > 0
      ? parseFloat(currentMonthEntries.books[0].investmentsPercentage)
      : 0;

  const needShare = currentMonthIncome * (currentMonthNeedPercetange / 100);
  const wantShare = currentMonthIncome * (currentMonthWantPercetange / 100);
  const investmentShare =
    currentMonthIncome * (currentMonthInvestmentPercetange / 100);

  return (
    <div className="grid grid-cols-7 gap-8 tracking-tight">
      <div className="col-span-7 lg:col-span-5">
        <Card>
          <CardTitle>
            <CardHeader className="flex flex-row items-center justify-between xl:block py-4">
              <Link
                href="/dashboard"
                className="xl:hidden border rounded-xl relative h-9 w-9"
              >
                <Icons.left className="h-6 w-6 absolute left-1 top-1.5" />
                <span className="sr-only">Go Back</span>
              </Link>
              <h1 className="hidden sm:block text-center">{`${currentMonth} Entries`}</h1>
              <h1 className="sm:hidden text-center">{`${currentMonth}`}</h1>
              <MobileSidebar />
            </CardHeader>
            <Divider />
          </CardTitle>
          <CardContent className="space-y-2 text-sm tracking-tight pt-6 md:pt-3">
            <div className="flex justify-between xl:justify-end pb-6 md:pb-3">
              <AddExpense
                currency={currentUser.currency as CurrencyType}
                expenses={expenses}
                calculations={{
                  needsTotal,
                  wantsTotal,
                  monthIncome: currentMonthIncome,
                  totalSaved: currentMonthIncome - (needsTotal + wantsTotal),
                }}
              />
            </div>
            {expenses.length === 0 ? (
              <div className="h-[calc(80vh-200px)] lg:h-[calc(80vh-95px)] flex flex-col items-center gap-y-1 pt-4 text-muted-foreground tracking-tight font-mono">
                <p>No entries added Yet!</p>
                <p>Add your first entry of the month.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-y-2">
                <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-7 px-4 sm:px-6 font-semibold">
                  <span className="hidden lg:block">Date & Time</span>
                  <span className="col-span-2 sm:col-span-3">Details</span>
                  <span className="text-center">Needs</span>
                  <span className="text-center">Wants</span>
                </div>
                <ScrollShadow className="h-[calc(80vh-200px)] lg:h-[calc(80vh-120px)] pb-12 lg:pb-8 w-full no-scrollbar">
                  <div className="flex flex-col gap-y-8 lg:gap-y-2">
                    {expenses.map((expense) => (
                      <ExpenseCard
                        key={expense.createdAt.toString()}
                        expense={expense}
                        currency={currentUser.currency as CurrencyType}
                      />
                    ))}
                  </div>
                </ScrollShadow>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="col-span-7 lg:col-span-2">
        <Card>
          <CardTitle>
            <CardHeader className="text-center py-4 text-2xl">
              Expense Insights
            </CardHeader>
            <Divider />
          </CardTitle>
          <ScrollShadow className="lg:h-[calc(90vh-80px)] w-full no-scrollbar">
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 pt-6 lg:pb-0 lg:pt-3">
              {currentMonthEntries.books.length === 0 ? (
                <p className="py-4 text-muted-foreground tracking-tighter text-center font-mono">
                  Start adding entries to get more insights.
                </p>
              ) : (
                <>
                  <div className="flex flex-col gap-y-1">
                    <span className="font-semibold underline underline-offset-4 mb-1 text-primary">
                      Allotment
                    </span>
                    <div className="flex gap-x-4 font-mono">
                      <div className="flex flex-col">
                        <span>
                          Needs:{" "}
                          {`${currentUser.currency}${needShare.toFixed(0)}`}
                        </span>
                        <span>
                          Wants:{" "}
                          {`${currentUser.currency}${wantShare.toFixed(0)}`}
                        </span>
                        <span>
                          Investments:{" "}
                          {`${currentUser.currency}${investmentShare.toFixed(
                            0
                          )}`}
                        </span>
                      </div>
                      <div className="flex gap-x-2">
                        <span className="text-6xl pt-px text-muted-foreground">{`}`}</span>

                        <div className="flex items-center">
                          <span>
                            {`${
                              currentUser.currency
                            }${currentMonthIncome.toFixed(0)}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-1">
                    <span className="font-semibold underline underline-offset-4 mb-1 text-primary">
                      Spendings
                    </span>
                    <div className="flex gap-x-4 font-mono">
                      <div className="flex flex-col">
                        <span>
                          Needs:{" "}
                          {`${currentUser.currency}${needsTotal.toFixed(2)}`}
                        </span>
                        <span>
                          Wants:{" "}
                          {`${currentUser.currency}${wantsTotal.toFixed(2)}`}
                        </span>
                      </div>
                      <div className="flex gap-x-2">
                        <span className="text-4xl pt-px text-muted-foreground">{`}`}</span>

                        <div className="flex items-center">
                          <span>
                            {`${currentUser.currency}${parseFloat(
                              currentMonthEntries.books[0].totalSpendings
                            ).toFixed(2)}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-1">
                    <span className="font-semibold underline underline-offset-4 mb-1 text-primary">
                      Money Left
                    </span>
                    <div className="flex gap-x-4 font-mono">
                      <div className="flex flex-col">
                        <span>
                          Needs:{" "}
                          <span
                            className={cn({
                              "text-danger-text": needShare - needsTotal < 0,
                            })}
                          >
                            <span>{needShare - needsTotal < 0 ? "-" : ""}</span>
                            {`${currentUser.currency}${Math.abs(
                              needShare - needsTotal
                            ).toFixed(2)}`}
                          </span>
                        </span>
                        <span>
                          Wants:{" "}
                          <span
                            className={cn({
                              "text-danger-text": wantShare - wantsTotal < 0,
                            })}
                          >
                            <span>{wantShare - wantsTotal < 0 ? "-" : ""}</span>
                            {`${currentUser.currency}${Math.abs(
                              wantShare - wantsTotal
                            ).toFixed(2)}`}
                          </span>
                        </span>
                      </div>
                      <div className="flex gap-x-2">
                        <span className="text-4xl pt-px text-muted-foreground">{`}`}</span>

                        <div className="flex items-center">
                          <span
                            className={cn({
                              "text-danger-text":
                                needShare +
                                  wantShare -
                                  (needsTotal + wantsTotal) <
                                0,
                            })}
                          >
                            <span>
                              {needShare +
                                wantShare -
                                (needsTotal + wantsTotal) <
                              0
                                ? "-"
                                : ""}
                            </span>
                            {`${currentUser.currency}${Math.abs(
                              needShare + wantShare - (needsTotal + wantsTotal)
                            ).toFixed(2)}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-1">
                    <span className="font-semibold underline underline-offset-4 mb-1 text-primary">
                      Savings
                    </span>
                    <div className="flex flex-col font-mono">
                      <span>
                        Total Savings:{" "}
                        <span
                          className={cn({
                            "text-danger-text":
                              currentMonthIncome - (needsTotal + wantsTotal) <
                              0,
                          })}
                        >
                          <span>
                            {currentMonthIncome - (needsTotal + wantsTotal) < 0
                              ? "-"
                              : ""}
                          </span>
                          {`${currentUser.currency}${Math.abs(
                            currentMonthIncome - (needsTotal + wantsTotal)
                          ).toFixed(2)}`}
                        </span>
                      </span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </ScrollShadow>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
