import React from "react";
import Container from "@/components/shared/container";
import Card from "@/components/shared/card";
import { getLocale, getTranslations } from "next-intl/server";
import { ApiService } from "@/service/api.services";
import {
  formatText,
  getLocalizedCategoryName,
  getLocalizedProduct,
} from "@/lib/utils";

export const metadata = {
  title:
    "Популярные хиты и новинки Rolling Sushi – Лучшие роллы и суши | Доставка 40 мин",
  description:
    "🔥 Популярные хиты и свежие новинки Rolling Sushi! 🍣 Лучшие классические, запечённые и горячие роллы, WOK и эксклюзивные блюда от наших шеф-поваров. 🚀 Доставка за 40 минут или ролл в подарок! 🎁 Бонусная система до 30% кешбэка – пробуйте новинки и получайте выгоду! Закажите прямо сейчас – rolling.uz!",
  keywords:
    "популярные суши, топ роллы, японская кухня Ташкент, лучшие суши, доставка еды",
  alternates: {
    canonical: "https://rolling.uz/uz/web/new-popular",
    ru: "https://rolling.uz/ru/web/new-popular",
    en: "https://rolling.uz/en/web/new-popular",
  },
};

const ColdRolls = async ({ params, searchParams }) => {
  const [locale, all, path, products, searchParamsData] = await Promise.all([
    getLocale(),
    getTranslations("All"),
    params,
    ApiService.getPosterData("menu.getProducts", "", 7200),
    searchParams,
  ]);
  const productsData = products.response.filter((item) => {
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
    <Container className="w-11/12 flex flex-col pt-5 space-y-3">
      <section className="w-full mt-5 space-y-3 pb-4">
        <div className="flex justify-between items-center gap-3">
          <h1 className="font-bold text-primary textNormal4 w-full">
            {all("popular")}
          </h1>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 2xl:grid-cols-7 gap-5">
          {productsData.map((item, i) => {
            const localizedName = getLocalizedProduct(
              item.product_production_description,
              locale,
              "name"
            );
            const linkNameProduct = formatText(
              getLocalizedProduct(
                item.product_production_description,
                "en",
                "name"
              )
            );
            const linkNameCategory = formatText(
              getLocalizedCategoryName(item.category_name, "en", "name")
            );
            return (
              <div key={i} className={`w-full h-full`}>
                <Card
                  defaultHref={
                    path?.place !== "branch"
                      ? `/${locale}/${path.place}/category/${item?.menu_category_id}-${linkNameCategory}/product/${item?.product_id}-${linkNameProduct}`
                      : `/${locale}/${path.place}/category/${item?.menu_category_id}-${linkNameCategory}/product/${item?.product_id}-${linkNameProduct}?spot=${spot}&table_id=${table_id}&table_num=${table_num}&service=${service}`
                  }
                  locale={locale}
                  item={item}
                  localizedName={localizedName}
                  photo={item.photo_origin}
                  price={item.price["1"] / 100}
                />
              </div>
            );
          })}
        </div>
      </section>
    </Container>
  );
};

export default ColdRolls;
