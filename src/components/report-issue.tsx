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
import { buttonVariants } from "@/components/ui/button";
import { ReportIssueForm } from "@/components/forms/report-form";

export const ReportIssue = () => {
  const [disabled, setDisabled] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      {disabled ? (
        <Button
          disabled={disabled}
          className={cn(
            buttonVariants({ variant: "secondary" }),
            "rounded-full m-1"
          )}
        >
          <Spinner color="default" size="sm" />
        </Button>
      ) : (
        <Button
          onPress={onOpen}
          className={cn(
            buttonVariants({ variant: "secondary" }),
            "rounded-full m-1"
          )}
        >
          Report an issue
        </Button>
      )}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={!disabled}
        hideCloseButton={disabled}
        backdrop="blur"
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 pb-0">
                Report an issue
              </ModalHeader>
              <ReportIssueForm onClose={onClose} setDisabled={setDisabled} />
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
