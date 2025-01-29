import LoginForm from "@/components/forms/LoginForm";
import { getLocale, getTranslations } from "next-intl/server";
import React from "react";

export const metadata = {
  title: "Вход в Rolling Sushi | Личный кабинет клиента",
  description:
    "Войдите в свой личный кабинет Rolling Sushi, чтобы отслеживать заказы, управлять бонусами и получать персональные скидки.",
  keywords:
    "вход Rolling Sushi, личный кабинет, бонусная программа, заказать суши",
  alternates: {
    canonical: "https://rolling.uz/uz/web/login",
    ru: "https://rolling.uz/ru/web/login",
    en: "https://rolling.uz/en/web/login",
  },
};

export default async function Login() {
  const [locale, login] = await Promise.all([
    getLocale(),
    getTranslations("Login"),
  ]);
  return (
    <main className="flex justify-center pt-[136px] items-start bg-register  bg-cover overflow-hidden w-full min-h-[calc(100vh-96px)] md:min-h-[calc(100vh-136px)]">
      <section className="bg-primary-modal w-11/12 max-w-lg p-5 rounded-md z-100">
        <h1 className="textSmall3 text-white">{login("title")}</h1>
        <LoginForm />
      </section>
    </main>
  );
}
