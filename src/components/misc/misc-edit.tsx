"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
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
              <MiscEditForm
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
