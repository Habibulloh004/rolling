"use client";

import { useMemo, useState } from "react";
import Cookies from "js-cookie";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import SubmitButton from "@/components/shared/submitButton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

import { formatTimestampToDate, getUrl, production } from "@/lib/utils";
import { getClientGroup, getClients, sendSmsToUser, verifySmsCode } from "@/actions";
import { createClient } from "@/actions/post";
import { useClientStore } from "@/store";

const STEP_PHONE = "phone";
const STEP_LOGIN_OTP = "login_otp";
const STEP_REGISTER = "register";

const normalizePhoneForPoster = (phone = "") => phone.replace("+", "");

export default function AuthPhoneFlowForm({ onAuthSuccess }) {
  const [step, setStep] = useState(STEP_PHONE);
  const [phone, setPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [existingClient, setExistingClient] = useState(null);
  const [clientGroups, setClientGroups] = useState([]);
  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    gender: "none",
    birthday: "",
  });

  const [isCheckingPhone, setIsCheckingPhone] = useState(false);
  const [isResendingCode, setIsResendingCode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const { setClient } = useClientStore();

  const allT = useTranslations("All");
  const loginT = useTranslations("Login");
  const loginFormT = useTranslations("Login.Form");
  const loginMessageT = useTranslations("Login.Message");
  const registerT = useTranslations("Register");
  const registerFormT = useTranslations("Register.Form");

  const canContinuePhone = useMemo(() => phone && phone.length >= 13, [phone]);
  const otpSlotClass =
    "h-11 w-11 rounded-md border border-white/40 bg-white/10 text-white text-base";

  const applyClientSession = (client) => {
    if (!client) return;

    const normalizedClient = {
      ...client,
      addresses: null,
    };

    Cookies.set("client", JSON.stringify(normalizedClient), {
      expires: 7,
      secure: production === "true",
    });
    setClient(normalizedClient);
  };

  const requestOtp = async (targetPhone) => {
    const smsResponse = await sendSmsToUser(targetPhone);
    if (smsResponse?.status !== "success") {
      toast.error(smsResponse?.message || allT("sms_err"));
      return false;
    }

    toast.success(`${loginMessageT("description")} ${targetPhone}`);
    return true;
  };

  const loadClientGroupsIfNeeded = async () => {
    if (clientGroups.length > 0) return clientGroups;
    const groups = await getClientGroup();
    if (Array.isArray(groups)) {
      setClientGroups(groups);
      return groups;
    }
    return [];
  };

  const handlePhoneStep = async (event) => {
    event.preventDefault();

    if (!canContinuePhone) {
      toast.error(loginT("Validation.phone"));
      return;
    }

    setIsCheckingPhone(true);
    try {
      const formattedPhone = normalizePhoneForPoster(phone);
      const clients = await getClients({ params: `&phone=${formattedPhone}` });
      const foundClient = Array.isArray(clients) && clients.length > 0 ? clients[0] : null;

      const smsSent = await requestOtp(phone);
      if (!smsSent) return;

      if (foundClient) {
        setExistingClient(foundClient);
        setStep(STEP_LOGIN_OTP);
      } else {
        await loadClientGroupsIfNeeded();
        setExistingClient(null);
        setStep(STEP_REGISTER);
      }
    } finally {
      setIsCheckingPhone(false);
    }
  };

  const handleResendCode = async () => {
    if (!canContinuePhone) return;
    setIsResendingCode(true);
    try {
      await requestOtp(phone);
    } finally {
      setIsResendingCode(false);
    }
  };

  const verifyOtp = async () => {
    if (!otpCode || otpCode.length !== 4) {
      toast.error(allT("sms_err"));
      return false;
    }

    const verifyResponse = await verifySmsCode(phone, otpCode);
    if (verifyResponse?.status !== "success") {
      toast.error(verifyResponse?.message || allT("sms_err"));
      return false;
    }

    return true;
  };

  const handleLoginWithOtp = async (event) => {
    event.preventDefault();
    if (!existingClient) return;

    setIsSubmitting(true);
    try {
      const isOtpValid = await verifyOtp();
      if (!isOtpValid) return;

      applyClientSession(existingClient);
      if (onAuthSuccess) {
        onAuthSuccess();
      } else {
        router.replace(`${getUrl(pathname)}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterAndLogin = async (event) => {
    event.preventDefault();

    if (!registerData.firstName?.trim()) {
      toast.error(registerT("Validation.first_name"));
      return;
    }

    setIsSubmitting(true);
    try {
      const isOtpValid = await verifyOtp();
      if (!isOtpValid) return;

      const groups = await loadClientGroupsIfNeeded();
      const createResponse = await createClient({
        client_name: `${registerData.lastName?.trim() || ""} ${registerData.firstName.trim()}`.trim(),
        client_sex:
          registerData.gender === "male"
            ? "1"
            : registerData.gender === "female"
            ? "2"
            : "0",
        client_groups_id_client: groups?.[0]?.client_groups_id || "1",
        phone,
        birthday: registerData.birthday
          ? registerData.birthday
          : "",
        email: "",
        comment: JSON.stringify({ source: "sms-login" }),
      });

      if (createResponse?.error === 167) {
        const clients = await getClients({
          params: `&phone=${normalizePhoneForPoster(phone)}`,
        });
        if (Array.isArray(clients) && clients[0]) {
          setExistingClient(clients[0]);
          setStep(STEP_LOGIN_OTP);
        }
        toast.error(allT("client_exists"));
        return;
      }

      if (!createResponse?.response) {
        toast.error(registerT("Message.error"));
        return;
      }

      const clients = await getClients({
        params: `&phone=${normalizePhoneForPoster(phone)}`,
      });
      const createdClient = Array.isArray(clients) ? clients[0] : null;
      if (!createdClient) {
        toast.error(registerT("Message.error"));
        return;
      }

      applyClientSession(createdClient);
      if (onAuthSuccess) {
        onAuthSuccess();
      } else {
        router.replace(`${getUrl(pathname)}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === STEP_PHONE) {
    return (
      <form onSubmit={handlePhoneStep} className="w-full space-y-4 sm:space-y-5">
        <div className="space-y-2">
          <Label className="text-white text-sm">{loginFormT("phone")}</Label>
          <PhoneInput
            defaultCountry="UZ"
            international
            withCountryCallingCode
            countryCallingCodeEditable={false}
            focusInputOnCountrySelection
            placeholder=""
            value={phone || ""}
            onChange={setPhone}
            className="input-phone rounded-md text-white"
          />
        </div>

        <SubmitButton
          isLoading={isCheckingPhone}
          className="w-full sm:w-40 bg-white text-primary hover:bg-white/90"
          disabled={!canContinuePhone || isCheckingPhone}
        >
          {allT("confirm")}
        </SubmitButton>
      </form>
    );
  }

  if (step === STEP_LOGIN_OTP) {
    return (
      <form onSubmit={handleLoginWithOtp} className="w-full space-y-4 sm:space-y-5">
        <div className="space-y-2">
          <Label className="text-white text-sm">{loginFormT("phone")}</Label>
          <Input value={phone} disabled className="rounded-md border-[1px] text-white bg-transparent" />
        </div>

        <div className="space-y-2">
          <Label className="text-white text-sm">{loginMessageT("validation")}</Label>
          <div className="w-full flex justify-center py-1">
            <InputOTP maxLength={4} value={otpCode} onChange={setOtpCode}>
              <InputOTPGroup>
                <InputOTPSlot index={0} className={otpSlotClass} />
                <InputOTPSlot index={1} className={otpSlotClass} />
                <InputOTPSlot index={2} className={otpSlotClass} />
                <InputOTPSlot index={3} className={otpSlotClass} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <SubmitButton
            isLoading={isSubmitting}
            className="w-full sm:w-40 bg-white text-primary hover:bg-white/90"
            disabled={otpCode.length !== 4 || isSubmitting}
          >
            {loginT("login")}
          </SubmitButton>

          <Button
            aria-label="resend login sms"
            type="button"
            variant="ghost"
            className="border border-white text-white hover:bg-white/10"
            onClick={handleResendCode}
            disabled={isResendingCode}
          >
            {registerT("send_sms")}
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleRegisterAndLogin} className="w-full space-y-4 sm:space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-2 sm:col-span-2">
          <Label className="text-white text-sm">{registerFormT("first_name")}</Label>
          <Input
            value={registerData.firstName}
            onChange={(event) =>
              setRegisterData((prev) => ({ ...prev, firstName: event.target.value }))
            }
            className="rounded-md border-[1px] text-white bg-transparent"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label className="text-white text-sm">
            {registerFormT("last_name")} ({registerT("optional")})
          </Label>
          <Input
            value={registerData.lastName}
            onChange={(event) =>
              setRegisterData((prev) => ({ ...prev, lastName: event.target.value }))
            }
            className="rounded-md border-[1px] text-white bg-transparent"
          />
        </div>

        <div className="col-span-1 sm:col-span-2 flex flex-nowrap items-start gap-3">
          <div className="w-1/2 min-w-0 flex flex-col gap-2">
            <Label className="text-white text-xs sm:text-sm whitespace-nowrap min-h-6 flex items-end">
              {registerFormT("gender")}
            </Label>
            <Select
              value={registerData.gender}
              onValueChange={(value) =>
                setRegisterData((prev) => ({ ...prev, gender: value }))
              }
            >
              <SelectTrigger className="h-[41px] w-full rounded-md border border-input text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">{registerT("gender_male")}</SelectItem>
                <SelectItem value="female">{registerT("gender_fimale")}</SelectItem>
                <SelectItem value="none">{registerT("gender_other")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-1/2 min-w-0 flex flex-col gap-2">
            <Label className="text-white text-xs sm:text-sm whitespace-nowrap min-h-6 flex items-end">
              {registerFormT("birthday")} ({registerT("optional")})
            </Label>
            <Input
              type="date"
              value={registerData.birthday}
              max={new Date().toISOString().split("T")[0]}
              onChange={(event) =>
                setRegisterData((prev) => ({ ...prev, birthday: event.target.value }))
              }
              className="h-[41px] w-full rounded-md border-[1px] text-white bg-transparent"
            />
          </div>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label className="text-white text-sm">{registerFormT("phone")}</Label>
          <Input value={phone} disabled className="rounded-md border-[1px] text-white bg-transparent" />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label className="text-white text-sm">{registerT("Message.validation")}</Label>
          <div className="w-full flex justify-center py-1">
            <InputOTP maxLength={4} value={otpCode} onChange={setOtpCode}>
              <InputOTPGroup>
                <InputOTPSlot index={0} className={otpSlotClass} />
                <InputOTPSlot index={1} className={otpSlotClass} />
                <InputOTPSlot index={2} className={otpSlotClass} />
                <InputOTPSlot index={3} className={otpSlotClass} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <SubmitButton
          isLoading={isSubmitting}
          className="w-full sm:w-auto bg-white text-primary hover:bg-white/90"
          disabled={otpCode.length !== 4 || isSubmitting}
        >
          {registerT("register")}
        </SubmitButton>

        <Button
          aria-label="resend register sms"
          type="button"
          variant="ghost"
          className="border border-white text-white hover:bg-white/10"
          onClick={handleResendCode}
          disabled={isResendingCode}
        >
          {registerT("send_sms")}
        </Button>
      </div>
    </form>
  );
}
