"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  useDisclosure,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import { useQueryClient } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { toast } from "@/hooks/use-toast";
import { ExtendedEntryType } from "@/types";
import { buttonVariants } from "@/components/ui/button";

export const DuePaid = ({
  entryDetails,
}: {
  entryDetails: ExtendedEntryType;
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const dueMarkPaidEntry = trpc.dues.dueMarkPaid.useMutation({
    onSuccess: () => {
      router.refresh();
      queryClient.resetQueries(["dues-entries"]);

      toast({
        title: "Entry marked as paid.",
        description: "Your entry has been marked as paid.",
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

  return (
    <>
      <span
        className="cursor-pointer hover:text-primary hover:opacity-90 transition"
        onClick={onOpen}
      >
        {entryDetails.dueStatus === "pending"
          ? "Mark as Paid"
          : "Mark as Unpaid"}
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
                Are you absolutely sure?
              </ModalHeader>
              <ModalBody>
                <p className="text-muted-foreground">
                  This will mark this entry as{" "}
                  {entryDetails.dueStatus === "pending" ? "paid" : "unpaid"}.
                  You can undo this action later.
                </p>
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
                      updatedDueStatus:
                        entryDetails.dueStatus === "pending"
                          ? "paid"
                          : "pending",
                    })
                  }
                >
                  {dueMarkPaidEntry.isLoading ? (
                    <Spinner color="default" size="sm" />
                  ) : entryDetails.dueStatus === "pending" ? (
                    "Mark as Paid"
                  ) : (
                    "Mark as Unpaid"
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
