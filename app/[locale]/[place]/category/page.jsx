import CustomImage from "@/components/shared/customImage";
import { Button } from "@/components/ui/button";
import {
  formatText,
  getLocalizedCategoryName,
  getLocalizedProduct,
  posterUrl,
} from "@/lib/utils";
import { ApiService } from "@/service/api.services";
import { ChevronRight, Minus, Plus } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import Container from "@/components/shared/container";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Card from "@/components/shared/card";
import Link from "next/link";

export const metadata = {
  title: "Суши-сеты в Ташкенте | Выгодные предложения от Rolling Sushi",
  description:
    "Попробуйте наши суши-сеты – идеальный выбор для компании! Выгодные цены, быстрая доставка в Ташкенте. Заказывайте прямо сейчас!",
  keywords:
    "суши-сеты, роллы, доставка суши Ташкент, выгодные сеты, японская кухня, Rolling Sushi",
  alternates: {
    canonical: "https://rolling.uz/uz/web/category",
    ru: "https://rolling.uz/ru/web/category",
    en: "https://rolling.uz/en/web/category",
  },
};

export default async function Page({ params, searchParams }) {
  const [locale, all, path, categoriesData, productsData, searchParamsData] =
    await Promise.all([
      getLocale(),
      getTranslations("All"),
      params,
      ApiService.getPosterData("menu.getCategories"),
      ApiService.getPosterData("menu.getProducts"),
      searchParams,
    ]);
  const categories = categoriesData.response.filter(
    (c) => c.category_photo != null && c.category_hidden != "1"
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
  const { spot, table_id, table_num, service } = searchParamsData;

  return (
    <Container className="w-full sm:w-11/12 flex flex-col pt-5 space-y-3">
      <section className="max-sm:w-11/12 w-full space-y-3">
        <div className="flex justify-between items-center gap-3">
          <h1 className="font-bold text-primary textNormal4 w-full">
            {all("categories")}
          </h1>
        </div>
        <div className="w-full grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 2xl:grid-cols-7 gap-5">
          {categories?.map((item, i) => {
            const localizedName = getLocalizedCategoryName(
              item.category_name,
              locale
            );

            const linkName = formatText(
              getLocalizedCategoryName(item.category_name, "en")
            );

            return (
              <Link
                key={i}
                href={
                  path?.place !== "branch"
                    ? `/${locale}/${path.place}/category/${item?.category_id}-${linkName}`
                    : `/${locale}/${path.place}/category/${item?.category_id}-${linkName}?spot=${spot}&table_id=${table_id}&table_num=${table_num}&service=${service}`
                }
                className="relative w-full h-full flex justify-start items-center flex-col gap-2"
              >
                <div className="w-full max-sm:max-h-32 aspect-square relative rounded-[20px] md:rounded-[40px] overflow-hidden">
                  <CustomImage
                    src={`${posterUrl}${item?.category_photo_origin}`}
                    className="w-full h-full object-cover aspect-square"
                    alt={`${localizedName}`}
                  />
                </div>
                <h1 className="font-bold textSmall3 sm:textSmall2 text-thin text-center">
                  {localizedName}
                </h1>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Carousel for popular categories */}
      <section className="w-full mt-5 space-y-3 pb-4">
        <div className="w-11/12 sm:w-full mx-auto flex justify-between items-center gap-3">
          <h1 className="font-bold text-primary textNormal4 w-full">
            {all("popular")}
          </h1>
          <Link
            href={`/${locale}/${path?.place}/new-popular`}
            variant="ghost"
            className="p-0 flex justify-end items-center gap-1 text-primary hover:text-primary text-sm font-medium"
          >
            {all("more")}
            <ChevronRight size={18} />
          </Link>
        </div>
        <Carousel
          className="relative w-full text-foreground mt-5 md:mt-10 "
          paginate={"false"}
        >
          {/* <div className="absolute -right-1 -top-4 w-2 h-48 bg-[#F5F5F5] z-50 shadow-custom" /> */}
          <CarouselContent className="relative">
            {products?.map((item, i) => {
              const localizedName = getLocalizedCategoryName(
                item.category_name,
                locale
              );
              const linkNameCategory = formatText(
                getLocalizedCategoryName(item.category_name, "en")
              );
              const linkNameProduct = formatText(
                getLocalizedProduct(
                  item.product_production_description,
                  "en",
                  "name"
                )
              );
              return (
                <CarouselItem
                  key={i}
                  className={`basis-[40%] sm:basis-[30%] md:basis-[20%] lg:basis-[15%] p-0 mx-2 ${
                    i == 0 && "max-sm:ml-8 max-md:ml-16 ml-8"
                  }`}
                >
                  <Card
                    locale={locale}
                    item={item}
                    defaultHref={`/${locale}/${path.place}/category/${item?.menu_category_id}-${linkNameCategory}/product/${item?.product_id}-${linkNameProduct}`}
                    localizedName={localizedName}
                    photo={item.photo_origin}
                    price={item?.price["1"] / 100}
                  />
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </section>
    </Container>
  );
}
