import { Skeleton } from "@/components/ui/skeleton";

import { Card, CardContent, CardFooter } from "@/components/ui/card";

export const ExpenseCardSkeleton = () => {
  return (
    <Card className="relative bg-transparent">
      <CardContent className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-7 items-center gap-y-2 px-4 sm:px-6 py-3">
        <div className="hidden lg:flex items-center col-span-2 lg:col-span-1">
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="col-span-2 sm:col-span-3 flex items-center">
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="flex justify-center items-center">
          <Skeleton className="h-4 w-8" />
        </div>
        <div className="flex justify-center items-center">
          <Skeleton className="h-4 w-8" />
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
      <CardFooter className="pt-3 pb-3.5 px-4 sm:px-6 lg:hidden ">
        <div className="flex justify-around w-full text-xs items-center">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-10" />
        </div>
      </CardFooter>
      <Skeleton className="lg:hidden absolute -bottom-[16px] rounded-t-none rounded-b-lg right-4 h-4 w-20" />
    </Card>
  );
};
