import { Shell } from "@/components/shell";
import { serverClient } from "@/trpc/server-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExpenseOverview } from "@/components/expense-overview";
import { format } from "date-fns";
import { MonthlyExpenseSheet } from "@/components/expense/mothly-expense-sheet";
import { Icons } from "@/components/icons";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const Overview = async () => {
  const userBooks = await serverClient.books.getUserBooks();

  const data =
    userBooks.length === 0
      ? []
      : userBooks.map((obj) => {
          const totalExpenses =
            obj.needs.reduce((acc, need) => acc + need.amount, 0) +
            obj.wants.reduce((acc, want) => acc + want.amount, 0);

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
          const totalWantEntries = obj.wants.reduce((acc) => acc + 1, 0);
          const totalNeedEntries = obj.needs.reduce((acc) => acc + 1, 0);

          totalEntries = totalWantEntries + totalNeedEntries;

          totalWants = obj.wants.reduce((acc, need) => acc + need.amount, 0);
          totalNeeds = obj.needs.reduce((acc, want) => acc + want.amount, 0);

          const totalExpenses = totalWants + totalNeeds;

          const month = format(obj.books[0].createdAt, "MMMM yyyy");

          return {
            month,
            total: totalExpenses,
            ...obj,
          };
        });

  const totalSpent = data.reduce((acc, obj) => acc + obj.total, 0);

  return (
    <Shell className="tracking-tight">
      <div className="space-y-2">
        <h1 className="line-clamp-1 text-3xl font-bold tracking-tight py-1">
          Budget Overview
        </h1>
        <p className="text-muted-foreground text-md">
          Monthly Expense Summary for the Past Year
        </p>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row justify-between items-center pb-2">
            <CardTitle className="text-md">Needs</CardTitle>
            <Icons.needs className="w-4 h-4" />
          </CardHeader>
          <CardContent>
            <p className="font-mono text-lg text-muted-foreground">{`₹${totalWants}`}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row justify-between items-center pb-2">
            <CardTitle className="text-md">Wants</CardTitle>
            <Icons.wants className="w-4 h-4" />
          </CardHeader>
          <CardContent>
            <p className="font-mono text-lg text-muted-foreground">{`₹${totalNeeds}`}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row justify-between items-center pb-2">
            <CardTitle className="text-md">Months Recorded</CardTitle>
            <Icons.streaks className="w-4 h-4" />
          </CardHeader>
          <CardContent>
            <p className="font-mono text-lg text-muted-foreground">{`${userBooks.length}`}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row justify-between items-center pb-2">
            <CardTitle className="text-md">Total Entries</CardTitle>
            <Icons.entries className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <p className="font-mono text-lg text-muted-foreground">{`${totalEntries}`}</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-5 gap-4">
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="text-md">Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ExpenseOverview data={data} />
          </CardContent>
        </Card>
        <Card className="col-span-2 max-h-[450px] overflow-y-auto no-scrollbar">
          <CardHeader>
            <CardTitle className="text-md">Total Monthly Expenses</CardTitle>
            <CardDescription>
              You have spent ₹{totalSpent} till now.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col py-0 px-3">
            {expenseData.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[270px]">
                <p className="text-sm font-mono text-muted-foreground">
                  No entries created yet.
                </p>
              </div>
            ) : (
              expenseData.map((expense, index) => (
                <MonthlyExpenseSheet key={index} expenseData={expense}>
                  <div className="flex items-center justify-between hover:bg-muted rounded-lg transtion p-3 cursor-pointer">
                    <span className="text-sm">{expense.month}</span>
                    <span className="font-mono">{`₹${expense.total}`}</span>
                  </div>
                </MonthlyExpenseSheet>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
};

export default Overview;
