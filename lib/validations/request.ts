import { z } from "zod";

export const createRequestSchema = z.object({
  medicines: z.string().min(1, "داروها را وارد کنید"),
  address: z.string().min(5, "آدرس تحویل را وارد کنید"),
  paymentMethod: z.enum(["cash", "online"]).default("cash"),
  notes: z.string().optional(),
});

export type CreateRequestInput = z.infer<typeof createRequestSchema>;
