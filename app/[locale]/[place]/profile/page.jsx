import Container from "@/components/shared/container";
import TextBonus from "./_components/textBonus";
import ProfileComponent from "./_components/profileComponent";
import { getLocale } from "next-intl/server";
import { cookies } from "next/headers";

export default async function Profile({ params }) {
  const [getClient, locale, path] = await Promise.all([
    await cookies(),
    getLocale(),
    params,
  ]);
  const clientData = getClient.get("client");
  const client = clientData ? JSON.parse(clientData?.value) : null;
  return (
    <Container
      className={`flex-col items-start min-h-[400px] justify-start pt-3 md:pt-8`}
    >
      <ProfileComponent locale={locale} path={path} client={client} />
      <TextBonus className={"hidden lg:flex gap-11 pt-6"} />
    </Container>
  );
}
