"use client";
import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { AddExpenseForm } from "@/components/forms/add-expense-form";

export const AddExpense = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        onPress={onOpen}
        color="primary"
        className={cn(
          buttonVariants({ size: "sm" }),
          "rounded-lg font-mono tracking-tighter"
        )}
      >
        Add Entry
      </Button>
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
                Add expense
              </ModalHeader>
              <AddExpenseForm onClose={onClose} />
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
