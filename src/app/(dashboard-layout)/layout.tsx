import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { Shell } from "@/components/shell";
import { getAuthSession } from "@/lib/auth";
import { GoBack } from "@/components/go-back";
import { serverClient } from "@/trpc/server-client";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";

export const dynamic = "force-dynamic";

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await getAuthSession();
  const currentUser = await serverClient.user.getCurrentUser();

  if (!session) redirect("/sign-in");

  if (!currentUser.monthlyIncome) redirect("/onboarding");

  return (
    <div className="flex-1 items-start xl:grid xl:grid-cols-[230px_minmax(0,1fr)] min-h-screen">
      <div className="h-full">
        <DashboardSidebar />
      </div>
      <Shell className="items-start h-full py-4 md:py-8 px-6 md:px-8">
        <div className="space-y-4">
          <GoBack />
          {children}
        </div>
      </Shell>
    </div>
  );
}
