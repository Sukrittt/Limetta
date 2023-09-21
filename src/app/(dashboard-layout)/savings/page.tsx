import { Divider } from "@nextui-org/divider";

import { cn } from "@/lib/utils";
import { CurrencyType } from "@/config";
import { serverClient } from "@/trpc/server-client";
import { Card, CardContent } from "@/components/ui/card";
import SavingsCard from "@/components/cards/savings-card";

export const dynamic = "force-dynamic";

const Savings = async () => {
  const currentUser = await serverClient.user.getCurrentUser();
  const savingsEntries = await serverClient.savings.getSavingsEntries();

  return (
    <Card className="rounded-2xl">
      <CardContent className="flex flex-col gap-y-8 py-8">
        <div className="flex flex-col items-center gap-y-2">
          <span
            className={cn("text-4xl", {
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
      <CardContent className="h-[calc(100vh-200px)] overflow-y-auto no-scrollbar pt-8">
        <SavingsCard
          savingsEntries={savingsEntries}
          currency={currentUser.currency as CurrencyType}
        />
      </CardContent>
    </Card>
  );
};

export default Savings;
