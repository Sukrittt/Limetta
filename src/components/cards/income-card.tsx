"use client";
import { FC, useCallback, useEffect, useState } from "react";
import { Input } from "@nextui-org/input";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import { RadioGroup, Radio } from "@nextui-org/radio";
import { Select, SelectItem } from "@nextui-org/select";
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
import { currencies } from "@/config";
import { CurrencyType } from "@/types";
import { toast } from "@/hooks/use-toast";
import { Icons } from "@/components/icons";
import { Label } from "@/components/ui/label";
import ToolTip from "@/components/ui/tool-tip";
import { buttonVariants } from "@/components/ui/button";

interface IncomeCardProps {
  title: string;
  income?: number;
  initialNeedRatio?: number;
  initialWantRatio?: number;
  initialInvestmentRatio?: number;
  initialSelectedRatio?: string;
  initialCurrency?: CurrencyType;
  href?: string;
  actionLabel: string;
}

export const IncomeCard: FC<IncomeCardProps> = ({
  title,
  income,
  initialNeedRatio,
  initialWantRatio,
  initialInvestmentRatio,
  initialSelectedRatio,
  initialCurrency,
  href = "/dashboard",
  actionLabel,
}) => {
  const router = useRouter();
  const [monthlyIncome, setMonthlyIncome] = useState<string | undefined>(
    income?.toString() ?? undefined
  );

  const [ratioSelected, setRatioSelected] = useState<"default" | "custom">(
    (initialSelectedRatio as "default" | "custom") ?? "default"
  );
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyType>(
    initialCurrency ?? "₹"
  );

  const [inputValidationState, setInputValidationState] = useState<
    "valid" | "invalid"
  >("valid");

  const [needRatio, setNeedRatio] = useState(
    ratioSelected === "default" ? "50" : initialNeedRatio?.toString() ?? ""
  );
  const [wantRatio, setWantRatio] = useState(
    ratioSelected === "default" ? "30" : initialWantRatio?.toString() ?? ""
  );
  const [investmentRatio, setInvestmentRatio] = useState(
    ratioSelected === "default"
      ? "20"
      : initialInvestmentRatio?.toString() ?? ""
  );

  const updateInputValidationState = useCallback(() => {
    if (!monthlyIncome) return setInputValidationState("valid");

    if (parseFloat(monthlyIncome) > 0) {
      setInputValidationState("valid");
    } else {
      setInputValidationState("invalid");
    }
  }, [monthlyIncome]);

  const updateUserIncome = trpc.user.updateMonthlyIncome.useMutation({
    onSuccess: () => {
      router.push(href);
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

    if (!monthlyIncome) {
      return toast({
        title: "Monthly Income is required",
        description: "Please enter a valid monthly income.",
        variant: "destructive",
      });
    }

    if (
      parseFloat(needRatio) +
        parseFloat(wantRatio) +
        parseFloat(investmentRatio) !==
      100
    ) {
      return toast({
        title: "Invalid ratio",
        description: "Ratio must add up to 100%.",
        variant: "destructive",
      });
    }

    const parsedAmount = parseFloat(monthlyIncome.replace(/,/g, ""));

    if (!parsedAmount) {
      return toast({
        title: "Invalid monthly income",
        description: "Please enter a valid monthly income.",
        variant: "destructive",
      });
    }

    updateUserIncome.mutate({
      monthlyIncome: parsedAmount,
      needsPercentage: parseFloat(needRatio),
      wantsPercentage: parseFloat(wantRatio),
      investmentsPercentage: parseFloat(investmentRatio),
      currency: selectedCurrency,
    });
  };

  useEffect(() => {
    updateInputValidationState();
  }, [monthlyIncome, updateInputValidationState]);

  useEffect(() => {
    if (ratioSelected === "default") {
      setNeedRatio("50");
      setWantRatio("30");
      setInvestmentRatio("20");
    }
  }, [ratioSelected]);

  return (
    <Card className="bg-[#1c1917] text-white">
      <CardHeader>
        <CardTitle className="text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-4 relative">
        <div className="flex gap-x-1.5 items-center">
          <Label>Monthly Income</Label>
          <ToolTip
            text="To allocate your budget between needs, wants and investments."
            showArrow
          >
            <Icons.info className="h-3 w-3 mt-[2px] text-muted-foreground" />
          </ToolTip>
        </div>
        <Select
          label="Currency"
          selectedKeys={selectedCurrency}
          onChange={(e) => {
            if (e.target.value === "") return;

            setSelectedCurrency(e.target.value as CurrencyType);
          }}
        >
          {currencies.map((currency) => (
            <SelectItem key={currency.value} value={currency.value}>
              {currency.label}
            </SelectItem>
          ))}
        </Select>
        <Input
          placeholder="Enter your monthly income here."
          value={monthlyIncome ?? ""}
          onChange={(e) => setMonthlyIncome(e.target.value)}
          validationState={inputValidationState}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleUpdateMonthlyIncome();
            }
          }}
          errorMessage={
            inputValidationState === "invalid" &&
            "Please entery a valid monthly income."
          }
          labelPlacement="outside"
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">
                {selectedCurrency}
              </span>
            </div>
          }
        />

        <div>
          <RadioGroup
            orientation="horizontal"
            value={ratioSelected}
            onValueChange={(value: string) =>
              setRatioSelected(value as "default" | "custom")
            }
          >
            <Radio
              value="default"
              description="Continue with the standard ratio."
            >
              <span className="text-white">50-30-20</span>
            </Radio>
            <Radio value="custom" description="Customize my ratio.">
              <span className="text-white">Custom</span>
            </Radio>
          </RadioGroup>
        </div>

        {ratioSelected === "custom" && (
          <NextUICard className="text-white">
            <NextUIBody>
              {parseFloat(needRatio) +
                parseFloat(wantRatio) +
                parseFloat(investmentRatio) !==
                100 && (
                <p className="text-danger-text text-xs tracking-tight mb-2">
                  Ratio must add up to 100%
                </p>
              )}
              <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                <Input
                  placeholder="0"
                  value={needRatio ?? ""}
                  onChange={(e) => setNeedRatio(e.target.value)}
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
                  value={wantRatio ?? ""}
                  onChange={(e) => setWantRatio(e.target.value)}
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
                  value={investmentRatio?.toString() ?? ""}
                  onChange={(e) => setInvestmentRatio(e.target.value)}
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
        <NextUICard className="w-full text-white">
          <NextUIBody className="py-2">
            <div className="flex justify-around gap-2 tracking-tight font-mono text-sm flex-wrap">
              <span>
                Needs: {selectedCurrency}
                <span className="font-semibold ml-1">
                  {monthlyIncome
                    ? (
                        parseFloat(monthlyIncome.replace(/,/g, "")) *
                        (parseFloat(needRatio) / 100)
                      ).toFixed(1)
                    : 0}
                </span>
              </span>
              <span>
                Wants: {selectedCurrency}
                <span className="font-semibold ml-1">
                  {monthlyIncome
                    ? (
                        parseFloat(monthlyIncome.replace(/,/g, "")) *
                        (parseFloat(wantRatio) / 100)
                      ).toFixed(1)
                    : 0}
                </span>
              </span>
              <span>
                Investments: {selectedCurrency}
                <span className="font-semibold ml-1">
                  {monthlyIncome
                    ? (
                        parseFloat(monthlyIncome.replace(/,/g, "")) *
                        (parseFloat(investmentRatio) / 100)
                      ).toFixed(1)
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
            actionLabel
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
