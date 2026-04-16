function readSeconds(name, fallback) {
  const rawValue = process.env[name];
  const parsedValue = Number.parseInt(rawValue ?? "", 10);

  if (Number.isFinite(parsedValue) && parsedValue >= 0) {
    return parsedValue;
  }

  return fallback;
}

function readBoolean(name, fallback) {
  const rawValue = String(process.env[name] ?? "").trim().toLowerCase();

  if (!rawValue) {
    return fallback;
  }

  if (["1", "true", "yes", "on"].includes(rawValue)) {
    return true;
  }

  if (["0", "false", "no", "off"].includes(rawValue)) {
    return false;
  }

  return fallback;
}

export const dataCacheEnabled = readBoolean("NEXT_PUBLIC_ENABLE_DATA_CACHE", true);

export const cacheDurations = {
  categories: readSeconds("CACHE_REVALIDATE_CATEGORIES", 86400),
  category: readSeconds("CACHE_REVALIDATE_CATEGORY", 86400),
  products: readSeconds("CACHE_REVALIDATE_PRODUCTS", 7200),
  product: readSeconds("CACHE_REVALIDATE_PRODUCT", 7200),
  categoryProducts: readSeconds("CACHE_REVALIDATE_CATEGORY_PRODUCTS", 7200),
  popularProducts: readSeconds("CACHE_REVALIDATE_POPULAR_PRODUCTS", 7200),
  headerSearch: readSeconds("CACHE_REVALIDATE_HEADER_SEARCH", 7200),
  banners: readSeconds("CACHE_REVALIDATE_BANNERS", 86400),
  spots: readSeconds("CACHE_REVALIDATE_SPOTS", 604800),
  promotions: readSeconds("CACHE_REVALIDATE_PROMOTIONS", 600),
  clientGroups: readSeconds("CACHE_REVALIDATE_CLIENT_GROUPS", 600),
  clients: readSeconds("CACHE_REVALIDATE_CLIENTS", 300),
  apiTime: readSeconds("CACHE_REVALIDATE_API_TIME", 300),
  imageMinimumTtl: readSeconds("CACHE_IMAGE_MINIMUM_TTL", 604800),
  staleDynamic: readSeconds("NEXT_CACHE_STALE_DYNAMIC", 30),
  staleStatic: readSeconds("NEXT_CACHE_STALE_STATIC", 180),
};

export const clientCacheDurations = {
  categories: readSeconds(
    "NEXT_PUBLIC_CLIENT_CACHE_CATEGORIES_TTL",
    cacheDurations.categories
  ),
  products: readSeconds(
    "NEXT_PUBLIC_CLIENT_CACHE_PRODUCTS_TTL",
    cacheDurations.products
  ),
  promotions: readSeconds(
    "NEXT_PUBLIC_CLIENT_CACHE_PROMOTIONS_TTL",
    cacheDurations.promotions
  ),
  categoryProducts: readSeconds(
    "NEXT_PUBLIC_CLIENT_CACHE_CATEGORY_PRODUCTS_TTL",
    cacheDurations.categoryProducts
  ),
  popularProducts: readSeconds(
    "NEXT_PUBLIC_CLIENT_CACHE_POPULAR_PRODUCTS_TTL",
    cacheDurations.popularProducts
  ),
  headerSearch: readSeconds(
    "NEXT_PUBLIC_CLIENT_CACHE_HEADER_SEARCH_TTL",
    cacheDurations.headerSearch
  ),
};

export const clientCachePolicy = {
  enabled:
    dataCacheEnabled &&
    readBoolean("NEXT_PUBLIC_ENABLE_CLIENT_SESSION_CACHE", true),
  backgroundRevalidate: readBoolean(
    "NEXT_PUBLIC_CLIENT_CACHE_BACKGROUND_REVALIDATE",
    true
  ),
};

const posterRevalidateByEndpoint = {
  "menu.getCategories": cacheDurations.categories,
  "menu.getCategory": cacheDurations.category,
  "menu.getProducts": cacheDurations.products,
  "menu.getProduct": cacheDurations.product,
  "spots.getSpots": cacheDurations.spots,
  "spots.getSpot": cacheDurations.spots,
  "access.getSpots": cacheDurations.spots,
  "clients.getPromotions": cacheDurations.promotions,
  "clients.getGroups": cacheDurations.clientGroups,
  "clients.getClient": cacheDurations.clients,
  "clients.getClients": cacheDurations.clients,
};

export function resolvePosterRevalidate(endpoint, override) {
  if (!dataCacheEnabled) {
    return 0;
  }

  if (typeof override === "number" && override >= 0) {
    return override;
  }

  return posterRevalidateByEndpoint[endpoint] ?? cacheDurations.products;
}

export function resolveApiRevalidate(apiUrl, override) {
  if (!dataCacheEnabled) {
    return 0;
  }

  if (typeof override === "number" && override >= 0) {
    return override;
  }

  if (apiUrl.includes("/api/banners")) {
    return cacheDurations.banners;
  }

  return cacheDurations.products;
}

export function getFetchCacheMode(revalidateSeconds) {
  if (process.env.NODE_ENV === "development" || !dataCacheEnabled) {
    return "no-store";
  }

  return revalidateSeconds > 0 ? "force-cache" : "no-store";
}

export function buildNextFetchOptions(revalidateSeconds, tags = []) {
  if (getFetchCacheMode(revalidateSeconds) === "no-store") {
    return undefined;
  }

  const nextOptions = {
    revalidate: Math.max(0, Number(revalidateSeconds) || 0),
  };

  if (Array.isArray(tags) && tags.length > 0) {
    nextOptions.tags = tags;
  }

  return nextOptions;
}

export function buildPublicCacheControl(
  maxAgeSeconds,
  staleWhileRevalidateSeconds = cacheDurations.staleDynamic
) {
  if (!dataCacheEnabled) {
    return "no-store, max-age=0";
  }

  const maxAge = Math.max(0, Number(maxAgeSeconds) || 0);
  const staleWhileRevalidate = Math.max(
    0,
    Number(staleWhileRevalidateSeconds) || 0
  );

  return `public, max-age=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`;
}
