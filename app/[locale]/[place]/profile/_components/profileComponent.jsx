"use client";

import { formatCurrency, getUrl } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {  gold, pencil } from "@/public";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "use-intl";
import { usePathname, useRouter } from "next/navigation";
import { updateClient } from "@/actions/post";
import Cookies from "js-cookie";
import { useClientStore } from "@/store";
import { Button } from "@/components/ui/button";

export default function ProfileComponent({ client }) {
  const { setClient } = useClientStore();
  const [changeName, setChangeName] = useState(true);
  const [name, setName] = useState(
    `${client.firstname && client.firstname} ${
      client.lastname && client.lastname
    }`
  );

  const router = useRouter();
  const pathName = usePathname();
  const allT = useTranslations("All");
  const profileT = useTranslations("Profile");
  const profileLinksT = useTranslations("Profile.Links");
  const profileLinksData = [
    {
      title: profileLinksT("my_card"),
      route: "/mycard",
    },
    {
      title: profileLinksT("address"),
      route: "/address",
    },
    {
      title: profileLinksT("order"),
      route: "/order",
    },
    {
      title: profileLinksT("bonus"),
      route: "/bonus",
    },
  ];

  return (
    <main className="w-full">
      <h1 className="textNormal4 text-primary font-semibold">
        {profileT("title")}
      </h1>
      <section className="pt-6 w-full flex flex-col items-center justify-center lg:items-start relative">
        <div className="w-full flex justify-between gap-5">
          <article className="w-full lg:w-2/3">
            <div>
              <Label htmlFor="name" className={"text-base leading-6"}>
                {profileT("userName")}
              </Label>
              <div
                className={`flex items-center bg-[#F5F5F5] ${
                  !changeName
                    ? "border-[2px] border-primary"
                    : "border-[0.5px] border-[#B9B9BB]"
                } rounded-[10px] w-full min-w-[240px] max-w-[454px] pr-3 mt-2 mb-5 h-12`}
              >
                <Input
                  id="name"
                  onChange={(e) => setName(e.target.value)}
                  readOnly={changeName}
                  defaultValue={`${client.firstname && client.firstname} ${
                    client.lastname && client.lastname
                  }`}
                  type="text"
                  placeholder="Last Name"
                  className={
                    "focus-visible:outline-none focus-visible:ring-0 border-none shadow-none"
                  }
                />
                <button
                  onClick={async () => {
                    if (
                      `${client?.firstname && client?.firstname} ${
                        client?.lastname && client?.lastname
                      }`.trim().length == name.trim().length
                    ) {
                      setChangeName((prev) => !prev);
                      return;
                    }
                    const [firstname, lastname] = name.trim().split(" ");
                    const updatedClient = {
                      client_id: Number(client?.client_id),
                      firstname: firstname == undefined ? "" : firstname,
                      lastname: lastname == undefined ? "" : lastname,
                    };
                    const res = await updateClient(updatedClient);
                    if (!res.error) {
                      Cookies.set(
                        "client",
                        JSON.stringify({
                          ...client,
                          firstname: firstname == undefined ? "" : firstname,
                          lastname: lastname == undefined ? "" : lastname,
                          addresses: null,
                        })
                      );
                      window.location.reload();
                    }
                    setChangeName((prev) => !prev);
                  }}
                >
                  <Image
                    src={pencil}
                    alt=""
                    width={100}
                    height={20}
                    className="h-5 w-4"
                  />
                </button>
              </div>
              <Label htmlFor="phone" className={"text-base leading-6"}>
                {profileT("phone")}
              </Label>
              {/* <Input id="phone" disabled value="+998935204050" /> */}
              <div className="flex items-center bg-[#F5F5F5] border-[0.5px] border-[#B9B9BB] rounded-[10px] w-full min-w-[240px] max-w-[454px] pr-7 mt-2 mb-5 h-12">
                <Input
                  id="name"
                  value={`${client.phone}`}
                  readOnly
                  type="text"
                  className={
                    "text-base focus-visible:outline-none focus-visible:ring-0 border-none shadow-none"
                  }
                />
              </div>
            </div>
          </article>
          <div className="hidden lg:flex flex-col gap-y-[15px] w-[337px] absolute top-0 right-0">
            {profileLinksData.map((item, i) => (
              <Link
                href={`${getUrl(pathName)}${
                  item.route == "/order" ? "/order" : `/profile/${item.route}`
                }`}
                key={i}
                className="bg-primary h-[50px] flex justify-center items-center text-white font-normal text-sm rounded-[10px]"
              >
                {item.title}
              </Link>
            ))}
            <Link href={`${getUrl(pathName)}/login`} className="w-full">
              <Button
                onClick={() => {
                  Cookies.remove("client");
                  setClient(null);
                }}
                className="w-full bg-primary h-[50px] flex justify-center items-center text-white font-normal text-sm rounded-[10px]"
              >
                {profileLinksT("log_out")}
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-primary rounded-xl w-full min-w-[250px] max-w-[331px] h-[180px] sm:h-[220px] flex flex-col justify-between items-center relative py-[5px] mt-5">
          <div className="flex flex-col gap-[2px] lg:gap-1 items-center justify-center pt-5">
            <p className="font-bold text-white text-xl sm:text-2xl lg:text-[32px] ">
              {client.client_groups_discount == "30"
                ? "GOLD"
                : client.client_groups_discount == "20"
                ? "SILVER"
                : "BRONZE"}
            </p>
            <p className="font-bold text-white text-center lg:text-xl">
              {client.client_groups_discount}%
            </p>
            <p className="font-bold text-white text-center text-[10px] ">
              {profileT("have_bonus")}
            </p>
            <p className="font-bold text-white text-center text-lg sm:text-lg ">
              {formatCurrency(client.bonus / 100)} {allT("sum")}
            </p>
          </div>
          <Image
            src={gold}
            alt="gold"
            width={350}
            height={100}
            className="absolute top-0 h-full"
          />
          <p className="font-bold text-white text-center text-[10px]  tracking-[0.12rem]">
            ROLLINGSUSHI
          </p>
        </div>
        <div className="flex flex-col gap-y-[15px] pt-10 w-full max-w-md lg:hidden ">
          {profileLinksData.map((item, i) => (
            <Link
              href={`${getUrl(pathName)}${
                item.route == "/order" ? "/order" : `/profile/${item.route}`
              }`}
              key={i}
              className="bg-primary h-[50px] flex justify-center items-center text-white font-normal text-sm rounded-[10px]"
            >
              {item.title}
            </Link>
          ))}
          <Link href={`${getUrl(pathName)}/login`} className="w-full">
            <Button
              onClick={() => {
                Cookies.remove("client");
                setClient(null);
              }}
              className="w-full bg-primary h-[50px] flex justify-center items-center text-white font-normal text-sm rounded-[10px]"
            >
              {profileLinksT("log_out")}
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
