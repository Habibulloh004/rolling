import React from "react";
import Container from "@/components/shared/container";
import Card from "@/components/shared/card";
import { getLocale, getTranslations } from "next-intl/server";
import { getLocalizedCategoryName } from "@/lib/utils";
import ProductsCard from "./_components/productsCard";

export const metadata = {
  title: "Избранное – Ваши любимые суши и роллы в Rolling Sushi",
  description:
    "Сохраняйте любимые суши и роллы в избранное и заказывайте быстрее! Rolling Sushi – это вкус и удобство в одном месте.",
  alternates: {
    canonical: "https://rolling.uz/uz/web/saved",
    ru: "https://rolling.uz/ru/web/saved",
    en: "https://rolling.uz/en/web/saved",
  },
};

const Favourite = async ({ params }) => {
  const [locale, all, path] = await Promise.all([
    getLocale(),
    getTranslations("Navbar"),
    params,
  ]);
  return (
    <Container className="w-11/12 flex flex-col pt-5 space-y-3">
      <section className="w-full mt-5 space-y-3 pb-4">
        <div className="flex justify-between items-center gap-3">
          <h1 className="font-bold text-primary textNormal4 w-full">
            {all("saved")}
          </h1>
        </div>
        <ProductsCard locale={locale} path={path} />
      </section>
    </Container>
  );
};

export default Favourite;
