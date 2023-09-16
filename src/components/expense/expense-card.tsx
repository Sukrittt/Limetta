import { format, utcToZonedTime } from "date-fns-tz";

import { ExpenseType } from "@/types";
import { EditExpense } from "./edit-expense";
import { DeleteExpense } from "./delete-expense";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export const ExpenseCard = ({ expense }: { expense: ExpenseType }) => {
  const timeZone = "Asia/Kolkata";
  const zonedDate = utcToZonedTime(expense.createdAt, timeZone);

  return (
    <Card>
      <CardContent className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-7 gap-y-2 px-4 sm:px-6 py-3">
        <div className="hidden lg:flex items-center col-span-2 lg:col-span-1">
          <span className="text-xs tracking-tighter">
            {format(zonedDate, "dd MMM '·' h:mm a", { timeZone })}
          </span>
        </div>
        <span className="text-base col-span-2 sm:col-span-3 break-words">
          {expense.description}
        </span>
        {expense.type === "need" ? (
          <span className="text-center">{`₹${expense.amount}`}</span>
        ) : (
          <span className="text-center">-</span>
        )}
        {expense.type === "want" ? (
          <span className="text-center">{`₹${expense.amount}`}</span>
        ) : (
          <span className="text-center">-</span>
        )}
        <div className="hidden lg:flex gap-x-2 justify-around text-xs items-center">
          <EditExpense expense={expense} />
          <DeleteExpense expenseId={expense.id} expenseType={expense.type} />
        </div>
      </CardContent>
      <CardFooter className="py-3 px-4 sm:px-6 lg:hidden">
        <div className="flex justify-between w-full text-xs items-center">
          <div className="flex items-center">
            <span className="text-xs tracking-tighter">
              {format(zonedDate, "dd MMM '·' h:mm a", { timeZone })}
            </span>
          </div>
          <div className="flex gap-x-4">
            <EditExpense expense={expense} />
            <DeleteExpense expenseId={expense.id} expenseType={expense.type} />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
