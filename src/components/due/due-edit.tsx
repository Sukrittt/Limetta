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
  entryDetails,
  currency,
  miscBalance,
  savingBalance,
}: {
  entryDetails: ExtendedEntryType;
  currency: CurrencyType;
  miscBalance: number;
  savingBalance: number;
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [disabled, setDisabled] = useState(false);

  return (
    <>
      {disabled ? (
        <Spinner color="default" size="sm" className="h-5 w-5" />
      ) : (
        <span
          className="cursor-pointer hover:text-primary hover:opacity-90 transition"
          onClick={onOpen}
        >
          Edit
        </span>
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
                Edit entry
              </ModalHeader>
              <DueEditForm
                onClose={onClose}
                currency={currency}
                entry={entryDetails}
                savingBalance={savingBalance}
                miscBalance={miscBalance}
                setDisabled={setDisabled}
              />
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
