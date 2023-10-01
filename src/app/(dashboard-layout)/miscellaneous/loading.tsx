import { Divider } from "@nextui-org/divider";
import { ScrollShadow } from "@nextui-org/scroll-shadow";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { MiscEntryItemSkeleton } from "@/components/skeletons/infinite-cards";

const loading = () => {
  return (
    <Card>
      <CardContent className="flex flex-col gap-y-8 py-8 relative">
        <div className="flex flex-col items-center gap-y-2">
          <Skeleton className="h-10 w-28 rounded-lg" />
          <p className="text-sm text-muted-foreground tracking-tight">
            Miscellaneous Balance
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-y-2 sm:justify-center sm:gap-x-12 sm:items-center">
          <Skeleton className="h-10 w-full sm:w-24 rounded-full" />
          <Skeleton className="h-10 w-full sm:w-24 rounded-full" />
        </div>
      </CardContent>
      <Divider />
      <ScrollShadow className="h-[calc(80vh-130px)] w-full no-scrollbar">
        <CardContent className="pt-8">
          <div className="flex flex-col gap-y-2 text-sm">
            <div className="grid grid-cols-7 px-4 sm:px-6">
              <span className="hidden lg:block">Date & Time</span>
              <span className="col-span-5 lg:col-span-3">Details</span>
              <span className="text-center col-span-2">Amount</span>
            </div>
            {Array.from({ length: 5 }).map((_, index) => (
              <MiscEntryItemSkeleton key={index} />
            ))}
          </div>
        </CardContent>
      </ScrollShadow>
    </Card>
  );
};

export default loading;
