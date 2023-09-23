"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { EntryType } from "@/types";
import { CurrencyType, InvestmentType } from "@/config";
import { InvestmentEditEntryForm } from "@/components/forms/investment-edit-form";

export const InvestmentEditEntry = ({
  entryDetails,
  currency,
  tradeBooking,
  initialTotalInvested,
  initialInvestmentType,
}: {
  initialInvestmentType: InvestmentType;
  initialTotalInvested: number;
  entryDetails: EntryType;
  currency: CurrencyType;
  tradeBooking: boolean;
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <span
        className="cursor-pointer hover:text-primary hover:opacity-90 transition"
        onClick={onOpen}
      >
        Edit
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
                Edit entry
              </ModalHeader>
              <InvestmentEditEntryForm
                initialInvestmentType={initialInvestmentType}
                tradeBooking={tradeBooking}
                initialTotalInvested={initialTotalInvested}
                entryDetails={entryDetails}
                onClose={onClose}
                currency={currency}
              />
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
