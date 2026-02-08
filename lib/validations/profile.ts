import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "نام حداقل ۲ کاراکتر"),
  phone: z.string().min(10, "شماره تلفن معتبر نیست"),
  address: z.string().optional(),
  healthSummary: z.string().optional(),
  age: z.string().optional(),
  allergies: z.string().optional(),
  chronicDiseases: z.string().optional(),
  currentMeds: z.string().optional(),
});

export type ProfileInput = z.infer<typeof profileSchema>;
