"use client";
import Container from "@/components/shared/container";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

export default function Profile() {
  const profileT = useTranslations("Profile");
  return (
    <Container
      className={`flex-col items-start py-10 min-h-[400px] justify-center`}
    >
      <h1 className="text-xl md:text-2xl text-muted font-semibold">
        {profileT("title")}
      </h1>
      <section>
        <article>
          <div>
            <Label htmlFor="name">{profileT("userName")}</Label>
            <Input id="name" type="text" />
            <Label htmlFor="phone">{profileT("phone")}</Label>
            {/* <Input id="phone" disabled value="+998935204050" /> */}
            <PhoneInput
              id="phone"
              defaultCountry="UZ"
              international
              withCountryCallingCode
              disabled
              value={"+998935204050"} // Ensure the phone input is controlled
              className={cn("input-phone rounded-md gray")}
              style={{ borderColor: "transparent" }} // or borderColor: 'initial' to reset
            />
          </div>
        </article>
      </section>
    </Container>
  );
}
