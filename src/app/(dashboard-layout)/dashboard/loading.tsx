import Link from "next/link";
import { ScrollShadow } from "@nextui-org/scroll-shadow";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";
import { DaysLeftInMonth } from "@/components/days-left";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { ExpenseCardSkeleton } from "@/components/skeletons/expense-card";
import { ExpenseTableSkeleton } from "@/components/skeletons/expense-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const loading = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("en-US", { month: "long" });

  const accountDetails = [
    {
      title: "Savings Account",
      shortTitle: "Savings",
      href: "/savings",
      type: "savings" as const,
      icon: Icons.transfer,
    },
    {
      title: "Investments Account",
      shortTitle: "Investments",
      href: "/investments",
      type: "investments" as const,
      icon: Icons.transfer,
    },
    {
      title: "Miscellaneous Account",
      shortTitle: "Miscellaneous",
      href: "/miscellaneous",
      type: "miscellaneous" as const,
      icon: Icons.transfer,
    },
  ];

  const updatedAccountDetails = [
    ...accountDetails,
    {
      title: `${currentMonth} Savings`,
      shortTitle: `${currentMonth} Savings`,
      href: "/expense-tracker",
      icon: Icons.link,
    },
  ];

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-7 sm:h-8 w-36 sm:w-40 rounded-lg" />
          <p className="text-muted-foreground text-sm">Welcome Back!</p>
        </div>
        <MobileSidebar />
        <div className="hidden xl:flex">
          <Skeleton className="h-10 w-28 rounded-xl" />
        </div>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 tracking-tight mt-2">
        {updatedAccountDetails.map((account, index) => (
          <Card key={index}>
            <CardTitle>
              <CardHeader className="px-4 pt-3 pb-2 xl:py-4 xl:px-6 font-normal">
                <div className="flex items-center justify-between text-muted-foreground">
                  <Link
                    href={account.href}
                    className="hidden lg:block hover:text-primary transition text-sm focus:outline-none focus:text-primary"
                  >
                    {account.title}
                  </Link>
                  <Link
                    href={account.href}
                    className="lg:hidden hover:text-primary transition text-sm focus:outline-none focus:text-primary"
                  >
                    {account.shortTitle}
                  </Link>
                  <Link
                    href={account.href}
                    className="hidden lg:block hover:text-primary transition focus:outline-none focus:text-primary"
                  >
                    <account.icon className="h-4 w-4" />
                  </Link>
                </div>
              </CardHeader>
            </CardTitle>
            <CardContent className="flex flex-col gap-y-2 px-4 pb-3 xl:px-6 xl:pb-6">
              <Skeleton className="h-7 xl:h-10 w-28" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-6 gap-4 tracking-tight min-h-[calc(100vh-300px)]">
        <Card className="col-span-6 lg:col-span-4">
          <CardTitle>
            <CardHeader className="py-4 font-normal">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {currentMonth} Transactions
                </span>
                <Link
                  href="/expense-tracker"
                  className={cn(buttonVariants({ variant: "link" }), "p-0")}
                >
                  View in Detail
                </Link>
              </div>
            </CardHeader>
          </CardTitle>
          <CardContent className="text-sm">
            <div className="flex flex-col gap-y-2">
              <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-7 px-4 sm:px-6">
                <span className="hidden lg:block">Date & Time</span>
                <span className="col-span-2 sm:col-span-3">Details</span>
                <span className="text-center">Needs</span>
                <span className="text-center">Wants</span>
              </div>
              <ScrollShadow className="h-[calc(60vh-120px)] w-full pb-12 no-scrollbar">
                <div className="flex flex-col gap-y-8 lg:gap-y-2">
                  {Array.from({ length: 15 }).map((_, index) => (
                    <ExpenseCardSkeleton key={index} />
                  ))}
                </div>
              </ScrollShadow>
            </div>
          </CardContent>
        </Card>
        <div className="col-span-6 lg:col-span-2 flex flex-col gap-y-4">
          <Card>
            <CardTitle>
              <CardHeader className="py-4 font-normal">
                <span className="text-sm text-muted-foreground">
                  {currentMonth} Overview
                </span>
              </CardHeader>
            </CardTitle>
            <CardContent className="flex flex-col gap-y-2">
              <ExpenseTableSkeleton />

              <div className="flex items-center justify-between text-xs tracking-tighter">
                <div className="flex gap-x-2 text-success-text">
                  <span>Total Savings:</span>
                  <Skeleton className="h-4 w-8" />
                </div>
                <DaysLeftInMonth />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default loading;
