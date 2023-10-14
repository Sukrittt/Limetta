import { useCallback, useEffect, useState } from "react";
import { Input } from "@nextui-org/input";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import { useQueryClient } from "@tanstack/react-query";
import { ModalBody, ModalFooter } from "@nextui-org/modal";

import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { CurrencyType } from "@/types";
import { toast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/date-picker";
import { buttonVariants } from "@/components/ui/button";

export const DueForm = ({
  onClose,
  currency,
  dueType,
  setDisabled,
}: {
  onClose: () => void;
  currency: CurrencyType;
  dueType: "receivable" | "payable";
  setDisabled: (disabled: boolean) => void;
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [amount, setAmount] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [inputValidationState, setInputValidationState] = useState<
    "valid" | "invalid"
  >("valid");

  const addDueEntry = trpc.dues.add.addDueEntry.useMutation({
    onSuccess: () => {
      router.refresh();
      queryClient.resetQueries(["dues-entries"]);

      toast({
        title: "Due added",
        description: "Your due has been added successfully.",
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

    addDueEntry.mutate({
      amount: parsedAmount,
      description,
      dueDate,
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
              disabled={addDueEntry.isLoading}
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
                dueType === "payable" ? "to" : "from"
              } XYZ`}
              value={description}
              disabled={addDueEntry.isLoading}
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
            <DatePicker
              value={dueDate}
              setValue={setDueDate}
              disabled={[{ before: new Date() }, new Date()]}
            />
          </div>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button
          color="danger"
          disabled={addDueEntry.isLoading}
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
          disabled={addDueEntry.isLoading}
        >
          {addDueEntry.isLoading ? (
            <Spinner color="default" size="sm" />
          ) : (
            "Add"
          )}
        </Button>
      </ModalFooter>
    </>
  );
};
