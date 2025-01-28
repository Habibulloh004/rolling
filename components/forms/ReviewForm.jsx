"use client";

import React, { useState } from "react";
import { Form } from "../ui/form";
import CustomFormField, { FormFieldType } from "../shared/customFormField";
import SubmitButton from "../shared/submitButton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { UpdateReviewValidation } from "@/lib/validation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { Rating } from "react-simple-star-rating";
import axios from "axios";
import Cookies from "js-cookie";
import { useToast } from "@/hooks/use-toast";

export default function ReviewForm() {
  const { toast } = useToast()
  const ReviewValidation = UpdateReviewValidation();
  const allT = useTranslations("All");
  const formT = useTranslations("Form");
  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(ReviewValidation),
    defaultValues: {
      fullName: "",
      text: "",
    },
  });

  const handleRating = (rate) => {
    setRating(rate);
  };

  const onSubmit = async (values) => {
    const auth = Cookies.get("auth");
    if(!Cookies.get("client")) {
      toast({
        variant: "destructive",
        title: allT("review_err"),
      });
      return;
    }
    setIsLoading(true);
    const feedbackMessage = `
📋 Новый отзыв:
#️⃣ Клиент ИД:
👤 Полное имя: ${values.fullName}
⭐ Рейтинг: ${rating}/5
💬 Отзыв: ${values.text}
  `.trim();

    await axios.get(
      `https://api.telegram.org/bot7051935328:AAFJxJAVsRTPxgj3rrHWty1pEUlMkBgg9_o/sendMessage?chat_id=-1002349869199&text=${encodeURIComponent(
        feedbackMessage
      )}`
    );
    form.reset();
    setRating(0)
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
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="text"
            label={formT("review")}
            placeholder=""
            inputClass="rounded-md text-black border-[1px]"
            labelClass="text-muted"
          />
          <div className="demo flex justify-center">
            <Rating
              onClick={handleRating}
              initialValue={rating}
              allowFraction
              fillColorArray={[
                "#f17a45",
                "#f19745",
                "#f1a545",
                "#f1b345",
                "#f1d045",
              ]}
              transition
            />
          </div>
        </div>
        <div className="flex w-full max-sm:flex-col items-center sm:justify-center gap-3 sm:items-center">
          <SubmitButton
            isLoading={isLoading}
            className="w-full sm:w-40 bg-muted text-white"
          >
            {allT("send")}
          </SubmitButton>
          <Button
            variant="outline"
            type={"button"}
            onClick={() => {
              setRating(0);
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
