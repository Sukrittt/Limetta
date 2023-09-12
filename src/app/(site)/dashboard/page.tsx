import { redirect } from "next/navigation";

import { Shell } from "@/components/shell";
import { getAuthSession } from "@/lib/auth";
import { serverClient } from "@/trpc/server-client";
import { AddExpense } from "@/components/expense/add-expense";
import { ExpenseCard } from "@/components/expense/expense-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

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

  const needShare =
    currentUser.monthlyIncome * (currentUser.needsPercentage / 100);
  const wantShare =
    currentUser.monthlyIncome * (currentUser.wantsPercentage / 100);
  const investmentShare =
    currentUser.monthlyIncome * (currentUser.investmentsPercentage / 100);

  return (
    <Shell className="grid grid-cols-7">
      <div className="col-span-5">
        <Card className="h-[calc(100vh-130px)] overflow-y-auto no-scrollbar">
          <CardTitle>
            <CardHeader className="text-center text-3xl">{`${currentMonth} Entries`}</CardHeader>
          </CardTitle>
          <CardContent className="space-y-2 text-sm tracking-tight">
            <div className="flex justify-end">
              <AddExpense />
            </div>
            {expenses.length === 0 ? (
              <div className="flex flex-col items-center gap-y-1 pt-4 font-mono text-muted-foreground tracking-tight">
                <p>No entries added Yet!</p>
                <p>Add your first entry of the month.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-7 px-6">
                  <span>Date & Time</span>
                  <span className="col-span-3">Details</span>
                  <span className="text-center">Needs</span>
                  <span className="text-center">Wants</span>
                </div>
                <div className="flex flex-col gap-y-4">
                  {expenses.map((expense) => (
                    <ExpenseCard key={expense.id} expense={expense} />
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="col-span-2">
        <Card className="h-[calc(100vh-130px)]">
          <CardTitle>
            <CardHeader className="text-center">Budget Overview</CardHeader>
          </CardTitle>
          <CardContent className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-2">
              <span className="font-semibold underline underline-offset-4">
                Allotment
              </span>
              <div className="font-mono flex flex-col gap-y-1">
                <span>Needs: {`₹ ${needShare}`}</span>
                <span>Wants: {`₹ ${wantShare}`}</span>
                <span>Investments: {`₹ ${investmentShare}`}</span>
                <span>Monthly Income: {`₹ ${currentUser.monthlyIncome}`}</span>
              </div>
            </div>
            <div className="flex flex-col gap-y-2">
              <span className="font-semibold underline underline-offset-4 mb-1">
                Spendings
              </span>
              <div className="font-mono flex flex-col gap-y-1">
                <span>Needs: {`₹ ${needsTotal}`}</span>
                <span>Wants: {`₹ ${wantsTotal}`}</span>
                <span>Total Spendings: {`₹ ${needsTotal + wantsTotal}`}</span>
              </div>
            </div>
            <div className="flex flex-col gap-y-2">
              <span className="font-semibold underline underline-offset-4 mb-1">
                Money Left
              </span>
              <div className="font-mono flex flex-col gap-y-1">
                <span>
                  Needs:{" "}
                  <span
                    className={cn({
                      "text-rose-500": needShare - needsTotal < 0,
                    })}
                  >
                    {`₹ ${needShare - needsTotal}`}
                  </span>
                </span>
                <span>
                  Wants:{" "}
                  <span
                    className={cn({
                      "text-rose-500": wantShare - wantsTotal < 0,
                    })}
                  >
                    {`₹ ${wantShare - wantsTotal}`}
                  </span>
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-y-2">
              <span className="font-semibold underline underline-offset-4 mb-1">
                Savings
              </span>
              <div className="font-mono flex flex-col gap-y-1">
                <span>
                  Left for Spending:{" "}
                  <span
                    className={cn({
                      "text-rose-500":
                        needShare + wantShare - (needsTotal + wantsTotal) < 0,
                    })}
                  >
                    {`₹ ${needShare + wantShare - (needsTotal + wantsTotal)}`}
                  </span>
                </span>
                <span>
                  Total Savings:{" "}
                  <span
                    className={cn({
                      "text-rose-500":
                        currentUser.monthlyIncome - (needsTotal + wantsTotal) <
                        0,
                    })}
                  >
                    {`₹ ${
                      currentUser.monthlyIncome - (needsTotal + wantsTotal)
                    }`}
                  </span>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
};

export default Dashboard;
