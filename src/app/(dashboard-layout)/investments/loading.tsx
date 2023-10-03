import { Divider } from "@nextui-org/divider";
import { ScrollShadow } from "@nextui-org/scroll-shadow";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { InvestmentEntryItemSkeleton } from "@/components/skeletons/infinite-cards";

const loading = () => {
  return (
    <Card>
      <CardContent className="flex flex-col gap-y-8 pt-8 pb-4 xl:py-8 relative">
        <div className="flex justify-around gap-4">
          <div className="flex flex-col items-center gap-y-2">
            <Skeleton className="h-10 w-28 rounded-lg" />
            <p className="text-sm text-muted-foreground tracking-tight">
              Investments Balance
            </p>
          </div>
          <div className="hidden md:flex flex-col items-center gap-y-2">
            <Skeleton className="h-10 w-28 rounded-lg" />
            <p className="text-sm text-muted-foreground tracking-tight">
              Total Invested
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-x-12 items-center">
          <Skeleton className="h-10 w-24 rounded-full" />
        </div>
      </CardContent>
      <Divider />
      <ScrollShadow className="h-[calc(80vh-150px)] w-full no-scrollbar">
        <CardContent className="pt-8">
          <div className="flex flex-col gap-y-2 text-sm">
            <div className="grid grid-cols-7 lg:grid-cols-8 px-4 sm:px-6">
              <span className="hidden lg:block">Date & Time</span>
              <span className="col-span-5 lg:col-span-3">Details</span>
              <span className="text-center col-span-2">Amount</span>
            </div>
            {Array.from({ length: 5 }).map((_, index) => (
              <InvestmentEntryItemSkeleton key={index} />
            ))}
          </div>
        </CardContent>
      </ScrollShadow>
    </Card>
  );
};

export default loading;
