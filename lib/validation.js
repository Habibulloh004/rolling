import { z } from "zod";
import { useTranslations } from "next-intl";

export const UpdateRegisterValidation = () => {
  const t = useTranslations("Register");

  return z.object({
    first_name: z.string().min(1, t("first_name_v")),
    last_name: z.string().min(1, t("last_name_v")),
    phone: z.string().min(13, t("phone_v")),
    email: z.string().email(t("email_v")),
    password: z.string().min(8, t("password_v")),
  });
};

export const LoginValidation = z.object({
  first_name: z.string().min(1, "Ismingizni kiriting"),
  last_name: z.string().min(1, "Familiyangizni kiriting"),
  phone: z.string().min(13, "To'liq telefon raqamingizni kiriting"),
  password: z
    .string()
    .min(8, "8 yoki undan ortiq belgidan foydalaning")
    .max(30, "Parol ko'pi bilan 30 ta belgidan oshmasligi kerak"),
});
