import Container from "@/components/shared/container";
import { getLocale, getTranslations } from "next-intl/server";
import React from "react";
import OrderItemComponent from "./_components/orderItemComponent";
import { ApiService } from "@/service/api.services";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { formatText, getLocalizedCategoryName, getLocalizedProduct } from "@/lib/utils";
import Card from "@/components/shared/card";

const Confirmed = async ({ params }) => {
  const [param, locale, orderText, productsData, spotsData, all] =
    await Promise.all([
      params,
      getLocale(),
      getTranslations("Order.Item"),
      ApiService.getPosterData("menu.getProducts"),
      ApiService.getPosterData("access.getSpots"),
      getTranslations("All"),
    ]);
  const products = productsData?.response?.filter((item) => {
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
    <Container className="w-11/12 pt-3 md:pt-8 flex flex-col ">
      <h1 className="font-bold  text-primary textNormal4 text-start w-full">
        {orderText("title")} - № {param.id}
      </h1>
      <p
        className="hidden lg:block textSmall4 font-normal text-[#004032] pt-4"
        dangerouslySetInnerHTML={{
          __html: orderText("desc").replace(
            /Rolling Sushi/g,
            "<strong>Rolling Sushi</strong>"
          ),
        }}
      ></p>
      <OrderItemComponent
        locale={locale}
        param={param}
        productsData={productsData?.response}
        spotsData={spotsData?.response}
      />
      <p
        className="block lg:hidden textSmall4 font-normal text-[#004032] pt-4"
        dangerouslySetInnerHTML={{
          __html: orderText("desc").replace(
            /Rolling Sushi/g,
            "<strong>Rolling Sushi</strong>"
          ),
        }}
      ></p>
      {/* Carousel for popular categories */}
      <section className="w-full mt-5 space-y-3 pb-4">
        <div className="w-11/12 sm:w-full mx-auto flex justify-between items-center gap-3">
          <h1 className="font-bold text-primary textNormal4 w-full">
            {all("popular")}
          </h1>
          <Link
            href={`/${locale}/${param?.place}/new-popular`}
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
                    defaultHref={`/${locale}/${param.place}/category/${item?.menu_category_id}-${linkNameCategory}/product/${item?.product_id}-${linkNameProduct}`}
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
};

export default Confirmed;
