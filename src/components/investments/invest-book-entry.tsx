"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";

import { cn } from "@/lib/utils";
import { CurrencyType } from "@/config";
import { buttonVariants } from "@/components/ui/button";
import { InvestBookEntryForm } from "@/components/forms/invest-book-entry-form";

export const InvestBookEntry = ({
  initialBalance,
  currency,
}: {
  initialBalance: number;
  currency: CurrencyType;
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        onPress={onOpen}
        className={cn(buttonVariants({ variant: "secondary" }), "rounded-full")}
      >
        Record Profit/Loss
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
                Record Profit/Loss
              </ModalHeader>
              <InvestBookEntryForm
                onClose={onClose}
                currency={currency}
                initialBalance={initialBalance}
              />
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
