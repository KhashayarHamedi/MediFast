import { z } from "zod";

export const signUpSchema = z
  .object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password at least 6 characters"),
    name: z.string().min(2, "Full name required"),
    phone: z.string().min(10, "Valid phone required"),
    role: z.enum(["patient", "delivery"]),
    plz: z.string().optional(),
    street: z.string().optional(),
    houseNumber: z.string().optional(),
    dateOfBirth: z.string().optional(),
    idDocumentUrl: z.string().optional(),
    vehicleType: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.role === "patient") {
        return (
          data.plz &&
          data.plz.trim().length >= 4 &&
          data.street &&
          data.street.trim().length >= 2 &&
          data.houseNumber &&
          data.houseNumber.trim().length >= 1
        );
      }
      return true;
    },
    { message: "PLZ, street and house number required for patients", path: ["plz"] }
  )
  .refine(
    (data) => {
      if (data.role === "delivery") {
        return (
          data.dateOfBirth &&
          data.idDocumentUrl &&
          data.vehicleType &&
          data.vehicleType.trim().length >= 1
        );
      }
      return true;
    },
    { message: "Date of birth, ID document and vehicle type required for couriers", path: ["dateOfBirth"] }
  );

export const signInSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password required"),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
