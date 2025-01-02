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
import { UpdateRegisterValidation } from "@/lib/validation";
import { toast } from "sonner";
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
import { useLocale, useTranslations } from "next-intl";
import { DatePicker } from "../ui/date-picker";
import { ArrowUpRight, Send } from "lucide-react";

export default function RegisterForm() {
  const optLang = useTranslations("Register.Message");
  const RegisterValidation = UpdateRegisterValidation();
  const t = useTranslations("Register");
  const all = useTranslations("All");
  const register = useTranslations("Register.Form");
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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
  const { errors } = form.formState;

  useEffect(() => {
    (async () => {
      try {
        const response = await databases.listDocuments(
          DATABASE_ID,
          COLLECTION_ID_USERS
        );
        console.log(response);
        setUsers(response.documents);
      } catch (error) {}
    })();
  }, []);

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
          <div className="w-full flex col-span-2 sm:grid grid-cols-2 justify-start items-end gap-2">
            <CustomFormField
              fieldType={FormFieldType.PHONE_INPUT}
              control={form.control}
              name="phone"
              placeholder=""
              label={register("phone")}
              inputClass="rounded-md border-[1px]"
            />
            <div
              className={`${
                errors.phone && "pb-7"
              } h-full flex justify-start items-end w-full`}
            >
              <AlertDialog>
                <AlertDialogTrigger asChild className="">
                  <div>
                    <Button className="max-sm:hidden w-6/10 h-10 bg-white hover:bg-white/90 text-black">
                      {t("send_sms")}
                    </Button>
                    <Button className="sm:hidden h-10 bg-white hover:bg-white/90 text-black w-10">
                      <Send size={32} />
                    </Button>
                  </div>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-md w-11/12 max-w-[365px]">
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
            label={register("password")}
            placeholder=""
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
            <span className="text-[13px] text-white">
              {register("privacy_policy")}
            </span>
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
          <span className="text-[13px] text-white">
            {register("privacy_policy")}
          </span>
        </div>
        <div className="flex w-full max-sm:flex-col items-center sm:justify-start gap-3 sm:items-center">
          <SubmitButton
            isLoading={isLoading}
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
            <Link href="/register" className="font-bold">
              {" "}
              {t("login")}
            </Link>
          </h1>
          <div className="sm:hidden flex justify-center items-center gap-2 text-white">
            <h1>{t("login")}</h1>
            <ArrowUpRight />
          </div>
        </div>
      </form>
    </Form>
  );
}
