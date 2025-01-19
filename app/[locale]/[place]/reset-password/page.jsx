import ResetPasswordForm from "@/components/forms/ResetPasswordForm";
import { getTranslations } from "next-intl/server";
import React from "react";

export default async function ResetPassword() {
  const [resetPT] = await Promise.all([
    getTranslations("ResetPassword"),
  ]);
  return (
    <main className="flex justify-center pt-[136px] items-start bg-register bg-cover overflow-hidden w-full min-h-[calc(100vh-96px)] md:min-h-[calc(100vh-136px)]">
      <section className="bg-primary-modal w-11/12 max-w-lg p-5 rounded-md z-100">
        <h1 className="textSmall3 text-white">{resetPT("title")}</h1>
        <ResetPasswordForm />
      </section>
    </main>
  );
}