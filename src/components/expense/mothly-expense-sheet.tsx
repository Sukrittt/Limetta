"use client";
import { FC, ReactNode } from "react";
import axios from "axios";
import { format } from "date-fns";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import { Divider } from "@nextui-org/divider";

import { Books, Needs, Wants } from "@/db/schema";
import { cn, createDownloadUrl } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CurrencyType } from "@/types";
import { toast } from "@/hooks/use-toast";
import { Icons } from "@/components/icons";
import ToolTip from "@/components/ui/tool-tip";
import { ExcelDataType } from "@/lib/validators";
import { useMutation } from "@tanstack/react-query";

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
  currency: CurrencyType;
}

export const MonthlyExpenseSheet: FC<MonthlyExpenseSheetProps> = ({
  children,
  expenseData,
  currency,
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

  const needsTotal = expenses.reduce(
    (acc, item) => (item.type === "need" ? acc + item.amount : acc),
    0
  );
  const wantsTotal = expenses.reduce(
    (acc, item) => (item.type === "want" ? acc + item.amount : acc),
    0
  );
  const totalSaved =
    expenseData.books[0].monthIncome - (needsTotal + wantsTotal);

  const { mutate: downloadEntries, isLoading } = useMutation({
    mutationFn: async () => {
      const excelData: ExcelDataType = {
        data: expenses.reverse().map((expense) => ({
          date: format(expense.createdAt, "dd-MM-yyyy"),
          details: expense.description,
          needs: expense.type === "need" ? expense.amount.toString() : "",
          wants: expense.type === "want" ? expense.amount.toString() : "",
        })),
        calculations: {
          needsTotal,
          wantsTotal,
          totalSaved,
        },
      };

      const response = await axios.post("/api/excel", excelData, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const fileName = `${format(
        expenseData.books[0].createdAt,
        "MMMM_yyyy"
      )}.xlsx`;

      createDownloadUrl(blob, fileName);
    },
    onSuccess: () => {
      toast({
        title: "Downloaded",
        description: "Expense Sheet has been downloaded successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Something went wrong.",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <Sheet>
      <SheetTrigger className="focus:outline-none rounded-lg focus-visible:ring-2 focus-visible:ring-neutral-800">
        {children}
      </SheetTrigger>
      <SheetContent className="overflow-y-auto no-scrollbar">
        <SheetHeader className="mt-2 sm:mt-0">
          <SheetTitle>{`${expenseData.month} expenses`}</SheetTitle>
          <SheetDescription>
            {`You spent a total of ${currency}${expenseData.total} this month.`}
          </SheetDescription>
          <div className="flex justify-end">
            <ToolTip text="Export excel" showArrow>
              <Button
                onClick={() => downloadEntries()}
                disabled={isLoading}
                className={cn(
                  buttonVariants({ size: "icon" }),
                  "rounded-full h-8 w-8"
                )}
              >
                {isLoading ? (
                  <Spinner color="default" size="sm" />
                ) : (
                  <Icons.download className="h-4 w-4" />
                )}
              </Button>
            </ToolTip>
          </div>
        </SheetHeader>
        <div className="grid gap-4 py-8 tracking-tight">
          <div className="flex justify-between items-center text-muted-foreground text-sm">
            <span>Details</span>
            <span>Amount</span>
          </div>
          <Divider />
          {expenses.length === 0 ? (
            <p className="font-mono mt-2 text-center text-sm text-muted-foreground">
              No expenses recorded for this month.
            </p>
          ) : (
            expenses.map((expense, index) => (
              <div key={index} className="grid grid-cols-4">
                <div className="flex items-center col-span-3">
                  <span className="text-sm break-words">
                    {expense.description}
                  </span>
                </div>
                <div className="flex gap-x-1 justify-end items-center">
                  <span className="font-mono">{`${currency}${expense.amount}`}</span>
                  <span className="text-xs">{`(${expense.type})`}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
