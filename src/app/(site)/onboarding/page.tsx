import { redirect } from "next/navigation";

import { serverClient } from "@/trpc/server-client";
import { IncomeCard } from "@/components/income-card";

export const dynamic = "force-dynamic";

const Onboarding = async () => {
  const currentUser = await serverClient.user.getCurrentUser();

  if (currentUser.monthlyIncome) redirect("/dashboard");

  return <IncomeCard title="Financial Setup: Let&rsquo;s Get Started" />;
};

export default Onboarding;
