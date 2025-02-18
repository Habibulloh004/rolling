import dynamic from "next/dynamic";
import { getData } from "@/service";
import { getLocale, getTranslations } from "next-intl/server";
import Container from "@/components/shared/container";
import { ApiService } from "@/service/api.services";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Cards from "./reviews/_components/cards";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
const TitleComponent = dynamic(() => import("./_components/titleComponent"), {
  ssr: true,
});
const Banner = dynamic(() => import("@/components/shared/banner"), {
  ssr: true,
});
const Categories = dynamic(() => import("./_components/categories"), {
  ssr: true,
});
const Popular = dynamic(() => import("./_components/popular"), {
  ssr: true,
});

export const metadata = {
  title:
    "Rolling Sushi – Доставка суши и роллов в Ташкенте | Бесплатная доставка | Бонусы до 30%",
  description:
    "🚀 Rolling Sushi – это не просто доставка, а вкус, который запоминается! 🍣 Бесплатная доставка по акции, доставка за 40 минут или ролл в подарок, всегда свежие роллы. 🎁 Бонусная система с кешбэком до 30% – копите и оплачивайте любимые блюда! Закажите прямо сейчас – rolling.uz!",
  keywords:
    "суши, роллы, доставка суши, японская кухня, Rolling Sushi, Ташкент, акции суши",
  alternates: {
    canonical: "https://rollingsushi.uz/uz/web",
    ru: "https://rollingsushi.uz/ru/web",
    en: "https://rollingsushi.uz/en/web",
  },
};
export default async function HomePage({ params, searchParams }) {
  // await sleep(10000);
  const [
    allT,
    bannersData,
    reviewsData,
    categoriesData,
    productsData,
    searchParamsData,
    locale,
    path,
  ] = await Promise.all([
    getTranslations("All"),
    getData("/banner/get_banners", 86400),
    getData("/poster/google", 86400),
    ApiService.getPosterData("menu.getCategories", "", 86400),
    ApiService.getPosterData("menu.getProducts", "", 7200),
    searchParams,
    getLocale(),
    params,
  ]);

  let spotData;
  if (path.place === "branch") {
    spotData = await ApiService.getPosterData(
      "spots.getSpot",
      `&spot_id=${searchParamsData.spot}`,
      604800
    );
  }

  const banners = bannersData.banners;
  const categories = categoriesData.response.filter(
    (item) =>
      item.category_photo != null &&
      item.category_hidden != "1" &&
      item?.category_id != 0
  );
  const products = productsData.response.filter((item) => {
    const findIngr = item?.ingredients?.find(
      (ingr) => ingr?.ingredient_id == 211
    );
    if (
      item.photo_origin != null &&
      item?.menu_category_id != 0 &&
      findIngr &&
      item?.hidden == 0
    ) {
      return true;
    } else {
      return false;
    }
  });

  return (
    <Container className={"w-full flex-col pb-10"}>
      {path.place == "branch" && (
        <TitleComponent
          searchParamsData={searchParamsData}
          products={productsData?.response}
          categories={categories}
          locale={locale}
          path={path}
          spotData={spotData}
        />
      )}
      {path.place != "branch" && <Banner path={path} banners={banners} />}
      <Categories categories={categories} locale={locale} path={path} />
      <Popular products={products} locale={locale} path={path} />
      <div className="w-full flex flex-col items-start md:px-12 pt-6 gap-5">
        <div className="max-md:w-11/12 mx-auto flex items-center justify-between w-full">
          <Link
            className="text-xl md:text-2xl text-muted font-semibold"
            href={`/${path.locale}/${path.place}/reviews`}
          >
            {allT("reviews")}
          </Link>
          <Link
            className="flex justify-end items-center gap-1 text-primary textSmall3 font-medium"
            href={`/${path.locale}/${path.place}/reviews`}
          >
            {allT("more")}
            <ChevronRight size={18} />
          </Link>
        </div>
        <Carousel
          className="relative w-full text-foreground mt-5 "
          paginate={"false"}
          opts={{
            align: "center",
          }}
        >
          <CarouselContent className="relative">
            {reviewsData.result.reviews.map((item, i) => {
              if (item.rating < 4) return;
              return (
                <CarouselItem
                  key={i}
                  className={`basis-[80%] sm:basis-[45%] lg:basis-[45%] xl:basis-[30%] p-0 mx-2 ${
                    i == 0 && "max-sm:ml-8 max-md:ml-16 ml-8"
                  }`}
                >
                  <a href="https://g.co/kgs/YJy7TYy" target="_blank">
                    <Cards data={item} />
                  </a>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </div>
    </Container>
  );
}
