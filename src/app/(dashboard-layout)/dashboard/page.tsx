import Link from "next/link";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { ScrollShadow } from "@nextui-org/scroll-shadow";

import { env } from "@/env.mjs";
import { cn } from "@/lib/utils";
import { CurrencyType } from "@/types";
import { Icons } from "@/components/icons";
import { Logout } from "@/components/logout";
import { Transfer } from "@/components/transfer";
import { serverClient } from "@/trpc/server-client";
import { buttonVariants } from "@/components/ui/button";
import { DaysLeftInMonth } from "@/components/days-left";
import { ExpenseTable } from "@/components/expense-table";
import { ExpenseCard } from "@/components/cards/expense-card";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: "Dashboard",
  description:
    "Effortlessly manage your finances with our dashboard. Check account balances, view recent expenses, and transfer funds between accounts.",
};

const Dashboard = async () => {
  const currentUser = await serverClient.user.getCurrentUser();

  if (!currentUser.monthlyIncome) redirect("/onboarding");

  const currentMonthEntries = await serverClient.books.getCurrentMonthBooks();

  const expenses = [
    ...currentMonthEntries.needs.map((item) => ({
      ...item,
      type: "need" as const,
      amount: parseFloat(item.amount),
      totalSpendings: parseFloat(currentMonthEntries.books[0].totalSpendings),
    })),
    ...currentMonthEntries.wants.map((item) => ({
      ...item,
      type: "want" as const,
      amount: parseFloat(item.amount),
      totalSpendings: parseFloat(currentMonthEntries.books[0].totalSpendings),
    })),
  ];
  expenses.sort((a: any, b: any) => b.createdAt - a.createdAt);

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

  const needShare = currentMonthIncome * (currentMonthNeedPercetange / 100);
  const wantShare = currentMonthIncome * (currentMonthWantPercetange / 100);

  const totalSavings = currentMonthIncome - (needsTotal + wantsTotal);

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("en-US", { month: "long" });

  const accountDetails = [
    {
      title: "Savings Account",
      shortTitle: "Savings",
      href: "/savings",
      balance: parseFloat(currentUser.savingsBalance),
      type: "savings" as const,
    },
    {
      title: "Investments Account",
      shortTitle: "Investments",
      href: "/investments",
      balance: parseFloat(currentUser.investmentsBalance),
      type: "investments" as const,
    },
    {
      title: "Miscellaneous Account",
      shortTitle: "Miscellaneous",
      href: "/miscellaneous",
      balance: parseFloat(currentUser.miscellanousBalance),
      type: "miscellaneous" as const,
    },
  ];

  const updatedAccountDetails = [
    ...accountDetails,
    {
      title: `${currentMonth} Savings`,
      shortTitle: `${currentMonth} Savings`,
      href: "/expense-tracker",
      balance: totalSavings,
      type: null,
    },
  ];

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold">{`Hello ${
            currentUser.name ? currentUser.name.split(" ")[0] : "User"
          }`}</h1>
          <p className="text-muted-foreground text-sm">Welcome Back!</p>
        </div>
        <MobileSidebar />

        <div className="hidden xl:flex">
          <Logout />
        </div>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 tracking-tight mt-2">
        {updatedAccountDetails.map((account, index) => (
          <Card key={index}>
            <CardTitle>
              <CardHeader className="px-4 pt-3 pb-2 xl:py-4 xl:px-6 font-normal">
                <div className="flex items-center justify-between text-muted-foreground">
                  <Link
                    href={account.href}
                    className="hidden lg:block hover:text-primary transition text-sm focus:outline-none focus:text-primary"
                  >
                    {account.title}
                  </Link>
                  <Link
                    href={account.href}
                    className="lg:hidden hover:text-primary transition text-sm focus:outline-none focus:text-primary"
                  >
                    {account.shortTitle}
                  </Link>
                  {account.type ? (
                    <Transfer
                      currency={currentUser.currency as CurrencyType}
                      initialSelected={account.type}
                      savingsBalance={parseFloat(currentUser.savingsBalance)}
                      investmentsBalance={parseFloat(
                        currentUser.investmentsBalance
                      )}
                      miscellaneousBalance={parseFloat(
                        currentUser.miscellanousBalance
                      )}
                      showTooltip
                      showIcon
                    />
                  ) : (
                    <Link
                      href={account.href}
                      className="hover:text-primary transition focus:outline-none focus:text-primary"
                    >
                      <Icons.link className="h-3 w-3 md:h-4 md:w-4" />
                    </Link>
                  )}
                </div>
              </CardHeader>
            </CardTitle>
            <CardContent className="flex flex-col gap-y-2 px-4 pb-3 xl:px-6 xl:pb-6">
              <span
                className={cn("text-lg xl:text-4xl font-bold tracking-wide", {
                  "text-danger-text": account.balance < 0,
                })}
              >
                <span>{account.balance < 0 ? "-" : ""}</span>
                <span>{currentUser.currency}</span>
                {Math.abs(account.balance).toLocaleString()}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-6 gap-4 tracking-tight min-h-[calc(100vh-300px)]">
        <Card className="col-span-6 lg:col-span-4">
          <CardTitle>
            <CardHeader className="py-4 font-normal">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {currentMonth} Transactions
                </span>
                <Link
                  href="/expense-tracker"
                  className={cn(
                    buttonVariants({ variant: "link" }),
                    "p-0 focus:underline"
                  )}
                >
                  View in Detail
                </Link>
              </div>
            </CardHeader>
          </CardTitle>
          <CardContent className="text-sm">
            <div className="flex flex-col gap-y-2">
              {expenses.length === 0 ? (
                <div className="flex flex-col items-center gap-y-1 pt-8 text-muted-foreground tracking-tight font-mono">
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
                  <ScrollShadow className="h-[calc(60vh-120px)] w-full no-scrollbar pb-12 lg:pb-6">
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
            </div>
          </CardContent>
        </Card>
        <div className="col-span-6 lg:col-span-2 flex flex-col gap-y-4">
          <Card>
            <CardTitle>
              <CardHeader className="pb-4 font-normal">
                <span className="text-sm text-muted-foreground">
                  {currentMonth} Overview
                </span>
              </CardHeader>
            </CardTitle>
            <CardContent className="flex flex-col gap-y-2">
              {currentMonthEntries.books.length === 0 ? (
                <p className="py-6 text-muted-foreground tracking-tighter text-center font-mono text-sm">
                  Start adding entries to get more insights.
                </p>
              ) : (
                <>
                  <ExpenseTable
                    currency={currentUser.currency as CurrencyType}
                    needSpent={needsTotal}
                    needsLeft={needShare - needsTotal}
                    wantSpent={wantsTotal}
                    wantsLeft={wantShare - wantsTotal}
                  />

                  <div className="flex items-center justify-between text-xs tracking-tighter">
                    <span
                      className={cn("text-success-text", {
                        "text-danger-text": totalSavings < 0,
                      })}
                    >
                      Total Savings: <span>{totalSavings < 0 ? "-" : ""}</span>
                      {currentUser.currency}
                      {totalSavings.toLocaleString()}{" "}
                    </span>
                    <DaysLeftInMonth />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
