import Link from "next/link";
import { Button } from "@nextui-org/button";
import { Balancer } from "react-wrap-balancer";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/config";
import { Shell } from "@/components/shell";
import { Dues } from "@/components/features/dues";
import { buttonVariants } from "@/components/ui/button";
import { TransferMoney } from "@/components/features/transfer-money";
import { ExpenseTracker } from "@/components/features/expense-tracker";
import { MaintainingAccounts } from "@/components/features/maintaining-accounts";

export default function Home() {
  return (
    <Shell>
      <section
        id="hero"
        aria-labelledby="hero-heading"
        className="mx-auto flex w-full max-w-[64rem] flex-col items-center justify-center gap-4 pb-8 text-center pt-10 sm:pt-20 lg:pb-10"
      >
        <Balancer className="font-bold leading-tight tracking-tight text-5xl sm:text-7xl lg:text-8xl lg:leading-[1.1]">
          Your <span className="font-mono text-primary">Financial</span>{" "}
          Wellness Starts Here
        </Balancer>
        <Balancer className="max-w-[32rem] lg:max-w-[46rem] text-lg sm:text-xl text-muted-foreground">
          Take control of your finances with our intuitive budgeting and expense
          tracking app. Achieve your financial goals, one step at a time.
        </Balancer>
        <Button
          color="primary"
          className={cn(buttonVariants(), "rounded-full text-md lg:h-11")}
          as={Link}
          href="/sign-in"
        >
          Get Started
        </Button>
      </section>
      <div className="flex flex-col items-center justify-center py-12 gap-y-4">
        <h3 className="text-4xl text-center font-extrabold tracking-tighter">
          Finance app built for students
        </h3>
        <Balancer className="text-muted-foreground text-center text-lg">
          Managing your expenses is hard. Saving money is harder. Welcome to{" "}
          {siteConfig.name}, where we make it easy for students to handle their
          finances by providing a one-stop solution for all your financial
          needs.
        </Balancer>
      </div>
      <ExpenseTracker />
      <MaintainingAccounts />
      <TransferMoney />
      <Dues />
    </Shell>
  );
}
