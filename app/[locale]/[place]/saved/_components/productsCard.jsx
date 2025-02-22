"use client";

import Card from "@/components/shared/card";
import {
  formatText,
  getLocalizedCategoryName,
  getLocalizedProduct,
} from "@/lib/utils";
import { useStore } from "@/store";
import React, { useEffect, useState } from "react";
import { useTranslations } from "use-intl";

export default function ProductsCard({ locale, path }) {
  const { favorites } = useStore();
  const all = useTranslations("All");
  return (
    <main>
      {favorites.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {favorites?.map((item, i) => {
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
                  localizedDesc={localizedDesc}
                  photo={item.photo_origin}
                  price={item.price["1"] / 100}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-start font-medium textSmall3">
          {all("not_found_favorites")}
        </p>
      )}
    </main>
  );
}
