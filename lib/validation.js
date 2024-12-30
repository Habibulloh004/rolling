import { z } from "zod";

export const LoginValidate = z.object({
  phone: z.string().min(13, "To'liq telefon raqamingizni kiriting"),
  password: z
    .string()
    .min(8, "8 yoki undan ortiq belgidan foydalaning")
    .max(30, "Parol ko'pi bilan 30 ta belgidan oshmasligi kerak"),
});
export const RegisterValidation = z.object({
  first_name: z.string().min(1, "Ismingizni kiriting"),
  last_name: z.string().min(1, "Familiyangizni kiriting"),
  phone: z.string().min(13, "To'liq telefon raqamingizni kiriting"),
  password: z
    .string()
    .min(8, "8 yoki undan ortiq belgidan foydalaning")
    .max(30, "Parol ko'pi bilan 30 ta belgidan oshmasligi kerak"),
});
