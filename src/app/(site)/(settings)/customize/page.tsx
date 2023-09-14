import { redirect } from "next/navigation";

import { Shell } from "@/components/shell";
import { serverClient } from "@/trpc/server-client";
import { IncomeCard } from "@/components/income-card";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const Customize = async () => {
  const currentUser = await serverClient.user.getCurrentUser();

  if (!currentUser) redirect("/sign-in");

  if (!currentUser.monthlyIncome) redirect("/onboarding");

  const initialSelectedRatio =
    currentUser.needsPercentage !== 50 &&
    currentUser.wantsPercentage !== 30 &&
    currentUser.investmentsPercentage !== 20
      ? "custom"
      : "default";

  return (
    <Shell className="px-0">
      <IncomeCard
        title="Tailor Your Monthly Budget and Expense Ratio"
        income={currentUser.monthlyIncome}
        initialNeedRatio={currentUser.needsPercentage}
        initialWantRatio={currentUser.wantsPercentage}
        initialInvestmentRatio={currentUser.investmentsPercentage}
        initialSelectedRatio={initialSelectedRatio}
      />
    </Shell>
  );
};

export default Customize;
