import { Divider } from "@nextui-org/divider";
import { ScrollShadow } from "@nextui-org/scroll-shadow";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const loading = () => {
  return (
    <Card>
      <CardContent className="flex flex-col gap-y-8 py-8 relative">
        <div className="flex flex-col items-center gap-y-2">
          <Skeleton className="h-10 w-28 rounded-lg" />
          <p className="text-sm text-muted-foreground tracking-tight">
            Savings Balance
          </p>
        </div>
      </CardContent>
      <Divider />
      <ScrollShadow className="h-[calc(100vh-200px)] w-full no-scrollbar">
        <CardContent className=" pt-8">
          <div className="flex flex-col gap-y-2 text-sm">
            <div className="grid grid-cols-7 px-4 sm:px-6">
              <span className="hidden lg:block">Date & Time</span>
              <span className="col-span-5 lg:col-span-3">Details</span>
              <span className="text-center col-span-2">Amount</span>
            </div>
            {Array.from({ length: 5 }).map((_, index) => (
              <SavingsEntryItemSkeleton key={index} />
            ))}
          </div>
        </CardContent>
      </ScrollShadow>
    </Card>
  );
};

export default loading;

const SavingsEntryItemSkeleton = () => {
  return (
    <Card>
      <CardContent className="grid grid-cols-7 px-4 sm:px-6 py-3">
        <div className="hidden lg:block items-center">
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="col-span-5 lg:col-span-3 break-words">
          <Skeleton className="h-4 w-3/4" />
        </div>

        <div className="flex justify-center col-span-2">
          <Skeleton className="h-4 w-10" />
        </div>
        <Skeleton className="h-4 w-1/2 hidden lg:block" />
      </CardContent>
      <CardFooter className="text-xs px-4 sm:px-6 pb-3 flex gap-x-4 lg:hidden">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-12" />
      </CardFooter>
    </Card>
  );
};
