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
        <Card key={index} className="bg-[#1c1917] border-[#27272a]">
          <CardContent className="grid grid-cols-5 px-4 sm:px-6 py-3">
            <span className="col-span-4 break-words">{entry.name}</span>
            <span className="text-center">
              ₹{entry.amount.toLocaleString()}
            </span>
          </CardContent>
          <Divider className="block" />
          <CardFooter className="text-xs px-4 sm:px-6 pb-3 flex flex-col items-start pt-3 gap-y-2">
            <div className="flex justify-between items-center w-full">
              <span
                className={cn("text-center text-xs", {
                  "text-danger-text": entry.dueType === "payable",
                  "text-success-text": entry.dueType === "receivable",
                })}
              >
                {entry.dueType === "payable" ? "Payable" : "Receivable"}
              </span>
              <span
                className={cn(
                  "cursor-pointer text-primary hover:opacity-90 transition bg-[#27272a] rounded-md py-1 px-2",
                  {
                    "text-warning-text": entry.dueStatus === "paid",
                  }
                )}
              >
                {`Mark as ${entry.dueStatus === "paid" ? "pending" : "paid"}`}
              </span>
            </div>
            <span className="text-center text-xs">
              <span className="text-muted-foreground">Due by:</span>{" "}
              {format(new Date(entry.dueDate), "dd MMM, yy")}
              {entry.dueStatus === "pending" &&
                new Date(entry.dueDate) <= new Date() && (
                  <span className="text-danger-text ml-1">!</span>
                )}
            </span>
            <div className="flex justify-between w-full items-center">
              <div className="flex gap-x-4">
                <span className="cursor-pointer text-warning-text hover:opacity-90 transition">
                  Edit
                </span>
                <span className="cursor-pointer text-danger-text hover:opacity-90 transition">
                  Delete
                </span>
              </div>
              <span
                className={cn("text-center text-xs", {
                  "text-success-text": entry.dueStatus === "paid",
                  "text-warning-text": entry.dueStatus === "pending",
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
                    <Icons.check2 className="h-4 w-4" />
                  </ToolTip>
                ) : (
                  <Icons.alert2 className="h-4 w-4" />
                )}
              </span>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
