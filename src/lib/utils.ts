import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
