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
import { notFound } from "next/navigation";
import React from "react";
import ProductPageClient from "./_component/ProductPageClient";
import { toPublicProduct } from "@/lib/public-menu-data";

function parseSlugId(value) {
  const rawId = String(value || "").split("-")[0];
  const id = Number(rawId);
  return Number.isInteger(id) && id > 0 ? id : 0;
}

function getProductName(productData, locale) {
  return (
    getLocalizedProduct(
      productData?.product_production_description,
      locale,
      "name"
    ) ||
    productData?.product_name ||
    ""
  );
}

async function loadProductFromCategoryFeed(path) {
  const productId = parseSlugId(path?.product);
  const categoryId = parseSlugId(path?.category);

  if (!productId) {
    return null;
  }

  const { response: productData } = await ApiService.getPosterData(
    "menu.getProduct",
    `&product_id=${productId}`
  );

  const normalizedProduct = toPublicProduct(productData);
  if (!normalizedProduct) {
    return null;
  }

  if (
    categoryId &&
    Number(normalizedProduct?.menu_category_id) !== Number(categoryId)
  ) {
    return null;
  }

  return normalizedProduct;
}

// 🔹 Statik sahifalar ro'yxatini generatsiya qilish
export async function generateStaticParams() {
  // 2. Barcha productlarni oling
  const { response: products = [] } = await ApiService.getPosterData(
    "menu.getProducts",
    ""
  );

  const locales = ["en", "uz", "ru"];
  const places = ["branch", "web"];
  
  const allParams = [];
  
  locales.forEach((locale) => {
    places.forEach((place) => {
      products
        .filter(
          (product) =>
            product?.product_id &&
            product?.menu_category_id &&
            product?.hidden == 0
        )
        .forEach((product) => {
          const englishName = getLocalizedProduct(
            product.product_production_description,
            "en",
            "name"
          );

        allParams.push({
          locale,
          place,
          category: `${product.menu_category_id}-${formatText(
            getLocalizedCategoryName(product.category_name, "en")
          )}`,
          product: `${product.product_id}-${formatText(englishName || product.product_name || "")}`,
        });
      });
    });
  });

  return allParams;
}

// 🔹 SEO metadata
export async function generateMetadata({ params }) {
  const [path, allT] = await Promise.all([params, getTranslations("All")]);
  if (!parseSlugId(path?.product) || !parseSlugId(path?.category)) {
    return {
      title: `Product - ${allT("buy")}`,
    };
  }
  const publicProductData = await loadProductFromCategoryFeed(path);

  if (!publicProductData) {
    return {
      title: `Product - ${allT("buy")}`,
    };
  }

  const localizedName = getProductName(publicProductData, path.locale);

  return {
    title: `${localizedName.replace(".", "") || "Product title"} - ${allT(
      "buy"
    )}`,
    description: extractDescription(publicProductData.product_production_description),
    keywords: extractKeywords(publicProductData.product_production_description),
    openGraph: {
      url: `https://rolling.uz/${generateUrl(path)}`,
      title: `${localizedName.replace(".", "") || "Product title"}`,
      description: extractDescription(
        publicProductData.product_production_description
      ),
      images: publicProductData.photo_origin
        ? [`${posterUrl}${publicProductData.photo_origin}`]
        : [],
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

  if (!parseSlugId(path?.product) || !parseSlugId(path?.category)) {
    notFound();
  }

  const publicProductData = await loadProductFromCategoryFeed(path);

  if (!publicProductData) {
    notFound();
  }

  const localizedName = getProductName(publicProductData, locale);
  const localizedNameCategory = getLocalizedCategoryName(
    publicProductData.category_name,
    locale
  );
  const localizedDesc = getLocalizedProduct(
    publicProductData.product_production_description,
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
      productData={publicProductData}
      localizedName={localizedName}
      localizedDesc={localizedDesc}
      localizedNameCategory={localizedNameCategory}
    />
  );
}
