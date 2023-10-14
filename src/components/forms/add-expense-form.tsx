"use client";
import { useCallback, useEffect, useState } from "react";
import { Input } from "@nextui-org/input";
import { useRouter } from "next/navigation";
import { Spinner } from "@nextui-org/spinner";
import { RadioGroup, Radio } from "@nextui-org/radio";
import { ModalBody, ModalFooter } from "@nextui-org/modal";

import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { CurrencyType } from "@/types";
import { toast } from "@/hooks/use-toast";
import { Button } from "@nextui-org/button";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/date-picker";
import { buttonVariants } from "@/components/ui/button";

export const AddExpenseForm = ({
  onClose,
  currency,
  setDisabled,
}: {
  onClose: () => void;
  currency: CurrencyType;
  setDisabled: (disabled: boolean) => void;
}) => {
  const router = useRouter();

  const [amount, setAmount] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [entryDate, setEntryDate] = useState<Date | undefined>(new Date());

  const [inputValidationState, setInputValidationState] = useState<
    "valid" | "invalid"
  >("valid");
  const [expenseTypeSelected, setExpenseTypeSelected] = useState<
    "want" | "need"
  >("want");

  const addEntry = trpc.entries.addEntry.useMutation({
    onSuccess: () => {
      onClose();
      setDisabled(false);
      router.refresh();

      toast({
        title: "Expense added",
        description: "Your expense has been added successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Something went wrong.",
        description: "Please try again.",
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

    if (!entryDate) {
      return toast({
        title: "Entry date is required",
        description: "Please select a valid entry date.",
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

    if (!parsedAmount) {
      return toast({
        title: "Amount is invalid",
        description: "Please enter a valid amount.",
        variant: "destructive",
      });
    }

    setDisabled(true);

    addEntry.mutate({
      amount: parsedAmount,
      description,
      expenseType: expenseTypeSelected,
      entryDate,
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

  return (
    <>
      <ModalBody>
        <form className="grid w-full max-w-xl gap-5">
          <div className="flex flex-col gap-y-2">
            <Label>Amount</Label>
            <Input
              autoFocus
              placeholder="Eg: 20"
              value={amount ?? ""}
              disabled={addEntry.isLoading}
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
            <Label>Expense Description</Label>
            <Input
              placeholder="Eg: Coffee"
              value={description}
              disabled={addEntry.isLoading}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <Label>
              Date{" "}
              <span className="text-sm text-muted-foreground tracking-tighter">
                (optional)
              </span>
            </Label>
            <DatePicker
              value={entryDate}
              setValue={setEntryDate}
              disabled={[
                {
                  before: new Date(
                    new Date().getFullYear(),
                    new Date().getMonth(),
                    1
                  ),
                },
                { after: new Date() },
              ]}
            />
          </div>

          <div>
            <RadioGroup
              orientation="horizontal"
              value={expenseTypeSelected}
              onValueChange={(value) =>
                setExpenseTypeSelected(value as "want" | "need")
              }
            >
              <Radio value="need" description="It's a necessity.">
                Needs
              </Radio>
              <Radio value="want" description="It's a luxury.">
                Wants
              </Radio>
            </RadioGroup>
          </div>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button
          color="danger"
          disabled={addEntry.isLoading}
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
          disabled={addEntry.isLoading}
        >
          {addEntry.isLoading ? <Spinner color="default" size="sm" /> : "Add"}
        </Button>
      </ModalFooter>
    </>
  );
};
