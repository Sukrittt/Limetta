"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  useDisclosure,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import { RadioGroup, Radio } from "@nextui-org/radio";
import { useQueryClient } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { toast } from "@/hooks/use-toast";
import { ExtendedEntryType } from "@/types";
import { buttonVariants } from "@/components/ui/button";

type AccountType = "want" | "need" | "savings" | "miscellaneous";

export const DuePaid = ({
  entryDetails,
  savingBalance,
}: {
  savingBalance: number;
  entryDetails: ExtendedEntryType;
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [accountTypeSelected, setAccountTypeSelected] = useState<AccountType>(
    entryDetails.transferAccountType ?? "savings"
  );

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const dueMarkPaidEntry = trpc.dues.markAsPaid.dueMarkAsPaid.useMutation({
    onSuccess: () => {
      router.refresh();
      queryClient.resetQueries(["dues-entries"]);

      const updatedDueStatus =
        entryDetails.dueStatus === "paid" ? "pending" : "paid";

      toast({
        title: `Entry marked as ${updatedDueStatus}.`,
        description: `Your entry has been marked as ${updatedDueStatus}.`,
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Something went wrong.",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  const markText = `Mark as ${
    entryDetails.dueStatus === "paid" ? "unpaid" : "paid"
  }`;

  const handleSubmit = () => {
    const insufficientBalance = parseFloat(entryDetails.amount) > savingBalance;

    if (
      accountTypeSelected === "savings" &&
      entryDetails.dueType === "payable" &&
      insufficientBalance
    ) {
      return toast({
        title: "Insufficient balance.",
        description: "Please add funds to your savings account.",
        variant: "destructive",
      });
    }

    dueMarkPaidEntry.mutate({
      dueId: entryDetails.entryId,
      accountTransferType:
        entryDetails.dueStatus === "pending" ? accountTypeSelected : null,
      updatedDueStatus:
        entryDetails.dueStatus === "pending" ? "paid" : "pending",
    });
  };

  return (
    <>
      {dueMarkPaidEntry.isLoading ? (
        <Spinner color="default" size="sm" className="h-5 w-5" />
      ) : (
        <span
          className={cn(
            "cursor-pointer text-primary hover:opacity-90 transition py-1 px-2 lg:p-0 bg-secondary lg:bg-transparent rounded-md lg:rounded-none",
            {
              "text-warning-text": entryDetails.dueStatus === "paid",
            }
          )}
          onClick={onOpen}
        >
          {markText}
        </span>
      )}

      <Modal
        isOpen={isOpen}
        isDismissable={!dueMarkPaidEntry.isLoading}
        hideCloseButton={dueMarkPaidEntry.isLoading}
        onOpenChange={onOpenChange}
        backdrop="blur"
        placement="center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 pb-0">
                <h1>{markText}</h1>
                {entryDetails.dueStatus === "pending" && (
                  <p className="text-muted-foreground font-normal text-base">
                    {entryDetails.dueType === "payable"
                      ? "From where should this amount be deducted?"
                      : "Where should this amount be added to?"}
                  </p>
                )}
              </ModalHeader>
              <ModalBody>
                {entryDetails.dueStatus === "pending" ? (
                  <RadioGroup
                    value={accountTypeSelected}
                    onValueChange={(value) =>
                      setAccountTypeSelected(value as AccountType)
                    }
                  >
                    <Radio
                      value="savings"
                      description={
                        entryDetails.dueType === "payable"
                          ? "Deduct from my savings account."
                          : "Add to my savings account."
                      }
                    >
                      Savings
                    </Radio>
                    <Radio
                      value="miscellaneous"
                      description={
                        entryDetails.dueType === "payable"
                          ? "Deduct from my miscellaneous account."
                          : "Add to my miscellaneous account."
                      }
                    >
                      Miscellaneous
                    </Radio>
                    {entryDetails.dueType === "payable" && (
                      <>
                        <Radio
                          value="need"
                          description="Deduct from my monthly expenses as 'needs'."
                        >
                          Needs
                        </Radio>
                        <Radio
                          value="want"
                          description="Deduct from my monthly expenses as 'wants'."
                        >
                          Wants
                        </Radio>
                      </>
                    )}
                  </RadioGroup>
                ) : (
                  <p className="text-muted-foreground">
                    Are you sure you want to mark the due as pending?
                  </p>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  disabled={dueMarkPaidEntry.isLoading}
                  variant="light"
                  className={cn(
                    buttonVariants({ size: "sm", variant: "ghost" }),
                    "rounded-lg"
                  )}
                  onPress={onClose}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  disabled={dueMarkPaidEntry.isLoading}
                  className={cn(buttonVariants({ size: "sm" }), "rounded-lg")}
                  onClick={handleSubmit}
                >
                  {dueMarkPaidEntry.isLoading ? (
                    <Spinner color="default" size="sm" />
                  ) : (
                    markText
                  )}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
