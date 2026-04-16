function parseBoolean(value, fallback = true) {
  const normalized = String(value ?? "").trim().toLowerCase();

  if (!normalized) {
    return fallback;
  }

  if (["1", "true", "yes", "on"].includes(normalized)) {
    return true;
  }

  if (["0", "false", "no", "off"].includes(normalized)) {
    return false;
  }

  return fallback;
}

export const legacyProductFilterEnabled = parseBoolean(
  process.env.NEXT_PUBLIC_ENABLE_LEGACY_PRODUCT_FILTER,
  true
);

export function hasProductImage(product) {
  return Boolean(product?.photo_origin || product?.photo);
}

export function hasPopularIngredient(product) {
  const ingredients = Array.isArray(product?.ingredients)
    ? product.ingredients
    : [];

  return ingredients.some(
    (ingredient) => Number(ingredient?.ingredient_id) === 211
  );
}

export function isBaseVisibleProduct(product) {
  return (
    product &&
    Number(product?.hidden) === 0 &&
    Number(product?.menu_category_id) !== 0
  );
}

export function shouldIncludeProduct(product, options = {}) {
  if (!isBaseVisibleProduct(product)) {
    return false;
  }

  const targetCategoryId = Number(options?.categoryId || 0);
  if (targetCategoryId > 0 && Number(product?.menu_category_id) !== targetCategoryId) {
    return false;
  }

  if (!legacyProductFilterEnabled) {
    return true;
  }

  if (options?.requirePhoto && !hasProductImage(product)) {
    return false;
  }

  if (options?.requirePopularIngredient && !hasPopularIngredient(product)) {
    return false;
  }

  return true;
}
