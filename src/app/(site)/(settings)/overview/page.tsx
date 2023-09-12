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

const Overview = async () => {
  const userBooks = await serverClient.books.getUserBooks();

  const data = userBooks.map((obj) => {
    const totalExpenses =
      obj.needs.reduce((acc, need) => acc + need.amount, 0) +
      obj.wants.reduce((acc, want) => acc + want.amount, 0);

    const month = new Date(obj.books[0].createdAt).toLocaleString("en-US", {
      month: "short",
    });

    return {
      name: month,
      total: totalExpenses,
    };
  });

  const expenseData = userBooks.map((obj) => {
    const totalExpenses =
      obj.needs.reduce((acc, need) => acc + need.amount, 0) +
      obj.wants.reduce((acc, want) => acc + want.amount, 0);

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
          Monthly Expense Summary and History
        </p>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-md">Title</CardTitle>
          </CardHeader>
          <CardContent>Content</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-md">Title</CardTitle>
          </CardHeader>
          <CardContent>Content</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-md">Title</CardTitle>
          </CardHeader>
          <CardContent>Content</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-md">Title</CardTitle>
          </CardHeader>
          <CardContent>Content</CardContent>
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
            <CardTitle className="text-md">Previous Month Expenses</CardTitle>
            <CardDescription>You spent ₹{totalSpent} till now.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col py-0 px-3">
            {expenseData.map((expense, index) => (
              <MonthlyExpenseSheet key={index} expenseData={expense}>
                <div className="flex items-center justify-between hover:bg-muted rounded-lg transtion p-3 cursor-pointer">
                  <span className="text-sm">{expense.month}</span>
                  <span className="font-mono">{`₹${expense.total}`}</span>
                </div>
              </MonthlyExpenseSheet>
            ))}
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
};

export default Overview;
