import { url } from "../lib/utils.js";
import {
  buildNextFetchOptions,
  getFetchCacheMode,
  resolveApiRevalidate,
} from "../lib/cache-config.js";

const normalizeBaseUrl = (value) => String(value || "").replace(/\/+$/, "");

const apiBaseUrls = [
  normalizeBaseUrl(process.env.NEXT_PUBLIC_ROLLING_BACK_URL),
  normalizeBaseUrl(process.env.NEXT_PUBLIC_URL),
  normalizeBaseUrl(url),
].filter(Boolean);
const DEFAULT_FETCH_TIMEOUT_MS = 20000;

function resolveFetchTimeoutMs() {
  const parsed = Number.parseInt(process.env.API_FETCH_TIMEOUT_MS ?? "", 10);
  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }
  return DEFAULT_FETCH_TIMEOUT_MS;
}

async function fetchWithFallback(endpoint, options) {
  let lastError = null;
  const timeoutMs = resolveFetchTimeoutMs();

  for (const baseUrl of apiBaseUrls) {
    const requestUrl = `${baseUrl}${endpoint}`;
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

function resolveApiTags(endpoint) {
  const tags = [];

  if (endpoint.includes("/api/banners")) {
    tags.push("api:banners");
  }
  if (endpoint.includes("/api/poster/products")) {
    tags.push("poster:products", "poster:menu");
  }
  if (endpoint.includes("/api/poster/categories")) {
    tags.push("poster:categories", "poster:menu");
  }
  if (endpoint.includes("/api/poster/promotions")) {
    tags.push("poster:promotions");
  }
  if (endpoint.includes("/api/poster/client-groups")) {
    tags.push("poster:client-groups");
  }
  if (endpoint.includes("/api/poster/spots")) {
    tags.push("poster:spots");
  }

  return Array.from(new Set(tags));
}

const getData = async (endpoint, revalidateTime) => {
  const resolvedRevalidate = resolveApiRevalidate(endpoint, revalidateTime);
  const tags = resolveApiTags(endpoint);
  try {
    const nextOptions = buildNextFetchOptions(resolvedRevalidate, tags);

    const res = await fetchWithFallback(endpoint, {
      cache: getFetchCacheMode(resolvedRevalidate),
      ...(nextOptions ? { next: nextOptions } : {}),
    });

    if (!res.ok) {
      return null;
    }

    const text = await res.text();
    if (!text) {
      return null;
    }

    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error(`API JSON parse failed: ${endpoint}`, parseError);
      return null;
    }
  } catch (error) {
    console.error(`API fetch failed: ${endpoint}`, error);
    return null;
  }
};

export { getData };
