import { redirect } from "next/navigation";

import { serverClient } from "@/trpc/server-client";
import { IncomeCard } from "@/components/income-card";

const Onboarding = async () => {
  const currentUser = await serverClient.getCurrentUser();

  if (currentUser.monthlyIncome) redirect("/dashboard");

  return <IncomeCard title="Financial Setup: Let&rsquo;s Get Started" />;
};

export default Onboarding;
