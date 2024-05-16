import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Divider } from "@nextui-org/divider";

import { env } from "@/env.mjs";
import { cn } from "@/lib/utils";
import { CurrencyType } from "@/types";
import { Icons } from "@/components/icons";
import ToolTip from "@/components/ui/tool-tip";
import { serverClient } from "@/trpc/server-client";
import { DueCard } from "@/components/cards/due-card";
import { Card, CardContent } from "@/components/ui/card";
import { DuePayment } from "@/components/due/due-payment";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: "Dues",
  description:
    "Streamline due management on our Dues page. Create, track, and settle dues while choosing where to allocate funds: miscellaneous account, savings, or current month's expenses.",
};

const Dues = async () => {
  const currentUser = await serverClient.user.getCurrentUser();

  if (!currentUser.monthlyIncome) redirect("/onboarding");

  const dueEntries = await serverClient.dues.getDueEntries();

  return (
    <Card>
      <CardContent className="flex flex-col gap-y-8 py-8 relative">
        <div className="absolute top-3 left-3">
          <ToolTip
            showArrow
            customComponent={
              <div className="px-1 py-2 max-w-xs">
                <div className="text-small font-bold">Dues</div>
                <div className="text-tiny space-y-2">
                  <p>
                    1. Keep track of your pending dues and mark them as paid
                    when cleared.
                  </p>
                  <p>
                    2. Once marked as paid, it will be reflected in the account
                    you choose.
                  </p>
                </div>
              </div>
            }
          >
            <Icons.help className="h-4 w-4 text-muted-foreground" />
          </ToolTip>
        </div>
        <div className="flex justify-between sm:justify-around">
          <div className="flex flex-col items-center gap-y-1 sm:gap-y-2">
            <span
              className={cn("text-2xl md:text-4xl", {
                "text-danger-text": parseFloat(currentUser.duePayable) < 0,
              })}
            >
              <span>{parseFloat(currentUser.duePayable) < 0 ? "-" : ""}</span>
              <span>{currentUser.currency}</span>
              {Math.abs(parseFloat(currentUser.duePayable)).toLocaleString()}
            </span>
            <p className="text-xs sm:text-sm text-muted-foreground tracking-tight">
              Due Payable
            </p>
          </div>
          <div className="flex flex-col items-center gap-y-1 sm:gap-y-2">
            <span
              className={cn("text-2xl md:text-4xl", {
                "text-danger-text": parseFloat(currentUser.dueReceivable) < 0,
              })}
            >
              <span>
                {parseFloat(currentUser.dueReceivable) < 0 ? "-" : ""}
              </span>
              <span>{currentUser.currency}</span>
              {Math.abs(parseFloat(currentUser.dueReceivable)).toLocaleString()}
            </span>
            <p className="text-xs sm:text-sm text-muted-foreground tracking-tight">
              Due Receivable
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-y-2 sm:flex-row sm:justify-center sm:gap-x-12 sm:items-center">
          <DuePayment
            currency={currentUser.currency as CurrencyType}
            dueType="payable"
          />
          <DuePayment
            currency={currentUser.currency as CurrencyType}
            dueType="receivable"
          />
        </div>
      </CardContent>
      <Divider />
      <CardContent className="pt-8">
        <DueCard
          initialDues={dueEntries}
          savingBalance={parseFloat(currentUser.savingsBalance)}
          currency={currentUser.currency as CurrencyType}
        />
      </CardContent>
    </Card>
  );
};

export default Dues;
