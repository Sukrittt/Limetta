import { Shell } from "@/components/shell";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Card as NextUICard, CardBody as NextUIBody } from "@nextui-org/card";

const loading = () => {
  return (
    <Shell className="px-0">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            Tailor Your Monthly Budget and Expense Ratio
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-4 relative">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />

          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex gap-x-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <div className="flex flex-col gap-y-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-36" />
              </div>
            </div>
            <div className="flex gap-x-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <div className="flex flex-col gap-y-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-36" />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-y-2 items-start w-full">
          <NextUICard className="w-full">
            <NextUIBody className="py-2">
              <div className="flex justify-around gap-2 tracking-tight font-mono text-sm flex-wrap">
                <span>
                  Needs: ₹<span className="font-semibold ml-1">---</span>
                </span>
                <span>
                  Wants: ₹<span className="font-semibold ml-1">---</span>
                </span>
                <span>
                  Investments: ₹<span className="font-semibold ml-1">---</span>
                </span>
              </div>
            </NextUIBody>
          </NextUICard>

          <Skeleton className="h-8 w-full mt-4" />
        </CardFooter>
      </Card>
    </Shell>
  );
};

export default loading;
