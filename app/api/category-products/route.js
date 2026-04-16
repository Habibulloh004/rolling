import { NextResponse } from "next/server";
import { ApiService } from "@/service/api.services";
import {
  buildPublicCacheControl,
  cacheDurations,
} from "@/lib/cache-config";
import { toCategoryBrowserProduct } from "@/lib/public-menu-data";
import { shouldIncludeProduct } from "@/lib/product-visibility";

export const dynamic = "force-dynamic";

const categoryProductsCache = new Map();
const pendingCategoryProducts = new Map();

export function clearCategoryProductsCache() {
  categoryProductsCache.clear();
  pendingCategoryProducts.clear();
}
const categoryProductsTtlMs =
  Math.max(0, Number(cacheDurations.categoryProducts) || 0) * 1000;

function getCategoryProductsCacheKey(categoryId, locale) {
  return `${locale}:${categoryId}`;
}

function getCachedCategoryProductsPayload(cacheKey) {
  const cachedEntry = categoryProductsCache.get(cacheKey);
  if (!cachedEntry) {
    return null;
  }

  if (categoryProductsTtlMs <= 0) {
    categoryProductsCache.delete(cacheKey);
    return null;
  }

  if (Date.now() - cachedEntry.createdAt > categoryProductsTtlMs) {
    categoryProductsCache.delete(cacheKey);
    return null;
  }

  return cachedEntry.payload;
}

async function buildCategoryProductsPayload(categoryId, locale) {
  const [{ response: products = [] }, { response: categories = [] }] =
    await Promise.all([
      ApiService.getPosterData("menu.getProducts", "", 0),
      ApiService.getPosterData("menu.getCategories", "", 0),
    ]);

  const matchingCategoryIds = new Set([categoryId]);
  for (const c of categories) {
    const parentId = Number(c?.parent_category || 0);
    const childId = Number(c?.category_id || 0);
    if (parentId === categoryId && childId > 0) {
      matchingCategoryIds.add(childId);
    }
  }

  const categoryProducts = products
    .filter((product) =>
      shouldIncludeProduct(product, {
        requirePhoto: true,
      }) && matchingCategoryIds.has(Number(product?.menu_category_id))
    )
    .map((product) => toCategoryBrowserProduct(product, locale))
    .filter(Boolean);

  return { products: categoryProducts };
}

async function getCategoryProductsPayload(categoryId, locale) {
  const cacheKey = getCategoryProductsCacheKey(categoryId, locale);
  const cachedPayload = getCachedCategoryProductsPayload(cacheKey);
  if (cachedPayload) {
    return cachedPayload;
  }

  const pendingPayload = pendingCategoryProducts.get(cacheKey);
  if (pendingPayload) {
    return pendingPayload;
  }

  const payloadRequest = buildCategoryProductsPayload(categoryId, locale)
    .then((payload) => {
      if (categoryProductsTtlMs > 0) {
        categoryProductsCache.set(cacheKey, {
          payload,
          createdAt: Date.now(),
        });
      }
      return payload;
    })
    .finally(() => {
      pendingCategoryProducts.delete(cacheKey);
    });

  pendingCategoryProducts.set(cacheKey, payloadRequest);
  return payloadRequest;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const rawCategoryId = searchParams.get("category_id");
  const categoryId = Number.parseInt(rawCategoryId || "", 10);
  const locale = searchParams.get("locale") || "en";
  const cacheControl = buildPublicCacheControl(cacheDurations.categoryProducts);

  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    return NextResponse.json(
      { products: [] },
      {
        headers: {
          "Cache-Control": cacheControl,
        },
      }
    );
  }

  try {
    const payload = await getCategoryProductsPayload(categoryId, locale);

    return NextResponse.json(
      payload,
      {
        headers: {
          "Cache-Control": cacheControl,
        },
      }
    );
  } catch (error) {
    console.error("Failed to build category product payload", error);

    return NextResponse.json(
      { products: [] },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  }
}
