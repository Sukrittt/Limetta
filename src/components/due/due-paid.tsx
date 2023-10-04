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

type AccountType = "want" | "need" | "saving" | "miscellaneous";

export const DuePaid = ({
  entryDetails,
  miscBalance,
}: {
  miscBalance: number;
  entryDetails: ExtendedEntryType;
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [accountTypeSelected, setAccountTypeSelected] =
    useState<AccountType>("saving");

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const dueMarkPaidEntry = trpc.dues.dueMarkPaid.useMutation({
    onSuccess: () => {
      router.refresh();
      queryClient.resetQueries(["dues-entries"]);

      toast({
        title: `Entry marked as ${entryDetails.dueStatus}.`,
        description: `Your entry has been marked as ${entryDetails.dueStatus}.`,
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

  const calculatedDueBalance =
    entryDetails.dueType === "payable"
      ? entryDetails.duePayableBalance
      : entryDetails.dueReceivableBalance;

  const markText =
    entryDetails.dueStatus === "pending" ? "Mark as Paid" : "Mark as Pending";

  return (
    <>
      <span
        className="cursor-pointer hover:text-primary hover:opacity-90 transition"
        onClick={onOpen}
      >
        {markText}
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
              <ModalHeader className="flex flex-col gap-1 pb-0">
                <h1>{markText}</h1>
                <p className="text-muted-foreground font-normal text-base">
                  {entryDetails.dueType === "payable"
                    ? "From where should this amount be deducted?"
                    : "Where should this amount be added to?"}
                </p>
              </ModalHeader>
              <ModalBody>
                <RadioGroup
                  value={accountTypeSelected}
                  onValueChange={(value) =>
                    setAccountTypeSelected(value as AccountType)
                  }
                >
                  {entryDetails.dueType === "payable" && (
                    <>
                      <Radio value="need" description="It's a necessity.">
                        Needs
                      </Radio>
                      <Radio value="want" description="It's a luxury.">
                        Wants
                      </Radio>
                    </>
                  )}
                  <Radio
                    value="saving"
                    description={
                      entryDetails.dueType === "payable"
                        ? "Deduct from my savings."
                        : "Add to my savings."
                    }
                  >
                    Savings
                  </Radio>
                  <Radio
                    value="miscellaneous"
                    description={
                      entryDetails.dueType === "payable"
                        ? "Deduct from my miscellaneous."
                        : "Add to my miscellaneous."
                    }
                  >
                    Miscellaneous
                  </Radio>
                </RadioGroup>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
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
                  onClick={() =>
                    dueMarkPaidEntry.mutate({
                      dueId: entryDetails.entryId,
                      initialDueBalance: calculatedDueBalance,
                      miscBalance,
                      updatedDueStatus:
                        entryDetails.dueStatus === "pending"
                          ? "paid"
                          : "pending",
                    })
                  }
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
