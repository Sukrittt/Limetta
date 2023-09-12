"use client";
import { useCallback, useEffect, useState } from "react";
import { Input } from "@nextui-org/input";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import { RadioGroup, Radio } from "@nextui-org/radio";
import { Card as NextUICard, CardBody as NextUIBody } from "@nextui-org/card";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { toast } from "@/hooks/use-toast";
import { Icons } from "@/components/icons";
import { Label } from "@/components/ui/label";
import ToolTip from "@/components/ui/tool-tip";
import { buttonVariants } from "@/components/ui/button";

export const IncomeCard = ({ title }: { title: string }) => {
  const router = useRouter();
  const [monthlyIncome, setMonthlyIncome] = useState<number | null>(null);
  const [ratioSelected, setRatioSelected] = useState("default");
  const [inputValidationState, setInputValidationState] = useState<
    "valid" | "invalid"
  >("valid");

  const [needRatio, setNeedRatio] = useState(
    ratioSelected === "default" ? 50 : 0
  );
  const [wantRatio, setWantRatio] = useState(
    ratioSelected === "default" ? 30 : 0
  );
  const [investmentRatio, setInvestmentRatio] = useState(
    ratioSelected === "default" ? 20 : 0
  );

  const updateInputValidationState = useCallback(() => {
    if (!monthlyIncome) return;

    if (monthlyIncome > 0) {
      setInputValidationState("valid");
    } else {
      setInputValidationState("invalid");
    }
  }, [monthlyIncome]);

  const updateUserIncome = trpc.user.updateMonthlyIncome.useMutation({
    onSuccess: () => {
      router.push("/dashboard");
    },
    onError: () => {
      toast({
        title: "Something went wrong.",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleUpdateMonthlyIncome = () => {
    if (inputValidationState === "invalid") return;

    if (needRatio + wantRatio + investmentRatio !== 100) {
      return toast({
        title: "Invalid ratio",
        description: "Ratio must add up to 100%.",
        variant: "destructive",
      });
    }

    if (!monthlyIncome) {
      return toast({
        title: "Invalid monthly income",
        description: "Please enter a valid monthly income.",
        variant: "destructive",
      });
    }

    updateUserIncome.mutate({
      monthlyIncome: monthlyIncome,
      needsPercentage: needRatio,
      wantsPercentage: wantRatio,
      investmentsPercentage: investmentRatio,
    });
  };

  useEffect(() => {
    updateInputValidationState();
  }, [monthlyIncome, updateInputValidationState]);

  useEffect(() => {
    if (ratioSelected === "default") {
      setNeedRatio(50);
      setWantRatio(30);
      setInvestmentRatio(20);
    }
  }, [ratioSelected]);

  return (
    <div className="min-h-[calc(100vh-80px)] max-w-md m-auto flex items-center justify-center">
      <Card>
        <CardTitle>
          <CardHeader className="text-center">{title}</CardHeader>
        </CardTitle>
        <CardContent className="flex flex-col gap-y-4 relative">
          <div className="flex gap-x-2 items-center">
            <Label>Monthly Income</Label>
            <ToolTip
              text="This amount will be used for splitting it into categories."
              showArrow
            >
              <Icons.info className="h-3 w-3 text-muted-foreground cursor-pointer" />
            </ToolTip>
          </div>
          <Input
            placeholder="Enter your monthly income here."
            type="number"
            value={monthlyIncome?.toString() ?? ""}
            onChange={(e) => setMonthlyIncome(parseInt(e.target.value))}
            validationState={inputValidationState}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleUpdateMonthlyIncome();
              }
            }}
            errorMessage={
              inputValidationState === "invalid" &&
              "Monthly income must be greater than 0."
            }
            labelPlacement="outside"
            startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">₹</span>
              </div>
            }
          />

          <div>
            <RadioGroup
              orientation="horizontal"
              value={ratioSelected}
              onValueChange={setRatioSelected}
            >
              <Radio
                value="default"
                description="Continue with the standard ratio."
              >
                50-30-20
              </Radio>
              <Radio value="custom" description="Customize my ratio.">
                Custom
              </Radio>
            </RadioGroup>
          </div>

          {ratioSelected === "custom" && (
            <NextUICard>
              <NextUIBody>
                {needRatio + wantRatio + investmentRatio !== 100 && (
                  <p className="text-red-500 text-xs tracking-tight mb-2">
                    Ratio must add up to 100%
                  </p>
                )}
                <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                  <Input
                    placeholder="0"
                    type="number"
                    value={needRatio?.toString() ?? ""}
                    onChange={(e) =>
                      setNeedRatio(
                        parseInt(
                          e.target.value.length === 0 ? "0" : e.target.value
                        )
                      )
                    }
                    label="Need ratio"
                    labelPlacement="outside"
                    endContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-default-400 text-small">%</span>
                      </div>
                    }
                  />
                  <Input
                    placeholder="0"
                    type="number"
                    value={wantRatio?.toString() ?? ""}
                    onChange={(e) =>
                      setWantRatio(
                        parseInt(
                          e.target.value.length === 0 ? "0" : e.target.value
                        )
                      )
                    }
                    label="Want ratio"
                    labelPlacement="outside"
                    endContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-default-400 text-small">%</span>
                      </div>
                    }
                  />
                  <Input
                    placeholder="0"
                    type="number"
                    value={investmentRatio?.toString() ?? ""}
                    onChange={(e) =>
                      setInvestmentRatio(
                        parseInt(
                          e.target.value.length === 0 ? "0" : e.target.value
                        )
                      )
                    }
                    label="Investment ratio"
                    labelPlacement="outside"
                    endContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-default-400 text-small">%</span>
                      </div>
                    }
                  />
                </div>
              </NextUIBody>
            </NextUICard>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-y-2 items-start w-full">
          <NextUICard className="w-full">
            <NextUIBody className="py-2">
              <div className="flex justify-around gap-2 tracking-tight font-mono text-sm flex-wrap">
                <span>
                  Needs: ₹
                  <span className="font-semibold ml-1">
                    {monthlyIncome
                      ? (monthlyIncome * (needRatio / 100)).toFixed(1)
                      : 0}
                  </span>
                </span>
                <span>
                  Wants: ₹
                  <span className="font-semibold ml-1">
                    {monthlyIncome
                      ? (monthlyIncome * (wantRatio / 100)).toFixed(1)
                      : 0}
                  </span>
                </span>
                <span>
                  Investments: ₹
                  <span className="font-semibold ml-1">
                    {monthlyIncome
                      ? (monthlyIncome * (investmentRatio / 100)).toFixed(1)
                      : 0}
                  </span>
                </span>
              </div>
            </NextUIBody>
          </NextUICard>

          <Button
            className={cn(
              buttonVariants({ size: "sm" }),
              "w-full mt-4 tracking-tight"
            )}
            disabled={updateUserIncome.isLoading}
            onClick={handleUpdateMonthlyIncome}
          >
            {updateUserIncome.isLoading ? (
              <Spinner color="default" size="sm" />
            ) : (
              "Continue to Dashboard"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
