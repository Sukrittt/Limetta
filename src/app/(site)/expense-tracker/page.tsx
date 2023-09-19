import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Divider } from "@nextui-org/divider";

import { env } from "@/env.mjs";
import { cn } from "@/lib/utils";
import { CurrencyType } from "@/config";
import { Shell } from "@/components/shell";
import { getAuthSession } from "@/lib/auth";
import { serverClient } from "@/trpc/server-client";
import { AddExpense } from "@/components/expense/add-expense";
import { ExpenseCard } from "@/components/expense/expense-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: "Dashboard",
  description:
    "Manage your expenses and gain a clear overview of your monthly budget with our user-friendly dashboard. Easily add, edit, and delete expenses while tracking your financial progress for the month.",
};

const Dashboard = async () => {
  const session = await getAuthSession();
  const currentUser = await serverClient.user.getCurrentUser();
  const currentMonthEntries = await serverClient.books.getCurrentMonthBooks();

  const expenses = [
    ...currentMonthEntries.needs.map((item) => ({
      ...item,
      type: "need" as const,
    })),
    ...currentMonthEntries.wants.map((item) => ({
      ...item,
      type: "want" as const,
    })),
  ];
  expenses.sort((a: any, b: any) => b.createdAt - a.createdAt);

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("en-US", { month: "long" });

  const needsTotal = currentMonthEntries.needs.reduce(
    (acc, item) => acc + item.amount,
    0
  );
  const wantsTotal = currentMonthEntries.wants.reduce(
    (acc, item) => acc + item.amount,
    0
  );

  if (!currentUser || !session) redirect("/sign-in");

  if (!currentUser.monthlyIncome) redirect("/onboarding");

  const currentMonthIncome =
    currentMonthEntries.books.length > 0
      ? currentMonthEntries.books[0].monthIncome
      : 0;
  const currentMonthNeedPercetange =
    currentMonthEntries.books.length > 0
      ? currentMonthEntries.books[0].needsPercentage
      : 0;
  const currentMonthWantPercetange =
    currentMonthEntries.books.length > 0
      ? currentMonthEntries.books[0].wantsPercentage
      : 0;
  const currentMonthInvestmentPercetange =
    currentMonthEntries.books.length > 0
      ? currentMonthEntries.books[0].investmentsPercentage
      : 0;

  const needShare = currentMonthIncome * (currentMonthNeedPercetange / 100);
  const wantShare = currentMonthIncome * (currentMonthWantPercetange / 100);
  const investmentShare =
    currentMonthIncome * (currentMonthInvestmentPercetange / 100);

  return (
    <Shell className="grid grid-cols-7 md:py-4 tracking-tight">
      <div className="col-span-7 lg:col-span-5">
        <Card className="h-[calc(100vh-140px)] overflow-y-auto no-scrollbar">
          <CardTitle>
            <CardHeader className="text-center text-2xl md:text-3xl py-4">{`${currentMonth} Entries`}</CardHeader>
            <Divider />
          </CardTitle>
          <CardContent className="space-y-2 text-sm tracking-tight pt-6 md:pt-3">
            <div className="flex justify-end pb-6 md:pb-3">
              <AddExpense
                expenses={expenses}
                calculations={{
                  needsTotal,
                  wantsTotal,
                  totalSaved:
                    currentUser.monthlyIncome - (needsTotal + wantsTotal),
                }}
              />
            </div>
            {expenses.length === 0 ? (
              <div className="flex flex-col items-center gap-y-1 pt-4 text-muted-foreground tracking-tight font-mono">
                <p>No entries added Yet!</p>
                <p>Add your first entry of the month.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-7 px-4 sm:px-6">
                  <span className="hidden lg:block">Date & Time</span>
                  <span className="col-span-2 sm:col-span-3">Details</span>
                  <span className="text-center">Needs</span>
                  <span className="text-center">Wants</span>
                </div>
                <div className="flex flex-col gap-y-4">
                  {expenses.map((expense) => (
                    <ExpenseCard
                      key={expense.id}
                      expense={expense}
                      currency={currentUser.currency as CurrencyType}
                    />
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="col-span-7 lg:col-span-2">
        <Card className="lg:h-[calc(100vh-140px)] overflow-y-auto no-scrollbar">
          <CardTitle>
            <CardHeader className="text-center py-5 ">
              Expense Insights
            </CardHeader>
            <Divider />
          </CardTitle>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 pt-6 lg:pb-0 lg:pt-3 text-sm">
            {currentMonthEntries.books.length === 0 ? (
              <p className="pt-4 text-muted-foreground tracking-tighter text-center font-mono">
                Start adding entires to get more insights.
              </p>
            ) : (
              <>
                <div className="flex flex-col gap-y-2">
                  <span className="font-semibold underline underline-offset-4">
                    Allotment
                  </span>
                  <div className="flex flex-col gap-y-1">
                    <span>Needs: {`${currentUser.currency}${needShare}`}</span>
                    <span>Wants: {`${currentUser.currency}${wantShare}`}</span>
                    <span>
                      Investments: {`${currentUser.currency}${investmentShare}`}
                    </span>
                    <span>
                      Monthly Income:{" "}
                      {`${currentUser.currency}${currentMonthIncome}`}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-y-2">
                  <span className="font-semibold underline underline-offset-4 mb-1">
                    Spendings
                  </span>
                  <div className="flex flex-col gap-y-1">
                    <span>Needs: {`${currentUser.currency}${needsTotal}`}</span>
                    <span>Wants: {`${currentUser.currency}${wantsTotal}`}</span>
                    <span>
                      Total Spendings:{" "}
                      {`${currentUser.currency}${needsTotal + wantsTotal}`}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-y-2">
                  <span className="font-semibold underline underline-offset-4 mb-1">
                    Money Left
                  </span>
                  <div className="flex flex-col gap-y-1">
                    <span>
                      Needs:{" "}
                      <span
                        className={cn({
                          "text-rose-500": needShare - needsTotal < 0,
                        })}
                      >
                        {`${currentUser.currency}${needShare - needsTotal}`}
                      </span>
                    </span>
                    <span>
                      Wants:{" "}
                      <span
                        className={cn({
                          "text-rose-500": wantShare - wantsTotal < 0,
                        })}
                      >
                        {`${currentUser.currency}${wantShare - wantsTotal}`}
                      </span>
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-y-2">
                  <span className="font-semibold underline underline-offset-4 mb-1">
                    Savings
                  </span>
                  <div className="flex flex-col gap-y-1">
                    <span>
                      Left for Spending:{" "}
                      <span
                        className={cn({
                          "text-rose-500":
                            needShare + wantShare - (needsTotal + wantsTotal) <
                            0,
                        })}
                      >
                        {`${currentUser.currency}${
                          needShare + wantShare - (needsTotal + wantsTotal)
                        }`}
                      </span>
                    </span>
                    <span>
                      Total Savings:{" "}
                      <span
                        className={cn({
                          "text-rose-500":
                            currentMonthIncome - (needsTotal + wantsTotal) < 0,
                        })}
                      >
                        {`${currentUser.currency}${
                          currentMonthIncome - (needsTotal + wantsTotal)
                        }`}
                      </span>
                    </span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
};

export default Dashboard;