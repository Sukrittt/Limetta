import Link from "next/link";
import { Button } from "@nextui-org/button";
import { Balancer } from "react-wrap-balancer";

import { cn } from "@/lib/utils";
import { Shell } from "@/components/shell";
import { buttonVariants } from "@/components/ui/button";

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
    </Shell>
  );
}
