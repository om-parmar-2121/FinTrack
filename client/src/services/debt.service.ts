import api from "../lib/api";
import type { DebtItem } from "../components/debts/types";

export interface DebtFilters {
  type?: string;
  status?: string;
  due?: string;
}

export const debtService = {
  getDebts: async (filters?: DebtFilters): Promise<{ success: boolean; data: DebtItem[] }> => {
    // If the filter status is overdue, pass it as 'due: "overdue"' and omit status
    const params: DebtFilters = { ...filters };
    if (params.status === "overdue") {
      params.due = "overdue";
      delete params.status;
    }

    const response = await api.get<{ success: boolean; data: any[] }>("/debts", {
      params,
    });

    // Map backend array to match client-side DebtItem
    const mappedData = (response.data.data || []).map((item: any): DebtItem => {
      const isOverdue = item.status === "pending" && new Date(item.deadline) < new Date();
      return {
        _id: item._id,
        person: item.personName,
        type: item.type,
        amount: item.amount,
        dueDate: item.deadline,
        note: item.note || "",
        status: isOverdue ? "overdue" : item.status,
      };
    });

    return {
      success: response.data.success,
      data: mappedData,
    };
  },

  addDebt: async (data: Omit<DebtItem, "_id" | "status">): Promise<{ success: boolean; data: DebtItem }> => {
    // Map frontend fields to backend schema (person -> personName, dueDate -> deadline)
    const payload = {
      personName: data.person,
      type: data.type,
      amount: data.amount,
      deadline: data.dueDate,
      note: data.note,
    };

    const response = await api.post<{ success: boolean; data: any }>("/debts", payload);
    const item = response.data.data;
    
    // Map the returned item back to DebtItem format
    const isOverdue = item.status === "pending" && new Date(item.deadline) < new Date();
    const mappedDebt: DebtItem = {
      _id: item._id,
      person: item.personName,
      type: item.type,
      amount: item.amount,
      dueDate: item.deadline,
      note: item.note || "",
      status: isOverdue ? "overdue" : item.status,
    };

    return {
      success: response.data.success,
      data: mappedDebt,
    };
  },

  markAsPaid: async (id: string): Promise<{ success: boolean; data: DebtItem }> => {
    const response = await api.patch<{ success: boolean; data: any }>(`/debts/${id}/pay`);
    const item = response.data.data;

    const mappedDebt: DebtItem = {
      _id: item._id,
      person: item.personName,
      type: item.type,
      amount: item.amount,
      dueDate: item.deadline,
      note: item.note || "",
      status: item.status,
    };

    return {
      success: response.data.success,
      data: mappedDebt,
    };
  },

  deleteDebt: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete<{ success: boolean; message: string }>(`/debts/${id}`);
    return response.data;
  },
};

export default debtService;
