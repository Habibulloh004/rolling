import Container from "@/components/shared/container";
import CustomImage from "@/components/shared/customImage";
import {
  extractDescription,
  extractKeywords,
  formatText,
  generateUrl,
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
import Card from "@/components/shared/card";

export async function generateMetadata({ params }) {
  const [path, allT] = await Promise.all([params, getTranslations("All")]);
  const { response: category } = await ApiService.getPosterData(
    `menu.getCategory`,
    `&category_id=${path.category.split("-")[0]}`
  );

  return {
    title: `${
      getLocalizedCategoryName(category.category_name, path.locale).replace(
        ".",
        ""
      ) || "Category title"
    } - ${allT("city")}`,
    description: extractDescription(category.category_name),
    keywords: extractKeywords(category.category_name),
    openGraph: {
      url: `https://rolling.uz/${generateUrl(path)}`,
      title: `${
        getLocalizedCategoryName(category.category_name, path.locale).replace(
          ".",
          ""
        ) || "Category title"
      }`,
      description: extractDescription(category.category_name),
      images: [`${posterUrl}${category.category_photo_origin}`], // You can add images if necessary
    },
    alternates: {
      canonical: `https://rolling.uz/${generateUrl(path)}`,
    },
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Product",
      name: `${
        getLocalizedCategoryName(category.category_name, path.locale).replace(
          ".",
          ""
        ) || "Category title"
      }`,
      description: extractDescription(category.category_name),
      // offers: {
      //   "@type": "Offer",
      //   priceCurrency: "USD",
      //   price: category.price?.[1] || "0.00",
      // },
    },
    other: {
      "script:ld+json": JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        name: `${
          getLocalizedCategoryName(category.category_name, path.locale).replace(
            ".",
            ""
          ) || "Category title"
        }`,
        description: extractDescription(category.category_name),
        // offers: {
        //   "@type": "Offer",
        //   priceCurrency: "USD",
        //   price: category.price?.[1] || "0.00",
        // },
      }),
    },
  };
}

export default async function CategoryItems({ params, searchParams }) {
  const [locale, all, path, searchParamsData] = await Promise.all([
    getLocale(),
    getTranslations("All"),
    params,
    searchParams,
  ]);
  const { spot, table_id, table_num, service } = searchParamsData;

  const { response: categoryItems } = await ApiService.getPosterData(
    `menu.getProducts`,
    `&category_id=${path.category}`
  );
  const { response: category } = await ApiService.getPosterData(
    `menu.getCategory`,
    `&category_id=${path.category}`
  );
  const products = categoryItems.filter((c) => c.photo != null);
  const categoryName = getLocalizedCategoryName(category.category_name, locale);

  return (
    <Container className="flex-col w-11/12 justify-start items-start space-y-8 pt-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href={
                path?.place !== "branch"
                  ? `/${locale}/${path?.place}/category`
                  : `/${locale}/${path?.place}/category?spot=${spot}&table_id=${table_id}&table_num=${table_num}&service=${service}`
              }
            >
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
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-5">
        {products?.map((item, i) => {
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
    </Container>
  );
}
