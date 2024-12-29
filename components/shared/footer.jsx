import React from "react";
import Container from "./container";
import { getLocale } from "next-intl/server";
import { secondaryIcon } from "@/public";
import { Link } from "@/i18n/routing";
import Image from "next/legacy/image";

const Footer = async () => {
  const locale = await getLocale();
  return (
    <footer className="bg-white grow min-h-[300px] flex items-center">
      <Container className={`border-b border-primary`}>
        <section>
          <Link locale={locale} href="/" className="flex-shrink-0 mt-5">
            <Image
              src={secondaryIcon}
              alt="Rolling Sushi"
              width={282}
              height={74}
              className=""
            />
          </Link>
        </section>
      </Container>
    </footer>
  );
};

export default Footer;
