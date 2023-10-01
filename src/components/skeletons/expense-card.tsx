import { Skeleton } from "@/components/ui/skeleton";

import { Card, CardContent, CardFooter } from "@/components/ui/card";

export const ExpenseCardSkelton = () => {
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
