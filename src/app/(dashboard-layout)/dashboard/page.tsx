import Link from "next/link";
import { redirect } from "next/navigation";
import { ScrollShadow } from "@nextui-org/scroll-shadow";

import { cn } from "@/lib/utils";
import { CurrencyType } from "@/types";
import { Icons } from "@/components/icons";
import { Logout } from "@/components/logout";
import { Transfer } from "@/components/transfer";
import { serverClient } from "@/trpc/server-client";
import { buttonVariants } from "@/components/ui/button";
import { ExpenseTable } from "@/components/expense-table";
import { ExpenseCard } from "@/components/cards/expense-card";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

const Dashboard = async () => {
  const currentUser = await serverClient.user.getCurrentUser();

  if (!currentUser.monthlyIncome) redirect("/onboarding");

  const currentMonthEntries = await serverClient.books.getCurrentMonthBooks();

  const expenses = [
    ...currentMonthEntries.needs.map((item) => ({
      ...item,
      type: "need" as const,
      totalSpendings: currentMonthEntries.books[0].totalSpendings,
    })),
    ...currentMonthEntries.wants.map((item) => ({
      ...item,
      type: "want" as const,
      totalSpendings: currentMonthEntries.books[0].totalSpendings,
    })),
  ];
  expenses.sort((a: any, b: any) => b.createdAt - a.createdAt);

  const needsTotal = currentMonthEntries.needs.reduce(
    (acc, item) => acc + item.amount,
    0
  );
  const wantsTotal = currentMonthEntries.wants.reduce(
    (acc, item) => acc + item.amount,
    0
  );

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

  const needShare = currentMonthIncome * (currentMonthNeedPercetange / 100);
  const wantShare = currentMonthIncome * (currentMonthWantPercetange / 100);

  const totalSavings = currentMonthIncome - (needsTotal + wantsTotal);

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("en-US", { month: "long" });

  const accountDetails = [
    {
      title: "Savings Account",
      href: "/savings",
      balance: currentUser.savingsBalance,
      type: "savings" as const,
      icon: Icons.piggy,
    },
    {
      title: "Investments Account",
      href: "/investments",
      balance: currentUser.investmentsBalance,
      type: "investments" as const,
      icon: Icons.investments,
    },
    {
      title: "Miscellaneous Account",
      href: "/miscellaneous",
      balance: currentUser.miscellanousBalance,
      type: "miscellaneous" as const,
      icon: Icons.siren,
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 tracking-tight mt-2">
        {accountDetails.map((account, index) => (
          <Card key={index}>
            <CardTitle>
              <CardHeader className="py-4 font-normal">
                <div className="flex items-center justify-between text-muted-foreground">
                  <Link
                    href={account.href}
                    className="hover:text-primary transition text-sm"
                  >
                    {account.title}
                  </Link>
                  <Link
                    href={account.href}
                    className="hover:text-primary transition"
                  >
                    <account.icon className="h-4 w-4" />
                  </Link>
                </div>
              </CardHeader>
            </CardTitle>
            <CardContent className="flex flex-col gap-y-2">
              <span
                className={cn("text-4xl font-bold tracking-wide", {
                  "text-red-500": account.balance < 0,
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
                  className={cn(buttonVariants({ variant: "link" }), "p-0")}
                >
                  View in Detail
                </Link>
              </div>
            </CardHeader>
          </CardTitle>
          <CardContent className="text-sm">
            <ScrollShadow className="h-[calc(60vh-100px)] w-full no-scrollbar">
              <div className="flex flex-col gap-y-2">
                {expenses.length === 0 ? (
                  <div className="flex flex-col items-center gap-y-1 pt-8 text-muted-foreground tracking-tight font-mono">
                    <p>No entries added Yet!</p>
                    <p>Add your first entry of the month.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-y-2">
                    <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-7 px-4 sm:px-6">
                      <span className="hidden lg:block">Date & Time</span>
                      <span className="col-span-2 sm:col-span-3">Details</span>
                      <span className="text-center">Needs</span>
                      <span className="text-center">Wants</span>
                    </div>
                    {expenses.map((expense) => (
                      <ExpenseCard
                        key={expense.id}
                        expense={expense}
                        currency={currentUser.currency as CurrencyType}
                      />
                    ))}
                  </div>
                )}
              </div>
            </ScrollShadow>
          </CardContent>
        </Card>
        <div className="col-span-6 lg:col-span-2 grid grid-cols-1 gap-4">
          <Card>
            <CardTitle>
              <CardHeader className="py-4 font-normal">
                <span className="text-sm text-muted-foreground">
                  {currentMonth} Overview
                </span>
              </CardHeader>
            </CardTitle>
            <CardContent className="flex flex-col gap-y-2">
              {currentMonthEntries.books.length === 0 ? (
                <p className="pt-6 text-muted-foreground tracking-tighter text-center font-mono text-sm">
                  Start adding entires to get more insights.
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

                  <span
                    className={cn("text-xs tracking-tighter", {
                      "text-red-500": wantShare - wantsTotal < 0,
                      "text-green-600": wantShare - wantsTotal > 0,
                    })}
                  >
                    Total Savings: <span>{totalSavings < 0 ? "-" : ""}</span>
                    {currentUser.currency}
                    {totalSavings.toLocaleString()}
                  </span>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardTitle>
              <CardHeader className="py-4 font-normal">
                <span className="text-muted-foreground text-sm">Transfer</span>
              </CardHeader>
            </CardTitle>
            <CardContent className="space-y-2">
              <div className="flex flex-col gap-y-2">
                {accountDetails.map((account, index) => (
                  <div key={index} className="grid grid-cols-4 items-center">
                    <div className="flex items-center gap-x-3 col-span-3 text-sm">
                      <account.icon className="h-4 w-4" />
                      {account.title}
                    </div>
                    <Transfer
                      currency={currentUser.currency as CurrencyType}
                      initialSelected={account.type}
                      savingsBalance={currentUser.savingsBalance}
                      investmentsBalance={currentUser.investmentsBalance}
                      miscellaneousBalance={currentUser.miscellanousBalance}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
