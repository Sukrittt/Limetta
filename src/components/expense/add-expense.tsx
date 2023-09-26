"use client";
import { FC } from "react";
import axios from "axios";
import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { format } from "date-fns";
import { Spinner } from "@nextui-org/spinner";
import { useMutation } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import { CurrencyType } from "@/types";
import { toast } from "@/hooks/use-toast";
import { ExcelDataType } from "@/lib/validators";
import { Calculations, ExpenseType } from "@/types";
import { buttonVariants } from "@/components/ui/button";
import { AddExpenseForm } from "@/components/forms/add-expense-form";

interface AddExpenseProps {
  currency: CurrencyType;
  expenses: ExpenseType[];
  calculations: Calculations;
}

export const AddExpense: FC<AddExpenseProps> = ({
  expenses,
  calculations,
  currency,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { mutate: downloadEntries, isLoading } = useMutation({
    mutationFn: async () => {
      const excelData: ExcelDataType = {
        data: expenses.map((expense) => ({
          date: format(expense.createdAt, "dd-MM-yyyy"),
          details: expense.description,
          needs: expense.type === "need" ? expense.amount.toString() : "",
          wants: expense.type === "want" ? expense.amount.toString() : "",
        })),
        calculations: {
          needsTotal: calculations.needsTotal,
          wantsTotal: calculations.wantsTotal,
          totalSaved: calculations.totalSaved,
        },
      };

      const response = await axios.post("/api/excel", excelData, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const fileName = `${format(new Date(), "MMMM_yyyy")}.xlsx`;

      createDownloadUrl(blob, fileName);
    },
    onSuccess: () => {
      toast({
        title: "Downloaded",
        description: "Expense Sheet has been downloaded successfully.",
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

  const createDownloadUrl = (blob: Blob, fileName: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = fileName;
    a.target = "_blank";

    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <Button
        onClick={() => downloadEntries()}
        disabled={isLoading}
        color="primary"
        className={cn(
          buttonVariants({ size: "sm", variant: "secondary" }),
          "rounded-lg tracking-tighter mr-2"
        )}
      >
        {isLoading ? <Spinner color="default" size="sm" /> : "Download"}
      </Button>
      <Button
        onPress={onOpen}
        color="primary"
        className={cn(
          buttonVariants({ size: "sm" }),
          "rounded-lg tracking-tighter"
        )}
      >
        Add Entry
      </Button>
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
                Add expense
              </ModalHeader>
              <AddExpenseForm onClose={onClose} currency={currency} />
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
