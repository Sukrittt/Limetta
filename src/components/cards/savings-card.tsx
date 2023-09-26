import Link from "next/link";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Savings } from "@/db/schema";
import { CurrencyType } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

const SavingsCard = ({
  savingsEntries,
  currency,
}: {
  savingsEntries: Savings[];
  currency: CurrencyType;
}) => {
  if (savingsEntries.length === 0) {
    return (
      <p className="mt-2 text-sm text-center tracking-tight text-muted-foreground">
        Your monthly savings and money transfers will appear here.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-y-2 text-sm">
      <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-7 px-4 sm:px-6">
        <span className="hidden lg:block">Date & Time</span>
        <span className="col-span-2 sm:col-span-3">Details</span>
        <span className="text-center col-span-2">Amount</span>
      </div>
      {savingsEntries.map((entry) => {
        const transferEntry = entry.transferingFrom || entry.transferingTo;
        const transferText = entry.transferingFrom
          ? entry.transferingFrom
          : entry.transferingTo;

        return (
          <Card key={entry.id}>
            <CardContent className="grid grid-cols-7 px-4 sm:px-6 py-3">
              <div className="items-center col-span-2 lg:col-span-1">
                <span className="text-xs tracking-tighter">
                  {format(entry.createdAt, "dd MMM '·' h:mm a")}
                </span>
              </div>
              <span className="col-span-2 sm:col-span-3 break-words">
                {transferEntry ? (
                  <>
                    {`Transferred ${entry.transferingFrom ? "from" : "to"}
                      ${transferText} account`}
                  </>
                ) : (
                  entry.entryName
                )}
              </span>

              <span
                className={cn("text-center col-span-2", {
                  "text-green-600": entry.entryType === "in",
                  "text-red-500": entry.entryType === "out",
                })}
              >
                {entry.entryType === "in" ? "+" : "-"}
                {currency}
                {entry.amount.toLocaleString()}
              </span>
              {transferEntry && (
                <Link
                  href={`/${transferText}`}
                  className="text-primary text-center underline underline-offset-4"
                >
                  {transferText &&
                    transferText?.charAt(0).toUpperCase() +
                      transferText?.slice(1)}
                </Link>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default SavingsCard;
