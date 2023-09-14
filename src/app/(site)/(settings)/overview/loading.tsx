import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shell } from "@/components/shell";
import { Icons } from "@/components/icons";
import { Skeleton } from "@/components/ui/skeleton";

const loading = () => {
  return (
    <Shell className="tracking-tight px-0">
      <div className="space-y-2">
        <h1 className="line-clamp-1 text-3xl font-bold tracking-tight py-1">
          Budget Overview
        </h1>
        <p className="text-muted-foreground text-md">
          Monthly Expense Summary for the Past Year
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row justify-between items-center pb-2">
            <CardTitle className="text-md">Needs</CardTitle>
            <Icons.needs className="w-4 h-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-10" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row justify-between items-center pb-2">
            <CardTitle className="text-md">Wants</CardTitle>
            <Icons.wants className="w-4 h-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-10" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row justify-between items-center pb-2">
            <CardTitle className="text-md">Months Recorded</CardTitle>
            <Icons.streaks className="w-4 h-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-10" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row justify-between items-center pb-2">
            <CardTitle className="text-md">Total Entries</CardTitle>
            <Icons.entries className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-10" />
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-5 gap-4">
        <Card className="col-span-5 lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-md">Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <Skeleton className="h-full w-full" />
          </CardContent>
        </Card>
        <Card className="col-span-5 lg:col-span-2 max-h-[450px] overflow-y-auto no-scrollbar">
          <CardHeader>
            <CardTitle className="text-md">Total Monthly Expenses</CardTitle>
            <CardDescription>You have spent --- till now.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-y-2 pb-6 lg:py-0 px-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between hover:bg-muted rounded-lg transtion p-3 cursor-pointer border"
              >
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-8" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
};

export default loading;
