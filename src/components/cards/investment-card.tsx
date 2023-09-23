import Link from "next/link";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Investments } from "@/db/schema";
import { CurrencyType, InvestmentType } from "@/config";
import { Card, CardContent } from "@/components/ui/card";
import { InvestmentEditEntry } from "@/components/investments/invest-edit-entry";
import { InvestmentDeleteEntry } from "@/components/investments/investment-delete-entry";

export const InvestmentCard = ({
  initialBalance,
  investmentEntries,
  currency,
  initialTotalInvested,
}: {
  investmentEntries: Investments[];
  currency: CurrencyType;
  initialBalance: number;
  initialTotalInvested: number;
}) => {
  if (investmentEntries.length === 0) {
    return (
      <p className="mt-2 text-sm text-center tracking-tight text-muted-foreground">
        Your transactions will appear here.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-y-2 text-sm">
      <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-8 px-4 sm:px-6">
        <span className="hidden lg:block">Date & Time</span>
        <span className="col-span-2 sm:col-span-3">Details</span>
        <span>Investment Type</span>
        <span className="text-center col-span-2">Amount</span>
      </div>
      {investmentEntries.map((entry) => {
        const transferEntry = entry.transferingFrom || entry.transferingTo;
        const transferText = entry.transferingFrom
          ? entry.transferingFrom
          : entry.transferingTo;

        const customDescription = entry.tradeBooks
          ? entry.entryType === "in"
            ? `Profits earned from ${entry.entryName}`
            : `Loss incurred from ${entry.entryName}`
          : `Invested in ${entry.entryName}`;

        const entryDetails = {
          entryId: entry.id,
          amount: entry.amount,
          description: entry.entryName,
          entryType: entry.entryType,
          initialBalance,
        };

        return (
          <Card key={entry.id}>
            <CardContent className="grid grid-cols-8 px-4 sm:px-6 py-3">
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
                  customDescription
                )}
              </span>

              <span>{entry.investmentType}</span>

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
              {transferEntry ? (
                <Link
                  href={`/${transferText}`}
                  className="text-primary text-center underline underline-offset-4"
                >
                  {transferText &&
                    transferText?.charAt(0).toUpperCase() +
                      transferText?.slice(1)}
                </Link>
              ) : (
                <div className="flex justify-around items-center text-xs">
                  <InvestmentEditEntry
                    currency={currency}
                    entryDetails={entryDetails}
                    tradeBooking={entry.tradeBooks}
                    initialTotalInvested={initialTotalInvested}
                    initialInvestmentType={
                      entry.investmentType as InvestmentType
                    }
                  />
                  <InvestmentDeleteEntry entryDetails={entryDetails} />
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
