import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Divider } from "@nextui-org/divider";
import { ScrollShadow } from "@nextui-org/scroll-shadow";

import { env } from "@/env.mjs";
import { cn } from "@/lib/utils";
import { CurrencyType } from "@/types";
import { Icons } from "@/components/icons";
import ToolTip from "@/components/ui/tool-tip";
import { Transfer } from "@/components/transfer";
import { serverClient } from "@/trpc/server-client";
import { Card, CardContent } from "@/components/ui/card";
import { InvestmentCard } from "@/components/cards/investment-card";
import { InvestAddEntry } from "@/components/investments/invest-add-entry";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: "Investments",
  description:
    "Effortlessly manage your investment entries with our user-friendly Investments page. Stay organized and in control of your investments with ease.",
};

const Investments = async () => {
  const currentUser = await serverClient.user.getCurrentUser();

  if (!currentUser.monthlyIncome) redirect("/onboarding");

  const investmentEntries =
    await serverClient.investments.getInvestmentEntries();

  return (
    <Card>
      <CardContent className="flex flex-col gap-y-8 pt-8 pb-4 xl:py-8 relative">
        <div className="absolute top-3 left-3">
          <ToolTip
            showArrow
            customComponent={
              <div className="px-1 py-2 max-w-xs">
                <div className="text-small font-bold">Investment Account</div>
                <div className="text-tiny">
                  Keep an eye on your investments, track transfers, and book
                  profits.
                </div>
              </div>
            }
          >
            <Icons.help className="h-4 w-4 text-muted-foreground" />
          </ToolTip>
        </div>
        <div className="absolute top-3 right-3">
          <Transfer
            showTooltip
            currency={currentUser.currency as CurrencyType}
            initialSelected="investments"
            savingsBalance={parseFloat(currentUser.savingsBalance)}
            investmentsBalance={parseFloat(currentUser.investmentsBalance)}
            miscellaneousBalance={parseFloat(currentUser.miscellanousBalance)}
          />
        </div>
        <div className="flex justify-between sm:justify-around gap-4 pt-6 md:pt-0">
          <div className="flex flex-col items-center gap-y-1 sm:gap-y-2">
            <span
              className={cn("text-2xl md:text-4xl", {
                "text-danger-text":
                  parseFloat(currentUser.investmentsBalance) < 0,
              })}
            >
              <span>
                {parseFloat(currentUser.investmentsBalance) < 0 ? "-" : ""}
              </span>
              <span>{currentUser.currency}</span>
              {Math.abs(
                parseFloat(currentUser.investmentsBalance)
              ).toLocaleString()}
            </span>
            <p className="text-xs sm:text-sm text-muted-foreground tracking-tight">
              Investments Balance
            </p>
          </div>
          <div className="flex flex-col items-center gap-y-1 sm:gap-y-2">
            <span className="text-2xl md:text-4xl">
              <span>{currentUser.currency}</span>
              {Math.abs(parseFloat(currentUser.totalInvested)).toLocaleString()}
            </span>
            <p className="text-xs sm:text-sm text-muted-foreground tracking-tight">
              Total Invested
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-x-12 items-center">
          <InvestAddEntry
            initialBalance={parseFloat(currentUser.investmentsBalance)}
            currency={currentUser.currency as CurrencyType}
          />
        </div>
      </CardContent>
      <Divider />
      <CardContent className="pt-8">
        <InvestmentCard
          initialInvestmentEntries={investmentEntries}
          currency={currentUser.currency as CurrencyType}
          initialBalance={parseFloat(currentUser.investmentsBalance)}
        />
      </CardContent>
    </Card>
  );
};

export default Investments;
