import Container from "@/components/shared/container";
import CustomImage from "@/components/shared/customImage";
import {
  formatText,
  getLocalizedCategoryName,
  getLocalizedProduct,
  posterUrl,
} from "@/lib/utils";
import { ApiService } from "@/service/api.services";
import { getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default async function CategoryItems({ params }) {
  const [locale, all, path] = await Promise.all([
    getLocale(),
    getTranslations("All"),
    params,
  ]);
  const { response: categoryItems } = await ApiService.getPosterData(
    `menu.getProducts`,
    `&category_id=${path.category}`
  );
  const { response: category } = await ApiService.getPosterData(
    `menu.getCategory`,
    `&category_id=${path.category}`
  );
  const products = categoryItems.filter((c) => c.photo != null);
  console.log(path);

  const categoryName = getLocalizedCategoryName(category.category_name, locale);

  return (
    <Container className="flex-col w-11/12 justify-start items-start space-y-8 pt-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${locale}/${path.place}/category`}>
              <h1 className="font-bold textSmall3">{all("categories")}</h1>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className={""} size={48} />
          <BreadcrumbItem>
            <BreadcrumbPage>
              <h1 className="font-bold textSmall3">{categoryName}</h1>
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="w-full grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 2xl:grid-cols-7 gap-5">
        {products?.map((item, i) => {
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
            <Link
              key={i}
              href={`/${locale}/${path.place}/category/${item.menu_category_id}-${linkNameCategory}/product/${item?.product_id}-${linkNameProducts}`} // Adjust link dynamically
              className="relative w-full flex justify-start items-center flex-col gap-2"
            >
              <div className="w-full aspect-square relative rounded-[20px] sm:rounded-[40px] bg-white overflow-hidden">
                <CustomImage
                  src={`${posterUrl}${item?.photo_origin}`}
                  className="w-full h-full object-cover"
                  alt={`${localizedName}`}
                />
              </div>
              <h1 className="font-bold text-thin textSmall2 text-center">
                {localizedName}
              </h1>
            </Link>
          );
        })}
      </div>
    </Container>
  );
}
