"use client";
import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { Spinner } from "@nextui-org/spinner";

import { CurrencyType, ExtendedEntryType } from "@/types";
import { DueEditForm } from "@/components/forms/due-edit-form";

export const DueEditEntry = ({
  currency,
  entryDetails,
  savingBalance,
}: {
  savingBalance: number;
  currency: CurrencyType;
  entryDetails: ExtendedEntryType;
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [disabled, setDisabled] = useState(false);

  return (
    <>
      {disabled ? (
        <Spinner color="default" size="sm" className="h-5 w-5" />
      ) : (
        <span
          className="cursor-pointer text-warning-text hover:opacity-90 transition"
          onClick={onOpen}
        >
          Edit
        </span>
      )}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        hideCloseButton={disabled}
        isDismissable={!disabled}
        backdrop="blur"
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit entry
              </ModalHeader>
              <DueEditForm
                onClose={onClose}
                currency={currency}
                entry={entryDetails}
                savingBalance={savingBalance}
                setDisabled={setDisabled}
              />
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
