import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Full name required"),
  phone: z.string().min(10, "Valid phone required"),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  plz: z.string().optional(),
  street: z.string().optional(),
  houseNumber: z.string().optional(),
  healthSummary: z.string().optional(),
  age: z.string().optional(),
  allergies: z.string().optional(),
  chronicDiseases: z.string().optional(),
  currentMeds: z.string().optional(),
});

export type ProfileInput = z.infer<typeof profileSchema>;
