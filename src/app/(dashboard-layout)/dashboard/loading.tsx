import Link from "next/link";
import { ScrollShadow } from "@nextui-org/scroll-shadow";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { ExpenseCardSkelton } from "@/components/skeletons/expense-card";
import { ExpenseTableSkeleton } from "@/components/skeletons/expense-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const loading = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("en-US", { month: "long" });

  const accountDetails = [
    {
      title: "Savings Account",
      href: "/savings",
      type: "savings" as const,
      icon: Icons.piggy,
    },
    {
      title: "Investments Account",
      href: "/investments",
      type: "investments" as const,
      icon: Icons.investments,
    },
    {
      title: "Miscellaneous Account",
      href: "/miscellaneous",
      type: "miscellaneous" as const,
      icon: Icons.siren,
    },
  ];

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-8 w-36 rounded-lg" />
          <p className="text-muted-foreground text-sm">Welcome Back!</p>
        </div>
        <MobileSidebar />
        <div className="hidden xl:flex">
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 tracking-tight mt-2">
        {accountDetails.map((account, index) => (
          <Card key={index}>
            <CardTitle>
              <CardHeader className="py-4 font-normal">
                <div className="flex items-center justify-between text-muted-foreground">
                  <Link
                    href={account.href}
                    className="hover:text-primary transition text-sm"
                  >
                    {account.title}
                  </Link>
                  <Link
                    href={account.href}
                    className="hover:text-primary transition"
                  >
                    <account.icon className="h-4 w-4" />
                  </Link>
                </div>
              </CardHeader>
            </CardTitle>
            <CardContent className="flex flex-col gap-y-2">
              <Skeleton className="h-10 w-28" />
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
            <ScrollShadow className="h-[calc(60vh-100px)] w-full no-scrollbar">
              <div className="flex flex-col gap-y-2">
                <div className="flex flex-col gap-y-2">
                  <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-7 px-4 sm:px-6">
                    <span className="hidden lg:block">Date & Time</span>
                    <span className="col-span-2 sm:col-span-3">Details</span>
                    <span className="text-center">Needs</span>
                    <span className="text-center">Wants</span>
                  </div>
                  {Array.from({ length: 7 }).map((_, index) => (
                    <ExpenseCardSkelton key={index} />
                  ))}
                </div>
              </div>
            </ScrollShadow>
          </CardContent>
        </Card>
        <div className="col-span-6 lg:col-span-2 grid grid-cols-1 gap-4">
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

              <div className="flex gap-x-2 text-xs tracking-tighter text-green-600">
                <span>Total Savings:</span>
                <Skeleton className="h-4 w-8" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardTitle>
              <CardHeader className="py-4 font-normal">
                <span className="text-muted-foreground text-sm">Transfer</span>
              </CardHeader>
            </CardTitle>
            <CardContent className="space-y-2">
              <div className="flex flex-col gap-y-2">
                {accountDetails.map((account, index) => (
                  <div key={index} className="grid grid-cols-4 items-center">
                    <div className="flex items-center gap-x-3 col-span-3 text-sm">
                      <account.icon className="h-4 w-4" />
                      {account.title}
                    </div>
                    <Skeleton className="h-6 w-20 rounded-lg" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default loading;
