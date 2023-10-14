"use client";
import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { Spinner } from "@nextui-org/spinner";

import { EntryType } from "@/types";
import { CurrencyType } from "@/types";
import { MiscEditForm } from "@/components/forms/misc-edit-form";

export const MiscEditEntry = ({
  entryDetails,
  currency,
}: {
  entryDetails: EntryType;
  currency: CurrencyType;
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
                Edit entry
              </ModalHeader>
              <MiscEditForm
                onClose={onClose}
                currency={currency}
                setDisabled={setDisabled}
                entryDetails={entryDetails}
              />
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
