import { getLocalizedCategoryName, getLocalizedProduct } from "./utils";

function normalizePriceMap(price) {
  if (!price || typeof price !== "object") {
    return { 1: 0 };
  }

  return {
    1: Number(price["1"] ?? price[1] ?? 0),
  };
}

export function toPublicCategory(category) {
  if (!category) {
    return null;
  }

  return {
    category_id: Number(category.category_id ?? 0),
    category_name: category.category_name ?? "",
    category_hidden: category.category_hidden ?? "0",
    category_photo: category.category_photo ?? null,
    category_photo_origin: category.category_photo_origin ?? null,
  };
}

export function toPublicProduct(product) {
  if (!product) {
    return null;
  }

  return {
    product_id: Number(product.product_id ?? 0),
    menu_category_id: Number(product.menu_category_id ?? 0),
    category_name: product.category_name ?? "",
    product_name: product.product_name ?? "",
    product_production_description:
      product.product_production_description ?? "",
    photo: product.photo ?? null,
    photo_origin: product.photo_origin ?? null,
    price: normalizePriceMap(product.price),
    hidden: product.hidden ?? 0,
    group_modifications: product.group_modifications ?? [],
    modifications: product.modifications ?? [],
  };
}

export function toSearchCategory(category) {
  const normalized = toPublicCategory(category);
  if (!normalized) {
    return null;
  }

  return {
    category_id: normalized.category_id,
    category_name: normalized.category_name,
    category_hidden: normalized.category_hidden,
  };
}

export function toSearchProduct(product) {
  const normalized = toPublicProduct(product);
  if (!normalized) {
    return null;
  }

  return {
    product_id: normalized.product_id,
    menu_category_id: normalized.menu_category_id,
    category_name: normalized.category_name,
    product_name: normalized.product_name,
    product_production_description: normalized.product_production_description,
    photo: normalized.photo,
    photo_origin: normalized.photo_origin,
    price: normalized.price,
    hidden: normalized.hidden,
  };
}

export function toCategoryBrowserProduct(product, locale) {
  const normalized = toPublicProduct(product);
  if (!normalized) {
    return null;
  }

  return {
    ...normalized,
    localizedName: getLocalizedProduct(
      normalized.product_production_description,
      locale,
      "name"
    ),
    localizedDesc: getLocalizedProduct(
      normalized.product_production_description,
      locale,
      "desc"
    ),
    linkNameProduct: getLocalizedProduct(
      normalized.product_production_description,
      "en",
      "name"
    ),
    linkNameCategory: getLocalizedCategoryName(
      normalized.category_name,
      "en"
    ),
  };
}
