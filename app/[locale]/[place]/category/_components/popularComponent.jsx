import { ApiService } from "@/service/api.services";
import { getLocale, getTranslations } from "next-intl/server";
import React from "react";
import {
  formatText,
  getLocalizedCategoryName,
  getLocalizedProduct,
} from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Card from "@/components/shared/card";
import Link from "next/link";

export default async function PopularComponent({ searchParamsData, path }) {
  const [locale, all, productsData] = await Promise.all([
    getLocale(),
    getTranslations("All"),
    ApiService.getPosterData("menu.getProducts", "", 7200),
  ]);
  const { spot, table_id, table_num, service } = searchParamsData;
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
            const localizedDesc = formatText(
              getLocalizedProduct(
                item.product_production_description,
                locale,
                "desc"
              )
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
                  localizedDesc={localizedDesc}
                  photo={item.photo_origin}
                  price={item?.price["1"] / 100}
                />
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
