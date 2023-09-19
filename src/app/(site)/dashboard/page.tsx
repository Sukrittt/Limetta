import Link from "next/link";
import { redirect } from "next/navigation";

import { Shell } from "@/components/shell";
import { serverClient } from "@/trpc/server-client";
import { Card as NextUICard, CardBody as NextUIBody } from "@nextui-org/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const Dashboard = async () => {
  const currentUser = await serverClient.user.getCurrentUser();

  if (!currentUser.monthlyIncome) redirect("/onboarding");

  const accountCards = [
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
      href: "/miscellanous",
      balance: currentUser.miscellanousBalance,
    },
  ];

  return (
    <Shell>
      <div>
        <h1 className="text-2xl font-semibold">{`Hello ${
          currentUser.name ? currentUser.name.split(" ")[0] : "User"
        }`}</h1>
        <p className="text-muted-foreground text-sm">Welcome Back!</p>
      </div>
      <div className="grid grid-cols-4 gap-4 tracking-tight">
        <NextUICard className="col-span-3">
          <NextUIBody>Expense Tracker Entries</NextUIBody>
        </NextUICard>

        <div className="grid grid-cols-1 gap-4">
          {accountCards.map((account, index) => (
            <NextUICard key={index}>
              <NextUIBody>
                <Link
                  href={account.href}
                  className="underline-offset-4 hover:underline hover:text-primary transition text-muted-foreground"
                >
                  {account.title}
                </Link>
                <span className="mt-2 font-bold text-xl">
                  <span className="text-lg text-muted-foreground mr-2">
                    {currentUser.currency}
                  </span>
                  {account.balance}
                </span>
              </NextUIBody>
            </NextUICard>
          ))}
        </div>
      </div>
    </Shell>
  );
};

export default Dashboard;
