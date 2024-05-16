import { useCallback, useEffect, useState } from "react";
import { Input } from "@nextui-org/input";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import { RadioGroup, Radio } from "@nextui-org/radio";
import { useQueryClient } from "@tanstack/react-query";
import { ModalBody, ModalFooter } from "@nextui-org/modal";

import { trpc } from "@/trpc/client";
import { toast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/date-picker";
import { buttonVariants } from "@/components/ui/button";
import { CurrencyType, ExtendedEntryType } from "@/types";
import { cn, getMaxSpendLimitForSavingAmount } from "@/lib/utils";

export const DueEditForm = ({
  onClose,
  currency,
  entry,
  savingBalance,
  setDisabled,
}: {
  onClose: () => void;
  currency: CurrencyType;
  entry: ExtendedEntryType;
  savingBalance: number;
  setDisabled: (disabled: boolean) => void;
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [amount, setAmount] = useState(entry.amount.toLocaleString());
  const [description, setDescription] = useState(entry.description);
  const [dueDate, setDueDate] = useState<Date | undefined>(
    new Date(entry.dueDate)
  );
  const [dueType, setDueType] = useState(entry.dueType);
  const [inputValidationState, setInputValidationState] = useState<
    "valid" | "invalid"
  >("valid");

  const editDueEntry = trpc.dues.edit.editDueEntry.useMutation({
    onSuccess: () => {
      router.refresh();
      queryClient.resetQueries(["dues-entries"]);

      toast({
        title: "Due updated",
        description: "Your due has been updated successfully.",
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

    if (!dueDate) {
      return toast({
        title: "Due date is required",
        description: "Please select a due date for the payment.",
        variant: "destructive",
      });
    }

    if (dueDate <= new Date()) {
      return toast({
        title: "Due date has passed",
        description: "Please select a valid due date for the payment.",
        variant: "destructive",
      });
    }

    if (description.length === 0 || description.length > 100) {
      return toast({
        title: "Description is too long/short",
        description: "Please enter a valid description.",
        variant: "destructive",
      });
    }

    const parsedAmount = parseFloat(amount.replace(/,/g, ""));

    const maxLimitForSavingAccount = getMaxSpendLimitForSavingAmount(
      savingBalance,
      parseFloat(entry.amount),
      entry.dueType
    );

    if (
      dueType === "payable" &&
      entry.dueStatus === "paid" &&
      entry.transferAccountType === "savings" &&
      parsedAmount > maxLimitForSavingAccount
    ) {
      return toast({
        title: "Insufficient balance.",
        description: "Please add funds to your savings account.",
        variant: "destructive",
      });
    }

    if (!parsedAmount) {
      return toast({
        title: "Amount is invalid",
        description: "Please enter a valid amount.",
        variant: "destructive",
      });
    }

    setDisabled(true);

    editDueEntry.mutate({
      dueId: entry.entryId,
      amount: parsedAmount,
      description,
      dueDate: new Date(dueDate),
      dueStatus: entry.dueStatus,
      dueType,
    });
  };

  const updateInputValidationState = useCallback(() => {
    if (!amount) return setInputValidationState("valid");

    if (parseFloat(amount) > 0) {
      setInputValidationState("valid");
    } else {
      setInputValidationState("invalid");
    }
  }, [amount]);

  useEffect(() => {
    updateInputValidationState();
  }, [amount, updateInputValidationState]);

  const disableRadioForExpenseTrackerEntry =
    entry.dueStatus === "paid" &&
    (entry.transferAccountType === "want" ||
      entry.transferAccountType === "need");

  return (
    <>
      <ModalBody>
        <form className="grid w-full max-w-xl gap-5">
          <div className="flex flex-col gap-y-2">
            <Label>Amount</Label>
            <Input
              autoFocus
              placeholder="Eg: 1000"
              value={amount ?? ""}
              disabled={editDueEntry.isLoading}
              onChange={(e) => setAmount(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
              validationState={inputValidationState}
              errorMessage={
                inputValidationState === "invalid" &&
                "Please entery a valid amount."
              }
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">
                    {currency}
                  </span>
                </div>
              }
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <Label>Description</Label>
            <Input
              placeholder={`Eg: Pending payment ${
                entry.dueType === "payable" ? "to" : "from"
              } XYZ`}
              value={description}
              disabled={editDueEntry.isLoading}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <Label>Due Date</Label>
            <DatePicker value={dueDate} setValue={setDueDate} />
          </div>

          {!disableRadioForExpenseTrackerEntry && (
            <div>
              <RadioGroup
                orientation="horizontal"
                value={dueType}
                onValueChange={(value) =>
                  setDueType(value as "payable" | "receivable")
                }
              >
                <Radio value="payable" description="You have to pay in future.">
                  Payable
                </Radio>
                <Radio
                  value="receivable"
                  description="You will receive in future."
                >
                  Receivable
                </Radio>
              </RadioGroup>
            </div>
          )}
        </form>
      </ModalBody>
      <ModalFooter>
        <Button
          color="danger"
          disabled={editDueEntry.isLoading}
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
          disabled={editDueEntry.isLoading}
        >
          {editDueEntry.isLoading ? (
            <Spinner color="default" size="sm" />
          ) : (
            "Update"
          )}
        </Button>
      </ModalFooter>
    </>
  );
};
