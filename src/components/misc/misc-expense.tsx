"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { MiscExpenseForm } from "@/components/forms/misc-expense-form";

export const MiscExpense = ({ initialBalance }: { initialBalance: number }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        onPress={onOpen}
        className={cn(buttonVariants({ variant: "secondary" }), "rounded-full")}
      >
        Expense
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
                Add Expense
              </ModalHeader>
              <MiscExpenseForm
                onClose={onClose}
                initialBalance={initialBalance}
              />
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
