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
import { Icons } from "@/components/icons";
import { AccountType, CurrencyType } from "@/types";
import { buttonVariants } from "@/components/ui/button";
import { TransferForm } from "@/components/forms/transfer-form";

export const Transfer = ({
  currency,
  initialSelected,
  investmentsBalance,
  miscellaneousBalance,
  savingsBalance,
}: {
  currency: CurrencyType;
  initialSelected: AccountType;
  savingsBalance: number;
  investmentsBalance: number;
  miscellaneousBalance: number;
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [disabled, setDisabled] = useState(false);

  return (
    <>
      {disabled ? (
        <Button
          className={cn(
            buttonVariants({ variant: "secondary", size: "sm" }),
            "rounded-xl"
          )}
          disabled={disabled}
        >
          <Spinner color="default" size="sm" />
        </Button>
      ) : (
        <Button
          onClick={onOpen}
          className={cn(
            buttonVariants({ variant: "secondary", size: "sm" }),
            "rounded-xl"
          )}
        >
          <Icons.transfer className="h-4 w-4 cursor-pointer group-hover:text-primary transition" />
        </Button>
      )}
      <Modal
        isOpen={isOpen}
        isDismissable={!disabled}
        onOpenChange={onOpenChange}
        backdrop="blur"
        placement="center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Transfer your money
              </ModalHeader>
              <TransferForm
                onClose={onClose}
                currency={currency}
                setDisabled={setDisabled}
                initialSelected={initialSelected}
                savingsBalance={savingsBalance}
                investmentsBalance={investmentsBalance}
                miscellaneousBalance={miscellaneousBalance}
              />
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
