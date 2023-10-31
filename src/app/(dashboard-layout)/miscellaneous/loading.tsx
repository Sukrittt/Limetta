import { Divider } from "@nextui-org/divider";
import { ScrollShadow } from "@nextui-org/scroll-shadow";

import { Icons } from "@/components/icons";
import ToolTip from "@/components/ui/tool-tip";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { MiscEntryItemSkeleton } from "@/components/skeletons/infinite-cards";

const loading = () => {
  return (
    <Card>
      <CardContent className="flex flex-col gap-y-8 py-8 relative">
        <div className="absolute top-3 left-3">
          <ToolTip
            showArrow
            customComponent={
              <div className="px-1 py-2 max-w-xs">
                <div className="text-small font-bold">
                  Miscellaneous Account
                </div>
                <div className="text-tiny">
                  View your miscellaneous transactions, dues and transfers.
                </div>
              </div>
            }
          >
            <Icons.help className="h-4 w-4 text-muted-foreground" />
          </ToolTip>
        </div>
        <div className="absolute top-3 right-3">
          <Skeleton className="h-8 w-20 rounded-xl" />
        </div>
        <div className="flex flex-col items-center gap-y-1 sm:gap-y-2 pt-6 md:pt-0">
          <Skeleton className="h-7 md:h-10 w-28 rounded-lg" />
          <p className="text-xs sm:text-sm text-muted-foreground tracking-tight">
            Miscellaneous Balance
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-y-2 sm:justify-center sm:gap-x-12 sm:items-center">
          <Skeleton className="h-[42px] w-full sm:w-24 rounded-full" />
          <Skeleton className="h-[42px] w-full sm:w-24 rounded-full" />
        </div>
      </CardContent>
      <Divider />
      <CardContent className="pt-8">
        <div className="flex flex-col gap-y-2 text-sm">
          <div className="grid grid-cols-7 px-4 sm:px-6">
            <span className="hidden lg:block">Date & Time</span>
            <span className="col-span-5 lg:col-span-3">Details</span>
            <span className="text-center col-span-2">Amount</span>
          </div>
          <ScrollShadow className="h-[calc(80vh-150px)] lg:h-[calc(80vh-235px)] w-full no-scrollbar pb-12">
            <div className="flex flex-col gap-y-8 lg:gap-y-2">
              {Array.from({ length: 15 }).map((_, index) => (
                <MiscEntryItemSkeleton key={index} />
              ))}
            </div>
          </ScrollShadow>
        </div>
      </CardContent>
    </Card>
  );
};

export default loading;
