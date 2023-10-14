"use client";
import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";

import { cn } from "@/lib/utils";
import { CurrencyType } from "@/types";
import { buttonVariants } from "@/components/ui/button";
import { InvestAddEntryForm } from "@/components/forms/invest-add-entry-form";

export const InvestAddEntry = ({
  initialBalance,
  currency,
}: {
  initialBalance: number;
  currency: CurrencyType;
}) => {
  const [disabled, setDisabled] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      {disabled ? (
        <Button
          disabled={disabled}
          className={cn(buttonVariants(), "rounded-full w-full md:w-fit")}
        >
          <Spinner color="default" size="sm" />
        </Button>
      ) : (
        <Button
          onPress={onOpen}
          className={cn(buttonVariants(), "rounded-full w-full md:w-fit")}
        >
          Add entry
        </Button>
      )}

      <Modal
        isOpen={isOpen}
        hideCloseButton={disabled}
        isDismissable={!disabled}
        onOpenChange={onOpenChange}
        backdrop="blur"
        placement="top-center"
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
                setDisabled={setDisabled}
              />
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
