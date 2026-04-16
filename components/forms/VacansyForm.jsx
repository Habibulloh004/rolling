"use client";

import React, { useState } from "react";
import { Form } from "../ui/form";
import CustomFormField, { FormFieldType } from "../shared/customFormField";
import SubmitButton from "../shared/submitButton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { UpdateVacansyValidation } from "@/lib/validation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";

export default function VacansyForm() {
  const ReviewValidation = UpdateVacansyValidation();
  const allT = useTranslations("All");
  const formT = useTranslations("Form");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(ReviewValidation),
    defaultValues: {
      fullName: "",
      phone: "",
      profession: "",
      self: "",
    },
  });

  const onSubmit = async (values) => {
    setIsLoading(true);
    const vacancyMessage = `
📋 Новый запрос на вакансию:
👤 Полное имя: ${values.fullName}
📞 Телефон: ${values.phone}
💼 Профессия: ${values.profession}
📝 Сам о себе: ${values.self}
`.trim();

    await fetch(
      `https://api.telegram.org/bot7051935328:AAFJxJAVsRTPxgj3rrHWty1pEUlMkBgg9_o/sendMessage?chat_id=-1002349869199&text=${encodeURIComponent(
        vacancyMessage
      )}`
    );

    form.reset();
    setIsLoading(false);
    return null;
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-[500px] space-y-5 sm:space-y-4 w-ful rounded-md"
      >
        <div className="w-full flex flex-col gap-3">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="fullName"
            placeholder=""
            label={formT("fullName")}
            inputClass="rounded-md text-black border-[1px]"
            labelClass="text-muted"
          />
          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="phone"
            placeholder=""
            label={formT("phone")}
            inputClass="rounded-md text-black border-1 gray"
            labelClass="text-muted"
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="profession"
            placeholder=""
            label={formT("profession")}
            inputClass="rounded-md text-black border-[1px]"
            labelClass="text-muted"
          />
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="self"
            label={formT("self")}
            placeholder=""
            inputClass="rounded-md text-black border-[1px]"
            labelClass="text-muted"
          />
        </div>
        <div className="flex w-full max-sm:flex-col items-center sm:justify-center gap-3 sm:items-center">
          <SubmitButton
            isLoading={isLoading}
            className="w-full sm:w-40 bg-muted text-white"
          >
            {allT("send")}
          </SubmitButton>
          <Button
          aria-label={`vacancy cancel`}
            variant="outline"
            type={"button"}
            onClick={() => {
              form.reset();
            }}
            className="text-muted w-full sm:w-40"
          >
            {allT("cancel")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
