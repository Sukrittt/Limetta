import { Divider } from "@nextui-org/divider";
import { Skeleton } from "@/components/ui/skeleton";

import { Shell } from "@/components/shell";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const loading = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("en-US", { month: "long" });

  return (
    <Shell className="grid grid-cols-7 md:py-4 tracking-tight">
      <div className="col-span-7 lg:col-span-5">
        <Card className="h-[calc(100vh-140px)] overflow-y-auto no-scrollbar">
          <CardTitle>
            <CardHeader className="text-center text-2xl md:text-3xl py-4">{`${currentMonth} Entries`}</CardHeader>
            <Divider />
          </CardTitle>
          <CardContent className="space-y-2 text-sm pt-6 md:pt-3">
            <div className="flex justify-end pb-6 md:pb-3">
              <Skeleton className="h-8 w-20 rounded-lg" />
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-7 px-4 sm:px-6">
              <span className="hidden lg:block">Date & Time</span>
              <span className="col-span-2 sm:col-span-3">Details</span>
              <span className="text-center">Needs</span>
              <span className="text-center">Wants</span>
            </div>
            <div className="flex flex-col gap-y-4">
              {Array.from({ length: 7 }).map((_, index) => (
                <ExpenseCardSkelton key={index} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="col-span-7 lg:col-span-2">
        <Card className="lg:h-[calc(100vh-140px)] overflow-y-auto no-scrollbar">
          <CardTitle>
            <CardHeader className="text-center py-5 ">
              Expense Insights
            </CardHeader>
            <Divider />
          </CardTitle>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 pt-6 lg:pb-0 lg:pt-3 text-sm">
            <div className="flex flex-col gap-y-2">
              <span className="font-semibold underline underline-offset-4">
                Allotment
              </span>
              <div className="flex flex-col gap-y-1">
                <span>Needs: ---</span>
                <span>Wants: ---</span>
                <span>Investments: ---</span>
                <span>Monthly Income: ---</span>
              </div>
            </div>
            <div className="flex flex-col gap-y-2">
              <span className="font-semibold underline underline-offset-4 mb-1">
                Spendings
              </span>
              <div className="flex flex-col gap-y-1">
                <span>Needs: ---</span>
                <span>Wants: ---</span>
                <span>Total Spendings: ---</span>
              </div>
            </div>
            <div className="flex flex-col gap-y-2">
              <span className="font-semibold underline underline-offset-4 mb-1">
                Money Left
              </span>
              <div className="flex flex-col gap-y-1">
                <span>Needs: ---</span>
                <span>Wants: ---</span>
              </div>
            </div>
            <div className="flex flex-col gap-y-2">
              <span className="font-semibold underline underline-offset-4 mb-1">
                Savings
              </span>
              <div className="flex flex-col gap-y-1">
                <span>Left for Spending: ---</span>
                <span>Total Savings: ---</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
};

export default loading;

const ExpenseCardSkelton = () => {
  return (
    <Card>
      <CardContent className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-7 gap-y-2 px-4 sm:px-6 py-3 ">
        <div className="hidden lg:flex items-center col-span-2 lg:col-span-1">
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="col-span-2 sm:col-span-3 flex items-center">
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="flex justify-center items-center">
          <Skeleton className="h-4 w-6" />
        </div>
        <div className="flex justify-center items-center">
          <Skeleton className="h-4 w-6" />
        </div>
        <div className="hidden lg:flex gap-x-2 justify-around text-xs items-center">
          <div className="flex justify-center items-center">
            <Skeleton className="h-4 w-10" />
          </div>
          <div className="flex justify-center items-center">
            <Skeleton className="h-4 w-10" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="py-3 px-4 sm:px-6 lg:hidden ">
        <div className="flex justify-between w-full text-xs items-center">
          <div className="flex items-center">
            <Skeleton className="h-4 w-16 sm:w-24" />
          </div>
          <div className="flex gap-x-4">
            <div className="flex justify-center items-center">
              <Skeleton className="h-4 w-10" />
            </div>
            <div className="flex justify-center items-center">
              <Skeleton className="h-4 w-10" />
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
