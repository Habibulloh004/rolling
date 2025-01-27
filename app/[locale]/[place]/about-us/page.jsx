import Container from "@/components/shared/container";
import { getTranslations } from "next-intl/server";
import Image from "next/legacy/image";
import React from "react";
import Link from "next/link";

export const metadata = {
  title: "О нас | Rolling Sushi - ваша любимая суши-доставка",
  description: "Узнайте историю нашей компании, наши принципы и почему тысячи людей выбирают Rolling Sushi для заказа суши в Ташкенте.",
  keywords: "о нас, Rolling Sushi, японская кухня, суши, доставка еды, Ташкент"
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
      <h1 className="text-xl md:text-2xl font-semibold ">{aboutUsT("title")}</h1>
      <Container className={"w-[97%] items-start gap-10 justify-between"}>
        <section className="w-full sm:w-[60%]">
          <p className="font-bold py-3 md:py-5 text-lg md:text-xl">
            {aboutUsT("intro")}
          </p>
          <div className="sm:hidden flex justify-center my-6">
            <Image
              src={`/assets/aboutLogo.svg`}
              alt={`aboutlogo`}
              width={100}
              height={100}
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
              href={`/${param.locale}/${param.place}/about-us/faq`}
              className="w-full h-[50px] flex items-center justify-center rounded-md bg-primary text-white py-2 text-xs md:text-sm text-center"
            >
              {aboutUsT("btnQuestions")}
            </Link>
            <Link
              href={`/${param.locale}/${param.place}/about-us/privacy-policy`}
              className="w-full h-[50px] flex items-center justify-center rounded-md bg-primary text-white py-2 text-xs md:text-sm text-center"
            >
              {aboutUsT("btnPolicy")}
            </Link>
            <Link
              href={`/${param.locale}/${param.place}/about-us/contact`}
              className="w-full h-[50px] flex items-center justify-center rounded-md bg-primary text-white py-2 text-xs md:text-sm text-center"
            >
              {aboutUsT("btnContact")}
            </Link>
            <Link
              href={`/${param.locale}/${param.place}/reviews`}
              className="w-full h-[50px] flex items-center justify-center rounded-md bg-primary text-white py-2 text-xs md:text-sm text-center"
            >
              {aboutUsT("btnReview")}
            </Link>
            <Link
              href={`/${param.locale}/${param.place}/create-vacansy`}
              className="w-full h-[50px] flex items-center justify-center rounded-md bg-primary text-white py-2 text-xs md:text-sm text-center"
            >
              {aboutUsT("btnVacansy")}
            </Link>
          </div>
        </section>
        <section className="hidden sm:block  w-[30%] space-y-4">
          <Image
            src={`/assets/aboutLogo.svg`}
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
              href={`/${param.locale}/${param.place}/about-us/faq`}
              className="w-full lg:w-3/4 mx-auto rounded-md bg-primary text-white py-4 text-xs md:text-sm text-center"
            >
              {aboutUsT("btnQuestions")}
            </Link>
            <Link
              href={`/${param.locale}/${param.place}/about-us/privacy-policy`}
              className="w-full lg:w-3/4 mx-auto rounded-md bg-primary text-white py-4 text-xs md:text-sm text-center"
            >
              {aboutUsT("btnPolicy")}
            </Link>
            <Link
              href={`/${param.locale}/${param.place}/about-us/contact`}
              className="w-full lg:w-3/4 mx-auto rounded-md bg-primary text-white py-4 text-xs md:text-sm text-center"
            >
              {aboutUsT("btnContact")}
            </Link>
            <Link
              href={`/${param.locale}/${param.place}/reviews`}
              className="w-full lg:w-3/4 mx-auto rounded-md bg-primary text-white py-4 text-xs md:text-sm text-center"
            >
              {aboutUsT("btnReview")}
            </Link>
            <Link
              href={`/${param.locale}/${param.place}/create-vacansy`}
              className="w-full lg:w-3/4 mx-auto rounded-md bg-primary text-white py-4 text-xs md:text-sm text-center"
            >
              {aboutUsT("btnVacansy")}
            </Link>
          </div>
        </section>
      </Container>
      {/* <sectio  */}
    </Container>
  );
};

export default AboutUs;
