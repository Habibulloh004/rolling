import Banner from "@/components/shared/banner";
import { getData } from "@/service";
import { getLocale, getTranslations } from "next-intl/server";
import Categories from "./_components/categories";
import Container from "@/components/shared/container";
import Popular from "./_components/popular";
import { ApiService } from "@/service/api.services";
import TitleComponent from "./_components/titleComponent";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Cards from "./reviews/_components/cards";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

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

export default async function HomePage({ params, searchParams }) {

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
    getTranslations('All'),
    getData("/banner/get_banners"),
    getData("/poster/google"),
    ApiService.getPosterData("menu.getCategories"),
    ApiService.getPosterData("menu.getProducts"),
    searchParams,
    getLocale(),
    params,
  ]);

  let spotData;
  if (path.place === "branch") {
    spotData = await ApiService.getPosterData(
      "spots.getSpot",
      `&spot_id=${searchParamsData.spot}`
    );
  }

  const banners = bannersData.banners;
  const categories = categoriesData.response.filter(
    (item) => item.category_photo != null && item.category_hidden != "1"
  );
  const products = productsData.response.filter((item) => {
    const findIngr = item?.ingredients?.find(
      (ingr) => ingr?.ingredient_id == 211
    );
    if (item.photo_origin != null && item?.menu_category_id != 0 && findIngr) {
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
          <h1 className="text-xl md:text-2xl text-muted font-semibold">
            {allT("reviews")}
          </h1>
          <Link
            className="flex justify-end items-center gap-1 text-primary textSmall3 font-medium"
            href={`/${path.locale}/${path.place}/reviews`}
          >
            {allT("more")}
            <ChevronRight size={18} />

          </Link>
        </div>
        <Carousel
          className="relative w-full text-foreground mt-5 md:mt-10 "
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
                  className={`basis-[80%] sm:basis-[45%] lg:basis-[45%] xl:basis-[30%] p-0 mx-2 ${i == 0 && "max-sm:ml-8 max-md:ml-16 ml-8"
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
