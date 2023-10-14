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
import { MiscEntryForm } from "@/components/forms/misc-entry-form";

export const MiscEntry = ({
  entryType,
  currency,
}: {
  currency: CurrencyType;
  entryType: "in" | "out";
}) => {
  const [disabled, setDisabled] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      {entryType === "in" ? (
        disabled ? (
          <Button
            disabled={disabled}
            className={cn(buttonVariants(), "rounded-full")}
          >
            <Spinner color="default" size="sm" />
          </Button>
        ) : (
          <Button
            onPress={onOpen}
            className={cn(buttonVariants(), "rounded-full")}
          >
            Income
          </Button>
        )
      ) : disabled ? (
        <Button
          disabled={disabled}
          className={cn(
            buttonVariants({ variant: "secondary" }),
            "rounded-full"
          )}
        >
          <Spinner color="default" size="sm" />
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
        isDismissable={!disabled}
        hideCloseButton={disabled}
        backdrop="blur"
        placement="top-center"
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
                setDisabled={setDisabled}
              />
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
