import { redirect } from "next/navigation";
import { Divider } from "@nextui-org/divider";

import { cn } from "@/lib/utils";
import { Shell } from "@/components/shell";
import { serverClient } from "@/trpc/server-client";
import MiscCard from "@/components/cards/misc-card";
import { MiscIncome } from "@/components/misc/misc-income";
import { MiscExpense } from "@/components/misc/misc-expense";
import { Card as NextUICard, CardBody as NextUIBody } from "@nextui-org/card";

const Miscellaneous = async () => {
  const currentUser = await serverClient.user.getCurrentUser();
  const miscEntries = await serverClient.misc.getMiscTransactions();

  if (!currentUser.monthlyIncome) redirect("/onboarding");

  return (
    <Shell>
      <NextUICard className="rounded-2xl">
        <NextUIBody className="flex flex-col gap-y-8 py-8">
          <div className="flex flex-col items-center gap-y-2">
            <span
              className={cn("text-4xl", {
                "text-red-500": currentUser.miscellanousBalance < 0,
              })}
            >{`${
              currentUser.currency
            }${currentUser.miscellanousBalance.toLocaleString()}`}</span>
            <p className="text-sm text-muted-foreground tracking-tight">
              Miscellaneous Balance
            </p>
          </div>
          <div className="flex justify-center gap-x-12 items-center">
            <MiscIncome initialBalance={currentUser.miscellanousBalance} />
            <MiscExpense initialBalance={currentUser.miscellanousBalance} />
          </div>
        </NextUIBody>
        <Divider />
        <NextUIBody className="h-[calc(70vh-140px)] overflow-y-auto no-scrollbar">
          <MiscCard miscEntries={miscEntries} />
        </NextUIBody>
      </NextUICard>
    </Shell>
  );
};

export default Miscellaneous;
