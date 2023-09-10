import { redirect } from "next/navigation";

import { getAuthSession } from "@/lib/auth";
import { serverClient } from "@/trpc/server-client";

export const dynamic = "force-dynamic";

const Dashboard = async () => {
  const session = await getAuthSession();
  const currentUser = await serverClient.getCurrentUser();

  if (!currentUser || !session) redirect("/sign-in");

  if (!currentUser.monthlyIncome) redirect("/onboarding");

  return (
    <div>
      <p>Dashboard page</p>
      <p>{session?.user.name}</p>
      <p>{currentUser.monthlyIncome}</p>
    </div>
  );
};

export default Dashboard;
