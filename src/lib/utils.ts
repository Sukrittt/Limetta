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
