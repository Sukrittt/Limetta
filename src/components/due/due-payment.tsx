"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";

import { cn } from "@/lib/utils";
import { CurrencyType } from "@/types";
import { DueForm } from "@/components/forms/due-form";
import { buttonVariants } from "@/components/ui/button";

export const DuePayment = ({
  initialBalance,
  currency,
  dueType,
}: {
  initialBalance: number;
  currency: CurrencyType;
  dueType: "receivable" | "payable";
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      {dueType === "receivable" ? (
        <Button
          onPress={onOpen}
          className={cn(
            buttonVariants({ variant: "secondary" }),
            "rounded-full"
          )}
        >
          Due Receivable
        </Button>
      ) : (
        <Button
          onPress={onOpen}
          className={cn(buttonVariants(), "rounded-full")}
        >
          Due Payable
        </Button>
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
                {dueType === "receivable" ? "Due Receivable" : "Due Payable"}
              </ModalHeader>
              <DueForm
                onClose={onClose}
                currency={currency}
                initialBalance={initialBalance}
                dueType={dueType}
              />
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
