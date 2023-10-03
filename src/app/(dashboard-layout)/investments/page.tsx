import { redirect } from "next/navigation";
import { Divider } from "@nextui-org/divider";
import { ScrollShadow } from "@nextui-org/scroll-shadow";

import { cn } from "@/lib/utils";
import { CurrencyType } from "@/types";
import { serverClient } from "@/trpc/server-client";
import { Card, CardContent } from "@/components/ui/card";
import { InvestmentCard } from "@/components/cards/investment-card";
import { InvestAddEntry } from "@/components/investments/invest-add-entry";

export const dynamic = "force-dynamic";

const Investments = async () => {
  const currentUser = await serverClient.user.getCurrentUser();
  const investmentEntries =
    await serverClient.investments.getInvestmentEntries();

  if (!currentUser.monthlyIncome) redirect("/onboarding");

  return (
    <Card>
      <CardContent className="flex flex-col gap-y-8 pt-8 pb-4 xl:py-8 relative">
        <div className="flex justify-around gap-4">
          <div className="flex flex-col items-center gap-y-2">
            <span
              className={cn("text-5xl md:text-4xl", {
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
          <div className="hidden md:flex flex-col items-center gap-y-2">
            <span className="text-4xl">
              <span>{currentUser.currency}</span>
              {Math.abs(currentUser.totalInvested).toLocaleString()}
            </span>
            <p className="text-sm text-muted-foreground tracking-tight">
              Total Invested
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-x-12 items-center">
          <InvestAddEntry
            initialBalance={currentUser.investmentsBalance}
            initialTotalInvested={currentUser.totalInvested}
            currency={currentUser.currency as CurrencyType}
          />
        </div>
      </CardContent>
      <Divider />
      <ScrollShadow className="h-[calc(80vh-150px)] w-full no-scrollbar">
        <CardContent className="pt-8">
          <InvestmentCard
            initialInvestmentEntries={investmentEntries}
            initialTotalInvested={currentUser.totalInvested}
            currency={currentUser.currency as CurrencyType}
            initialBalance={currentUser.investmentsBalance}
          />
        </CardContent>
      </ScrollShadow>
    </Card>
  );
};

export default Investments;
