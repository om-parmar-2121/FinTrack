import { selector } from "recoil";
import { userState, transactionsState, transactionFiltersState, debtsState } from "./atoms";
import type { TransactionItem } from "../components/transactions/types";
import type { DebtItem } from "../components/debts/types";

// USER SELECTORS

export const isAuthenticatedState = selector<boolean>({
  key: "isAuthenticatedState",
  get: ({ get }) => get(userState) !== null
});

export const userFinancialGoalsState = selector({
  key: "userFinancialGoalsState",
  get: ({ get }) => {
    const user = get(userState);
    return {
      startingBalance: user?.startingBalance ?? 0,
      savingGoal: user?.savingGoal ?? 0,
    };
  }
});

// TRANSACTION SELECTORS

export const transactionsSummarySelector = selector({
  key: "transactionsSummarySelector",
  get: ({ get }) => {
    const txs = get(transactionsState);
    const user = get(userState);
    const startingBalance = user?.startingBalance ?? 0;
    let loggedIncome = 0;
    let loggedExpense = 0;
    for (const t of txs) {
      if (t.type === "income") {
        loggedIncome += t.amount;
      } else {
        loggedExpense += t.amount;
      }
    }
    return {
      totalIncome: startingBalance + loggedIncome,
      totalExpense: loggedExpense,
      balance: (startingBalance + loggedIncome) - loggedExpense
    };
  }
});

export const recentTransactionsSelector = selector<TransactionItem[]>({
  key: "recentTransactionsSelector",
  get: ({ get }) => {
    const txs = get(transactionsState);
    return [...txs]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 6);
  }
});

export const transactionsByCategorySelector = selector<{ category: string; amount: number }[]>({
  key: "transactionsByCategorySelector",
  get: ({ get }) => {
    const txs = get(transactionsState);
    const map = new Map<string, number>();
    for (const t of txs) {
      if (t.type === "expense") {
        map.set(t.category, (map.get(t.category) ?? 0) + t.amount);
      }
    }
    return Array.from(map.entries())
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  }
});

export const filteredTransactionsSelector = selector<TransactionItem[]>({
  key: "filteredTransactionsSelector",
  get: ({ get }) => {
    const txs = get(transactionsState);
    const { search, type, category } = get(transactionFiltersState);
    return txs.filter((t) => {
      if (type !== "all" && t.type !== type) return false;
      if (category !== "all" && t.category !== category) return false;
      if (search.trim()) {
        const term = search.toLowerCase();
        return t.note?.toLowerCase().includes(term) || t.category?.toLowerCase().includes(term);
      }
      return true;
    });
  }
});

// OFFLINE INSIGHT SELECTORS

export const highestExpenseSelector = selector({
  key: "highestExpenseSelector",
  get: ({ get }) => {
    const txs = get(transactionsState);
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const expenses = txs.filter((t) => t.type === "expense" && new Date(t.date) >= startOfMonth);
    if (expenses.length === 0) return null;
    return [...expenses].sort((a, b) => b.amount - a.amount)[0];
  }
});

export const monthlyExpenseSelector = selector<number>({
  key: "monthlyExpenseSelector",
  get: ({ get }) => {
    const txs = get(transactionsState);
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return txs
      .filter((t) => t.type === "expense" && new Date(t.date) >= startOfMonth)
      .reduce((sum, t) => sum + t.amount, 0);
  }
});

export const weeklyExpenseSelector = selector<number>({
  key: "weeklyExpenseSelector",
  get: ({ get }) => {
    const txs = get(transactionsState);
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), diff);
    startOfWeek.setHours(0, 0, 0, 0);
    return txs
      .filter((t) => t.type === "expense" && new Date(t.date) >= startOfWeek)
      .reduce((sum, t) => sum + t.amount, 0);
  }
});

// OFFLINE ANALYTICS SELECTORS

export const monthlyAnalyticsSelector = selector({
  key: "monthlyAnalyticsSelector",
  get: ({ get }) => {
    const txs = get(transactionsState);
    const currentYear = new Date().getFullYear();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const data = months.map((month) => ({ month, income: 0, expense: 0 }));

    for (const t of txs) {
      const d = new Date(t.date);
      if (d.getFullYear() === currentYear) {
        const monthIndex = d.getMonth();
        if (t.type === "income") {
          data[monthIndex].income += t.amount;
        } else {
          data[monthIndex].expense += t.amount;
        }
      }
    }
    return data;
  }
});

export const weeklySpendAnalyticsSelector = selector({
  key: "weeklySpendAnalyticsSelector",
  get: ({ get }) => {
    const txs = get(transactionsState);
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const dailySums = daysOfWeek.map((day) => ({ day, amount: 0 }));

    for (const t of txs) {
      if (t.type === "expense") {
        const tDate = new Date(t.date);
        if (tDate >= startOfWeek && tDate <= endOfWeek) {
          let wDay = tDate.getDay() - 1; // 0 for Sun -> -1, 1 for Mon -> 0
          if (wDay === -1) wDay = 6;
          if (wDay >= 0 && wDay < 7) {
            dailySums[wDay].amount += t.amount;
          }
        }
      }
    }
    return dailySums;
  }
});

// DEBT SELECTORS

export const debtSummarySelector = selector({
  key: "debtSummarySelector",
  get: ({ get }) => {
    const debts = get(debtsState);
    const totalLent = debts
      .filter((d) => d.type === "lent" && d.status !== "paid")
      .reduce((s, d) => s + d.amount, 0);
    const totalBorrowed = debts
      .filter((d) => d.type === "borrowed" && (d.status === "pending" || d.status === "overdue"))
      .reduce((s, d) => s + d.amount, 0);
    const pendingCount = debts.filter((d) => d.status === "pending" || d.status === "overdue").length;
    return { totalLent, totalBorrowed, pendingCount };
  }
});

export const pendingDebtsSelector = selector<DebtItem[]>({
  key: "pendingDebtsSelector",
  get: ({ get }) => get(debtsState).filter((d) => d.status === "pending" || d.status === "overdue"),
});

// ALERTS SELECTOR

export const budgetAlertsSelector = selector<string[]>({
  key: "budgetAlertsSelector",
  get: ({ get }) => {
    const summary = get(transactionsSummarySelector);
    const alerts: string[] = [];

    if (summary.balance < 0) {
      alerts.push("Your account balance is negative!");
    }
    return alerts;
  }
});
