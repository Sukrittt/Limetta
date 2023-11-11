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

export const Onboarding = () => {
  const [monthlyIncome, setMonthlyIncome] = useState<string | undefined>(
    undefined
  );

  const [ratioSelected, setRatioSelected] = useState<"default" | "custom">(
    "default"
  );
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyType>("₹");

  const [inputValidationState, setInputValidationState] = useState<
    "valid" | "invalid"
  >("valid");

  const [needRatio, setNeedRatio] = useState("50");
  const [wantRatio, setWantRatio] = useState("30");
  const [investmentRatio, setInvestmentRatio] = useState("20");

  const updateInputValidationState = useCallback(() => {
    if (!monthlyIncome) return setInputValidationState("valid");

    if (parseFloat(monthlyIncome) > 0) {
      setInputValidationState("valid");
    } else {
      setInputValidationState("invalid");
    }
  }, [monthlyIncome]);

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
    <Card className="bg-[#1c1917] border-[#27272a] text-white">
      <CardHeader>
        <CardTitle className="text-center">
          Financial Setup: Let&rsquo;s Get Started
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-4 relative">
        <div className="flex gap-x-1.5 items-center">
          <Label>Monthly Income</Label>
          <div className="hidden lg:block">
            <ToolTip
              text="To allocate your budget between needs, wants and investments."
              showArrow
            >
              <Icons.info className="h-3 w-3 mt-[2px] text-muted-foreground" />
            </ToolTip>
          </div>
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
              50-30-20
            </Radio>
            <Radio value="custom" description="Customize my ratio.">
              Custom
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
        >
          Continue to Dashboard
        </Button>
      </CardFooter>
    </Card>
  );
};
