import { Divider } from "@nextui-org/divider";
import { ScrollShadow } from "@nextui-org/scroll-shadow";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { DueEntryItemSkeleton } from "@/components/skeletons/infinite-cards";

const loading = () => {
  return (
    <Card>
      <CardContent className="flex flex-col gap-y-8 py-8 relative">
        <div className="flex justify-between sm:justify-around">
          <div className="flex flex-col items-center gap-y-2">
            <Skeleton className="h-10 w-28 rounded-lg" />

            <p className="text-sm text-muted-foreground tracking-tight">
              Due Payable
            </p>
          </div>
          <div className="flex flex-col items-center gap-y-2">
            <Skeleton className="h-10 w-28 rounded-lg" />

            <p className="text-sm text-muted-foreground tracking-tight">
              Due Receivable
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-y-2 sm:flex-row sm:justify-center sm:gap-x-12 sm:items-center">
          <Skeleton className="h-10 w-full sm:w-24 rounded-full" />
          <Skeleton className="h-10 w-full sm:w-24 rounded-full" />
        </div>
      </CardContent>
      <Divider />
      <ScrollShadow className="h-[calc(80vh-130px)] w-full no-scrollbar">
        <CardContent className="pt-8">
          <div className="flex flex-col gap-y-2 text-sm">
            <div className="grid grid-cols-5 lg:grid-cols-9 px-4 sm:px-6">
              <span className="hidden lg:block">Date & Time</span>
              <span className="col-span-4 lg:col-span-2">Details</span>
              <span className="text-center">Amount</span>
              <span className="hidden lg:block text-center">Type</span>
              <span className="hidden lg:block text-center">Status</span>
              <span className="hidden lg:block text-center">Due date</span>
            </div>
            {Array.from({ length: 5 }).map((_, index) => (
              <DueEntryItemSkeleton key={index} />
            ))}
          </div>
        </CardContent>
      </ScrollShadow>
    </Card>
  );
};

export default loading;
