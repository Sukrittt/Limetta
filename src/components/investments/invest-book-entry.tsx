"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";

import { EntryType } from "@/types";
import { CurrencyType } from "@/config";
import { InvestBookEntryForm } from "@/components/forms/invest-book-entry-form";

export const InvestmentBookEntry = ({
  currency,
  initialBalance,
  entryDetails,
}: {
  initialBalance: number;
  currency: CurrencyType;
  entryDetails: EntryType;
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <span
        className="cursor-pointer hover:text-primary hover:opacity-90 transition col-span-2"
        onClick={onOpen}
      >
        Profit/Loss
      </span>
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
                Record Profit/Loss
              </ModalHeader>
              <InvestBookEntryForm
                onClose={onClose}
                currency={currency}
                initialBalance={initialBalance}
                entryDetails={entryDetails}
              />
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
