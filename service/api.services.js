import {
  buildNextFetchOptions,
  getFetchCacheMode,
  resolvePosterRevalidate,
} from "../lib/cache-config.js";

const normalizeBaseUrl = (value) => String(value || "").replace(/\/+$/, "");

const apiBaseUrls = [
  normalizeBaseUrl(process.env.NEXT_PUBLIC_ROLLING_BACK_URL),
  normalizeBaseUrl(process.env.NEXT_PUBLIC_URL),
].filter(Boolean);
const DEFAULT_FETCH_TIMEOUT_MS = 20000;

function resolveFetchTimeoutMs() {
  const parsed = Number.parseInt(process.env.API_FETCH_TIMEOUT_MS ?? "", 10);
  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }
  return DEFAULT_FETCH_TIMEOUT_MS;
}

const posterEndpointMap = {
  "menu.getCategories": "/api/poster/categories",
  "menu.getCategory": "/api/poster/categories",
  "menu.getProducts": "/api/poster/products",
  "menu.getProduct": "/api/poster/products",
  "spots.getSpots": "/api/poster/spots",
  "spots.getSpot": "/api/poster/spots",
  "access.getSpots": "/api/poster/spots",
  "clients.getPromotions": "/api/poster/promotions",
  "clients.getGroups": "/api/poster/client-groups",
  "clients.getClient": "/api/poster/clients",
  "clients.getClients": "/api/poster/clients",
};

const singularPosterEndpointConfig = {
  "menu.getCategory": "category_id",
  "menu.getProduct": "product_id",
  "spots.getSpot": "spot_id",
};

async function fetchWithFallback(path, options) {
  let lastError = null;
  const timeoutMs = resolveFetchTimeoutMs();

  for (const baseUrl of apiBaseUrls) {
    const requestUrl = `${baseUrl}${path}`;
    for (let attempt = 1; attempt <= 2; attempt += 1) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      try {
        return await fetch(requestUrl, {
          ...(options || {}),
          signal: controller.signal,
        });
      } catch (error) {
        lastError = error;
        if (attempt === 1) {
          await new Promise((resolve) => setTimeout(resolve, 250));
        }
      } finally {
        clearTimeout(timeoutId);
      }
    }
  }

  throw lastError || new Error("API request failed");
}

async function fetchJson(requestUrl, revalidateTime = 0) {
  try {
    const nextOptions = buildNextFetchOptions(revalidateTime);
    const response = await fetchWithFallback(requestUrl, {
      cache: getFetchCacheMode(revalidateTime),
      ...(nextOptions ? { next: nextOptions } : {}),
    });

    if (!response.ok) {
      return null;
    }

    const text = await response.text();
    if (!text) {
      return null;
    }

    try {
      return JSON.parse(text);
    } catch (error) {
      console.error(`Poster JSON parse failed: ${requestUrl}`, error);
      return null;
    }
  } catch (error) {
    console.error(`Poster fetch failed: ${requestUrl}`, error);
    return null;
  }
}

function resolvePosterTags(endpoint, props) {
  const tags = [];

  if (endpoint?.startsWith("menu.")) {
    tags.push("poster:menu");
  }

  switch (endpoint) {
    case "menu.getProducts": {
      tags.push("poster:products");
      const searchParams = new URLSearchParams(props?.replace(/^&/, "") || "");
      const categoryId = searchParams.get("category_id");
      if (categoryId) {
        tags.push(`poster:products:category:${categoryId}`);
      }
      break;
    }
    case "menu.getProduct":
      tags.push("poster:products");
      break;
    case "menu.getCategories":
    case "menu.getCategory":
      tags.push("poster:categories");
      break;
    case "clients.getPromotions":
      tags.push("poster:promotions");
      break;
    case "clients.getGroups":
      tags.push("poster:client-groups");
      break;
    case "clients.getClient":
    case "clients.getClients":
      tags.push("poster:clients");
      break;
    case "spots.getSpots":
    case "spots.getSpot":
    case "access.getSpots":
      tags.push("poster:spots");
      break;
    default:
      break;
  }

  return Array.from(new Set(tags));
}

async function fetchJsonWithTags(requestUrl, revalidateTime = 0, tags = []) {
  try {
    const nextOptions = buildNextFetchOptions(revalidateTime, tags);

    const response = await fetchWithFallback(requestUrl, {
      cache: getFetchCacheMode(revalidateTime),
      ...(nextOptions ? { next: nextOptions } : {}),
    });

    if (!response.ok) {
      return null;
    }

    const text = await response.text();
    if (!text) {
      return null;
    }

    try {
      return JSON.parse(text);
    } catch (error) {
      console.error(`Poster JSON parse failed: ${requestUrl}`, error);
      return null;
    }
  } catch (error) {
    console.error(`Poster fetch failed: ${requestUrl}`, error);
    return null;
  }
}

function getResponseCollection(payload) {
  if (!payload) {
    return [];
  }

  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload.response)) {
    return payload.response;
  }

  if (payload.data && Array.isArray(payload.data.response)) {
    return payload.data.response;
  }

  return [];
}

function normalizePosterPayload(rawPayload) {
  const candidatePayloads = [rawPayload?.data?.data, rawPayload?.data, rawPayload];
  const payload =
    candidatePayloads.find(
      (candidate) => candidate && typeof candidate === "object"
    ) || {};

  return {
    ...payload,
    response: getResponseCollection(payload),
  };
}

export const ApiService = {
  async getPosterData(endpoint, props, revalidateTime) {
    const backendPath = posterEndpointMap[endpoint];
    if (!backendPath) {
      throw new Error(`Unknown Poster endpoint: ${endpoint}`);
    }

    const resolvedRevalidate = resolvePosterRevalidate(endpoint, revalidateTime);
    const idParamName = singularPosterEndpointConfig[endpoint];

    // For singular endpoints (getProduct, getCategory, getSpot), fetch from the
    // base URL without query params so the cache entry is shared with the list
    // endpoint.  The backend returns all items regardless of query params — we
    // filter client-side below.
    const queryString =
      idParamName || !props ? "" : `?${props.replace(/^&/, "")}`;
    const response = await fetchJsonWithTags(
      `${backendPath}${queryString}`,
      resolvedRevalidate,
      resolvePosterTags(endpoint, props)
    );
    if (!response) {
      return {
        response: singularPosterEndpointConfig[endpoint] ? null : [],
      };
    }

    const normalizedPayload = normalizePosterPayload(response);

    if (idParamName) {
      const searchParams = new URLSearchParams(props?.replace(/^&/, "") || "");
      const expectedId = searchParams.get(idParamName);
      const selectedItem =
        normalizedPayload.response.find(
          (item) => String(item?.[idParamName]) === String(expectedId)
        ) ?? normalizedPayload.response[0] ?? null;

      return {
        ...normalizedPayload,
        response: selectedItem,
      };
    }

    // Always return a stable object with a normalized `response` array so callers
    // can handle different backend payload wrappers without extra conditions.
    return normalizedPayload;
  },
  async get(apiUrl) {
    return fetchJson(apiUrl);
  },
};
