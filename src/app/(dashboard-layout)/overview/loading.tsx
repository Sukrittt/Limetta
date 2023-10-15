import Link from "next/link";
import { ScrollShadow } from "@nextui-org/scroll-shadow";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/icons";
import ToolTip from "@/components/ui/tool-tip";
import { Skeleton } from "@/components/ui/skeleton";

const loading = () => {
  const dashboardTabs = [
    {
      label: "Needs",
      icon: Icons.needs,
    },
    {
      label: "Wants",
      icon: Icons.wants,
    },
    {
      label: "Timeframe",
      icon: Icons.streaks,
    },
    {
      label: "Total Entries",
      icon: Icons.entries,
    },
  ];

  return (
    <div className="tracking-tight grid gap-4">
      <div className="space-y-2 -mt-2">
        <h1 className="line-clamp-1 text-3xl font-bold tracking-tight">
          Budget Overview
        </h1>
        <div className="flex gap-x-1 items-center text-muted-foreground">
          <p>Monthly Expense Summary for the Past Year</p>
          <ToolTip
            customComponent={
              <p className="text-xs">
                An overview of all the expenes you made in{" "}
                <Link
                  href="/expense-tracker"
                  className="text-primary transition"
                >
                  expense tracker
                </Link>
                .
              </p>
            }
          >
            <Icons.info className="h-3 w-3 mt-[2px]" />
          </ToolTip>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
        {dashboardTabs.map((tab, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row justify-between items-center px-4 pt-3 pb-2 xl:py-4 xl:px-6">
              <CardTitle className="text-sm sm:text-base">
                {tab.label}
              </CardTitle>
              <tab.icon className="w-4 h-4 hidden sm:block" />
            </CardHeader>
            <CardContent className="px-4 pb-3 xl:px-6 xl:pb-6">
              <Skeleton className="h-5 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-5 gap-4">
        <Card className="col-span-5 lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-md">Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-[355px]">
            <Skeleton className="h-full w-full" />
          </CardContent>
        </Card>
        <Card className="col-span-5 lg:col-span-2 overflow-y-auto no-scrollbar">
          <CardHeader>
            <CardTitle className="text-md">Total Monthly Expenses</CardTitle>
            <CardDescription>You have spent --- till now.</CardDescription>
          </CardHeader>
          <ScrollShadow className="h-[320px] w-full no-scrollbar pb-6">
            <CardContent className="flex flex-col gap-y-2 pb-6 lg:py-0 px-3">
              {Array.from({ length: 12 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between hover:bg-muted rounded-lg transtion p-3 cursor-pointer border"
                >
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-8" />
                </div>
              ))}
            </CardContent>
          </ScrollShadow>
        </Card>
      </div>
    </div>
  );
};

export default loading;
