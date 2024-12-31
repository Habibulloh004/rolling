import React from "react";
import Container from "./container";
import { getLocale, getTranslations } from "next-intl/server";
import { appStoreIcon, playMarketIcon, secondaryIcon } from "@/public";
import { Link } from "@/i18n/routing";
import Image from "next/legacy/image";
import { footItems } from "@/lib/utils";
import { ChevronRight, MoveRight } from "lucide-react";

const Footer = async () => {
  const [locale, footerT, footNavT] = await Promise.all([
    getLocale(),
    getTranslations("Footer"),
    getTranslations("FootNav"),
  ]);
  return (
    <footer className="bg-white min-h-[300px] flex items-center flex-shrink-0 py-3">
      <Container className={`border-b border-primary py-2`}>
        <section className="space-y-2 md:space-y-4 text-xs">
          <Link locale={locale} href="/" className="flex-shrink-0 mt-5">
            <Image
              src={secondaryIcon}
              alt="Rolling Sushi"
              width={282}
              height={74}
              className=""
            />
          </Link>
          <p
            className="text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: footerT("logoBottom") }}
          />
          <div className="space-y-1">
            <span className="flex items-center gap-2">
              <p>{footerT("phone")}</p>
              <a className="font-semibold text-black" href="tel:+998771244444">
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
          <div className="flex flex-col gap-2 text-sm lg:hidden">
            <p className="font-semibold">{footerT("download")}</p>
            <div className="-translate-x-3">
              <a href="/">
                <Image
                  src={appStoreIcon}
                  alt="app store icon"
                  width={166}
                  height={54}
                  className=""
                />
              </a>
              <a href="/">
                <Image
                  src={playMarketIcon}
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
            <a href="/">
              <Image
                src={appStoreIcon}
                alt="app store icon"
                width={166}
                height={54}
                className=""
              />
            </a>
            <a href="/">
              <Image
                src={playMarketIcon}
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
                      locale={locale}
                      href={item.path}
                      className="flex items-center gap-1 font-semibold"
                    >
                      <ChevronRight className="size-4 md:size-5" />
                      {footNavT(`${item.title}`)}
                    </Link>
                  </li>
                );
              })}
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
};

export default Footer;
