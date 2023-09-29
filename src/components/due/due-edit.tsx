"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { CurrencyType, ExtendedEntryType } from "@/types";
import { DueEditForm } from "@/components/forms/due-edit-form";

export const DueEditEntry = ({
  entryDetails,
  currency,
}: {
  entryDetails: ExtendedEntryType;
  currency: CurrencyType;
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <span
        className="cursor-pointer hover:text-primary hover:opacity-90 transition"
        onClick={() => onOpen()}
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
              <DueEditForm
                onClose={onClose}
                currency={currency}
                entry={entryDetails}
              />
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
