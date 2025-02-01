"use client";

import React, { useState, useEffect } from "react";
import { Form } from "../ui/form";
import CustomFormField, { FormFieldType } from "../shared/customFormField";
import SubmitButton from "../shared/submitButton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { UpdateResetPasswordValidation } from "@/lib/validation";
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
import { useTranslations } from "next-intl";
import { ArrowUpRight, Send, X } from "lucide-react";
import { generateRandomFourDigitNumber, getUrl } from "@/lib/utils";
import { Button } from "../ui/button";
import { getClients, sendSmsToUser } from "@/actions";
import { updateClient } from "@/actions/post";
import { toast } from "sonner";

export default function ResetPasswordForm() {
  const [users, setUsers] = useState([]);
  const [resetPasswordBtnDisabled, setResetPasswordBtnDisabled] =
    useState(true);
  const [otpValues, setOtpValues] = useState("");
  const [generatingValue, setGeneratingValue] = useState("");
  const pathname = usePathname();
  const optLang = useTranslations("ResetPassword.Message");
  const all = useTranslations("All");
  const ResetPasswordValidation = UpdateResetPasswordValidation();
  const t = useTranslations("ResetPassword");
  const registerT = useTranslations("Register");
  const loginT = useTranslations("Login");
  const reset = useTranslations("ResetPassword.Form");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(ResetPasswordValidation),
    defaultValues: {
      phone: "",
      new_password: "",
      confirm_password: "",
    },
  });

  useEffect(() => {
    async function getPosterClients() {
      const clients = await getClients();
      setUsers(clients);
    }
    getPosterClients();
  }, []);

  const phone = form.watch("phone");

  async function login(clients, loginData) {
    const formattedPhone = loginData.phone.replace("+", "");

    for (const client of clients) {
      const clientPhone = client.phone_number || "";

      if (clientPhone == formattedPhone) {
        return { success: true, message: "Login successful", client };
      }
    }
    return { success: false, message: "Invalid phone number or password" };
  }

  const onSubmit = async (values) => {
    setIsLoading(true);
    const { client, success } = await login(users, values);
    if (success == false) {
      toast.error(all("client_err"));
      setIsLoading(false);
      return;
    }
    const clientPassword = JSON.parse(client.comment);
    const updatedClient = {
      client_id: client.client_id,
      comment: JSON.stringify({
        ...clientPassword,
        password: `password ${values.new_password}`,
      }),
    };
    await updateClient(updatedClient);
    Cookies.set(
      "client",
      JSON.stringify({
        ...updatedClient,
        addresses: null,
      }),
      { expires: 7, secure: true }
    );
    router.replace(`${getUrl(pathname)}/login`);
    setIsLoading(false);
  };

  const checkNumber = async () => {
    // const postNumber = fetch("")
    if (otpValues != generatingValue) {
      toast.error(all("sms_err"));
      return;
    }
    setResetPasswordBtnDisabled(false);
  };

  const sendSms = async () => {
    const code = generateRandomFourDigitNumber();
    setGeneratingValue(code);
    const res = await sendSmsToUser(code, form.getValues("phone"));
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-5 sm:space-y-4 w-ful rounded-md"
      >
        <div className="w-full flex flex-col gap-3">
          <div className="w-full flex col-span-2 sm:grid grid-cols-3 justify-start items-end gap-2">
            <div className="w-full col-span-2">
              <CustomFormField
                fieldType={FormFieldType.PHONE_INPUT}
                control={form.control}
                name="phone"
                placeholder=""
                label={reset("phone")}
                inputClass="rounded-md border-[1px]"
              />
            </div>
            <div
              className={`${
                form.formState.phone && "pb-7"
              } h-full flex justify-start items-end w-full`}
            >
              <div></div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <div>
                    <Button
                    aria-label={`reset sms`}
                    type="button"
                    disabled={!phone || phone.length != 13}
                    onClick={sendSms}
                    className="max-sm:hidden h-10 px-[10px] bg-white hover:bg-white/90 text-black"
                    >
                      {registerT("send_sms")}
                    </Button>
                    <Button
                      aria-label={`reset sms2`}
                      type="button"
                      disabled={!phone || phone.length != 13}
                      onClick={sendSms}
                      className="sm:hidden h-10 bg-white hover:bg-white/90 text-black w-10"
                    >
                      <Send size={32} />
                    </Button>
                  </div>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-md w-11/12 max-w-[365px]">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl text-center relative">
                      {optLang("title")}
                      <AlertDialogCancel className="w-2 aspect-square absolute right-0 -top-2">
                        <X className="size-2" />
                      </AlertDialogCancel>
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-black/60 text-center text-sm">
                      {optLang("description")} <br /> {form.getValues("phone")}{" "}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="w-full flex justify-center items-center">
                    <InputOTP maxLength={4} onChange={(e) => setOtpValues(e)}>
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
                    <AlertDialogAction
                      onClick={checkNumber}
                      className="w-full hover:bg-primary hover:opacity-[0.9]"
                    >
                      {optLang("validation")}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
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
          <SubmitButton
            isLoading={isLoading}
            disabled={resetPasswordBtnDisabled || users.length < 1}
            className="w-full sm:w-40 bg-white hover:bg-white"
          >
            {t("reset")}
          </SubmitButton>

          <div className="sm:hidden w-full text-white flex items-center justify-center gap-2">
            <div className="w-full h-[1.5px] bg-white" />
            <h1 className="textNormal3">{all("or")}</h1>
            <div className="w-full h-[1.5px] bg-white" />
          </div>
          <h1 className="max-sm:hidden text-[13px] text-white font-[400]">
            {loginT("have_account")}
            <Link href={`${getUrl(pathname)}/sign-up`} className="font-bold">
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
