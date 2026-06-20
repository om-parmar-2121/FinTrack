import { z } from "zod";

export const debtSchema = z.object({
  type: z.enum(["borrowed", "lent"]),
  personName: z.string().min(1, "Person name is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  note: z.string().optional(),
  deadline: z.coerce.date()
});