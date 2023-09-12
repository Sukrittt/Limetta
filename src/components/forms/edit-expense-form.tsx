"use client";
import { useState } from "react";
import { Input } from "@nextui-org/input";
import { useRouter } from "next/navigation";
import { Spinner } from "@nextui-org/spinner";
import { RadioGroup, Radio } from "@nextui-org/radio";
import { ModalBody, ModalFooter } from "@nextui-org/modal";

import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { ExpenseType } from "@/types";
import { toast } from "@/hooks/use-toast";
import { Button } from "@nextui-org/button";
import { Label } from "@/components/ui/label";
import { buttonVariants } from "@/components/ui/button";

export const EditExpenseForm = ({
  expense,
  onClose,
}: {
  expense: ExpenseType;
  onClose: () => void;
}) => {
  const router = useRouter();
  const [amount, setAmount] = useState(expense.amount);
  const [description, setDescription] = useState(expense.description);
  const [expenseTypeSelected, setExpenseTypeSelected] = useState(expense.type);

  const editEntry = trpc.entries.editEntry.useMutation({
    onSuccess: () => {
      onClose();
      toast({
        title: "Expense Updated",
        description: "Expense has been updated successfully.",
      });
      router.refresh();
    },
    onError: (error) => {
      toast({
        title: "Something went wrong",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    editEntry.mutate({
      bookId: expense.bookId,
      expenseId: expense.id,
      amount,
      description,
      expenseType: expenseTypeSelected,
      initialExpenseType: expense.type,
    });
  };

  return (
    <>
      <ModalBody>
        <form className="grid w-full max-w-xl gap-5">
          <div className="flex flex-col gap-y-2">
            <Label>Amount</Label>
            <Input
              autoFocus
              placeholder="Eg: ₹ 20"
              type="number"
              disabled={editEntry.isLoading}
              value={amount?.toString() ?? ""}
              onChange={(e) => setAmount(parseInt(e.target.value))}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">₹</span>
                </div>
              }
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <Label>Expense Description</Label>
            <Input
              placeholder="Eg: Coffee"
              value={description}
              disabled={editEntry.isLoading}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
            />
          </div>
          <div>
            <RadioGroup
              orientation="horizontal"
              value={expenseTypeSelected}
              onValueChange={(value) => {
                if (value !== "want" && value !== "need") return;
                setExpenseTypeSelected(value);
              }}
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
          variant="light"
          className={cn(
            buttonVariants({ size: "sm", variant: "ghost" }),
            "rounded-lg"
          )}
          onPress={onClose}
        >
          Close
        </Button>
        <Button
          color="primary"
          className={cn(buttonVariants({ size: "sm" }), "rounded-lg")}
          disabled={editEntry.isLoading}
          onClick={handleSubmit}
        >
          {editEntry.isLoading ? (
            <Spinner color="default" size="sm" />
          ) : (
            "Update"
          )}
        </Button>
      </ModalFooter>
    </>
  );
};
