import Banner from "@/components/shared/banner";
import { getData } from "@/service";
import { getLocale } from "next-intl/server";
import Categories from "./_components/categories";
import Container from "@/components/shared/container";
import Popular from "./_components/popular";
import { ApiService } from "@/service/api.services";

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

export default async function HomePage({ params }) {
  const [bannersData, categoriesData, productsData] = await Promise.all([
    getData("/banner/get_banners"),
    ApiService.getPosterData("menu.getCategories"),
    ApiService.getPosterData("menu.getProducts"),
  ]);

  const banners = bannersData.banners;
  const categories = categoriesData.response.filter(
    (item) => item.category_photo != null && item.category_hidden != "1"
  );
  const products = productsData.response
    .filter((item) => item.photo_origin != null && item?.menu_category_id != 0)
    .slice(0, 10);

  const [locale, path] = await Promise.all([getLocale(), params]);

  return (
    <Container className={"w-full flex-col"}>
      <Banner banners={banners} />
      <Categories categories={categories} locale={locale} path={path} />
      <Popular products={products} locale={locale} path={path} />
    </Container>
  );
}
