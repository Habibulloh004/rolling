import Head from "next/head";
import Container from "@/components/shared/container";
import {
  extractDescription,
  extractKeywords,
  formatText,
  generateUrl,
  getLocalizedCategoryName,
  getLocalizedProduct,
  posterUrl,
  truncateText,
} from "@/lib/utils";
import { ApiService } from "@/service/api.services";
import { getLocale, getTranslations } from "next-intl/server";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ProductCard from "./_component/productCard";

export async function generateMetadata({ params }) {
  const [ path, allT ] = await Promise.all([params, getTranslations("All")]);
  const { response: productData } = await ApiService.getPosterData(
    `menu.getProduct`,
    `&product_id=${path.product.split("-")[0]}`,
    7200
  );

  return {
    title: `${getLocalizedProduct(productData.product_production_description, path.locale, "name").replace(".", "") || "Product title"} - ${allT("buy")}`,
    description: extractDescription(productData.product_production_description),
    keywords: extractKeywords(productData.product_production_description),
    openGraph: {
      url: `https://rolling.uz/${generateUrl(path)}`,
      title: `${getLocalizedProduct(productData.product_production_description, path.locale, "name").replace(".", "") || "Product title"}`,
      description: extractDescription(
        productData.product_production_description
      ),
      images: [
        `${posterUrl}${productData.photo_origin}`
      ], // You can add images if necessary
    },
    alternates: {
      canonical: `https://rolling.uz/${generateUrl(path)}`,
    },
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Product",
      name: `${getLocalizedProduct(productData.product_production_description, path.locale, "name").replace(".", "") || "Product title"}`,
      description: extractDescription(
        productData.product_production_description
      ),
      offers: {
        "@type": "Offer",
        priceCurrency: "SUM",
        price: productData.price?.[1] || "0.00",
      },
    },
    other: {
      "script:ld+json": JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        name: `${getLocalizedProduct(productData.product_production_description, path.locale, "name").replace(".", "") || "Product title"}`,
        description: extractDescription(
          productData.product_production_description
        ),
        offers: {
          "@type": "Offer",
          priceCurrency: "SUM",
          price: productData.price?.[1] || "0.00",
        },
      }),
    },
  };
}

export default async function ProductPage({ params, searchParams }) {
  const [locale, path, all, searchParamsData] = await Promise.all([
    getLocale(),
    params,
    getTranslations("All"),
    searchParams,
  ]);
  const { spot, table_id, table_num, service } = searchParamsData;

  const { response: productData } = await ApiService.getPosterData(
    `menu.getProduct`,
    `&product_id=${path.product}`,
    7200
  );

  const localizedName = getLocalizedProduct(
    productData.product_production_description,
    locale,
    "name"
  );
  const localizedNameCategory = getLocalizedCategoryName(
    productData.category_name,
    locale
  );
  const localizedDesc = getLocalizedProduct(
    productData.product_production_description,
    locale,
    "desc"
  );

  return (
    <>
      <Container className={"w-11/12 flex-col justify-start items-start pt-4"}>
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
              <BreadcrumbLink
                href={
                  path?.place !== "branch"
                    ? `/${locale}/${path?.place}/category/${
                        productData?.menu_category_id
                      }-${formatText(
                        getLocalizedCategoryName(
                          productData.category_name,
                          "en"
                        )
                      )}`
                    : `/${locale}/${path?.place}/category/${
                        productData?.menu_category_id
                      }-${formatText(
                        getLocalizedCategoryName(
                          productData.category_name,
                          "en"
                        )
                      )}?spot=${spot}&table_id=${table_id}&table_num=${table_num}&service=${service}`
                }
              >
                <h1 className="font-bold textSmall3">
                  {localizedNameCategory}
                </h1>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className={""} size={48} />
            <BreadcrumbItem>
              <BreadcrumbPage>
                <h1 className="font-bold textSmall3">
                  {truncateText(localizedName, 50)}
                </h1>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <ProductCard
          localizedName={localizedName}
          localizedDesc={localizedDesc}
          productData={productData}
          place={path.place}
        />
      </Container>
    </>
  );
}
