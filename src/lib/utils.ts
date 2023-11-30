import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { AccountType } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getUpdatedBalance = (
  initialBalance: number,
  existingAmount: number,
  updatedAmount: number,
  updatedEntryType: "in" | "out",
  existingEntryType: "in" | "out"
) => {
  if (updatedEntryType === existingEntryType) {
    if (updatedEntryType === "in") {
      return initialBalance - existingAmount + updatedAmount;
    }
    return initialBalance + existingAmount - updatedAmount;
  } else {
    if (existingEntryType === "in") {
      return initialBalance - existingAmount - updatedAmount;
    }

    return initialBalance + existingAmount + updatedAmount;
  }
};

export const getInitialToAccount = (fromAccount: AccountType): AccountType => {
  if (fromAccount === "savings") return "investments";
  if (fromAccount === "investments") return "savings";

  return "savings";
};

export const createDownloadUrl = (blob: Blob, fileName: string) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = fileName;
  a.target = "_blank";

  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
};

export const getMaxSpendLimitForSavingAmount = (
  balance: number,
  entryAmount: number,
  initialEntryType: "payable" | "receivable"
) => {
  if (initialEntryType === "payable") {
    return balance + entryAmount;
  }

  return balance - entryAmount;
};

export const getTimeLeftInMonth = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  const lastDayOfMonth = new Date(currentYear, currentMonth, 0);
  const daysLeft = lastDayOfMonth.getDate() - currentDate.getDate();

  if (daysLeft === 0) {
    const hoursLeft = 23 - currentDate.getHours();
    if (hoursLeft === 0) {
      const minutesLeft = 59 - currentDate.getMinutes();
      return `${minutesLeft} minutes left`;
    }
    return `${hoursLeft} hours left`;
  }else if(daysLeft === 1){
     return `${daysLeft} day left`;
  }

  return `${daysLeft} days left`;
};
