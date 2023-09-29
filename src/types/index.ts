export type ExpenseType = {
  type: "need" | "want";
  userId: string;
  id: number;
  description: string;
  createdAt: Date;
  amount: number;
  bookId: number;
  totalSpendings: number;
};

export type Calculations = {
  needsTotal: number;
  wantsTotal: number;
  totalSaved: number;
};

export type EntryType = {
  entryId: number;
  amount: number;
  description: string;
  entryType: "in" | "out";
  initialBalance: number;
};

export type ExtendedEntryType = Omit<
  EntryType,
  "entryType" | "initialBalance"
> & {
  dueStatus: "paid" | "pending";
  dueType: "payable" | "receivable";
  duePayableBalance: number;
  dueReceivableBalance: number;
  dueDate: Date;
};

export type CurrencyType = "₹" | "$" | "€" | "£";

export type AccountType = "investments" | "savings" | "miscellaneous";
