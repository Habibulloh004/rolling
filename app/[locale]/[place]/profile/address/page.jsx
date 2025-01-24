import React from "react";
import Container from "@/components/shared/container";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import MyAddressComponent from "./_components/myAddressComponent";

export const mapArray = [
  {
    id: 1,
    title: "Дом 1",
    adress: "Яшнабадский рй. Боткина 1а",
    latitude: 41.36507,
    longitude: 69.3074687,
    comment: "6-podezd",
  },
  {
    id: 2,
    title: "Mega Planet",
    adress: "Яшнабадский рй. Боткина 1а",
    latitude: 41.367297,
    longitude: 69.291109,
    comment: "",
  },
  {
    id: 3,
    title: "Дом 1",
    adress: "Яшнабадский рй. Боткина 1а",
    latitude: 41.36507,
    longitude: 69.3074687,
    comment: "Dom orqasidan kirasiz",
  },
  {
    id: 4,
    title: "Дом 1",
    adress: "Яшнабадский рй. Боткина 1а",
    latitude: 41.36507,
    longitude: 69.3074687,
    comment: "",
  },
];

const Address = async ({ params }) => {
  const [profileT, locale, path] = await Promise.all([
    getTranslations("Profile"),
    getLocale(),
    params,
  ]);

  return (
    <Container className={"flex flex-col pt-3 md:pt-8 gap-5"}>
      <div className="w-full flex justify-between">
        <h1 className="w-full font-semibold text-primary textNormal4 text-start">
          {profileT("my_address")}
        </h1>
        <Link
          href={`/${locale}/${path?.place}/profile/address/add`}
          className="h-10 px-4 bg-primary"
        >
          {profileT("btnAddAddress")}
        </Link>
      </div>
      <MyAddressComponent addressData={mapArray} />
    </Container>
  );
};

export default Address;
