"use client";

import { useEffect, useState } from "react";
import Left from "./left";
import Right from "./right";
import CartSidebar from "./sidebar";
import Products from "./products";
import Payment from "./payment";
import Order from "./order";
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

function IngredientCarousel({ title, productsIng = [], locale, path }) {
  if (!productsIng?.length) {
    return null;
  }

  return (
    <section className="w-full mt-5 space-y-3 pb-4">
      <div className="w-11/12 sm:w-full mx-auto flex justify-between items-center gap-3">
        <h1 className="font-bold text-primary textNormal4 w-full">{title}</h1>
      </div>
      <Carousel className="relative w-full text-foreground mt-5 md:mt-10 " paginate={"false"}>
        <CarouselContent className="relative">
          {productsIng.map((item, i) => {
            const localizedName = getLocalizedProduct(
              item.product_production_description,
              locale,
              "name"
            );
            const localizedDesc = getLocalizedProduct(
              item.product_production_description,
              locale,
              "desc"
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
                key={item.product_id || i}
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

export default function CartResponsive({
  apiTime,
  auth,
  path,
  locale,
  spotData,
  searchParamsData,
  promotions,
  productsData,
  categoriesData,
  productsIng,
  cartIngredientLabel,
}) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsDesktop(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  if (isDesktop) {
    return (
      <>
        <div className="grid lg:grid-cols-2 lg:gap-16 w-full">
          <Left
            apiTime={apiTime}
            auth={auth}
            place={path.place}
            locale={locale}
            spotData={spotData}
            searchParamsData={searchParamsData}
          />
          <Right
            apiTime={apiTime}
            promotions={promotions}
            auth={auth}
            products={productsData.filter((c) => c.menu_category_id != 0).slice(0, 10)}
            locale={locale}
            place={path.place}
            spotData={spotData}
            searchParamsData={searchParamsData}
            productsData={productsData}
            categoriesData={categoriesData}
          />
        </div>
        <IngredientCarousel
          title={cartIngredientLabel}
          productsIng={productsIng}
          locale={locale}
          path={path}
        />
      </>
    );
  }

  return (
    <div className="w-full space-y-2">
      <CartSidebar
        apiTime={apiTime}
        auth={auth}
        locale={locale}
        place={path.place}
        spotData={spotData}
        searchParamsData={searchParamsData}
      />
      <Products
        apiTime={apiTime}
        locale={locale}
        auth={auth}
        place={path.place}
        categoriesData={categoriesData}
      />
      <IngredientCarousel
        title={cartIngredientLabel}
        productsIng={productsIng}
        locale={locale}
        path={path}
      />
      <Payment apiTime={apiTime} locale={locale} place={path.place} auth={auth} />
      <Order
        categoriesData={categoriesData}
        apiTime={apiTime}
        promotions={promotions}
        auth={auth}
        searchParamsData={searchParamsData}
        locale={locale}
        productsData={productsData}
        place={path.place}
        spotDataFilial={spotData}
      />
    </div>
  );
}
