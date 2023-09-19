// import { format, utcToZonedTime } from "date-fns-tz";
import { format } from "date-fns";

import { ExpenseType } from "@/types";
import { CurrencyType } from "@/config";
import { EditExpense } from "../expense/edit-expense";
import { DeleteExpense } from "../expense/delete-expense";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export const ExpenseCard = ({
  expense,
  currency,
}: {
  expense: ExpenseType;
  currency: CurrencyType;
}) => {
  // const timeZone = "Asia/Kolkata";
  // const zonedDate = utcToZonedTime(expense.createdAt, timeZone);

  return (
    <Card>
      <CardContent className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-7 gap-y-2 px-4 sm:px-6 py-3">
        <div className="hidden lg:flex items-center col-span-2 lg:col-span-1">
          <span className="text-xs tracking-tighter">
            {/* {format(zonedDate, "dd MMM '·' h:mm a", { timeZone })} */}
            {format(expense.createdAt, "dd MMM '·' h:mm a")}
          </span>
        </div>
        <span className="col-span-2 sm:col-span-3 break-words">
          {expense.description}
        </span>
        {expense.type === "need" ? (
          <span className="text-center">{`${currency}${expense.amount}`}</span>
        ) : (
          <span className="text-center">-</span>
        )}
        {expense.type === "want" ? (
          <span className="text-center">{`${currency}${expense.amount}`}</span>
        ) : (
          <span className="text-center">-</span>
        )}
        <div className="hidden lg:flex justify-around text-xs items-center">
          <EditExpense expense={expense} />
          <DeleteExpense expenseId={expense.id} expenseType={expense.type} />
        </div>
      </CardContent>
      <CardFooter className="py-3 px-4 sm:px-6 lg:hidden">
        <div className="flex justify-between w-full text-xs items-center">
          <div className="flex items-center">
            <span className="text-xs tracking-tighter">
              {/* {format(zonedDate, "dd MMM '·' h:mm a", { timeZone })} */}
              {format(expense.createdAt, "dd MMM '·' h:mm a")}
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
