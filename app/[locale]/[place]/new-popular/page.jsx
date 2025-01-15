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

const ColdRolls = async ({ params }) => {
  const [locale, all, path, products] = await Promise.all([
    getLocale(),
    getTranslations("All"),
    params,
    ApiService.getPosterData("menu.getProducts"),
  ]);
  const productsData = products.response
    .filter((item) => item.photo_origin != null && item.menu_category_id != 0)
    .slice(0, 20);
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
                  defaultHref={`/${locale}/${path.place}/category/${item?.menu_category_id}-${linkNameCategory}/product/${item?.product_id}-${linkNameProduct}`}
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
