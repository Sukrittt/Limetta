"use client";
import Link from "next/link";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

import { cn } from "@/lib/utils";
import { themes } from "@/themes";
import { CurrencyType } from "@/types";
import { useConfig } from "@/hooks/use-config";
import { buttonVariants } from "@/components/ui/button";

export const ExpenseOverview = ({
  data,
  currency,
}: {
  data: { name: string; total: number }[];
  currency: CurrencyType;
}) => {
  const [config] = useConfig();

  const theme = themes.find((theme) => theme.name === config.theme);

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px]">
        <p className="text-sm font-mono text-muted-foreground">
          Start Tracking Expenses to See Insights.
        </p>
        <Link
          className={cn(buttonVariants({ variant: "link" }), "-mt-1")}
          href="/dashboard"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${currency}${value}`}
        />
        <Bar
          dataKey="total"
          style={
            {
              fill: "var(--theme-primary)",
              opacity: 1,
              "--theme-primary": `hsl(${theme?.cssVars["dark"].primary})`,
            } as React.CSSProperties
          }
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
