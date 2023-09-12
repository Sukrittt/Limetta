import { format, utcToZonedTime } from "date-fns-tz";

import { ExpenseType } from "@/types";
import { EditExpense } from "./edit-expense";
import { DeleteExpense } from "./delete-expense";
import { Card, CardContent } from "@/components/ui/card";

export const ExpenseCard = ({ expense }: { expense: ExpenseType }) => {
  const timeZone = "Asia/Kolkata";
  const zonedDate = utcToZonedTime(expense.createdAt, timeZone);

  return (
    <Card>
      <CardContent className="grid grid-cols-7 py-3">
        <div className="flex items-center">
          <span className="text-xs tracking-tighter">
            {format(zonedDate, "dd MMM '·' h:mm a", { timeZone })}
          </span>
        </div>
        <span className="col-span-3">{expense.description}</span>
        {expense.type === "need" ? (
          <span className="text-center font-mono">{`₹${expense.amount}`}</span>
        ) : (
          <span className="text-center">-</span>
        )}
        {expense.type === "want" ? (
          <span className="text-center font-mono">{`₹${expense.amount}`}</span>
        ) : (
          <span className="text-center">-</span>
        )}
        <div className="flex gap-x-2 justify-around text-xs items-center">
          <EditExpense expense={expense} />
          <DeleteExpense expenseId={expense.id} expenseType={expense.type} />
        </div>
      </CardContent>
    </Card>
  );
};
