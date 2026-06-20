import { z } from "zod";

export const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),

  amount: z.coerce.number().positive("Amount must be positive"),

  category: z.enum(["food", "travel", "bills", "shopping", "other", "salary"]).optional(),

  note: z.string().optional(),

  date: z.coerce.date()
}).refine((data) => data.type === "income" || !!data.category, {
  message: "Category is required for expenses",
  path: ["category"],
});