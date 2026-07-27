export interface DebtPayment {
  _id: string;
  amount: number;
  note?: string;
  date: string;
}

export interface DebtItem {
  _id: string;
  person: string;
  type: "borrowed" | "lent";
  amount: number;
  paidAmount: number;
  dueDate: string;
  note: string;
  status: "pending" | "partial" | "paid" | "overdue";
  payments: DebtPayment[];
}
