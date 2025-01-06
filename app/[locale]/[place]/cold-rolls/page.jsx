import React from "react";
import Container from "@/components/shared/container";
import Card from "@/components/shared/card";
import { getLocale, getTranslations } from "next-intl/server";
import { ApiService } from "@/service/api.services";
import { getLocalizedCategoryName } from "@/lib/utils";

const ColdRolls = async () => {
  const { response: categories } = await ApiService.getPosterData(
    "menu.getCategories"
  );
  const [locale, all] = await Promise.all([
    getLocale(),
    getTranslations("All"),
  ]);
  return (
    <Container className="w-11/12 flex flex-col pt-5 space-y-3">
      <section className="w-full mt-5 space-y-3 pb-4">
        <div className="flex justify-between items-center gap-3">
          <h1 className="font-bold text-primary textNormal4 w-full">
            {all("cold_rolls")}
          </h1>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {categories.map((item, i) => {
            const localizedName = getLocalizedCategoryName(
              item.category_name,
              locale
            );
            return (
              <div key={i} className={`w-full`}>
                <Card
                  defaultHref={`/web/cold-rolls/${item?.category_id}`}
                  locale={locale}
                  item={item}
                  localizedName={localizedName}
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
