import {
  clientCachePolicy,
  dataCacheEnabled,
} from "./cache-config";

const memoryCategoryCache = new Map();
const memoryCategoriesListCache = new Map();
const pendingCategoryRequests = new Map();
const pendingCategoriesListRequests = new Map();
const memoryCategoryBrowserState = new Map();

function isClientCategoryCacheEnabled() {
  return dataCacheEnabled;
}

function isSessionCategoryCacheEnabled() {
  return dataCacheEnabled && clientCachePolicy.enabled;
}

function getCategoryCacheKey(locale, categoryId) {
  return `category-products:${locale}:${categoryId}`;
}

function getCategoryBrowserStateKey(locale, place) {
  return `category-browser:${locale}:${place || "web"}`;
}

function normalizeCacheEnvelope(parsedValue) {
  if (
    parsedValue &&
    typeof parsedValue === "object" &&
    Object.prototype.hasOwnProperty.call(parsedValue, "payload")
  ) {
    return {
      payload: parsedValue.payload,
      updatedAt: Number(parsedValue.updatedAt) || Date.now(),
    };
  }

  return {
    payload: parsedValue,
    updatedAt: Date.now(),
  };
}

function readSessionCache(cacheKey) {
  if (typeof window === "undefined" || !isSessionCategoryCacheEnabled()) {
    return null;
  }

  const rawValue = window.sessionStorage.getItem(cacheKey);
  if (!rawValue) {
    return null;
  }

  try {
    return normalizeCacheEnvelope(JSON.parse(rawValue));
  } catch {
    window.sessionStorage.removeItem(cacheKey);
    return null;
  }
}

function writeSessionCache(cacheKey, payload) {
  if (typeof window === "undefined" || !isSessionCategoryCacheEnabled()) {
    return;
  }

  try {
    window.sessionStorage.setItem(
      cacheKey,
      JSON.stringify({
        payload,
        updatedAt: Date.now(),
      })
    );
  } catch {}
}

export function primeCategoryProducts(locale, categoryId, products) {
  if (
    !isClientCategoryCacheEnabled() ||
    !locale ||
    !categoryId ||
    !Array.isArray(products)
  ) {
    return;
  }

  const cacheKey = getCategoryCacheKey(locale, categoryId);
  memoryCategoryCache.set(cacheKey, {
    payload: products,
    updatedAt: Date.now(),
  });
  writeSessionCache(cacheKey, products);
}

export function getCachedCategoryProducts(locale, categoryId) {
  if (!isClientCategoryCacheEnabled() || !locale || !categoryId) {
    return null;
  }

  const cacheKey = getCategoryCacheKey(locale, categoryId);
  const memoryValue = memoryCategoryCache.get(cacheKey);
  if (memoryValue) {
    return memoryValue.payload;
  }

  const sessionValue = readSessionCache(cacheKey);
  if (sessionValue) {
    memoryCategoryCache.set(cacheKey, sessionValue);
    return sessionValue.payload;
  }

  return null;
}

function getCachedCategoryEnvelope(locale, categoryId) {
  if (!isClientCategoryCacheEnabled() || !locale || !categoryId) {
    return null;
  }

  const cacheKey = getCategoryCacheKey(locale, categoryId);
  const memoryValue = memoryCategoryCache.get(cacheKey);
  if (memoryValue) {
    return memoryValue;
  }

  const sessionValue = readSessionCache(cacheKey);
  if (sessionValue) {
    memoryCategoryCache.set(cacheKey, sessionValue);
    return sessionValue;
  }

  return null;
}

async function fetchCategoryProducts(locale, categoryId) {
  const response = await fetch(
    `/api/category-products?category_id=${categoryId}&locale=${locale}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to load category ${categoryId}`);
  }

  const data = await response.json();
  if (!Array.isArray(data?.products)) {
    throw new Error(`Invalid category payload ${categoryId}`);
  }

  const products = data.products;
  primeCategoryProducts(locale, categoryId, products);
  return products;
}

function areProductsEqual(left, right) {
  try {
    return JSON.stringify(left) === JSON.stringify(right);
  } catch {
    return false;
  }
}

function requestCategoryProducts(locale, categoryId, onUpdate) {
  const cacheKey = getCategoryCacheKey(locale, categoryId);
  const pendingRequest = pendingCategoryRequests.get(cacheKey);
  if (pendingRequest) {
    if (typeof onUpdate === "function") {
      return pendingRequest.then((products) => {
        onUpdate(products);
        return products;
      });
    }
    return pendingRequest;
  }

  const previousProducts = getCachedCategoryProducts(locale, categoryId);
  const nextRequest = fetchCategoryProducts(locale, categoryId)
    .then((products) => {
      if (
        typeof onUpdate === "function" &&
        !areProductsEqual(previousProducts, products)
      ) {
        onUpdate(products);
      }

      return products;
    })
    .finally(() => {
      pendingCategoryRequests.delete(cacheKey);
    });

  pendingCategoryRequests.set(cacheKey, nextRequest);
  return nextRequest;
}

export function loadCategoryProducts(locale, categoryId, options = {}) {
  const forceRefresh = options?.forceRefresh === true;

  if (!isClientCategoryCacheEnabled()) {
    return requestCategoryProducts(locale, categoryId, options?.onUpdate);
  }

  const cachedEnvelope = getCachedCategoryEnvelope(locale, categoryId);
  const cachedProducts = cachedEnvelope?.payload;
  const onUpdate =
    typeof options?.onUpdate === "function" ? options.onUpdate : null;

  if (forceRefresh) {
    return requestCategoryProducts(locale, categoryId, onUpdate);
  }

  if (cachedProducts) {
    return Promise.resolve(cachedProducts);
  }

  return requestCategoryProducts(locale, categoryId, onUpdate);
}

export function warmCategoryProducts(locale, categoryId, options = {}) {
  if (!locale || !categoryId) {
    return Promise.resolve([]);
  }

  return loadCategoryProducts(locale, categoryId, options).catch(() => []);
}

export function getCategoryBrowserState(locale, place) {
  if (!isClientCategoryCacheEnabled() || !locale) {
    return null;
  }

  const cacheKey = getCategoryBrowserStateKey(locale, place);
  const memoryValue = memoryCategoryBrowserState.get(cacheKey);
  if (memoryValue) {
    return memoryValue;
  }

  const sessionEnvelope = readSessionCache(cacheKey);
  if (sessionEnvelope?.payload) {
    memoryCategoryBrowserState.set(cacheKey, sessionEnvelope.payload);
    return sessionEnvelope.payload;
  }

  return null;
}

export function saveCategoryBrowserState(locale, place, value) {
  if (!isClientCategoryCacheEnabled() || !locale || !value) {
    return;
  }

  const cacheKey = getCategoryBrowserStateKey(locale, place);
  memoryCategoryBrowserState.set(cacheKey, value);
  writeSessionCache(cacheKey, value);
}

function getCategoriesListCacheKey(locale) {
  return `categories-list:${locale}`;
}

export function getCachedCategories(locale) {
  if (!locale) return null;

  const cacheKey = getCategoriesListCacheKey(locale);
  const memoryValue = memoryCategoriesListCache.get(cacheKey);
  if (memoryValue) return memoryValue.payload;

  const sessionValue = readSessionCache(cacheKey);
  if (sessionValue?.payload) {
    memoryCategoriesListCache.set(cacheKey, sessionValue);
    return sessionValue.payload;
  }

  return null;
}

export function loadCategories(locale) {
  if (!locale) return Promise.resolve([]);

  const cacheKey = getCategoriesListCacheKey(locale);

  // Return from memory cache
  const cached = getCachedCategories(locale);
  if (cached) return Promise.resolve(cached);

  // Dedupe concurrent requests
  const pending = pendingCategoriesListRequests.get(cacheKey);
  if (pending) return pending;

  const request = fetch(`/api/categories?locale=${locale}`, { cache: "no-store" })
    .then((response) => {
      if (!response.ok) throw new Error("Failed to load categories");
      return response.json();
    })
    .then((data) => {
      const categories = Array.isArray(data?.categories) ? data.categories : [];
      memoryCategoriesListCache.set(cacheKey, {
        payload: categories,
        updatedAt: Date.now(),
      });
      writeSessionCache(cacheKey, categories);
      return categories;
    })
    .finally(() => {
      pendingCategoriesListRequests.delete(cacheKey);
    });

  pendingCategoriesListRequests.set(cacheKey, request);
  return request;
}

export function invalidateCategoryBrowserCaches() {
  memoryCategoryCache.clear();
  memoryCategoriesListCache.clear();
  pendingCategoryRequests.clear();
  pendingCategoriesListRequests.clear();
  memoryCategoryBrowserState.clear();

  if (typeof window === "undefined") {
    return;
  }

  try {
    const keys = [];
    for (let index = 0; index < window.sessionStorage.length; index += 1) {
      const key = window.sessionStorage.key(index);
      if (
        key &&
        (key.startsWith("category-products:") ||
          key.startsWith("category-browser:") ||
          key.startsWith("categories-list:"))
      ) {
        keys.push(key);
      }
    }

    keys.forEach((key) => window.sessionStorage.removeItem(key));
  } catch {}
}
