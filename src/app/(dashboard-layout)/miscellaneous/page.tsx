import { redirect } from "next/navigation";
import { Divider } from "@nextui-org/divider";

import { cn } from "@/lib/utils";
import { CurrencyType } from "@/config";
import { serverClient } from "@/trpc/server-client";
import MiscCard from "@/components/cards/misc-card";
import { Card, CardContent } from "@/components/ui/card";
import { MiscIncome } from "@/components/misc/misc-income";
import { MiscExpense } from "@/components/misc/misc-expense";

export const dynamic = "force-dynamic";

const Miscellaneous = async () => {
  const currentUser = await serverClient.user.getCurrentUser();
  const miscEntries = await serverClient.misc.getMiscTransactions();

  if (!currentUser.monthlyIncome) redirect("/onboarding");

  return (
    <Card className="rounded-2xl">
      <CardContent className="flex flex-col gap-y-8 py-8">
        <div className="flex flex-col items-center gap-y-2">
          <span
            className={cn("text-4xl", {
              "text-red-500": currentUser.miscellanousBalance < 0,
            })}
          >
            <span>{currentUser.miscellanousBalance < 0 ? "-" : ""}</span>
            <span>{currentUser.currency}</span>
            {Math.abs(currentUser.miscellanousBalance).toLocaleString()}
          </span>
          <p className="text-sm text-muted-foreground tracking-tight">
            Miscellaneous Balance
          </p>
        </div>
        <div className="flex justify-center gap-x-12 items-center">
          <MiscIncome initialBalance={currentUser.miscellanousBalance} />
          <MiscExpense initialBalance={currentUser.miscellanousBalance} />
        </div>
      </CardContent>
      <Divider />
      <CardContent className="h-[calc(80vh-130px)] overflow-y-auto no-scrollbar pt-8">
        <MiscCard
          miscEntries={miscEntries}
          currency={currentUser.currency as CurrencyType}
          initialBalance={currentUser.miscellanousBalance}
        />
      </CardContent>
    </Card>
  );
};

export default Miscellaneous;
