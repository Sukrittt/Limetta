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
import { InvestAddEntryForm } from "@/components/forms/invest-add-entry-form";

export const InvestAddEntry = ({
  initialBalance,
  initialTotalInvested,
  currency,
}: {
  initialBalance: number;
  initialTotalInvested: number;
  currency: CurrencyType;
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button onPress={onOpen} className={cn(buttonVariants(), "rounded-full")}>
        Add entry
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
                Add Entry
              </ModalHeader>
              <InvestAddEntryForm
                onClose={onClose}
                currency={currency}
                initialBalance={initialBalance}
                initialTotalInvested={initialTotalInvested}
              />
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
