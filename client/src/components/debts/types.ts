export interface DebtItem {
  _id: string;
  person: string;
  type: "borrowed" | "lent";
  amount: number;
  dueDate: string;
  note: string;
  status: "pending" | "paid" | "overdue";
}
