import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Input } from "@nextui-org/input";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";
import { Selection } from "@nextui-org/react";
import { Spinner } from "@nextui-org/spinner";
import { useQueryClient } from "@tanstack/react-query";
import { Select, SelectItem } from "@nextui-org/select";
import { ModalBody, ModalFooter } from "@nextui-org/modal";

import { trpc } from "@/trpc/client";
import { accountTypes } from "@/config";
import { toast } from "@/hooks/use-toast";
import { Icons } from "@/components/icons";
import { Label } from "@/components/ui/label";
import { CurrencyType, AccountType } from "@/types";
import { cn, getInitialToAccount } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export const TransferForm = ({
  onClose,
  initialSelected,
  investmentsBalance,
  miscellaneousBalance,
  savingsBalance,
  currency,
  setDisabled,
}: {
  onClose: () => void;
  currency: CurrencyType;
  initialSelected: AccountType;
  savingsBalance: number;
  investmentsBalance: number;
  miscellaneousBalance: number;
  setDisabled: (disabled: boolean) => void;
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [amount, setAmount] = useState<string | null>(null);

  const [fromAccount, setFromAccount] = useState(initialSelected);
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

  const transferAmount = trpc.transfer.transferAmount.useMutation({
    onSuccess: () => {
      router.refresh();

      queryClient.resetQueries(["investment-entries"]);
      queryClient.resetQueries(["savings-entries"]);
      queryClient.resetQueries(["miscellaneous-entries"]);

      const { dismiss } = toast({
        title: "Transfer successfully done",
        description: (
          <>
            Your money was transferred to{" "}
            <Link
              href={`/${toAccount}`}
              onClick={() => dismiss()}
              className="text-primary underline underline-offset-4"
            >
              {toAccount.charAt(0).toUpperCase() + toAccount.slice(1)}
            </Link>{" "}
            account.
          </>
        ),
      });
      setDisabled(false);
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Something went wrong.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!amount) {
      return toast({
        title: "Amount is required",
        description: "Please enter a valid amount.",
        variant: "destructive",
      });
    }

    const parsedAmount = parseFloat(amount.replace(/,/g, ""));

    if (!parsedAmount) {
      return toast({
        title: "Amount is invalid",
        description: "Please enter a valid amount.",
        variant: "destructive",
      });
    }

    if (fromAccount === toAccount) {
      return toast({
        title: "Transfer is invalid",
        description:
          "Please select different accounts to transfer to and from.",
        variant: "destructive",
      });
    }

    if (transferableAmount < parseFloat(amount.replace(/,/g, ""))) {
      return toast({
        title: "Insufficient balance",
        description:
          "Your account balance is not enough to cover this transaction.",
        variant: "destructive",
      });
    }

    setDisabled(true);

    transferAmount.mutate({
      to: toAccount,
      from: fromAccount,
      amount: parsedAmount,
    });
  };

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
    <>
      <ModalBody>
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
                autoFocus
                disabled={transferAmount.isLoading}
                placeholder={`Eg: ${
                  transferableAmount > 0 ? transferableAmount : "1000"
                }`}
                value={amount ?? ""}
                onChange={(e) => setAmount(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit();
                  }
                }}
                validationState={inputValidationState}
                errorMessage={
                  inputValidationState === "invalid" &&
                  "Insufficient wallet balance."
                }
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">
                      {currency}
                    </span>
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
              <p>
                {currency}
                {transferableAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button
          color="danger"
          disabled={transferAmount.isLoading}
          className={cn(
            buttonVariants({ size: "sm", variant: "ghost" }),
            "rounded-lg"
          )}
          variant="light"
          onPress={onClose}
        >
          Close
        </Button>
        <Button
          color="primary"
          className={cn(buttonVariants({ size: "sm" }), "rounded-lg")}
          onClick={handleSubmit}
          disabled={transferAmount.isLoading}
        >
          {transferAmount.isLoading ? (
            <Spinner color="default" size="sm" />
          ) : (
            "Transfer"
          )}
        </Button>
      </ModalFooter>
    </>
  );
};
