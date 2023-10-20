import Link from "next/link";
import { Divider } from "@nextui-org/divider";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollShadow } from "@nextui-org/scroll-shadow";

import { Icons } from "@/components/icons";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { ExpenseCardSkeleton } from "@/components/skeletons/expense-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const loading = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("en-US", { month: "long" });

  return (
    <div className="grid grid-cols-7 gap-8 tracking-tight">
      <div className="col-span-7 lg:col-span-5">
        <Card className="overflow-y-auto no-scrollbar">
          <CardTitle>
            <CardHeader className="flex flex-row items-center justify-between xl:block py-4">
              <Link
                href="/dashboard"
                className="xl:hidden border rounded-xl relative h-9 w-9"
              >
                <Icons.left className="h-6 w-6 absolute left-1 top-1.5" />
                <span className="sr-only">Go Back</span>
              </Link>
              <h1 className="hidden sm:block text-center">{`${currentMonth} Entries`}</h1>
              <h1 className="sm:hidden text-center">{`${currentMonth}`}</h1>
              <MobileSidebar />
            </CardHeader>
            <Divider />
          </CardTitle>
          <CardContent className="space-y-2 text-sm pt-6 md:pt-3">
            <div className="flex justify-between xl:justify-end gap-x-2 pb-6 md:pb-3">
              <Skeleton className="h-8 w-20 rounded-lg" />
              <Skeleton className="h-8 w-20 rounded-lg" />
            </div>
            <div className="flex flex-col gap-y-2">
              <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-7 px-4 sm:px-6">
                <span className="hidden lg:block">Date & Time</span>
                <span className="col-span-2 sm:col-span-3">Details</span>
                <span className="text-center">Needs</span>
                <span className="text-center">Wants</span>
              </div>
              <ScrollShadow className="h-[calc(80vh-200px)] lg:h-[calc(80vh-120px)] pb-8 w-full no-scrollbar">
                <div className="flex flex-col gap-y-8 lg:gap-y-2">
                  {Array.from({ length: 15 }).map((_, index) => (
                    <ExpenseCardSkeleton key={index} />
                  ))}
                </div>
              </ScrollShadow>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="col-span-7 lg:col-span-2">
        <Card>
          <CardTitle>
            <CardHeader className="text-center py-5 ">
              Expense Insights
            </CardHeader>
            <Divider />
          </CardTitle>
          <ScrollShadow className="lg:h-[calc(90vh-80px)] w-full no-scrollbar">
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 pt-6 lg:pb-0 lg:pt-3">
              <div className="flex flex-col gap-y-1">
                <span className="font-semibold underline underline-offset-4 mb-1 text-primary">
                  Allotment
                </span>
                <div className="flex gap-x-4 font-mono">
                  <div className="flex flex-col">
                    <span>Needs: ---</span>
                    <span>Wants: ---</span>
                    <span>Investments: ---</span>
                  </div>
                  <div className="flex gap-x-2">
                    <span className="text-6xl pt-px text-muted-foreground">{`}`}</span>

                    <div className="flex items-center">
                      <span>---</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-y-1">
                <span className="font-semibold underline underline-offset-4 mb-1 text-primary">
                  Spendings
                </span>
                <div className="flex gap-x-4 font-mono">
                  <div className="flex flex-col">
                    <span>Needs: ---</span>
                    <span>Wants: ---</span>
                  </div>
                  <div className="flex gap-x-2">
                    <span className="text-4xl pt-px text-muted-foreground">{`}`}</span>

                    <div className="flex items-center">
                      <span>---</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-y-1">
                <span className="font-semibold underline underline-offset-4 mb-1 text-primary">
                  Money Left
                </span>
                <div className="flex gap-x-4 font-mono">
                  <div className="flex flex-col">
                    <span>Needs: ---</span>
                    <span>Wants: ---</span>
                  </div>
                  <div className="flex gap-x-2">
                    <span className="text-4xl pt-px text-muted-foreground">{`}`}</span>

                    <div className="flex items-center">
                      <span>---</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-y-1">
                <span className="font-semibold underline underline-offset-4 mb-1 text-primary">
                  Savings
                </span>
                <div className="flex flex-col font-mono">
                  <span>Total Savings: ---</span>
                </div>
              </div>
            </CardContent>
          </ScrollShadow>
        </Card>
      </div>
    </div>
  );
};

export default loading;
