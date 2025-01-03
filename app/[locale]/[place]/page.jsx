import Banner from "@/components/shared/banner";
import { getData } from "@/service";
import { getLocale, getTranslations } from "next-intl/server";
import Categories from "./_components/categories";
import Container from "@/components/shared/container";
import Modals from "./_components/modals";
import { Link } from "@/i18n/routing";

export const metadata = {
  title: "Rolling Sushi - Свежие суши и роллы в Ташкенте",
  description:
    "Rolling Sushi предлагает свежие суши, роллы и японскую кухню с доставкой и в ресторане. Узнайте о наших акциях и популярном меню!",
  keywords:
    "суши, роллы, доставка суши, японская кухня, Rolling Sushi, Ташкент, акции суши",
  alternates: {
    canonical: "https://rollingsushi.uz/",
  },
};

export default async function HomePage() {
  const [bannersData, categoriesData] = await Promise.all([
    getData("/banner/get_banners"),
    getData("/poster/categories"),
  ]);

  const banners = bannersData.banners;
  const categories = categoriesData.response.filter(
    (item) => item.category_photo != null && item.category_hidden != "1"
  );

  const [locale] = await Promise.all([getLocale()]);

  return (
    <Container className={"w-full flex-col"}>
      {/* <Banner banners={banners} /> */}
      <Categories categories={categories} locale={locale} />

      <Modals categories={categories} locale={locale} />
    </Container>
  );
}
