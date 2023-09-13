import { redirect } from "next/navigation";

import { serverClient } from "@/trpc/server-client";
import { IncomeCard } from "@/components/income-card";

export const dynamic = "force-dynamic";

const Onboarding = async () => {
  const currentUser = await serverClient.user.getCurrentUser();

  if (currentUser.monthlyIncome) redirect("/dashboard");

  return (
    <div className="min-h-[calc(100vh-150px)] max-w-lg p-5 m-auto flex items-center justify-center">
      <IncomeCard title="Financial Setup: Let&rsquo;s Get Started" />
    </div>
  );
};

export default Onboarding;
