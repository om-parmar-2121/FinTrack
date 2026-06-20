import api from "../lib/api";

export interface User {
  _id: string;
  name: string;
  email: string;
  monthlyBudget: number;
  savingGoal: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user?: User;
    token?: string;
    requireVerification?: boolean;
    email?: string;
  };
}

export const authService = {
  signup: async (data: Omit<User, "_id" | "createdAt" | "updatedAt"> & { password?: string }): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/signup", data);
    return response.data;
  },

  login: async (data: Pick<User, "email"> & { password?: string }): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/login", data);
    return response.data;
  },

  auth0Login: async (data: { email: string; name: string; auth0Id: string}): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth0-login", data)
    return response.data
  },

  verifyOtp: async (data: { email: string; otp: string }): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/verify-otp", data);
    return response.data;
  },

  logout: async (): Promise<{ success: boolean; message: string }> => {
    const response = await api.post<{ success: boolean; message: string }>("/logout");
    return response.data;
  },

  getMe: async (): Promise<{ success: boolean; data: User }> => {
    const response = await api.get<{ success: boolean; data: User }>("/me");
    return response.data;
  },

  updateMe: async (data: Partial<Pick<User, "savingGoal" | "monthlyBudget">>): Promise<{ success: boolean; data: User }> => {
    const response = await api.put<{ success: boolean; data: User }>("/me", data);
    return response.data;
  },
};

export default authService;
