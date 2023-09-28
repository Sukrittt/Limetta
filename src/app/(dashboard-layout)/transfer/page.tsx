import { redirect } from "next/navigation";
import { Divider } from "@nextui-org/divider";

import { cn } from "@/lib/utils";
import { CurrencyType } from "@/types";
import { Icons } from "@/components/icons";
import { serverClient } from "@/trpc/server-client";
import { Card, CardContent } from "@/components/ui/card";
import { Transfer as TransferMoney } from "@/components/transfer";

export const dynamic = "force-dynamic";

const Transfer = async () => {
  const currentUser = await serverClient.user.getCurrentUser();

  if (!currentUser.monthlyIncome) redirect("/onboarding");

  const accountInfo = [
    {
      label: "Investment Account",
      balance: currentUser.investmentsBalance,
      type: "investments" as const,
      icon: Icons.investments,
    },
    {
      label: "Savings Account",
      balance: currentUser.savingsBalance,
      type: "savings" as const,
      icon: Icons.piggy,
    },
    {
      label: "Miscellaneous Account",
      balance: currentUser.miscellanousBalance,
      type: "miscellaneous" as const,
      icon: Icons.siren,
    },
  ];

  return (
    <Card>
      <h1 className="font-bold py-8 text-2xl text-center">
        Transfer your money
      </h1>
      <Divider />
      <CardContent className="flex flex-col gap-y-8 py-8 tracking-tight">
        <div className="flex flex-col gap-y-2">
          <p className="text-sm text-muted-foreground">My Accounts</p>
          <div className="flex flex-col gap-y-2">
            {accountInfo.map((info, index) => (
              <div key={index} className="grid grid-cols-4 items-center">
                <div className="flex items-center gap-x-2 text-sm">
                  <info.icon className="h-4 w-4" />
                  {info.label}
                </div>
                <span
                  className={cn("text-center col-span-2 text-sm", {
                    "text-red-500": info.balance < 0,
                  })}
                >
                  <span>{info.balance < 0 ? "-" : ""}</span>
                  <span>{currentUser.currency}</span>
                  {info.balance.toLocaleString()}
                </span>
                <TransferMoney
                  currency={currentUser.currency as CurrencyType}
                  initialSelected={info.type}
                  savingsBalance={currentUser.savingsBalance}
                  investmentsBalance={currentUser.investmentsBalance}
                  miscellaneousBalance={currentUser.miscellanousBalance}
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Transfer;
