import Container from "@/components/shared/container";
import TextBonus from "./_components/textBonus";
import ProfileComponent from "./_components/profileComponent";
import { getLocale, getTranslations } from "next-intl/server";

export default async function Profile({ params }) {
  const [profileT, locale, path] = await Promise.all([
    getTranslations("Profile"),
    getLocale(),
    params,
  ]);
  return (
    <Container
      className={`w-11/12 flex-col items-start min-h-[400px] justify-start pt-3 md:pt-8`}
    >
      <ProfileComponent locale={locale} path={path} />
      <TextBonus className={"hidden lg:flex gap-11 pt-6"} />
    </Container>
  );
}
