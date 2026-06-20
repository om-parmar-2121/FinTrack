import { z } from "zod";

export const monthlySchema = z.object({
  year: z.coerce.number().min(2000).max(2100),
});

export const dateRangeSchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date()
});