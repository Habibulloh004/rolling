"use client";

import {
  formatText,
  getLocalizedCategoryName,
  getLocalizedProduct,
} from "@/lib/utils";
import Container from "@/components/shared/container";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "use-intl";
import Card from "@/components/shared/card";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const Popular = ({ products = [], locale, path }) => {
  const allT = useTranslations("All");
  const searchParams = useSearchParams();
  const spot = searchParams.get("spot");
  const table_id = searchParams.get("table_id");
  const table_num = searchParams.get("table_num");
  const service = searchParams.get("service");

  return (
    <Container className="mt-5 w-full flex-col gap-3 pb-4">
      <div className="w-11/12 flex justify-between items-center gap-3">
        <Link
          locale={locale}
          href={
            path?.place !== "branch"
              ? `/${locale}/${path?.place}/new-popular`
              : `/${locale}/${path?.place}/new-popular?spot=${spot}&table_id=${table_id}&table_num=${table_num}&service=${service}`
          }
          className="font-bold text-thin textNormal4"
        >
          {allT("popular")}
        </Link>
        <Link
          locale={locale}
          href={
            path?.place !== "branch"
              ? `/${locale}/${path?.place}/new-popular`
              : `/${locale}/${path?.place}/new-popular?spot=${spot}&table_id=${table_id}&table_num=${table_num}&service=${service}`
          }
          className="textSmall3 flex items-center gap-1 text-primary font-medium"
        >
          {allT("more")}
          <ChevronRight size={18} />
        </Link>
      </div>

      <Carousel className="relative w-full text-foreground mt-5">
        <CarouselContent className="relative">
          {products.map((item, i) => {
            const localizedName = getLocalizedProduct(
              item.product_production_description,
              locale,
              "name"
            );

            const linkNameCategory = formatText(
              getLocalizedCategoryName(item.category_name, "en")
            );

            const linkNameProducts = formatText(
              getLocalizedProduct(
                item?.product_production_description,
                "en",
                "name"
              )
            );

            return (
              <CarouselItem
                key={item.product_id || i}
                className={`basis-[40%] sm:basis-[30%] md:basis-[20%] lg:basis-[15%] p-0 mx-2 ${
                  i === 0 && "max-sm:ml-8 max-md:ml-16 ml-8"
                }`}
              >
                <Card
                  defaultHref={
                    path?.place !== "branch"
                      ? `/${locale}/${path?.place}/category/${item?.menu_category_id}-${linkNameCategory}/product/${item?.product_id}-${linkNameProducts}`
                      : `/${locale}/${path?.place}/category/${item?.menu_category_id}-${linkNameCategory}/product/${item?.product_id}-${linkNameProducts}?spot=${spot}&table_id=${table_id}&table_num=${table_num}&service=${service}`
                  }
                  locale={locale}
                  item={item}
                  photo={item.photo}
                  localizedName={
                    localizedName
                      ? localizedName
                      : item.product_name?.split("$")[0]
                  }
                  price={item.price?.["1"] / 100}
                />
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </Container>
  );
};

export default Popular;
