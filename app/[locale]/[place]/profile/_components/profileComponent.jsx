"use client";

import { profileLinks } from "@/lib/utils";
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { gold, pencil } from "@/public";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "use-intl";

export default function ProfileComponent({ path, locale }) {
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
      route: "/bonuses",
    },
    {
      title: profileLinksT("log_out"),
      route: "/logout",
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
              <div className="flex items-center bg-[#F5F5F5] border-[0.5px] border-[#B9B9BB] rounded-[10px] w-full min-w-[240px] max-w-[454px] pr-7 mt-2 mb-5 h-12">
                <Input
                  id="name"
                  onChange={(e) => console.log(e)}
                  value="Клиент Клиентов"
                  type="text"
                  placeholder="Last Name"
                  className={
                    "focus-visible:outline-none focus-visible:ring-0 border-none shadow-none"
                  }
                />
                <button>
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
                  onChange={(e) => console.log(e)}
                  id="name"
                  value="+998935204050"
                  type="text"
                  placeholder="Last Name"
                  className={
                    "text-base focus-visible:outline-none focus-visible:ring-0 border-none shadow-none"
                  }
                />
              </div>
            </div>
          </article>
          <div className="hidden  lg:flex flex-col gap-y-[15px] w-[337px] absolute top-0 right-0">
            {profileLinksData.map((item, i) => (
              <Link
                href={`/${locale}/${path?.place}${
                  item.route == "/order" ? "/order" : `/profile/${item.route}`
                }`}
                key={i}
                className="bg-primary h-[50px] flex justify-center items-center text-white font-normal text-sm rounded-[10px]"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-primary rounded-xl w-full min-w-[250px] max-w-[331px] h-[180px] sm:h-[220px] flex flex-col justify-between items-center relative py-[5px] mt-5">
          <div className="flex flex-col gap-[2px] lg:gap-1 items-center justify-center pt-5">
            <p className="font-bold text-white text-xl sm:text-2xl lg:text-[32px] ">GOLD</p>
            <p className="font-bold text-white text-center lg:text-xl">30%</p>
            <p className="font-bold text-white text-center text-[10px] ">
              Имеющиеся бонусы:
            </p>
            <p className="font-bold text-white text-center text-lg sm:text-xl lg:text-2xl ">
              45 000 сум
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
              href={`/${locale}/${path?.place}${
                item.route == "/order" ? "/order" : `/profile/${item.route}`
              }`}
              key={i}
              className="bg-primary h-[50px] flex justify-center items-center text-white font-normal text-sm rounded-[10px]"
            >
              {item.title}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
