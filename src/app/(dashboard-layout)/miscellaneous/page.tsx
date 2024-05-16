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
import MiscCard from "@/components/cards/misc-card";
import { Card, CardContent } from "@/components/ui/card";
import { MiscEntry } from "@/components/misc/misc-entry";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: "Miscellaneous",
  description:
    "Streamline your miscellaneous finances effortlessly on our Miscellaneous page. Easily record and track additional income and expenses that do not fit into your regular categories, providing a flexible approach to managing your financial transactions.",
};

const Miscellaneous = async () => {
  const currentUser = await serverClient.user.getCurrentUser();

  if (!currentUser.monthlyIncome) redirect("/onboarding");

  const miscEntries = await serverClient.misc.getMiscTransactions();

  return (
    <Card>
      <CardContent className="flex flex-col gap-y-8 py-8 relative">
        <div className="absolute top-3 left-3">
          <ToolTip
            showArrow
            customComponent={
              <div className="px-1 py-2 max-w-xs">
                <div className="text-small font-bold">
                  Miscellaneous Account
                </div>
                <div className="text-tiny">
                  View your miscellaneous transactions, dues and transfers.
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
            initialSelected="miscellaneous"
            savingsBalance={parseFloat(currentUser.savingsBalance)}
            investmentsBalance={parseFloat(currentUser.investmentsBalance)}
            miscellaneousBalance={parseFloat(currentUser.miscellanousBalance)}
          />
        </div>
        <div className="flex flex-col items-center gap-y-1 sm:gap-y-2 pt-6 md:pt-0">
          <span
            className={cn("text-2xl md:text-4xl", {
              "text-danger-text":
                parseFloat(currentUser.miscellanousBalance) < 0,
            })}
          >
            <span>
              {parseFloat(currentUser.miscellanousBalance) < 0 ? "-" : ""}
            </span>
            <span>{currentUser.currency}</span>
            {Math.abs(
              parseFloat(currentUser.miscellanousBalance)
            ).toLocaleString()}
          </span>
          <p className="text-xs sm:text-sm text-muted-foreground tracking-tight">
            Miscellaneous Balance
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-y-2 sm:justify-center sm:gap-x-12 sm:items-center">
          <MiscEntry
            currency={currentUser.currency as CurrencyType}
            entryType="in"
          />
          <MiscEntry
            currency={currentUser.currency as CurrencyType}
            entryType="out"
          />
        </div>
      </CardContent>
      <Divider />
      <CardContent className="pt-8">
        <MiscCard
          initialMiscEntries={miscEntries}
          currency={currentUser.currency as CurrencyType}
        />
      </CardContent>
    </Card>
  );
};

export default Miscellaneous;
