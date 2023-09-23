import { Divider } from "@nextui-org/divider";

import { cn } from "@/lib/utils";
import { CurrencyType } from "@/config";
import { serverClient } from "@/trpc/server-client";
import { Card, CardContent } from "@/components/ui/card";
import { MiscExpense } from "@/components/misc/misc-expense";
import { InvestAddEntry } from "@/components/investments/invest-add-entry";
import { InvestmentCard } from "@/components/cards/investment-card";

export const dynamic = "force-dynamic";

const Investments = async () => {
  const currentUser = await serverClient.user.getCurrentUser();
  const investmentEntries =
    await serverClient.investments.getInvestmentEntries();

  return (
    <Card className="rounded-2xl">
      <CardContent className="flex flex-col gap-y-8 py-8">
        <div className="flex flex-col items-center gap-y-2">
          <span
            className={cn("text-4xl", {
              "text-red-500": currentUser.investmentsBalance < 0,
            })}
          >
            <span>{currentUser.investmentsBalance < 0 ? "-" : ""}</span>
            <span>{currentUser.currency}</span>
            {Math.abs(currentUser.investmentsBalance).toLocaleString()}
          </span>
          <p className="text-sm text-muted-foreground tracking-tight">
            Investments Balance
          </p>
        </div>
        <div className="flex justify-center gap-x-12 items-center">
          <InvestAddEntry
            initialBalance={currentUser.investmentsBalance}
            currency={currentUser.currency as CurrencyType}
          />
          <MiscExpense initialBalance={currentUser.investmentsBalance} />
        </div>
      </CardContent>
      <Divider />
      <CardContent className="h-[calc(80vh-130px)] overflow-y-auto no-scrollbar pt-8">
        <InvestmentCard
          investmentEntries={investmentEntries}
          currency={currentUser.currency as CurrencyType}
          initialBalance={currentUser.investmentsBalance}
        />
      </CardContent>
    </Card>
  );
};

export default Investments;
