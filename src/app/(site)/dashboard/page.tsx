import Link from "next/link";
import { redirect } from "next/navigation";

import { cn } from "@/lib/utils";
import { Shell } from "@/components/shell";
import { Button } from "@nextui-org/button";
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
        <Button
          className={cn(
            buttonVariants({ variant: "secondary" }),
            "h-[250px] rounded-3xl bg-[#eedcdc] text-neutral-800 font-semibold text-lg tracking-tight"
          )}
          as={Link}
          href="/expense-tracker"
        >
          Expense Tracker
        </Button>
        <Button
          className={cn(
            buttonVariants({ variant: "secondary" }),
            "h-[250px] rounded-3xl bg-[#f1eee9] text-neutral-800 font-semibold text-lg tracking-tight"
          )}
          as={Link}
          href="#"
        >
          Investments account
        </Button>
        <Button
          className={cn(
            buttonVariants({ variant: "secondary" }),
            "h-[250px] rounded-3xl bg-[#c0dedc] text-neutral-800 font-semibold text-lg tracking-tight"
          )}
          as={Link}
          href="#"
        >
          Savings account
        </Button>
        <Button
          className={cn(
            buttonVariants({ variant: "secondary" }),
            "h-[250px] rounded-3xl bg-[#e6dff1] text-neutral-800 font-semibold text-lg tracking-tight"
          )}
          as={Link}
          href="#"
        >
          Miscellaneous account
        </Button>
      </div>
    </Shell>
  );
};

export default Dashboard;
