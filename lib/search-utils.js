import { getLocalizedProduct, getLocalizedCategoryName } from "./utils";

const LOCALES = ["ru", "uz", "en"];

function safeText(value) {
  return String(value ?? "").trim();
}

function stripXmlTags(text) {
  return String(text ?? "").replace(/<[^>]+>/g, " ").trim();
}

export function getProductDisplayName(product, locale) {
  const localizedName = safeText(
    getLocalizedProduct(
      product?.product_production_description,
      locale,
      "name"
    )
  );

  if (localizedName) {
    return localizedName;
  }

  const backendName = safeText(product?.product_name);
  if (backendName) {
    return backendName;
  }

  return safeText(product?.product_id);
}

export function getProductSlugBaseName(product) {
  const englishName = safeText(
    getLocalizedProduct(product?.product_production_description, "en", "name")
  );
  return englishName || safeText(product?.product_name) || safeText(product?.product_id);
}

export function getProductSearchText(product) {
  const desc = product?.product_production_description;

  const names = LOCALES.map((lng) =>
    safeText(getLocalizedProduct(desc, lng, "name"))
  );

  const descriptions = LOCALES.map((lng) =>
    stripXmlTags(getLocalizedProduct(desc, lng, "desc"))
  );

  const categoryNames = LOCALES.map((lng) =>
    safeText(getLocalizedCategoryName(String(product?.category_name ?? ""), lng))
  );

  return [
    safeText(product?.product_name),
    ...names,
    ...descriptions,
    ...categoryNames,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}
