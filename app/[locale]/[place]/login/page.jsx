import LoginForm from "@/components/forms/LoginForm";
import { getLocale, getTranslations } from "next-intl/server";
import React from "react";

export default async function Login() {
  const [locale, register] = await Promise.all([
    getLocale(),
    getTranslations("Register"),
  ]);
  return (
    <main className="flex justify-center pt-[136px] items-start bg-register bg-cover overflow-hidden w-full min-h-[calc(100vh-96px)] md:min-h-[calc(100vh-136px)]">
      <section className="bg-primary-modal w-11/12 max-w-lg p-5 rounded-md z-100">
        <h1 className="textSmall3 text-white">{register("registeration")}</h1>
        <LoginForm />
      </section>
    </main>
  );
}
