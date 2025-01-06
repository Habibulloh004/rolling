import Container from "@/components/shared/container";
import { aboutLogo } from "@/public";
import { getTranslations, getLocale } from "next-intl/server";
import Image from "next/legacy/image";
import React from "react";
import TeamCards from "./_components/cards";
import Link from "next/link";

export const metadata = {
  title: "О нас - Rolling Sushi",
  description:
    "Узнайте больше о Rolling Sushi: наш подход, качество, миссия, ценности. Мы предлагаем свежие и вкусные суши с доставкой и в ресторане.",
  keywords: "О нас, Rolling Sushi, японская кухня, свежие суши, доставка еды",
  alternates: {
    canonical: "https://rollingsushi.uz/about-us",
  },
};

const AboutUs = async ({ params }) => {
  const [param, aboutUsT] = await Promise.all([
    params,
    getTranslations("AboutUsPage"),
  ]);
  const description = aboutUsT("description")
    .split("***")
    .map((sentence) => sentence.trim());

  return (
    <Container className={"flex-col items-start py-3 md:py-8 text-muted"}>
      <h1 className="text-xl md:text-2xl font-semibold">{aboutUsT("title")}</h1>
      <Container className={"w-[97%] items-start gap-10 justify-between"}>
        <section className="w-full sm:w-[60%]">
          <p className="font-semibold py-3 md:py-5 text-lg md:text-xl">
            {aboutUsT("intro")}
          </p>
          <div className="sm:hidden flex justify-center my-6">
            <Image
              src={aboutLogo}
              alt={`aboutlogo`}
              // fill={true}
              className="w-[400px] aspect-[4/1]"
            />
          </div>
          <p className="first-letter:pl-6">{aboutUsT("introBottom")}</p>
          <div className="md:pl-10 py-3 md:py-8">
            <p className="font-semibold text-lg">
              {aboutUsT("descriptionTop")}
            </p>
            <ul className="text-sm md:text-base py-2">
              {description.map((item, index) => (
                <li className="list-disc leading-relaxed" key={index}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <p>{aboutUsT("descriptionBottom")}</p>
          <div className="flex flex-col gap-3 sm:hidden mt-4">
            <Link
              href={`/${param.locale}/${param.place}/reviews`}
              className="w-full rounded-md bg-primary text-white py-2 text-xs md:text-sm text-center"
            >
              {aboutUsT("btnReview")}
            </Link>
            <Link
              href={`/${param.locale}/${param.place}/create-vacansy`}
              className="w-full rounded-md bg-primary text-white py-2 text-xs md:text-sm text-center"
            >
              {aboutUsT("btnVacansy")}
            </Link>
          </div>
        </section>
        <section className="hidden sm:block pt-10 w-[30%] space-y-6">
          <Image
            src={aboutLogo}
            alt={`aboutlogo`}
            // fill
            className="w-[400px] aspect-[4/1]"
          />
          <p className="font-semibold text-muted text-center">
            {aboutUsT("logoBottom")}
          </p>
          <div className="flex flex-col gap-3">
            {/* <CreateReview /> */}
            <Link
              href={`/${param.locale}/${param.place}/reviews`}
              className="w-full lg:w-3/4 mx-auto rounded-md bg-primary text-white py-2 text-xs md:text-sm text-center"
            >
              {aboutUsT("btnReview")}
            </Link>
            <Link
              href={`/${param.locale}/${param.place}/create-vacansy`}
              className="w-full lg:w-3/4 mx-auto rounded-md bg-primary text-white py-2 text-xs md:text-sm text-center"
            >
              {aboutUsT("btnVacansy")}
            </Link>
          </div>
        </section>
      </Container>
      <section className="mt-10 md:mt-14">
        <h1 className="text-xl md:text-2xl font-semibold">
          {aboutUsT("ourComand")}
        </h1>
        <TeamCards />
      </section>
    </Container>
  );
};

export default AboutUs;
