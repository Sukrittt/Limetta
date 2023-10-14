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
import { DueForm } from "@/components/forms/due-form";
import { buttonVariants } from "@/components/ui/button";

export const DuePayment = ({
  currency,
  dueType,
}: {
  currency: CurrencyType;
  dueType: "receivable" | "payable";
}) => {
  const [disabled, setDisabled] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      {dueType === "receivable" ? (
        disabled ? (
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
            Due Receivable
          </Button>
        )
      ) : disabled ? (
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
          Due Payable
        </Button>
      )}
      <Modal
        isOpen={isOpen}
        isDismissable={!disabled}
        hideCloseButton={disabled}
        onOpenChange={onOpenChange}
        backdrop="blur"
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {dueType === "receivable" ? "Due Receivable" : "Due Payable"}
              </ModalHeader>
              <DueForm
                dueType={dueType}
                onClose={onClose}
                currency={currency}
                setDisabled={setDisabled}
              />
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
