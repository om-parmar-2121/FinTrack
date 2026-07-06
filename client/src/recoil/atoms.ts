import { atom } from "recoil";
import type { User } from "../services/auth.service";
import type { TransactionItem } from "../components/transactions/types";
import type { DebtItem } from "../components/debts/types";

export const userState = atom<User | null>({
  key: "userState",
  default: null,
});

export const transactionsState = atom<TransactionItem[]>({
  key: "transactionsState",
  default: [],
});

export const transactionFiltersState = atom({
  key: "transactionFiltersState",
  default: {
    search: "",
    type: "all" as "all" | "income" | "expense",
    category: "all",
  },
});

export const debtsState = atom<DebtItem[]>({
  key: "debtsState",
  default: [],
});
