export type ExpenseType = {
  type: "need" | "want";
  userId: string;
  id: number;
  description: string;
  createdAt: Date;
  amount: number;
  bookId: number;
  dueType?: "payable" | null;
};

export type Calculations = {
  needsTotal: number;
  wantsTotal: number;
  totalSaved: number;
  monthIncome: number;
};

export type EntryType = {
  entryId: number;
  amount: string;
  description: string;
  entryType: "in" | "out";
  initialBalance?: number;
  createdAt: Date;
};

export type ExtendedEntryType = Omit<
  EntryType,
  "entryType" | "initialBalance"
> & {
  dueDate: Date;
  dueStatus: "paid" | "pending";
  dueType: "payable" | "receivable";
  transferAccountType?: "want" | "need" | "savings" | "miscellaneous" | null;
};

export type CurrencyType = "₹" | "$" | "€" | "£";

export type AccountType = "investments" | "savings" | "miscellaneous";
