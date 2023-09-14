import { FC, ReactNode } from "react";
import { Divider } from "@nextui-org/divider";

import { Books, Needs, Wants } from "@/db/schema";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type ExpenseType = {
  books: Books[];
  needs: Needs[];
  wants: Wants[];
  month: string;
  total: number;
};

interface MonthlyExpenseSheetProps {
  children: ReactNode;
  expenseData: ExpenseType;
}

export const MonthlyExpenseSheet: FC<MonthlyExpenseSheetProps> = ({
  children,
  expenseData,
}) => {
  const expenses = [
    ...expenseData.needs.map((item) => ({
      ...item,
      type: "need" as const,
    })),
    ...expenseData.wants.map((item) => ({
      ...item,
      type: "want" as const,
    })),
  ];
  expenses.sort((a: any, b: any) => b.createdAt - a.createdAt);

  return (
    <Sheet>
      <SheetTrigger className="focus:outline-none rounded-lg focus-visible:ring-2 focus-visible:ring-neutral-800">
        {children}
      </SheetTrigger>
      <SheetContent className="overflow-y-auto no-scrollbar">
        <SheetHeader className="mt-2 sm:mt-0">
          <SheetTitle>{`${expenseData.month} expenses`}</SheetTitle>
          <SheetDescription>
            You spent a total of ₹{expenseData.total} this month.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-8 tracking-tight">
          <div className="flex justify-between items-center text-muted-foreground text-sm">
            <span>Details</span>
            <span>Amount</span>
          </div>
          <Divider />
          {expenses.map((expense) => (
            <div key={expense.id} className="grid grid-cols-4">
              <div className="flex items-center col-span-3">
                <span className="text-sm break-words">
                  {expense.description}
                </span>
              </div>
              <div className="flex gap-x-1 justify-end items-center">
                <span className="font-mono">{`₹${expense.amount}`}</span>
                <span className="text-xs">{`(${expense.type})`}</span>
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
