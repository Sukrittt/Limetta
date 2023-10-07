"use client";

import { format } from "date-fns";
import { Divider } from "@nextui-org/divider";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import ToolTip from "@/components/ui/tool-tip";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export const DueCard = () => {
  const entries = [
    {
      name: "Flat Rent",
      amount: 500,
      dueType: "payable",
      dueStatus: "paid",
      transferredAccount: "want",
      dueDate: new Date().setDate(1),
    },
    {
      name: "Lent money to a friend",
      amount: 100,
      dueType: "receivable",
      dueStatus: "pending",
      dueDate: new Date(),
    },
  ];

  return (
    <div className="flex flex-col gap-y-8 w-full sm:w-[500px]">
      {entries.map((entry, index) => (
        <Card key={index}>
          <CardContent className="grid grid-cols-5 px-4 sm:px-6 py-3">
            <span className="col-span-4 break-words">{entry.name}</span>
            <span className="text-center">
              ₹{entry.amount.toLocaleString()}
            </span>
          </CardContent>
          <Divider className="block" />
          <CardFooter className="text-xs px-4 sm:px-6 pb-3 flex flex-col items-start pt-3 gap-y-2">
            <div className="flex gap-x-4">
              <span
                className={cn("text-center text-xs", {
                  "text-red-500": entry.dueType === "payable",
                  "text-green-600": entry.dueType === "receivable",
                })}
              >
                {entry.dueType === "payable" ? "Payable" : "Receivable"}
              </span>
              <span
                className={cn("text-center text-xs", {
                  "text-green-600": entry.dueStatus === "paid",
                  "text-yellow-600": entry.dueStatus === "pending",
                })}
              >
                {entry.transferredAccount ? (
                  <ToolTip
                    customComponent={
                      <p className="text-xs">
                        Transferred to{" "}
                        <span className="text-primary">expense-tracker</span>
                      </p>
                    }
                    showArrow
                  >
                    <div className="flex gap-x-1">
                      <span>Paid</span>
                      <Icons.info className="w-3 h-3 mt-[2px] text-muted-foreground" />
                    </div>
                  </ToolTip>
                ) : (
                  "Pending"
                )}
              </span>
            </div>
            <span className="text-center text-xs">
              Due date: {format(new Date(entry.dueDate), "dd MMM, yy")}
              {entry.dueStatus === "pending" &&
                new Date(entry.dueDate) <= new Date() && (
                  <span className="text-yellow-600">!</span>
                )}
            </span>
            <div className="flex gap-x-4">
              <span
                className={cn(
                  "cursor-pointer text-primary hover:opacity-90 transition",
                  {
                    "text-yellow-600": entry.dueStatus === "paid",
                  }
                )}
              >
                Mark as paid
              </span>
              <span className="cursor-pointer text-yellow-600 hover:opacity-90 transition">
                Edit
              </span>
              <span className="cursor-pointer text-red-500 hover:opacity-90 transition">
                Delete
              </span>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
