import { Divider } from "@nextui-org/divider";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export const InvestmentEntryItemSkeleton = () => {
  return (
    <Card className="relative">
      <CardContent className="grid grid-cols-7 lg:grid-cols-8 px-4 sm:px-6 py-3">
        <div className="hidden lg:flex items-center">
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="col-span-5 lg:col-span-3">
          <Skeleton className="h-4 w-3/4" />
        </div>

        <div className="flex justify-center col-span-2">
          <Skeleton className="h-4 w-10" />
        </div>
        <div className="justify-center items-center text-xs col-span-2 hidden lg:grid grid-cols-3">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
        </div>
      </CardContent>
      <CardFooter className="text-xs px-4 sm:px-6 pb-3 block lg:hidden">
        <div className="text-xs flex gap-x-4">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
        </div>
      </CardFooter>
      <Skeleton className="lg:hidden absolute -bottom-[16px] rounded-t-none rounded-b-lg right-3 h-4 w-20" />
    </Card>
  );
};

export const SavingsEntryItemSkeleton = () => {
  return (
    <Card className="relative">
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
        <div className="flex justify-center">
          <Skeleton className="h-4 w-1/2 hidden lg:block" />
        </div>
      </CardContent>
      <CardFooter className="text-xs px-4 sm:px-6 pb-3 flex gap-x-4 lg:hidden">
        <Skeleton className="h-4 w-16" />
      </CardFooter>
      <Skeleton className="lg:hidden absolute -bottom-[16px] rounded-t-none rounded-b-lg right-3 h-4 w-20" />
    </Card>
  );
};

export const MiscEntryItemSkeleton = () => {
  return (
    <Card className="relative">
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
        <div className="hidden lg:flex justify-around items-center text-xs">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
        </div>
      </CardContent>
      <CardFooter className="text-xs px-4 sm:px-6 pb-3 block lg:hidden">
        <div className="flex gap-x-4 items-center text-xs">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
        </div>
      </CardFooter>
      <Skeleton className="lg:hidden absolute -bottom-[16px] rounded-t-none rounded-b-lg right-3 h-4 w-20" />
    </Card>
  );
};

export const DueEntryItemSkeleton = () => {
  return (
    <Card>
      <CardContent className="grid grid-cols-5 lg:grid-cols-9 items-center px-4 sm:px-6 py-3">
        <div className="hidden lg:flex items-center">
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="col-span-4 lg:col-span-2 break-words py-[2px]">
          <Skeleton className="h-4 w-3/4" />
        </div>

        <div className="flex justify-center">
          <Skeleton className="h-4 w-10" />
        </div>
        <div className="hidden lg:flex items-center justify-center">
          <Skeleton className="h-4 w-12" />
        </div>
        <div className="hidden lg:flex items-center justify-center">
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>
        <div className="hidden lg:flex items-center justify-center">
          <Skeleton className="h-4 w-12" />
        </div>
        <div className="hidden lg:flex justify-around items-center text-xs col-span-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
        </div>
      </CardContent>
      <Divider className="block lg:hidden" />
      <CardFooter className="text-xs px-4 sm:px-6 pb-3 flex flex-col items-start pt-3 gap-y-2 lg:hidden">
        <div className="flex items-center justify-between w-full">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="h-4 w-28" />
        <div className="flex items-center justify-between w-full">
          <div className="flex gap-x-4">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
          </div>

          <Skeleton className="h-4 w-4 rounded-full" />
        </div>
      </CardFooter>
    </Card>
  );
};
