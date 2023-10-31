import { Divider } from "@nextui-org/divider";
import { ScrollShadow } from "@nextui-org/scroll-shadow";

import { Icons } from "@/components/icons";
import ToolTip from "@/components/ui/tool-tip";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { DueEntryItemSkeleton } from "@/components/skeletons/infinite-cards";

const loading = () => {
  return (
    <Card>
      <CardContent className="flex flex-col gap-y-8 py-8 relative">
        <div className="absolute top-3 left-3">
          <ToolTip
            showArrow
            customComponent={
              <div className="px-1 py-2 max-w-xs">
                <div className="text-small font-bold">Dues</div>
                <div className="text-tiny space-y-2">
                  <p>
                    1. Keep track of your pending dues and mark them as paid
                    when cleared.
                  </p>
                  <p>
                    2. Once marked as paid, it will be reflected in the account
                    you choose.
                  </p>
                </div>
              </div>
            }
          >
            <Icons.help className="h-4 w-4 text-muted-foreground" />
          </ToolTip>
        </div>
        <div className="flex justify-between sm:justify-around">
          <div className="flex flex-col items-center gap-y-1 sm:gap-y-2">
            <Skeleton className="h-7 md:h-10 w-28 rounded-lg" />
            <p className="text-xs sm:text-sm text-muted-foreground tracking-tight">
              Due Payable
            </p>
          </div>
          <div className="flex flex-col items-center gap-y-1 sm:gap-y-2">
            <Skeleton className="h-7 md:h-10 w-28 rounded-lg" />
            <p className="text-xs sm:text-sm text-muted-foreground tracking-tight">
              Due Receivable
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-y-2 sm:flex-row sm:justify-center sm:gap-x-12 sm:items-center">
          <Skeleton className="h-[42px] w-full sm:w-24 rounded-full" />
          <Skeleton className="h-[42px] w-full sm:w-24 rounded-full" />
        </div>
      </CardContent>
      <Divider />
      <CardContent className="pt-8">
        <div className="flex flex-col gap-y-2 text-sm">
          <div className="grid grid-cols-5 lg:grid-cols-9 px-4 sm:px-6">
            <span className="hidden lg:block">Date & Time</span>
            <span className="col-span-4 lg:col-span-2">Details</span>
            <span className="text-center">Amount</span>
            <span className="hidden lg:block text-center">Type</span>
            <span className="hidden lg:block text-center">Status</span>
            <span className="hidden lg:block text-center">Due Date</span>
          </div>
          <ScrollShadow className="h-[calc(80vh-150px)] lg:h-[calc(80vh-235px)] flex flex-col gap-y-2 w-full no-scrollbar pb-12">
            {Array.from({ length: 15 }).map((_, index) => (
              <DueEntryItemSkeleton key={index} />
            ))}
          </ScrollShadow>
        </div>
      </CardContent>
    </Card>
  );
};

export default loading;
