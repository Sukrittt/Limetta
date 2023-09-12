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

import { trpc } from "@/trpc/client";
import { toast } from "@/hooks/use-toast";
import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const DeleteExpense = ({
  expenseId,
  expenseType,
}: {
  expenseId: number;
  expenseType: "want" | "need";
}) => {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const deleteEntry = trpc.entries.deleteEntry.useMutation({
    onSuccess: () => {
      onOpenChange();
      router.refresh();

      toast({
        title: "Entry deleted",
        description: "The entry has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Something went wrong",
        description: error.message,
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
        Delete
      </span>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
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
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  disabled={deleteEntry.isLoading}
                  className={cn(buttonVariants(), "rounded-lg")}
                  onClick={() => deleteEntry.mutate({ expenseId, expenseType })}
                >
                  {deleteEntry.isLoading ? (
                    <>
                      <Icons.spinner className="h-4 w-4 animate-spin mr-1" />
                      Deleting
                    </>
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
