import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

type ExpenseType = {
  type: string;
  userId: string;
  id: number;
  description: string;
  createdAt: Date;
  amount: number;
  bookId: number;
};

export const ExpenseCard = ({ expense }: { expense: ExpenseType }) => {
  return (
    <Card>
      <CardContent className="grid grid-cols-7 py-3">
        <span>{format(expense.createdAt, "dd MMM yyyy")}</span>
        <span className="col-span-3">{expense.description}</span>
        {expense.type === "needs" ? (
          <span className="text-center">{`₹ ${expense.amount}`}</span>
        ) : (
          <span className="text-center">-</span>
        )}
        {expense.type === "wants" ? (
          <span className="text-center">{`₹ ${expense.amount}`}</span>
        ) : (
          <span className="text-center">-</span>
        )}
        <div className="flex gap-x-2 justify-around text-xs items-center">
          <span className="cursor-pointer hover:text-primary hover:opacity-90 transition">
            Edit
          </span>
          <span className="cursor-pointer hover:text-primary hover:opacity-90 transition">
            Delete
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
