import { redirect } from "next/navigation";
import { Divider } from "@nextui-org/divider";
import { ScrollShadow } from "@nextui-org/scroll-shadow";

import { cn } from "@/lib/utils";
import { CurrencyType } from "@/types";
import { GoBack } from "@/components/go-back";
import { serverClient } from "@/trpc/server-client";
import { DueCard } from "@/components/cards/due-card";
import { Card, CardContent } from "@/components/ui/card";
import { DuePayment } from "@/components/due/due-payment";

const Dues = async () => {
  const currentUser = await serverClient.user.getCurrentUser();
  const dueEntries = await serverClient.dues.getDueEntries();

  if (!currentUser.monthlyIncome) redirect("/onboarding");
  return (
    <Card>
      <CardContent className="flex flex-col gap-y-8 py-8 relative">
        <div>
          <GoBack />
          <div className="flex justify-between sm:justify-around">
            <div className="flex flex-col items-center gap-y-2">
              <span
                className={cn("text-4xl", {
                  "text-red-500": currentUser.duePayable < 0,
                })}
              >
                <span>{currentUser.duePayable < 0 ? "-" : ""}</span>
                <span>{currentUser.currency}</span>
                {Math.abs(currentUser.duePayable).toLocaleString()}
              </span>
              <p className="text-sm text-muted-foreground tracking-tight">
                Due Payable
              </p>
            </div>
            <div className="flex flex-col items-center gap-y-2">
              <span
                className={cn("text-4xl", {
                  "text-red-500": currentUser.dueReceivable < 0,
                })}
              >
                <span>{currentUser.dueReceivable < 0 ? "-" : ""}</span>
                <span>{currentUser.currency}</span>
                {Math.abs(currentUser.dueReceivable).toLocaleString()}
              </span>
              <p className="text-sm text-muted-foreground tracking-tight">
                Due Receivable
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-y-2 sm:flex-row sm:justify-center sm:gap-x-12 sm:items-center">
          <DuePayment
            initialBalance={currentUser.duePayable}
            currency={currentUser.currency as CurrencyType}
            dueType="payable"
          />
          <DuePayment
            initialBalance={currentUser.dueReceivable}
            currency={currentUser.currency as CurrencyType}
            dueType="receivable"
          />
        </div>
      </CardContent>
      <Divider />
      <ScrollShadow className="h-[calc(80vh-130px)] w-full no-scrollbar">
        <CardContent className="pt-8">
          <DueCard
            currency={currentUser.currency as CurrencyType}
            initialDues={dueEntries}
            initialPayableBalance={currentUser.duePayable}
            initialReceivableBalance={currentUser.dueReceivable}
          />
        </CardContent>
      </ScrollShadow>
    </Card>
  );
};

export default Dues;
