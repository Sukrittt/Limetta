"use client";
import { useState } from "react";
import { Textarea } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Spinner } from "@nextui-org/spinner";
import { ModalBody, ModalFooter } from "@nextui-org/modal";

import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { toast } from "@/hooks/use-toast";
import { Button } from "@nextui-org/button";
import { buttonVariants } from "@/components/ui/button";

export const ReportIssueForm = ({
  onClose,
  setDisabled,
}: {
  onClose: () => void;
  setDisabled: (disabled: boolean) => void;
}) => {
  const router = useRouter();
  const [description, setDescription] = useState("");

  const createIssue = trpc.reports.createIssue.useMutation({
    onSuccess: () => {
      onClose();
      setDisabled(false);
      router.refresh();

      toast({
        title: "Issue reported.",
        description: "We will get back to you soon.",
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

  const handleSubmit = () => {
    setDisabled(true);

    createIssue.mutate({
      description,
    });
  };

  return (
    <>
      <ModalBody>
        <form className="grid w-full max-w-xl gap-5">
          <Textarea
            autoFocus
            placeholder="Eg: There is a bug."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
          />
        </form>
      </ModalBody>
      <ModalFooter>
        <Button
          color="danger"
          disabled={createIssue.isLoading}
          className={cn(
            buttonVariants({ size: "sm", variant: "ghost" }),
            "rounded-lg"
          )}
          variant="light"
          onPress={onClose}
        >
          Close
        </Button>
        <Button
          color="primary"
          className={cn(buttonVariants({ size: "sm" }), "rounded-lg")}
          onClick={handleSubmit}
          disabled={createIssue.isLoading}
        >
          {createIssue.isLoading ? (
            <Spinner color="default" size="sm" />
          ) : (
            "Submit"
          )}
        </Button>
      </ModalFooter>
    </>
  );
};
