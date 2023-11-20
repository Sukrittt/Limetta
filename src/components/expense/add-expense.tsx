"use client";
import { FC, useState } from "react";
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

import { CurrencyType } from "@/types";
import { toast } from "@/hooks/use-toast";
import ToolTip from "@/components/ui/tool-tip";
import { ExcelDataType } from "@/lib/validators";
import { cn, createDownloadUrl } from "@/lib/utils";
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
  const [disabled, setDisabled] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { mutate: downloadEntries, isLoading } = useMutation({
    mutationFn: async () => {
      const excelData: ExcelDataType = {
        data: expenses.reverse().map((expense) => ({
          date: format(expense.createdAt, "dd-MM-yyyy"),
          details: expense.description,
          needs: expense.type === "need" ? expense.amount.toString() : "",
          wants: expense.type === "want" ? expense.amount.toString() : "",
        })),
        calculations: {
          needsTotal: calculations.needsTotal,
          wantsTotal: calculations.wantsTotal,
          totalSaved: calculations.totalSaved,
          monthIncome: calculations.monthIncome,
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

  return (
    <>
      <ToolTip text="Export excel" showArrow disableForMobile={false}>
        <Button
          onClick={() => downloadEntries()}
          disabled={isLoading}
          color="primary"
          className={cn(
            buttonVariants({ size: "sm", variant: "secondary" }),
            "rounded-lg tracking-tighter mr-2"
          )}
        >
          {isLoading ? <Spinner color="default" size="sm" /> : "Export"}
        </Button>
      </ToolTip>
      {disabled ? (
        <Button
          disabled={disabled}
          className={cn(buttonVariants({ size: "sm" }), "rounded-xl")}
        >
          <Spinner color="default" size="sm" />
        </Button>
      ) : (
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
      )}

      <Modal
        isOpen={isOpen}
        isDismissable={!disabled}
        hideCloseButton={disabled}
        onOpenChange={onOpenChange}
        backdrop="blur"
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add expense
              </ModalHeader>
              <AddExpenseForm
                onClose={onClose}
                currency={currency}
                setDisabled={setDisabled}
              />
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
