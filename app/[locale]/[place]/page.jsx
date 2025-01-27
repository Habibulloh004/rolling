import Banner from "@/components/shared/banner";
import { getData } from "@/service";
import { getLocale } from "next-intl/server";
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
    bannersData,
    reviewsData,
    categoriesData,
    productsData,
    searchParamsData,
    locale,
    path,
  ] = await Promise.all([
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
      {path.place != "branch" && <Banner banners={banners} />}
      <Categories categories={categories} locale={locale} path={path} />
      <Popular products={products} locale={locale} path={path} />
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
                className={`basis-[80%] sm:basis-[45%] lg:basis-[45%] xl:basis-[30%] p-0 mx-2 ${
                  i == 0 && "max-sm:ml-8 max-md:ml-16 ml-8"
                }`}
              >
                <Link href="https://g.co/kgs/YJy7TYy" target="_blank">
                  <Cards data={item} />
                </Link>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </Container>
  );
}
