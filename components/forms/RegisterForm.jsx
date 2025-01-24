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
import { UpdateRegisterValidation } from "@/lib/validation";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
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
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useTranslations } from "next-intl";
import { ArrowUpRight, Send, X } from "lucide-react";
import {
  formatTimestampToDate,
  generateRandomFourDigitNumber,
  getUrl,
  url,
} from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  getCategories,
  getClient,
  getClientGroup,
  sendSmsToUser,
} from "@/actions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/actions/post";

export default function RegisterForm() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [clientGroup, setClientGroup] = useState("");
  const [registerBtnDisabled, setRegisterBtnDisabled] = useState(true);
  const [otpValues, setOtpValues] = useState("");
  const [generatingValue, setGeneratingValue] = useState("");
  const optLang = useTranslations("Register.Message");
  const RegisterValidation = UpdateRegisterValidation();
  const t = useTranslations("Register");
  const all = useTranslations("All");
  const policyT = useTranslations("Policy");
  const descriptionT = useTranslations("Policy.description");
  const register = useTranslations("Register.Form");
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(RegisterValidation),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      birthday: "",
      genter: "male",
      phone: "",
      password: "",
      privacy_policy: false,
    },
  });

  useEffect(() => {
    async function getGroup() {
      const result = await getClientGroup();
      setClientGroup(result);
    }
    getGroup();
  }, []);

  const onSubmit = async (values) => {
    setIsLoading(true);
    const posterClient = await createClient({
      client_name: `${form.getValues("last_name")} ${form.getValues(
        "first_name"
      )}`,
      client_sex: `${
        form.getValues("genter") == "male"
          ? "1"
          : form.getValues("genter") == "female"
          ? "2"
          : "0"
      }`,
      client_groups_id_client: clientGroup
        ? clientGroup[0].client_groups_id
        : "1",
      phone: `${form.getValues("phone")}`,
      email: `${form.getValues("email")}`,
      birthday: formatTimestampToDate(form.getValues("birthday")),
      comment: JSON.stringify({
        password: `password ${form.getValues("password")}`,
      }),
    });

    if (posterClient.error && posterClient.error == 167) {
      router.replace(`${getUrl(pathname)}/login`);
      setIsLoading(false);
      return;
    }

    await getClient(posterClient.response);
    router.replace(`${getUrl(pathname)}/login`);
    setIsLoading(false);
  };

  const phone = form.watch("phone");

  const [gender, setGender] = useState({
    male: false,
    female: false,
    none: false,
  });

  const handleCheckboxChange = (field) => {
    setGender((prev) => ({
      male: field === "male" ? true : false,
      female: field === "female" ? true : false,
      none: field === "none" ? true : false,
    }));
    form.setValue("gender", field);
  };

  const checkNumber = async () => {
    if (otpValues != generatingValue) {
      toast({
        variant: "destructive",
        title: all("sms_err"),
      });
      return;
    }
    setRegisterBtnDisabled(false);
  };

  const sendSms = async () => {
    setOpen(true);
    const code = generateRandomFourDigitNumber();
    setGeneratingValue(code);
    await sendSmsToUser(code, form.getValues("phone"));
  };
  const descriptionArray = [
    {
      id: 1,
      title: descriptionT("0_title"),
      text: descriptionT("0_text"),
    },
    {
      id: 2,
      title: descriptionT("1_title"),
      text: descriptionT("1_text"),
    },
    {
      id: 3,
      title: descriptionT("2_title"),
      text: descriptionT("2_text"),
    },
    {
      id: 4,
      title: descriptionT("3_title"),
      text: descriptionT("3_text"),
    },
    {
      id: 5,
      title: descriptionT("4_title"),
      text: descriptionT("4_text"),
    },
  ];

  const { errors } = form.formState;
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-5 sm:space-y-4 w-ful rounded-md"
      >
        <div className="w-full flex flex-col sm:grid grid-cols-1 sm:grid-cols-2 gap-3">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="first_name"
            placeholder=""
            label={register("first_name")}
            inputClass="rounded-md border-[1px] col-span-2 md:col-span-1"
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="last_name"
            placeholder=""
            label={register("last_name")}
            inputClass="rounded-md border-[1px] col-span-2 md:col-span-1"
          />
          <div className="w-full flex col-span-2 sm:grid grid-cols-2 lg:grid-cols-3 justify-start items-end gap-2">
            <div className="lg:col-span-2 w-full">
              <CustomFormField
                fieldType={FormFieldType.PHONE_INPUT}
                control={form.control}
                name="phone"
                placeholder=""
                label={register("phone")}
                inputClass="rounded-md border-[1px] w-full"
              />
            </div>
            <div
              className={`${
                errors.phone && "pb-7"
              } h-full flex justify-end items-end col-span-1`}
            >
              <div></div>
              <AlertDialog open={open}>
                <AlertDialogTrigger asChild>
                  <div>
                    <Button
                      type="button"
                      disabled={!phone || phone.length != 13}
                      onClick={sendSms}
                      className="max-sm:hidden w-6/10 h-10 bg-white hover:bg-white/90 text-black"
                    >
                      {t("send_sms")}
                    </Button>
                    <Button
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
                      <AlertDialogCancel className="w-2 aspect-square absolute right-0 -top-2" onClick={() => setOpen(false)}>
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
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="email"
            placeholder=""
            label={register("email")}
            inputClass="rounded-md border-[1px]"
            onChangeDatePicker={(date) => form.setValue("birthday", date)}
          />
          <CustomFormField
            fieldType={FormFieldType.PASSWORDINPUT}
            control={form.control}
            name="password"
            label="Parol" // Labelni matn sifatida uzatish
            inputClass="rounded-md border-[1px]"
          />
          <div className="sm:hidden flex items-center space-x-2">
            <Checkbox
              onCheckedChange={() =>
                form.setValue(
                  "privacy_policy",
                  !form.getValues("privacy_policy")
                )
              }
            />

            <div className="w-5/6">
              <Dialog>
                <DialogTrigger as="div">
                  <p className="text-[12px] text-white text-start">
                    {register("privacy_policy")
                      .split(" ")
                      .slice(0, 12)
                      .join(" ")}{" "}
                    <span className="underline underline-offset-1">
                      {register("privacy_policy")
                        .split(" ")
                        .slice(-2)
                        .join(" ")}
                    </span>
                  </p>
                </DialogTrigger>

                <DialogContent as="div" mark="false" className={"px-5"}>
                  <ScrollArea as="div" className="h-[500px] py-4">
                    <h1 className="text-xl md:text-2xl font-semibold text-start w-full text-[#004032] mt-3">
                      {policyT("title")}
                    </h1>
                    {descriptionArray.map((item, i) => (
                      <DialogHeader as="div" key={i}>
                        <DialogTitle as="div">
                          <p className="text-base lg:test-lg text-start  w-5/6">
                            {item.title}
                          </p>
                        </DialogTitle>

                        {item.text.split("\n").map((line, idx) => (
                          <DialogDescription
                            className="text-xs md:text-base font-normal text-start"
                            key={idx}
                          >
                            {line}
                          </DialogDescription>
                        ))}
                      </DialogHeader>
                    ))}
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            control={form.control}
            name="birthday"
            label={register("birthday")}
            startYear={1900} // Set start year for range
            endYear={new Date().getFullYear()} // Dynamically set the current year
            optional={t("optional")}
          />
          <div className="col-span-2 flex flex-col space-y-2">
            <div className="flex justify-start items-center gap-1">
              <span className="text-sm text-white">{register("gender")}</span>
              <span className="text-xs text-white/50">{t("optional")}</span>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            <label className="flex items-center space-x-2">
              <Checkbox
                checked={gender.male}
                onCheckedChange={() => handleCheckboxChange("male")}
              />
              <span className="text-[13px] text-white">{t("gender_male")}</span>
            </label>
            <label className="flex items-center space-x-2">
              <Checkbox
                checked={gender.female}
                onCheckedChange={() => handleCheckboxChange("female")}
              />
              <span className="text-[13px] text-white">
                {t("gender_fimale")}
              </span>
            </label>
            <label className="flex items-center space-x-2">
              <Checkbox
                checked={gender.none}
                onCheckedChange={() => handleCheckboxChange("none")}
              />
              <span className="text-[13px] text-white">
                {t("gender_other")}
              </span>
            </label>
          </div>
        </div>
        <div className="max-sm:hidden flex items-center space-x-2">
          <Checkbox
            onCheckedChange={() =>
              form.setValue("privacy_policy", !form.getValues("privacy_policy"))
            }
          />
          <Dialog>
            <DialogTrigger as="div">
              <p className="text-xs text-left text-white ">
                {register("privacy_policy").split(" ").slice(0, 12).join(" ")}{" "}
                <span className="underline underline-offset-2">
                  {register("privacy_policy").split(" ").slice(-2).join(" ")}
                </span>
              </p>
            </DialogTrigger>
            <DialogContent mark="false" className={"px-5"}>
              <ScrollArea as="div" className="h-[400px] py-7">
                <h1 className="text-xl md:text-2xl font-semibold text-start w-full text-[#004032] mt-3">
                  {policyT("title")}
                </h1>
                {descriptionArray.map((item, i) => (
                  <DialogHeader as="div" key={i}>
                    <DialogTitle as="div">
                      <p className="text-base lg:test-lg text-start  w-5/6">
                        {item.title}
                      </p>
                    </DialogTitle>
                    {item.text.split("\n").map((line, idx) => (
                      <DialogDescription
                        className="text-xs md:text-base font-normal text-start"
                        key={idx}
                      >
                        {line}
                      </DialogDescription>
                    ))}
                  </DialogHeader>
                ))}
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex w-full max-sm:flex-col items-center sm:justify-start gap-3 sm:items-center">
          <SubmitButton
            isLoading={isLoading}
            disabled={registerBtnDisabled}
            className="w-full sm:w-40 bg-white hover:bg-white"
          >
            {t("register")}
          </SubmitButton>
          <div className="sm:hidden w-full text-white flex items-center justify-center gap-2">
            <div className="w-full h-[1.5px] bg-white" />
            <h1 className="textNormal3">{all("or")}</h1>
            <div className="w-full h-[1.5px] bg-white" />
          </div>
          <h1 className="max-sm:hidden text-[13px] text-white font-[400]">
            {t("have_account")}
            <Link href={`${getUrl(pathname)}/login`} className="font-semibold ">
              {" "}
              {t("login")}
            </Link>
          </h1>
          <Link
            href={`${getUrl(pathname)}/login`}
            className="sm:hidden flex justify-center items-center gap-2 text-white"
          >
            <h1 className="">{t("login")}</h1>
            <ArrowUpRight />
          </Link>
        </div>
      </form>
    </Form>
  );
}
