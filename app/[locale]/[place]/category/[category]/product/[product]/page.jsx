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
import ProductPageClient from "./_component/ProductPageClient";

export const revalidate = 7200;

// 🔹 Statik sahifalar ro'yxatini generatsiya qilish
export async function generateStaticParams() {
  // 1. Barcha kategoriyalarni oling
  const { response: categories } = await ApiService.getPosterData(
    "menu.getCategories", // yoki qanday API bo'lsa
    "",
    7200
  );
  
  // 2. Barcha productlarni oling
  const { response: products } = await ApiService.getPosterData(
    "menu.getProducts",
    "",
    7200
  );

  const locales = ['en', 'uz', 'ru'];
  const places = ['branch', 'web'];
  
  const allParams = [];
  
  locales.forEach(locale => {
    places.forEach(place => {
      products.forEach(product => {
        allParams.push({
          locale,
          place,
          category: `${product.menu_category_id}-${formatText(product.category_name || "")}`,
          product: `${product.product_id}-${formatText(product.name || "")}`,
        });
      });
    });
  });

  return allParams;
}

// 🔹 SEO metadata
export async function generateMetadata({ params }) {
  const [path, allT] = await Promise.all([params, getTranslations("All")]);
  const { response: productData } = await ApiService.getPosterData(
    "menu.getProduct",
    `&product_id=${path.product.split("-")[0]}`,
    7200
  );

  return {
    title: `${getLocalizedProduct(
      productData.product_production_description,
      path.locale,
      "name"
    ).replace(".", "") || "Product title"} - ${allT("buy")}`,
    description: extractDescription(productData.product_production_description),
    keywords: extractKeywords(productData.product_production_description),
    openGraph: {
      url: `https://rolling.uz/${generateUrl(path)}`,
      title: `${getLocalizedProduct(
        productData.product_production_description,
        path.locale,
        "name"
      ).replace(".", "") || "Product title"}`,
      description: extractDescription(
        productData.product_production_description
      ),
      images: [`${posterUrl}${productData.photo_origin}`],
    },
    alternates: {
      canonical: `https://rolling.uz/${generateUrl(path)}`,
    },
  };
}

// 🔹 Server component
export default async function ProductPage({ params }) {
  const [locale, path, all] = await Promise.all([
    getLocale(),
    params,
    getTranslations("All"),
  ]);

  const { response: productData } = await ApiService.getPosterData(
    "menu.getProduct",
    `&product_id=${path.product.split("-")[0]}`,
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

  // Extract translation strings instead of passing the function
  const translations = {
    categories: all("categories"),
    // Add any other translations you need here
  };

  return (
    <ProductPageClient
      locale={locale}
      path={path}
      translations={translations}
      productData={productData}
      localizedName={localizedName}
      localizedDesc={localizedDesc}
      localizedNameCategory={localizedNameCategory}
    />
  );
}
