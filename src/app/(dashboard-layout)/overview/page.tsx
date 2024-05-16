import Link from "next/link";
import { format } from "date-fns";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ScrollShadow } from "@nextui-org/scroll-shadow";

import { env } from "@/env.mjs";
import { Icons } from "@/components/icons";
import { serverClient } from "@/trpc/server-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CurrencyType } from "@/types";
import ToolTip from "@/components/ui/tool-tip";
import { ExpenseOverview } from "@/components/expense-overview";
import { MonthlyExpenseSheet } from "@/components/expense/mothly-expense-sheet";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: "Overview",
  description:
    "Get a comprehensive view of your finances over the past 12 months with our Overview page. Explore detailed expense graphs for each month, review your transaction history, and gain insights into your needs, wants, and total entries.",
};

const Overview = async () => {
  const currentUser = await serverClient.user.getCurrentUser();

  if (!currentUser.monthlyIncome) redirect("/onboarding");

  const userBooks = await serverClient.books.getUserBooks();

  const data =
    userBooks.length === 0
      ? []
      : userBooks.map((obj) => {
          const totalExpenses =
            obj.needs.reduce((acc, need) => acc + parseFloat(need.amount), 0) +
            obj.wants.reduce((acc, want) => acc + parseFloat(want.amount), 0);

          const month = new Date(obj.books[0].createdAt).toLocaleString(
            "en-US",
            {
              month: "short",
            }
          );

          return {
            name: month,
            total: totalExpenses,
          };
        });

  let totalWants = 0,
    totalNeeds = 0,
    totalEntries = 0;

  const expenseData =
    userBooks.length === 0
      ? []
      : userBooks.map((obj) => {
          const totalWantEntries = obj.wants.length;
          const totalNeedEntries = obj.needs.length;

          totalEntries += totalWantEntries + totalNeedEntries;

          const eachMonthTotalWants = obj.wants.reduce(
            (acc, want) => acc + parseFloat(want.amount),
            0
          );

          const eachMonthTotalNeeds = obj.needs.reduce(
            (acc, need) => acc + parseFloat(need.amount),
            0
          );

          totalWants += eachMonthTotalWants;
          totalNeeds += eachMonthTotalNeeds;

          const totalExpenses = eachMonthTotalWants + eachMonthTotalNeeds;

          const month = format(obj.books[0].createdAt, "MMMM yyyy");

          return {
            month,
            total: totalExpenses,
            ...obj,
          };
        });

  const totalSpent = data.reduce((acc, obj) => acc + obj.total, 0);

  const dashboardTabs = [
    {
      label: "Needs",
      data: `${currentUser.currency}${totalNeeds.toLocaleString()}`,
      icon: Icons.needs,
    },
    {
      label: "Wants",
      data: `${currentUser.currency}${totalWants.toLocaleString()}`,
      icon: Icons.wants,
    },
    {
      label: "Timeframe",
      data: userBooks.length.toLocaleString(),
      icon: Icons.streaks,
    },
    {
      label: "Total Entries",
      data: `${totalEntries.toLocaleString()}`,
      icon: Icons.entries,
    },
  ];

  return (
    <div className="grid gap-4">
      <div className="space-y-2 -mt-2">
        <h1 className="line-clamp-1 text-3xl font-bold tracking-tight">
          Budget Overview
        </h1>
        <div className="flex gap-x-1 items-center text-muted-foreground">
          <p>Monthly Expense Summary for the Past Year</p>
          <ToolTip
            customComponent={
              <p className="text-xs">
                An overview of all the expenes you made in{" "}
                <Link
                  href="/expense-tracker"
                  className="text-primary transition"
                >
                  expense tracker
                </Link>
                .
              </p>
            }
          >
            <Icons.info className="h-3 w-3 mt-[2px]" />
          </ToolTip>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
        {dashboardTabs.map((tab, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row justify-between items-center px-4 pt-3 pb-2 xl:py-4 xl:px-6">
              <CardTitle className="text-sm sm:text-base">
                {tab.label}
              </CardTitle>
              <tab.icon className="w-4 h-4 hidden sm:block" />
            </CardHeader>
            <CardContent className="px-4 pb-3 xl:px-6 xl:pb-6">
              <span className="text-lg xl:text-xl font-bold tracking-wide">
                {tab.data}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-5 gap-4">
        <Card className="col-span-5 lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-md">Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ExpenseOverview
              data={data}
              currency={currentUser.currency as CurrencyType}
            />
          </CardContent>
        </Card>
        <Card className="col-span-5 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-md">Total Monthly Expenses</CardTitle>
            <CardDescription>
              You have spent {currentUser.currency}
              {totalSpent} till now.
            </CardDescription>
          </CardHeader>
          <ScrollShadow className="h-[320px] w-full no-scrollbar pb-6">
            <CardContent className="flex flex-col gap-y-2 pb-6 lg:py-0 px-3">
              {expenseData.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[320px]">
                  <p className="text-sm font-mono text-muted-foreground">
                    No entries created yet.
                  </p>
                </div>
              ) : (
                expenseData.reverse().map((expense, index) => (
                  <MonthlyExpenseSheet
                    key={index}
                    expenseData={expense}
                    currency={currentUser.currency as CurrencyType}
                  >
                    <div className="flex items-center justify-between hover:bg-muted rounded-lg transtion-all p-3 cursor-pointer border">
                      <span className="text-sm">{expense.month}</span>
                      <span className="font-mono">{`${currentUser.currency}${expense.total}`}</span>
                    </div>
                  </MonthlyExpenseSheet>
                ))
              )}
            </CardContent>
          </ScrollShadow>
        </Card>
      </div>
    </div>
  );
};

export default Overview;
