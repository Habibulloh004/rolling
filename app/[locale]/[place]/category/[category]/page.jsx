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
import { toPublicCategory, toPublicProduct } from "@/lib/public-menu-data";
import { notFound } from "next/navigation";
import { shouldIncludeProduct } from "@/lib/product-visibility";

function parseSlugId(value) {
  const rawId = String(value || "").split("-")[0];
  const id = Number(rawId);
  return Number.isInteger(id) && id > 0 ? id : 0;
}

export async function generateStaticParams() {
  const { response: categories = [] } = await ApiService.getPosterData(
    "menu.getCategories",
    ""
  );

  return ["uz", "ru", "en"].flatMap((locale) =>
    ["web", "branch"].flatMap((place) =>
      categories
        .filter((item) => item?.category_id && item?.category_hidden != "1")
        .map((item) => ({
          locale,
          place,
          category: `${item.category_id}-${formatText(
            getLocalizedCategoryName(item.category_name, "en")
          )}`,
        }))
    )
  );
}

export async function generateMetadata({ params }) {
  const [path, allT] = await Promise.all([params, getTranslations("All")]);
  const targetCategoryId = parseSlugId(path?.category);
  if (!targetCategoryId) {
    return {
      title: `Category - ${allT("city")}`,
    };
  }
  const { response: rawCategory } = await ApiService.getPosterData(
    `menu.getCategory`,
    `&category_id=${targetCategoryId}`
  );
  const category = toPublicCategory(rawCategory);
  const categoryName = getLocalizedCategoryName(
    category?.category_name ?? "",
    path.locale
  ).replace(".", "");

  return {
    title: `${categoryName || "Category title"} - ${allT("city")}`,
    description: extractDescription(category?.category_name ?? ""),
    keywords: extractKeywords(category?.category_name ?? ""),
    openGraph: {
      url: `https://rolling.uz/${generateUrl(path)}`,
      title: `${categoryName || "Category title"}`,
      description: extractDescription(category?.category_name ?? ""),
      images: category?.category_photo_origin
        ? [`${posterUrl}${category.category_photo_origin}`]
        : [],
    },
    alternates: {
      canonical: `https://rolling.uz/${generateUrl(path)}`,
    },
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Product",
      name: `${categoryName || "Category title"}`,
      description: extractDescription(category?.category_name ?? ""),
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
        name: `${categoryName || "Category title"}`,
        description: extractDescription(category?.category_name ?? ""),
        // offers: {
        //   "@type": "Offer",
        //   priceCurrency: "USD",
        //   price: category.price?.[1] || "0.00",
        // },
      }),
    },
  };
}

export default async function CategoryItems({ params }) {
  const [locale, all, path] = await Promise.all([
    getLocale(),
    getTranslations("All"),
    params,
  ]);
  const targetCategoryId = parseSlugId(path?.category);
  if (!targetCategoryId) {
    notFound();
  }

  const [{ response: categoryItems }, { response: rawCategory }, { response: allCategories }] =
    await Promise.all([
      ApiService.getPosterData("menu.getProducts", ""),
      ApiService.getPosterData("menu.getCategory", `&category_id=${targetCategoryId}`),
      ApiService.getPosterData("menu.getCategories", ""),
    ]);
  const category = toPublicCategory(rawCategory) ?? {
    category_name: "",
  };

  // Collect subcategory IDs whose parent is the target category
  const matchingCategoryIds = new Set([targetCategoryId]);
  for (const c of allCategories || []) {
    const parentId = Number(c?.parent_category || 0);
    const childId = Number(c?.category_id || 0);
    if (parentId === targetCategoryId && childId > 0) {
      matchingCategoryIds.add(childId);
    }
  }

  const products = (categoryItems || [])
    .filter((item) =>
      shouldIncludeProduct(item, {
        requirePhoto: true,
      }) && matchingCategoryIds.has(Number(item?.menu_category_id))
    )
    .map(toPublicProduct)
    .filter(Boolean);
  const categoryName = getLocalizedCategoryName(category.category_name, locale);
  
  return (
    <Container className="flex-col w-11/12 justify-start items-start space-y-8 pt-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href={`/${locale}/${path?.place}/category`}
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
                localizedDesc={localizedDesc}
                localizedName={localizedName}
                photo={item.photo_origin || item.photo}
                price={item.price["1"] / 100}
              />
            </div>
          );
        })}
      </div>
    </Container>
  );
}
