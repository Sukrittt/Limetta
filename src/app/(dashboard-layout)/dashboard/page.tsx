import Link from "next/link";
import { redirect } from "next/navigation";

import { serverClient } from "@/trpc/server-client";
import { Card as NextUICard, CardBody as NextUIBody } from "@nextui-org/card";

export const dynamic = "force-dynamic";

const Dashboard = async () => {
  const currentUser = await serverClient.user.getCurrentUser();

  if (!currentUser.monthlyIncome) redirect("/onboarding");

  const accountDetails = [
    {
      title: "Savings Account",
      href: "/savings",
      balance: currentUser.savingsBalance,
    },
    {
      title: "Investments Account",
      href: "/investments",
      balance: currentUser.investmentsBalance,
    },
    {
      title: "Miscellaneous Account",
      href: "/miscellaneous",
      balance: currentUser.miscellanousBalance,
    },
  ];

  return (
    <div className="flex flex-col gap-y-4">
      <div>
        <h1 className="text-3xl font-semibold">{`Hello ${
          currentUser.name ? currentUser.name.split(" ")[0] : "User"
        }`}</h1>
        <p className="text-muted-foreground text-sm">Welcome Back!</p>
      </div>
      <div className="grid grid-cols-6 gap-4 tracking-tight mt-4">
        {accountDetails.map((account, index) => (
          <NextUICard key={index} className="col-span-2">
            <NextUIBody className="flex flex-col justify-between">
              <span>{account.title}</span>
              <span>{account.balance.toLocaleString()}</span>
            </NextUIBody>
          </NextUICard>
        ))}
      </div>
      <div className="grid grid-cols-6 gap-4 tracking-tight h-[calc(100vh-260px)]">
        <NextUICard className="col-span-4">
          <NextUIBody>September Transactions</NextUIBody>
        </NextUICard>
        <div className="col-span-2 grid grid-cols-1 gap-4">
          <NextUICard>
            <NextUIBody>September Overview</NextUIBody>
          </NextUICard>
          <NextUICard>
            <NextUIBody>Transfer</NextUIBody>
          </NextUICard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
