"use client";
import { useCallback, useEffect, useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Selection } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/select";
import {
  Card as NextUICard,
  CardBody as NextUIBody,
  CardHeader as NextUIHeader,
  CardFooter as NextUIFooter,
} from "@nextui-org/card";

import { AccountType } from "@/types";
import { accountTypes } from "@/config";
import { Icons } from "@/components/icons";
import { Label } from "@/components/ui/label";
import { cn, getInitialToAccount } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const investmentsBalance = 5000;
const miscellaneousBalance = 2500;
const savingsBalance = 1000;

export const Transfer = () => {
  const [amount, setAmount] = useState<string | null>(null);

  const [fromAccount, setFromAccount] = useState<AccountType>("savings");
  const [toAccount, setToAccount] = useState(getInitialToAccount(fromAccount));

  const [fromSelection, setFromSelection] = useState<Selection>(
    new Set([fromAccount])
  );
  const [toSelection, setToSelection] = useState<Selection>(
    new Set([toAccount])
  );

  let transferableAmount =
    fromAccount === "investments"
      ? investmentsBalance
      : fromAccount === "savings"
      ? savingsBalance
      : miscellaneousBalance;

  transferableAmount = transferableAmount > 0 ? transferableAmount : 0;

  const [inputValidationState, setInputValidationState] = useState<
    "valid" | "invalid"
  >("valid");

  const updateInputValidationState = useCallback(() => {
    if (!amount) return setInputValidationState("valid");

    if (parseFloat(amount.replace(/,/g, "")) > transferableAmount) {
      return setInputValidationState("invalid");
    }

    if (parseFloat(amount) > 0) {
      setInputValidationState("valid");
    } else {
      setInputValidationState("invalid");
    }
  }, [amount, transferableAmount]);

  useEffect(() => {
    updateInputValidationState();
  }, [amount, updateInputValidationState]);

  const revertFromToSelections = () => {
    setFromSelection(new Set([toAccount]));
    setToSelection(new Set([fromAccount]));

    setFromAccount(toAccount);
    setToAccount(fromAccount);
  };

  return (
    <NextUICard className="px-3 py-2 w-full md:w-[500px] text-white">
      <NextUIHeader className="text-left tracking-tight font-semibold text-lg">
        Transfer your money
      </NextUIHeader>
      <NextUIBody>
        <form className="grid w-full max-w-xl gap-5">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-x-2">
              <Select
                label="From"
                placeholder="Select an account"
                selectedKeys={fromSelection}
                className="max-w-xs"
                onSelectionChange={setFromSelection}
                onChange={(e) => setFromAccount(e.target.value as AccountType)}
              >
                {accountTypes.map((account) => (
                  <SelectItem key={account.value} value={account.value}>
                    {account.label}
                  </SelectItem>
                ))}
              </Select>
              <div
                className="cursor-pointer hover:text-primary transition"
                onClick={revertFromToSelections}
              >
                <Icons.transfer className="h-4 w-4" />
              </div>
            </div>

            <Select
              label="To"
              placeholder="Select an account"
              selectedKeys={toSelection}
              className="max-w-xs"
              onSelectionChange={setToSelection}
              onChange={(e) => setToAccount(e.target.value as AccountType)}
            >
              {accountTypes.map((account) => (
                <SelectItem key={account.value} value={account.value}>
                  {account.label}
                </SelectItem>
              ))}
            </Select>
          </div>

          <div className="flex flex-col gap-y-2">
            <div className="flex flex-col gap-y-2 relative">
              <Label>Amount</Label>
              <Input
                placeholder={`Eg: ${
                  transferableAmount > 0 ? transferableAmount : "1000"
                }`}
                value={amount ?? ""}
                onChange={(e) => setAmount(e.target.value)}
                validationState={inputValidationState}
                errorMessage={
                  inputValidationState === "invalid" &&
                  "Insufficient wallet balance."
                }
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">₹</span>
                  </div>
                }
              />

              <div
                className="absolute top-[33px] cursor-pointer z-50 right-5 text-primary text-sm"
                onClick={() => setAmount(transferableAmount.toLocaleString())}
              >
                All
              </div>
            </div>

            <div className="flex justify-between text-muted-foreground text-sm tracking-tight">
              <p>Transferable Amount</p>
              <p>₹{transferableAmount.toLocaleString()}</p>
            </div>
          </div>
        </form>
      </NextUIBody>
      <NextUIFooter className="flex justify-end gap-x-2">
        <Button
          color="danger"
          className={cn(
            buttonVariants({ size: "sm", variant: "ghost" }),
            "rounded-lg"
          )}
          variant="light"
        >
          Close
        </Button>
        <Button
          color="primary"
          className={cn(buttonVariants({ size: "sm" }), "rounded-lg")}
        >
          Transfer
        </Button>
      </NextUIFooter>
    </NextUICard>
  );
};
