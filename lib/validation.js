import { z } from "zod";
import { useTranslations } from "next-intl";

export const UpdateRegisterValidation = () => {
  const t = useTranslations("Register.Validation");

  return z.object({
    first_name: z.string().min(1, { message: t("first_name") }), // Ensure the key exists
    last_name: z.string().min(1, { message: t("last_name") }),
    phone: z.string().min(13, { message: t("phone") }),
    email: z.string().email({ message: t("email") }),
    password: z.string().min(8, { message: t("password") }),
    birthday: z.any(),
    gender: z.any(),
    privacy_policy: z.boolean(),
  });
};
export const UpdateLoginValidation = () => {
  const t = useTranslations("Register.Validation");

  return z.object({
    phone: z.string().min(13, { message: t("phone") }),
    password: z.string().min(8, { message: t("password") }),
  });
};
export const UpdateResetPasswordValidation = () => {
  const t = useTranslations("Register.Validation");

  return z.object({
    phone: z.string().min(13, { message: t("phone") }),
    new_password: z.string().min(8, { message: t("password") }),
    confirm_password: z.string().min(8, { message: t("password") }),
  });
};
