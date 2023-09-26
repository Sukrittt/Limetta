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

export type CurrencyType = "₹" | "$" | "€" | "£";

export type AccountType = "investments" | "savings" | "miscellaneous";
