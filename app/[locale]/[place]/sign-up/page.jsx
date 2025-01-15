import RegisterForm from "@/components/forms/RegisterForm";
import CustomImage from "@/components/shared/customImage";
import { getLocale, getTranslations } from "next-intl/server";
import React from "react";

export default async function SignUp() {
  const [locale, register] = await Promise.all([
    getLocale(),
    getTranslations("Register"),
  ]);
  return (
    <main className="flex justify-center items-start bg-register bg-cover overflow-hidden w-full min-h-[calc(100vh-96px)] md:min-h-[calc(100vh-136px)]">
      <section className="w-11/12 my-5 bg-primary-modal max-w-11/12 sm:max-w-xl p-5 rounded-md space-y-3 z-100">
        <h1 className="textSmall3 text-white">{register("registeration")}</h1>
        <RegisterForm />
      </section>
    </main>
  );
}
