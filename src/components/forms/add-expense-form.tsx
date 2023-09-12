"use client";
import { useState } from "react";
import { Input } from "@nextui-org/input";
import { RadioGroup, Radio } from "@nextui-org/radio";
import { ModalBody, ModalFooter } from "@nextui-org/modal";

import { Label } from "@/components/ui/label";
import { Button } from "@nextui-org/button";

export const AddExpenseForm = ({
  bookId,
  onClose,
}: {
  bookId: number;
  onClose: () => void;
}) => {
  const [amount, setAmount] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [expenseTypeSelected, setExpenseTypeSelected] = useState<
    "want" | "need"
  >("need");

  const handleSubmit = () => {};

  return (
    <>
      <ModalBody>
        <form className="grid w-full max-w-xl gap-5" onSubmit={handleSubmit}>
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
        <Button color="danger" variant="light" onPress={onClose}>
          Close
        </Button>
        <Button color="primary" onPress={onClose}>
          Add
        </Button>
      </ModalFooter>
    </>
  );
};
