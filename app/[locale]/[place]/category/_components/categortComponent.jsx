import { ApiService } from "@/service/api.services";
import { getLocale, getTranslations } from "next-intl/server";
import React from "react";
import CustomImage from "@/components/shared/customImage";
import { formatText, getLocalizedCategoryName, posterUrl } from "@/lib/utils";
import Link from "next/link";

export default async function CategoryComponent({ searchParamsData, path }) {
  const [locale, all, categoriesData] = await Promise.all([
    getLocale(),
    getTranslations("All"),
    ApiService.getPosterData("menu.getCategories", "", 86400),
  ]);
  const { spot, table_id, table_num, service } = searchParamsData;
  const categories = categoriesData.response.filter(
    (c) =>
      c.category_photo != null &&
      c.category_hidden != "1" &&
      c?.category_id != 0
  );

  return (
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
                  src={
                    item?.category_photo_origin
                      ? `${posterUrl}${item?.category_photo_origin}`
                      : "/empty.jpg"
                  }
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
  );
}
