"use client";
import Link from "next/link";
import { format } from "date-fns";

import { ExpenseType } from "@/types";
import { CurrencyType } from "@/types";
import { Badge } from "@/components/ui/badge";
import { EditExpense } from "@/components/expense/edit-expense";
import { DeleteExpense } from "@/components/expense/delete-expense";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export const ExpenseCard = ({
  expense,
  currency,
}: {
  expense: ExpenseType;
  currency: CurrencyType;
}) => {
  return (
    <Card className="bg-background relative">
      <CardContent className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-7 items-center gap-y-2 px-4 sm:px-6 py-3">
        <div className="hidden lg:flex items-center col-span-2 lg:col-span-1">
          <span className="text-xs tracking-tighter">
            {format(expense.createdAt, "dd MMM '·' h:mm a")}
          </span>
        </div>
        <span className="col-span-2 sm:col-span-3 break-words">
          {expense.description}{" "}
          {expense.dueType && expense.dueType === "payable" && (
            <span className="text-xs text-muted-foreground font-mono">
              (due paid)
            </span>
          )}
        </span>
        {expense.type === "need" ? (
          <span className="text-center">{`${currency}${expense.amount.toLocaleString()}`}</span>
        ) : (
          <span className="text-center text-muted-foreground font-mono text-xs">
            N/A
          </span>
        )}
        {expense.type === "want" ? (
          <span className="text-center">{`${currency}${expense.amount.toLocaleString()}`}</span>
        ) : (
          <span className="text-center text-muted-foreground font-mono text-xs">
            N/A
          </span>
        )}
        {expense.dueType ? (
          <Link
            href="/dues"
            className="hidden lg:block text-primary text-center text-xs underline underline-offset-4"
          >
            Dues
          </Link>
        ) : (
          <div className="hidden lg:flex justify-around text-xs items-center">
            <EditExpense expense={expense} />
            <DeleteExpense expenseId={expense.id} expenseType={expense.type} />
          </div>
        )}
      </CardContent>
      <CardFooter className="py-3 px-4 sm:px-6 lg:hidden">
        {expense.dueType ? (
          <div className="flex justify-end w-full text-xs items-center">
            <Link
              href="/dues"
              className="text-primary text-center text-xs underline underline-offset-4"
            >
              Dues
            </Link>
          </div>
        ) : (
          <div className="flex justify-around w-full text-xs items-center">
            <EditExpense expense={expense} />
            <DeleteExpense expenseId={expense.id} expenseType={expense.type} />
          </div>
        )}
      </CardFooter>
      <Badge className="lg:hidden absolute -bottom-[22px] bg-secondary text-white rounded-t-none rounded-b-lg right-4">
        <span className="text-[10px] font-normal tracking-tighter">
          {format(expense.createdAt, "dd MMM '·' h:mm a")}
        </span>
      </Badge>
    </Card>
  );
};
