import React from "react";
import Container from "@/components/shared/container";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import MyAddressComponent from "./_components/myAddressComponent";

const Address = async ({ params }) => {
  const [profileT, locale, path] = await Promise.all([
    getTranslations("Profile"),
    getLocale(),
    params,
  ]);

  return (
    <Container className={"w-11/12 flex flex-col pt-3 md:pt-8 gap-5 md:px-10"}>
      <div className="w-full flex justify-between">
        <h1 className="font-semibold text-primary textNormal4 text-start">
          {profileT("my_address")}
        </h1>
        <Link
          href={`/${locale}/${path?.place}/profile/address/add`}
          className="h-10 px-4 bg-primary rounded-xl flex items-center justify-center font-medium text-white"
        >
          {profileT("btnAddAddress")}
        </Link>
      </div>
      <MyAddressComponent />
    </Container>
  );
};

export default Address;
