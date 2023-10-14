"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { useState } from "react";
import { Spinner } from "@nextui-org/spinner";

import { EntryType } from "@/types";
import { CurrencyType } from "@/types";
import { InvestBookEntryForm } from "@/components/forms/invest-book-entry-form";

export const InvestmentBookEntry = ({
  currency,
  entryDetails,
}: {
  currency: CurrencyType;
  entryDetails: EntryType;
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [disabled, setDisabled] = useState(false);

  return (
    <>
      {disabled ? (
        <Spinner color="default" size="sm" className="h-5 w-5" />
      ) : (
        <span
          className="cursor-pointer hover:text-primary hover:opacity-90 transition col-span-2"
          onClick={onOpen}
        >
          Profit/Loss
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
                Record Profit/Loss
              </ModalHeader>
              <InvestBookEntryForm
                onClose={onClose}
                currency={currency}
                entryDetails={entryDetails}
                setDisabled={setDisabled}
              />
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
