import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Divider } from "@nextui-org/divider";

import { env } from "@/env.mjs";
import { cn } from "@/lib/utils";
import { CurrencyType } from "@/types";
import { Icons } from "@/components/icons";
import ToolTip from "@/components/ui/tool-tip";
import { Transfer } from "@/components/transfer";
import { serverClient } from "@/trpc/server-client";
import { Card, CardContent } from "@/components/ui/card";
import SavingsCard from "@/components/cards/savings-card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: "Savings",
  description:
    "View your savings balance, track your monthly contributions, and monitor transfers to and from this account with ease.",
};

const Savings = async () => {
  const currentUser = await serverClient.user.getCurrentUser();

  if (!currentUser.monthlyIncome) redirect("/onboarding");

  const savingsEntries = await serverClient.savings.getSavingsEntries();

  return (
    <Card>
      <CardContent className="flex flex-col gap-y-8 py-8 relative">
        <div className="absolute top-3 left-3">
          <ToolTip
            showArrow
            customComponent={
              <div className="px-1 py-2 max-w-xs">
                <div className="text-small font-bold">Savings Account</div>
                <div className="text-tiny">
                  View your monthly savings, dues and transfers.
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
            initialSelected="savings"
            savingsBalance={parseFloat(currentUser.savingsBalance)}
            investmentsBalance={parseFloat(currentUser.investmentsBalance)}
            miscellaneousBalance={parseFloat(currentUser.miscellanousBalance)}
          />
        </div>
        <div className="flex flex-col items-center gap-y-1 sm:gap-y-2 pt-6 md:pt-0">
          <span
            className={cn("text-2xl md:text-4xl", {
              "text-danger-text": parseFloat(currentUser.savingsBalance) < 0,
            })}
          >
            <span>{parseFloat(currentUser.savingsBalance) < 0 ? "-" : ""}</span>
            <span>{currentUser.currency}</span>
            {Math.abs(parseFloat(currentUser.savingsBalance)).toLocaleString()}
          </span>
          <p className="text-xs sm:text-sm text-muted-foreground tracking-tight">
            Savings Balance
          </p>
        </div>
      </CardContent>
      <Divider />
      <CardContent className=" pt-8">
        <SavingsCard
          initialSavingsEntries={savingsEntries}
          currency={currentUser.currency as CurrencyType}
        />
      </CardContent>
    </Card>
  );
};

export default Savings;
