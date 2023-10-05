import { redirect } from "next/navigation";
import { Divider } from "@nextui-org/divider";
import { ScrollShadow } from "@nextui-org/scroll-shadow";

import { cn } from "@/lib/utils";
import { CurrencyType } from "@/types";
import { Icons } from "@/components/icons";
import ToolTip from "@/components/ui/tool-tip";
import { Transfer } from "@/components/transfer";
import { serverClient } from "@/trpc/server-client";
import { Card, CardContent } from "@/components/ui/card";
import SavingsCard from "@/components/cards/savings-card";

export const dynamic = "force-dynamic";

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
            currency={currentUser.currency as CurrencyType}
            initialSelected="savings"
            savingsBalance={currentUser.savingsBalance}
            investmentsBalance={currentUser.investmentsBalance}
            miscellaneousBalance={currentUser.miscellanousBalance}
          />
        </div>
        <div className="flex flex-col items-center gap-y-2">
          <span
            className={cn("text-5xl md:text-4xl", {
              "text-red-500": currentUser.savingsBalance < 0,
            })}
          >
            <span>{currentUser.savingsBalance < 0 ? "-" : ""}</span>
            <span>{currentUser.currency}</span>
            {Math.abs(currentUser.savingsBalance).toLocaleString()}
          </span>
          <p className="text-sm text-muted-foreground tracking-tight">
            Savings Balance
          </p>
        </div>
      </CardContent>
      <Divider />
      <ScrollShadow className="h-[calc(100vh-220px)] w-full no-scrollbar">
        <CardContent className=" pt-8">
          <SavingsCard
            initialSavingsEntries={savingsEntries}
            currency={currentUser.currency as CurrencyType}
          />
        </CardContent>
      </ScrollShadow>
    </Card>
  );
};

export default Savings;
