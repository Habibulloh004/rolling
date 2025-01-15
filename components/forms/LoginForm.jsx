"use client";

import React, { useState, useEffect, cache } from "react";
import { Form } from "../ui/form";
import CustomFormField, { FormFieldType } from "../shared/customFormField";
import SubmitButton from "../shared/submitButton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { UpdateLoginValidation } from "@/lib/validation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { getUrl } from "@/lib/utils";
import { getClients } from "@/actions";

export default function LoginForm() {
  const optLang = useTranslations("Register.Message");

  const all = useTranslations("All");
  const RegisterValidation = UpdateLoginValidation();
  const t = useTranslations("Login");
  const register = useTranslations("Login.Form");
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const form = useForm({
    resolver: zodResolver(RegisterValidation),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  useEffect(() => {
    async function getPosterClients() {
      const clients = await getClients();
      setUsers(clients);
      console.log(clients);
    }
    getPosterClients();
  }, []);

  async function login(clients, loginData) {
    const formattedPhone = loginData.phone.replace("+", "");
    const formattedPassword = `password ${loginData.password}`; // Add "password " to the user input password

    for (const client of clients) {
      const clientPhone = client.phone_number || "";
      let clientPassword = null;

      // Attempt to parse the JSON part of the comment field
      try {
        // Extract only the JSON object from the comment
        const jsonString = client.comment.match(/^\{.*?\}/)?.[0] || "{}";
        const commentData = JSON.parse(jsonString);
        clientPassword = commentData.password;
      } catch (error) {
        console.warn(
          `Skipping client ${client.lastname} due to invalid JSON in comment.`
        );
        // console.dir(client, { depth: null });
        continue; // Skip this client if the JSON is invalid
      }

      // Check if phone and password match
      if (
        clientPhone === formattedPhone &&
        clientPassword === formattedPassword
      ) {
        return { success: true, message: "Login successful", client };
      }
    }

    return { success: false, message: "Invalid phone number or password" };
  }

  const onSubmit = async (values) => {
    const result = await login(users, values);
    console.log(result);
    Cookies.set("client", JSON.stringify(result.client), {
      expires: 7,
      path: "/",
    });
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
            label={register("phone")}
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
        </div>
        <div className="flex w-full max-sm:flex-col items-center sm:justify-start gap-3 sm:items-center">
          <SubmitButton
            disabled={users.length < 1}
            isLoading={isLoading}
            className="w-full sm:w-40 bg-white hover:bg-white"
          >
            {t("login")}
          </SubmitButton>
          <div className="sm:hidden w-full text-white flex items-center justify-center gap-2">
            <div className="w-full h-[1.5px] bg-white" />
            <h1 className="textNormal3">{all("or")}</h1>
            <div className="w-full h-[1.5px] bg-white" />
          </div>
          <h1 className="max-sm:hidden text-[13px] text-white font-[400]">
            {t("have_account")}
            <Link href={`${getUrl(pathname)}/sign-up`} className="font-bold">
              {" "}
              {t("register")}
            </Link>
          </h1>
          <Link
            href={`${getUrl(pathname)}/sign-up`}
            className="sm:hidden flex justify-center items-center gap-2 text-white"
          >
            <h1>{t("register")}</h1>
            <ArrowUpRight />
          </Link>
        </div>
      </form>
    </Form>
  );
}
