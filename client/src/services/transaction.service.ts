import api from "../lib/api";
import type { TransactionItem } from "../components/transactions/types";

export interface TransactionFilters {
  type?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
}

export const transactionService = {
  getTransactions: async (filters?: TransactionFilters): Promise<{ success: boolean; data: TransactionItem[] }> => {
    const response = await api.get<{ success: boolean; data: TransactionItem[] }>("/transactions", {
      params: filters,
    });
    return response.data;
  },

  addTransaction: async (data: Omit<TransactionItem, "_id">): Promise<{ success: boolean; data: TransactionItem }> => {
    const response = await api.post<{ success: boolean; data: TransactionItem }>("/transactions", data);
    return response.data;
  },

  updateTransaction: async (id: string, data: Partial<Omit<TransactionItem, "_id">>): Promise<{ success: boolean; data: TransactionItem }> => {
    const response = await api.put<{ success: boolean; data: TransactionItem }>(`/transactions/${id}`, data);
    return response.data;
  },

  deleteTransaction: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete<{ success: boolean; message: string }>(`/transactions/${id}`);
    return response.data;
  },
};

export default transactionService;
