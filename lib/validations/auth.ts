import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().email("ایمیل معتبر نیست"),
  password: z.string().min(6, "رمز عبور حداقل ۶ کاراکتر"),
  name: z.string().min(2, "نام حداقل ۲ کاراکتر"),
  phone: z.string().min(10, "شماره تلفن معتبر نیست"),
  role: z.enum(["patient", "delivery"]),
});

export const signInSchema = z.object({
  email: z.string().email("ایمیل معتبر نیست"),
  password: z.string().min(1, "رمز عبور را وارد کنید"),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
