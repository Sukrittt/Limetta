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
import { buttonVariants } from "@/components/ui/button";
import { MiscEntryForm } from "@/components/forms/misc-entry-form";

export const MiscEntry = ({
  entryType,
  currency,
}: {
  currency: CurrencyType;
  entryType: "in" | "out";
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      {entryType === "in" ? (
        <Button
          onPress={onOpen}
          className={cn(buttonVariants(), "rounded-full")}
        >
          Income
        </Button>
      ) : (
        <Button
          onPress={onOpen}
          className={cn(
            buttonVariants({ variant: "secondary" }),
            "rounded-full"
          )}
        >
          Expense
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
                {entryType === "in" ? "Add Income" : "Add Expense"}
              </ModalHeader>
              <MiscEntryForm
                onClose={onClose}
                currency={currency}
                entryType={entryType}
              />
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
