"use client";
import Link from "next/link";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const ExpenseOverview = ({
  data,
}: {
  data: { name: string; total: number }[];
}) => {
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
    <ResponsiveContainer width="100%" height={350}>
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
          tickFormatter={(value) => `₹${value}`}
        />
        <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};
