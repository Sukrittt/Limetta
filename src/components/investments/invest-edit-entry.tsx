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
import { InvestmentEditEntryForm } from "@/components/forms/investment-edit-form";

export const InvestmentEditEntry = ({
  entryDetails,
  currency,
  tradeBooking,
}: {
  entryDetails: EntryType;
  currency: CurrencyType;
  tradeBooking: boolean;
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
              <InvestmentEditEntryForm
                onClose={onClose}
                currency={currency}
                setDisabled={setDisabled}
                tradeBooking={tradeBooking}
                entryDetails={entryDetails}
              />
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
