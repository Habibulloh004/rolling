"use client";

import React, { useState, useEffect } from "react";
import { Form } from "../ui/form";
import CustomFormField, { FormFieldType } from "../shared/customFormField";
import SubmitButton from "../shared/submitButton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UpdateResetPasswordValidation } from "@/lib/validation";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useLocale, useTranslations } from "next-intl";
import { DatePicker } from "../ui/date-picker";
import { ArrowUpRight, Send } from "lucide-react";

export default function ResetPasswordForm() {
  const optLang = useTranslations("ResetPassword.Message");
  const all = useTranslations("All");
  const RegisterValidation = UpdateResetPasswordValidation();
  const t = useTranslations("ResetPassword");
  const reset = useTranslations("ResetPassword.Form");
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(RegisterValidation),
    defaultValues: {
      phone: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const onSubmit = async (values) => {
    console.log(values);

    return null;
    setIsLoading(true);

    try {
      const { phone, password } = values;
      console.log(phone, password, users);

      const findUser = users?.find(
        (user) =>
          user?.Password == String(password) &&
          user?.PhoneNumber == String(phone)
      );
      console.log({ findUser });

      if (findUser) {
        Cookies.set("auth", JSON.stringify(findUser), { expires: 1 });
        Cookies.set(
          "extraTime",
          new Date().getTime() + 60 * 60 * 1000 * 24 * 30, // 30 days
          { expires: 1 }
        );
        toast.success("Tizimga muvofaqiyatli kirdingiz.");
        router.push(`/${findUser?.Role}`);
      } else {
        toast.error("Login yoki password noto'g'ri.Qaytadan urunib ko'ring!!!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Login yoki password noto'g'ri.Qaytadan urunib ko'ring!!!");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-5 sm:space-y-4 w-ful rounded-md"
      >
        <div className="w-full flex flex-col gap-3">
          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="phone"
            placeholder=""
            label={reset("phone")}
            inputClass="rounded-md border-[1px]"
          />
          <CustomFormField
            fieldType={FormFieldType.PASSWORDINPUT}
            control={form.control}
            name="new_password"
            label={reset("new_password")}
            placeholder=""
            inputClass="rounded-md border-[1px]"
          />
          <CustomFormField
            fieldType={FormFieldType.PASSWORDINPUT}
            control={form.control}
            name="confirm_password"
            label={reset("confirm_password")}
            placeholder=""
            inputClass="rounded-md border-[1px]"
          />
        </div>
        <div className="flex w-full max-sm:flex-col items-center sm:justify-start gap-3 sm:items-center">
          <AlertDialog>
            <AlertDialogTrigger asChild className="">
                <SubmitButton
                  isLoading={isLoading}
                  className="w-full sm:w-40 bg-white hover:bg-white"
                >
                  {t("reset")}
                </SubmitButton>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-md w-[365px]">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-xl text-center">
                  {optLang("title")}
                </AlertDialogTitle>
                <AlertDialogDescription className="text-black/60 text-center text-sm">
                  {optLang("description")} <br /> +998 99 ***-**-99{" "}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="w-full flex justify-center items-center">
                <InputOTP maxLength={4}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <AlertDialogFooter
                className={"flex justify-center items-center w-full"}
              >
                <AlertDialogAction className="w-full hover:bg-primary hover:opacity-[0.9]">
                  {optLang("validation")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <div className="sm:hidden w-full text-white flex items-center justify-center gap-2">
            <div className="w-full h-[1.5px] bg-white" />
            <h1 className="textNormal3">{all("or")}</h1>
            <div className="w-full h-[1.5px] bg-white" />
          </div>
          <h1 className="max-sm:hidden text-[13px] text-white font-[400]">
            <Link href="/register" className="font-bold">
              {" "}
              {t("register")}
            </Link>
          </h1>
          <div className="sm:hidden flex justify-center items-center gap-2 text-white">
            <h1>{t("register")}</h1>
            <ArrowUpRight />
          </div>
        </div>
      </form>
    </Form>
  );
}
