"use client";
import { Button } from "@nextui-org/button";
import {
    Modal,
    ModalContent,
    ModalHeader, useDisclosure
} from "@nextui-org/modal";

import { AddExpenseForm } from "@/components/forms/add-expense-form";

export const AddExpense = ({ bookId }: { bookId: number }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        onPress={onOpen}
        color="primary"
      >
        Add Entry
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add expense
              </ModalHeader>
                <AddExpenseForm bookId={bookId} onClose={onClose} />
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
