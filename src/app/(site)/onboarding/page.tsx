import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { env } from "@/env.mjs";
import { serverClient } from "@/trpc/server-client";
import { IncomeCard } from "@/components/cards/income-card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: "Onboarding",
  description:
    "Start your financial journey with our Onboarding process. Set your monthly income and allocation ratio for needs and wants. Get on the path to financial success by customizing your budget right from the beginning.",
};

const Onboarding = async () => {
  const currentUser = await serverClient.user.getCurrentUser();

  if (currentUser.monthlyIncome) redirect("/dashboard");

  return (
    <div className="min-h-[calc(100vh-180px)] max-w-xl p-5 m-auto flex items-center justify-center">
      <IncomeCard
        title="Financial Setup: Let&rsquo;s Get Started"
        actionLabel="Continue to Dashboard"
      />
    </div>
  );
};

export default Onboarding;
