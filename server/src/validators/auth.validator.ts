import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),

  email: z.string().email("Invalid email format"),

  password: z.string().min(6, "Password must be at least 6 characters"),

  monthlyBudget: z.coerce.number().optional(),

  savingGoal: z.coerce.number().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),

  password: z.string().min(6, "Password is required"),
});

export const updateMeSchema = z.object({
  monthlyBudget: z.coerce.number().min(0, "Monthly budget must be a positive number").optional(),

  savingGoal: z.coerce.number().min(0, "Saving goal must be a positive number").optional(),
});

export const verifyOtpSchema = z.object({
  email: z.string().email("Invalid email"),
  otp: z.string().length(6, "OTP must be exactly 6 characters"),
});