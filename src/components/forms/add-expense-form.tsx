"use client";
import { useState } from "react";
import { Input } from "@nextui-org/input";
import { useRouter } from "next/navigation";
import { Spinner } from "@nextui-org/spinner";
import { RadioGroup, Radio } from "@nextui-org/radio";
import { ModalBody, ModalFooter } from "@nextui-org/modal";

import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { toast } from "@/hooks/use-toast";
import { Button } from "@nextui-org/button";
import { Label } from "@/components/ui/label";
import { buttonVariants } from "@/components/ui/button";

export const AddExpenseForm = ({
  bookId,
  onClose,
}: {
  bookId: number;
  onClose: () => void;
}) => {
  const router = useRouter();
  const [amount, setAmount] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [expenseTypeSelected, setExpenseTypeSelected] = useState<
    "want" | "need"
  >("need");

  const addEntry = trpc.entries.addEntry.useMutation({
    onSuccess: () => {
      onClose();
      router.refresh();
      toast({
        title: "Expense added successfully",
        description: "Your expense has been added successfully.",
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

    addEntry.mutate({
      bookId,
      amount,
      description,
      expenseType: expenseTypeSelected,
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
