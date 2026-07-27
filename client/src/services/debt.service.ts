import api from "../lib/api";
import type { DebtItem } from "../components/debts/types";

export interface DebtFilters {
  type?: string;
  status?: string;
  due?: string;
}

const mapDebtItem = (item: any): DebtItem => {
  const isOverdue = item.status === "pending" && new Date(item.deadline) < new Date();
  return {
    _id: item._id,
    person: item.personName,
    type: item.type,
    amount: item.amount,
    paidAmount: item.paidAmount ?? 0,
    dueDate: item.deadline,
    note: item.note || "",
    status: isOverdue ? "overdue" : item.status,
    payments: (item.payments || []).map((p: any) => ({
      _id: p._id,
      amount: p.amount,
      note: p.note || "",
      date: p.date,
    })),
  };
};

export const debtService = {
  getDebts: async (filters?: DebtFilters): Promise<{ success: boolean; data: DebtItem[] }> => {
    const params: DebtFilters = { ...filters };
    if (params.status === "overdue") {
      params.due = "overdue";
      delete params.status;
    }

    const response = await api.get<{ success: boolean; data: any[] }>("/debts", { params });
    const mappedData = (response.data.data || []).map(mapDebtItem);

    return {
      success: response.data.success,
      data: mappedData,
    };
  },

  addDebt: async (data: Omit<DebtItem, "_id" | "status" | "paidAmount" | "payments">): Promise<{ success: boolean; data: DebtItem }> => {
    const payload = {
      personName: data.person,
      type: data.type,
      amount: data.amount,
      deadline: data.dueDate,
      note: data.note,
    };

    const response = await api.post<{ success: boolean; data: any }>("/debts", payload);
    return {
      success: response.data.success,
      data: mapDebtItem(response.data.data),
    };
  },

  logPayment: async (id: string, amount: number, note?: string): Promise<{ success: boolean; data: DebtItem }> => {
    const response = await api.post<{ success: boolean; data: any }>(`/debts/${id}/payments`, {
      amount,
      note: note || "",
    });
    return {
      success: response.data.success,
      data: mapDebtItem(response.data.data),
    };
  },

  markAsPaid: async (id: string): Promise<{ success: boolean; data: DebtItem }> => {
    const response = await api.patch<{ success: boolean; data: any }>(`/debts/${id}/pay`);
    return {
      success: response.data.success,
      data: mapDebtItem(response.data.data),
    };
  },

  deleteDebt: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete<{ success: boolean; message: string }>(`/debts/${id}`);
    return response.data;
  },
};

export default debtService;
