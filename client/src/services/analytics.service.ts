import api from "../lib/api";

export interface SummaryData {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface CategoryData {
  category: string;
  amount: number;
}

export interface InsightsData {
  highestExpense: {
    _id: string;
    type: string;
    amount: number;
    category: string;
    note?: string;
    date: string;
  } | null;
  monthlyExpense: number;
  weeklyExpense: number;
}

export interface AlertData {
  type: "monthly" | "weekly";
  message: string;
}

export interface MonthlyTrendData {
  month: string;
  income: number;
  expense: number;
}

export const analyticsService = {
  getSummary: async (): Promise<{ success: boolean; data: SummaryData }> => {
    const response = await api.get<{ success: boolean; data: SummaryData }>("/analytics/summary");
    return response.data;
  },

  getCategories: async (): Promise<{ success: boolean; data: CategoryData[] }> => {
    const response = await api.get<{ success: boolean; data: CategoryData[] }>("/analytics/categories");
    return response.data;
  },

  getInsights: async (): Promise<{ success: boolean; data: InsightsData }> => {
    const response = await api.get<{ success: boolean; data: InsightsData }>("/analytics/insights");
    return response.data;
  },

  getAlerts: async (): Promise<{ success: boolean; data: AlertData[] }> => {
    const response = await api.get<{ success: boolean; data: AlertData[] }>("/analytics/alerts");
    return response.data;
  },

  getMonthlyData: async (year: number): Promise<{ success: boolean; data: MonthlyTrendData[] }> => {
    const response = await api.get<{ success: boolean; data: MonthlyTrendData[] }>("/analytics/monthly", {
      params: { year },
    });
    return response.data;
  },
};

export default analyticsService;
