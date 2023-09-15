export type ExpenseType = {
  type: "need" | "want";
  userId: string;
  id: number;
  description: string;
  createdAt: Date;
  amount: number;
  bookId: number;
};

export type Calculations = {
  needsTotal: number;
  wantsTotal: number;
  totalSaved: number;
};
