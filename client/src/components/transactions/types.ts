export interface TransactionItem {
  _id: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  note: string;
  date: string;
}
