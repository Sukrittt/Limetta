import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { env } from "@/env.mjs";
import { CurrencyType } from "@/types";
import { serverClient } from "@/trpc/server-client";
import { IncomeCard } from "@/components/cards/income-card";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: "Customize",
  description:
    "Tailor your financial plan with our Customize page. Personalize your monthly income and define the allocation ratio for needs and wants. Take control of your financial strategy by customizing your budget to align with your goals.",
};

const Customize = async () => {
  const currentUser = await serverClient.user.getCurrentUser();

  if (!currentUser) redirect("/sign-in");

  if (!currentUser.monthlyIncome) redirect("/onboarding");

  const initialSelectedRatio =
    parseFloat(currentUser.needsPercentage) !== 50 ||
    parseFloat(currentUser.wantsPercentage) !== 30 ||
    parseFloat(currentUser.investmentsPercentage) !== 20
      ? "custom"
      : "default";

  return (
    <IncomeCard
      title="Tailor Your Monthly Budget and Expense Ratio"
      income={parseFloat(currentUser.monthlyIncome)}
      initialNeedRatio={parseFloat(currentUser.needsPercentage)}
      initialWantRatio={parseFloat(currentUser.wantsPercentage)}
      initialInvestmentRatio={parseFloat(currentUser.investmentsPercentage)}
      initialSelectedRatio={initialSelectedRatio}
      initialCurrency={currentUser.currency as CurrencyType}
      href="/dashboard"
      actionLabel="Save"
    />
  );
};

export default Customize;
