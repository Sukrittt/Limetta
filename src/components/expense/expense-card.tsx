import { format } from "date-fns";
import { ExpenseType } from "@/types";
import { EditExpense } from "./edit-expense";
import { DeleteExpense } from "./delete-expense";
import { Card, CardContent } from "@/components/ui/card";

export const ExpenseCard = ({ expense }: { expense: ExpenseType }) => {
  return (
    <Card>
      <CardContent className="grid grid-cols-7 py-3">
        <span>{format(expense.createdAt, "dd MMM yyyy")}</span>
        <span className="col-span-3">{expense.description}</span>
        {expense.type === "need" ? (
          <span className="text-center font-mono">{`₹ ${expense.amount}`}</span>
        ) : (
          <span className="text-center">-</span>
        )}
        {expense.type === "want" ? (
          <span className="text-center font-mono">{`₹ ${expense.amount}`}</span>
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
