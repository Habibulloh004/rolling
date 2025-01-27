import Container from "@/components/shared/container";
import React from "react";
import TextBonus from "../_components/textBonus";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { formatCurrency } from "@/lib/utils";
import { cookies } from "next/headers";

export const metadata = {
  title: "Бонусная система - Rolling Sushi",
  description:
    "Наша бонусная система позволяет вам экономить до 30% на каждом заказе. Узнайте, как накопить бонусы и использовать их для оплаты.",
  keywords: "бонусная система, Rolling Sushi, накопить бонусы, скидки, Ташкент",
};

export default async function Bonus() {
  const getClient = await cookies();
  const clientData = getClient.get("client");
  const client = clientData ? JSON.parse(clientData?.value) : {};

  const [allT, profileT, bonusT] = await Promise.all([
    getTranslations("All"),
    getTranslations("Profile"),
    getTranslations("Bonus"),
  ]);

  return (
    <Container className={"w-11/12 flex flex-col pt-3 md:pt-8"}>
      <h1 className="w-full textNormal4 text-primary font-semibold">
        {bonusT("bonus")}
      </h1>
      <div className="flex justify-around pt-6 w-full">
        <div className="flex flex-col items-center">
          <div className="bg-primary rounded-xl w-full max-w-md h-[240px] flex flex-col justify-between items-center relative py-[5px] ">
            <div className="flex flex-col items-center justify-center pt-5">
              <p className="font-bold text-white text-[32px] ">
                {client.client_groups_discount == "30"
                  ? "GOLD"
                  : client.client_groups_discount == "20"
                  ? "SILVER"
                  : "BRONZE"}
              </p>
              <p className="font-bold text-white text-center text-2xl ">
                {client.client_groups_discount}%
              </p>
              <p className="font-bold text-white text-center text-[10px] ">
                {profileT("have_bonus")}
              </p>
              <p className="font-bold text-white text-center text-2xl ">
                {formatCurrency(client.bonus / 100)} {allT("sum")}
              </p>
            </div>
            <Image
              src={`${
                client.client_groups_discount == "30"
                  ? "/assets/Gold.png"
                  : client.client_groups_discount == "20"
                  ? "/assets/Silver.png"
                  : "/assets/Bronze.png"
              }`}
              alt="gold"
              width={400}
              height={100}
              className="absolute top-0 w-[350px] lg:w-[400px]"
            />
            <p className="font-bold text-white text-center text-[10px]  tracking-[0.12rem]">
              ROLLINGSUSHI
            </p>
          </div>
          <TextBonus className={"flex lg:hidden flex-col gap-5 pt-7 w-full"} />
          <p className="my-4 text-base font-medium">{bonusT("title")}</p>
        </div>

        <TextBonus className={"hidden lg:flex flex-col gap-5"} />
      </div>
    </Container>
  );
}
