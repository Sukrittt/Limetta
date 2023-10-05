"use client";
import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { Spinner } from "@nextui-org/spinner";

import { ExpenseType } from "@/types";
import { EditExpenseForm } from "@/components/forms/edit-expense-form";

export const EditExpense = ({ expense }: { expense: ExpenseType }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [disabled, setDisabled] = useState(false);

  return (
    <>
      {disabled ? (
        <Spinner color="default" size="sm" className="h-5 w-5" />
      ) : (
        <span
          className="cursor-pointer hover:text-primary hover:opacity-90 transition"
          onClick={onOpen}
        >
          Edit
        </span>
      )}
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
              <EditExpenseForm
                expense={expense}
                onClose={onClose}
                setDisabled={setDisabled}
              />
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
