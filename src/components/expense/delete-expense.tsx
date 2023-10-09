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

import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { toast } from "@/hooks/use-toast";
import { buttonVariants } from "@/components/ui/button";

export const DeleteExpense = ({
  expenseId,
  expenseType,
}: {
  expenseId: number;
  expenseType: "want" | "need";
}) => {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const deleteEntry = trpc.entries.deleteEntry.useMutation({
    onSuccess: () => {
      onClose();
      router.refresh();

      toast({
        title: "Expense deleted",
        description: "Your expense has been deleted successfully.",
      });
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
      {deleteEntry.isLoading ? (
        <Spinner color="default" size="sm" className="h-5 w-5" />
      ) : (
        <span
          className="cursor-pointer text-danger-text hover:opacity-90 transition"
          onClick={onOpen}
        >
          Delete
        </span>
      )}
      <Modal
        isOpen={isOpen}
        isDismissable={!deleteEntry.isLoading}
        hideCloseButton={deleteEntry.isLoading}
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
                  This action cannot be undone. This will permanently delete
                  this entry from this month&rsquo;s expenses.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  disabled={deleteEntry.isLoading}
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
                  disabled={deleteEntry.isLoading}
                  className={cn(buttonVariants({ size: "sm" }), "rounded-lg")}
                  onClick={() =>
                    deleteEntry.mutate({
                      expenseId,
                      expenseType,
                    })
                  }
                >
                  {deleteEntry.isLoading ? (
                    <Spinner color="default" size="sm" />
                  ) : (
                    "Delete"
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
