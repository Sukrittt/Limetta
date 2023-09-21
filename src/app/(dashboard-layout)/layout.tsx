import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { Shell } from "@/components/shell";
import { getAuthSession } from "@/lib/auth";
import { serverClient } from "@/trpc/server-client";
import { DashboardSidebar } from "@/components/dashboard-sidebar";

export const dynamic = "force-dynamic";

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await getAuthSession();
  const currentUser = await serverClient.user.getCurrentUser();

  if (!session) redirect("/sign-in");

  if (!currentUser.monthlyIncome) redirect("/onboarding");

  return (
    <div className="flex-1 items-start lg:grid lg:grid-cols-[270px_minmax(0,1fr)] h-screen">
      <div className="bg-card h-full">
        <DashboardSidebar session={session} />
      </div>
      <Shell className="border-l-3 items-start h-full">{children}</Shell>
    </div>
  );
}
