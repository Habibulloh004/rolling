"use client";
import React from "react";
import Container from "./container";
import Image from "next/legacy/image";
import { footItems } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

export default function Footer({ params: path }) {
  const pathname = usePathname();
  const footerT = useTranslations("Footer");
  const footNavT = useTranslations("FootNav");
  const AboutUsPage = useTranslations("AboutUsPage");
  if (path.place !== "branch") {
    return (
      <footer
        className={`bg-white min-h-[300px] flex items-center flex-shrink-0 py-3 ${
          pathname.includes("/login") ||
          pathname.includes("/sign-up") ||
          pathname.includes("/reset-password")
            ? ""
            : "mt-8"
        }`}
      >
        <Container className={`border-b border-primary py-2`}>
          <section className="space-y-2 md:space-y-4 text-xs flex flex-col justify-center">
            <Link
              href={`/${path.locale}/${path.place}`}
              className="flex-shrink-0 max-md:mx-auto mt-5 w-[200px] md:w-[280px]"
            >
              <Image
                src={`/assets/secondaryIcon.webp`}
                alt="Rolling Sushi"
                width={282}
                height={74}
                className=""
              />
            </Link>
            <p
              className="text-sm leading-relaxed text-center md:text-left"
              dangerouslySetInnerHTML={{ __html: footerT("logoBottom") }}
            />
            <div className="space-y-1 max-md:flex max-md:flex-col max-md:items-center ">
              <span className="flex items-center gap-2">
                <p>{footerT("phone")}</p>
                <a
                  className="font-semibold text-black"
                  href="tel:+998771244444"
                >
                  +998 77 124-44-44
                </a>
              </span>
              <span className="flex items-center gap-2">
                <p>{footerT("email")}</p>
                <a
                  className="font-semibold text-black"
                  href="mailto:rollingsushiuz@gmail.com"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  rollingsushiuz@gmail.com
                </a>
              </span>
            </div>
            <div className="flex flex-col gap-2 text-sm lg:hidden max-md:items-center">
              <p className="font-semibold">{footerT("download")}</p>
              <div className="md:-translate-x-3 w-full max-sm:flex items-center justify-between flex-col gap-2">
                <a href="https://play.google.com/store/apps/details?id=com.abdurrahmonxoja.RollingSushi">
                  <Image
                    src={`/assets/appStoreIcon.webp`}
                    alt="app store icon"
                    width={166}
                    height={54}
                    className=""
                  />
                </a>
                <a href="https://apps.apple.com/uz/app/rolling-sushi/id6483865556">
                  <Image
                    src={`/assets/playMarketIcon.webp`}
                    alt="play market icon"
                    width={166}
                    height={54}
                    className=""
                  />
                </a>
              </div>
            </div>
          </section>
          <section className="w-1/2 hidden lg:flex flex-col items-end gap-2 text-sm">
            <p className="font-semibold">{footerT("download")}</p>
            <div className="translate-x-2">
              <a href="https://play.google.com/store/apps/details?id=com.abdurrahmonxoja.RollingSushi">
                <Image
                  src={`/assets/appStoreIcon.webp`}
                  alt="app store icon"
                  width={166}
                  height={54}
                  className=""
                />
              </a>
              <a
                href="https://apps.apple.com/uz/app/rolling-sushi/id6483865556"
                target="blank"
              >
                <Image
                  src={`/assets/playMarketIcon.webp`}
                  alt="play market icon"
                  width={166}
                  height={54}
                  className=""
                />
              </a>
            </div>
            <div className="text-sm flex items-center justify-between w-full xl:w-[60%] gap-2">
              <ul className="flex flex-col gap-2">
                {footItems.map((item) => {
                  return (
                    <li key={item.id}>
                      <Link
                        href={`/${path.locale}/${path.place}/${item.path}`}
                        className="flex items-center gap-1 font-semibold"
                      >
                        <ChevronRight className="size-4 md:size-5" />
                        {footNavT(`${item.title}`)}
                      </Link>
                    </li>
                  );
                })}
                {/* <Link
                  href={`/${path.locale}/${path.place}/about-us/privacy-policy`}
                  className="flex items-center gap-1 font-semibold"
                >
                  <ChevronRight className="size-4 md:size-5" />
                  {AboutUsPage(`btnPolicy`)}
                </Link> */}
              </ul>
              <article className="flex flex-col gap-2">
                <p>{footerT("addressName")}</p>
                <a target="_blank" href="https://yandex.uz/maps/-/CHQDmGIG">
                  {footerT("address1")}
                </a>
                <a target="_blank" href="https://yandex.uz/maps/-/CHQDmK26">
                  {footerT("address2")}
                </a>
                <a target="_blank" href="https://yandex.uz/maps/-/CHQDmO3~">
                  {footerT("address3")}
                </a>
              </article>
            </div>
          </section>
        </Container>
      </footer>
    );
  }
}
