import Link from "next/link";
import { redirect } from "next/navigation";

import { cn } from "@/lib/utils";
import { Shell } from "@/components/shell";
import { serverClient } from "@/trpc/server-client";
import { buttonVariants } from "@/components/ui/button";

export const dynamic = "force-dynamic";

const Dashboard = async () => {
  const currentUser = await serverClient.user.getCurrentUser();

  if (!currentUser.monthlyIncome) redirect("/onboarding");

  return (
    <Shell>
      <div>
        <h1 className="text-2xl font-semibold">{`Hello ${
          currentUser.name ? currentUser.name.split(" ")[0] : "User"
        }`}</h1>
        <p className="text-muted-foreground text-sm">Welcome Back!</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/expense-tracker">
          <div
            className={cn(
              buttonVariants({ variant: "secondary" }),
              "h-[250px] w-full rounded-3xl bg-[#eedcdc] hover:bg-[#eedcdc]/80 transition-all text-neutral-800 font-semibold text-lg tracking-tight"
            )}
          >
            Expense Tracker
          </div>
        </Link>
        <Link href="/investments">
          <div
            className={cn(
              buttonVariants({ variant: "secondary" }),
              "h-[250px] w-full rounded-3xl bg-[#f1eee9] hover:bg-[#f1eee9]/80 transition-all text-neutral-800 font-semibold text-lg tracking-tight"
            )}
          >
            Investments account
          </div>
        </Link>
        <Link href="/savings">
          <div
            className={cn(
              buttonVariants({ variant: "secondary" }),
              "h-[250px] w-full rounded-3xl bg-[#c0dedc] hover:bg-[#c0dedc]/80 transition-all text-neutral-800 font-semibold text-lg tracking-tight"
            )}
          >
            Savings account
          </div>
        </Link>
        <Link href="/miscellaneous">
          <div
            className={cn(
              buttonVariants({ variant: "secondary" }),
              "h-[250px] w-full rounded-3xl bg-[#e6dff1] hover:bg-[#e6dff1]/80 transition-all text-neutral-800 font-semibold text-lg tracking-tight"
            )}
          >
            Miscellaneous account
          </div>
        </Link>
      </div>
    </Shell>
  );
};

export default Dashboard;
