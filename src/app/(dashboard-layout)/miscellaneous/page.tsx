import { redirect } from "next/navigation";
import { Divider } from "@nextui-org/divider";
import { ScrollShadow } from "@nextui-org/scroll-shadow";

import { cn } from "@/lib/utils";
import { CurrencyType } from "@/types";
import { serverClient } from "@/trpc/server-client";
import MiscCard from "@/components/cards/misc-card";
import { Card, CardContent } from "@/components/ui/card";
import { MiscEntry } from "@/components/misc/misc-entry";

export const dynamic = "force-dynamic";

const Miscellaneous = async () => {
  const currentUser = await serverClient.user.getCurrentUser();

  if (!currentUser.monthlyIncome) redirect("/onboarding");

  const miscEntries = await serverClient.misc.getMiscTransactions();

  return (
    <Card>
      <CardContent className="flex flex-col gap-y-8 py-8 relative">
        <div className="flex flex-col items-center gap-y-2">
          <span
            className={cn("text-5xl md:text-4xl", {
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
        <div className="flex flex-col sm:flex-row gap-y-2 sm:justify-center sm:gap-x-12 sm:items-center">
          <MiscEntry
            initialBalance={currentUser.miscellanousBalance}
            currency={currentUser.currency as CurrencyType}
            entryType="in"
          />
          <MiscEntry
            initialBalance={currentUser.miscellanousBalance}
            currency={currentUser.currency as CurrencyType}
            entryType="out"
          />
        </div>
      </CardContent>
      <Divider />
      <ScrollShadow className="h-[calc(80vh-130px)] w-full no-scrollbar">
        <CardContent className="pt-8">
          <MiscCard
            initialMiscEntries={miscEntries}
            currency={currentUser.currency as CurrencyType}
            initialBalance={currentUser.miscellanousBalance}
          />
        </CardContent>
      </ScrollShadow>
    </Card>
  );
};

export default Miscellaneous;
