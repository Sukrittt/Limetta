import Link from "next/link";
import { Button } from "@nextui-org/button";
import { Balancer } from "react-wrap-balancer";

import { Shell } from "@/components/shell";

export default function Home() {
  return (
    <Shell>
      <section
        id="hero"
        aria-labelledby="hero-heading"
        className="mx-auto flex w-full max-w-[64rem] flex-col items-center justify-center gap-4 pb-8 pt-6 text-center md:pb-12 md:pt-10 lg:pt-24 lg:pb-10 relative"
      >
        <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-5xl lg:text-8xl lg:leading-[1.1]">
          Your <span className="font-mono text-primary">Financial</span>{" "}
          Wellness Starts Here
        </h1>
        {/* <div className="bg-gradient-to-r from-primary via-purple-500 to-background absolute h-10 w-20" /> */}
        <Balancer className="max-w-[46rem] text-xl text-muted-foreground sm:text-xl">
          Take control of your finances with our intuitive budgeting and expense
          tracking app. Achieve your financial goals, one step at a time.
        </Balancer>
        <Button
          color="primary"
          className="rounded-full"
          size="lg"
          as={Link}
          href="/sign-in"
        >
          Get Started
        </Button>
      </section>
    </Shell>
  );
}
