import { redirect } from "next/navigation";
import { Divider } from "@nextui-org/divider";
import { ScrollShadow } from "@nextui-org/scroll-shadow";

import { cn } from "@/lib/utils";
import { CurrencyType } from "@/types";
import { GoBack } from "@/components/go-back";
import { serverClient } from "@/trpc/server-client";
import { Card, CardContent } from "@/components/ui/card";
import SavingsCard from "@/components/cards/savings-card";

export const dynamic = "force-dynamic";

const Savings = async () => {
  const currentUser = await serverClient.user.getCurrentUser();
  const savingsEntries = await serverClient.savings.getSavingsEntries();

  if (!currentUser.monthlyIncome) redirect("/onboarding");

  return (
    <Card>
      <CardContent className="flex flex-col gap-y-8 py-8 relative">
        <div>
          <GoBack />
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
        </div>
      </CardContent>
      <Divider />
      <ScrollShadow className="h-[calc(100vh-200px)] w-full no-scrollbar">
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
