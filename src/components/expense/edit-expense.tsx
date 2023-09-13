"use client";
import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";

import { ExpenseType } from "@/types";
import { EditExpenseForm } from "@/components/forms/edit-expense-form";

export const EditExpense = ({ expense }: { expense: ExpenseType }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <span
        className="cursor-pointer hover:text-primary hover:opacity-90 transition"
        onClick={onOpen}
      >
        Edit
      </span>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        placement="center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit expense
              </ModalHeader>
              <EditExpenseForm expense={expense} onClose={onClose} />
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
