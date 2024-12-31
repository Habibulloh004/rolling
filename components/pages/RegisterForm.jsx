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

export default function RegisterForm() {
  const RegisterValidation = UpdateRegisterValidation();
  const register = useTranslations("Register");
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(RegisterValidation),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
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
  };

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
        className="w-full space-y-4 w-ful rounded-md"
      >
        <div className="w-full grid grid-cols-2 gap-3">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="first_name"
            placeholder=""
            label={register("first_name")}
            inputClass="rounded-md border-[1px]"
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="last_name"
            placeholder=""
            label={register("last_name")}
            inputClass="rounded-md border-[1px]"
          />
          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="phone"
            placeholder=""
            label={register("phone")}
            inputClass="rounded-md border-[1px]"
          />
          <div className="h-full flex justify-start items-end w-ful">
            <AlertDialog>
              <AlertDialogTrigger asChild className="">
                <Button className="w-6/10 bg-white hover:bg-white/90 text-black">
                  {register("send_sms")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="w-[365px]">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-xl text-center">
                    Смс подтверждения
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-black/60 text-center text-sm">
                    Смс подтверждения отправлено на номер +998 99 ***-**-99{" "}
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
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="email"
            placeholder=""
            label={register("email")}
            inputClass="rounded-md border-[1px]"
          />
          <CustomFormField
            fieldType={FormFieldType.PASSWORDINPUT}
            control={form.control}
            name="password"
            label={register("password")}
            placeholder=""
            inputClass="rounded-md border-[1px]"
          />
          <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            control={form.control}
            name="birthday"
            label={register("birthday")}
            placeholder=""
            inputClass="rounded-md border-[1px]"
          />
          <div className="col-span-2 flex flex-col space-y-2">
            <div className="flex justify-start items-center gap-1">
              <span className="text-sm text-white">{register("gender")}</span>
              <span className="text-xs text-white/50">
                {register("optional")}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex items-center space-x-2">
              <Checkbox
                checked={gender.male}
                onCheckedChange={() => handleCheckboxChange("male")}
              />
              <span className="text-[13px] text-white">
                {register("gender_male")}
              </span>
            </label>
            <label className="flex items-center space-x-2">
              <Checkbox
                checked={gender.female}
                onCheckedChange={() => handleCheckboxChange("female")}
              />
              <span className="text-[13px] text-white">
                {register("gender_fimale")}
              </span>
            </label>
            <label className="flex items-center space-x-2">
              <Checkbox
                checked={gender.none}
                onCheckedChange={() => handleCheckboxChange("none")}
              />
              <span className="text-[13px] text-white">
                {register("gender_other")}
              </span>
            </label>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={gender.male}
            onCheckedChange={() => handleCheckboxChange("male")}
          />
          <span className="text-[13px] text-white">
            {register("privacy_policy")}
          </span>
        </div>
        <div className="flex justify-start gap-2 items-center">
          <SubmitButton
            isLoading={isLoading}
            className="w-40 bg-white hover:bg-white"
          >
            {register("register")}
          </SubmitButton>
          <h1 className="text-[13px] text-white font-[400]">
            {register("have_account")}
            <Link href="/register" className="font-bold">
              {" "}
              {register("login")}
            </Link>
          </h1>
        </div>
      </form>
    </Form>
  );
}
