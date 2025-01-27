import Container from "@/components/shared/container";
import React from "react";
import Products from "./_components/products";
import Order from "./_components/order";
import Payment from "./_components/payment";
import Right from "./_components/right";
import Left from "./_components/left";
import { getLocale, getTranslations } from "next-intl/server";
import { ApiService } from "@/service/api.services";
import CartSidebar from "./_components/sidebar";
import { cookies } from "next/headers";
import Head from "next/head";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  formatText,
  getLocalizedCategoryName,
  getLocalizedProduct,
} from "@/lib/utils";
import Card from "@/components/shared/card";

export async function generateMetadata() {
  return {
    title: "Корзина - Rolling Sushi",
    description:
      "Просмотрите ваш заказ, выберите способ доставки и оформите покупку в Rolling Sushi.",
    keywords: "корзина, оформить заказ, доставка суши, Rolling Sushi, Ташкент",
    alternates: {
      canonical: "https://rollingsushi.uz/cart",
    },
  };
}

const Basket = async ({ params, searchParams }) => {
  const cookieStore = await cookies();
  const cookiesData = cookieStore.get("client");
  const auth = cookiesData ? JSON.parse(cookiesData.value) : {};

  const [cart, products, locale, path, searchParamsData, all] =
    await Promise.all([
      getTranslations("Cart"),
      ApiService.getPosterData("menu.getProducts"),
      getLocale(),
      params,
      searchParams,
      getTranslations("All"),
    ]);

  let spotData;
  if (path.place === "branch") {
    spotData = await ApiService.getPosterData(
      "spots.getSpot",
      `&spot_id=${searchParamsData.spot}`
    );
  }
  const productsIng = products?.response?.filter((item) => {
    const findIngr = item?.ingredients?.find(
      (ingr) => ingr?.ingredient_id == 213
    );
    if (item.photo_origin != null && item?.menu_category_id != 0 && findIngr) {
      return true;
    } else {
      return false;
    }
  });
  return (
    <>
      <Container
        className={"w-11/12 flex flex-col md:gap-5 pt-4 md:pt-8 gap-2"}
      >
        <h1 className="w-full text-primary font-bold font-Poppins leading-10 text-start textNormal4">
          {cart("title")}
        </h1>
        {/* Desktop version */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-16 w-full">
          <Left
            auth={auth}
            place={path.place}
            locale={locale}
            spotData={spotData}
            searchParamsData={searchParamsData}
          />
          <Right
            auth={auth}
            products={products.response
              .filter((c) => c.menu_category_id != 0)
              .slice(0, 10)}
            locale={locale}
            place={path.place}
            searchParamsData={searchParamsData}
          />
        </div>
        {/* Mobile version */}
        <div className="lg:hidden w-full space-y-2">
          <CartSidebar
            auth={auth}
            locale={locale}
            place={path.place}
            spotData={spotData}
            searchParamsData={searchParamsData}
          />
          <Products locale={locale} auth={auth} place={path.place} />
          <Payment locale={locale} place={path.place} auth={auth} />
          <Order
            auth={auth}
            searchParamsData={searchParamsData}
            locale={locale}
            place={path.place}
          />
        </div>
        {/* Carousel for popular categories */}
        <section className="w-full mt-5 space-y-3 pb-4">
          <div className="w-11/12 sm:w-full mx-auto flex justify-between items-center gap-3">
            <h1 className="font-bold text-primary textNormal4 w-full">
              {all("cart_ingredient")}
            </h1>
          </div>
          <Carousel
            className="relative w-full text-foreground mt-5 md:mt-10 "
            paginate={"false"}
          >
            {/* <div className="absolute -right-1 -top-4 w-2 h-48 bg-[#F5F5F5] z-50 shadow-custom" /> */}
            <CarouselContent className="relative">
              {productsIng?.map((item, i) => {
                const localizedName = getLocalizedProduct(
                  item.product_production_description,
                  locale,
                  "name"
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
    </>
  );
};

export default Basket;
