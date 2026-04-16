import { NextResponse } from "next/server";
import { ApiService } from "@/service/api.services";
import {
  buildPublicCacheControl,
  cacheDurations,
} from "@/lib/cache-config";
import { getLocalizedCategoryName } from "@/lib/utils";

export const dynamic = "force-dynamic";

const categoriesCache = new Map();
const pendingCategories = new Map();

export function clearCategoriesCache() {
  categoriesCache.clear();
  pendingCategories.clear();
}
const categoriesTtlMs =
  Math.max(0, Number(cacheDurations.categories) || 0) * 1000;

function getCacheKey(locale) {
  return `categories:${locale}`;
}

async function buildCategoriesPayload(locale) {
  const categoriesData = await ApiService.getPosterData(
    "menu.getCategories",
    "",
    0
  );

  const rawCategories = categoriesData?.response || [];

  const categories = rawCategories
    .filter(
      (c) =>
        c?.category_photo != null &&
        c?.category_hidden != "1" &&
        c?.category_id != 0
    )
    .map((c) => ({
      id: Number(c?.category_id),
      name: getLocalizedCategoryName(c?.category_name, locale),
      name_en: getLocalizedCategoryName(c?.category_name, "en"),
      photo: c?.category_photo ?? c?.category_photo_origin ?? null,
    }));

  return { categories };
}

async function getCategoriesPayload(locale) {
  const cacheKey = getCacheKey(locale);

  const cached = categoriesCache.get(cacheKey);
  if (cached && categoriesTtlMs > 0 && Date.now() - cached.createdAt < categoriesTtlMs) {
    return cached.payload;
  }

  const pending = pendingCategories.get(cacheKey);
  if (pending) {
    return pending;
  }

  const request = buildCategoriesPayload(locale)
    .then((payload) => {
      if (categoriesTtlMs > 0) {
        categoriesCache.set(cacheKey, { payload, createdAt: Date.now() });
      }
      return payload;
    })
    .finally(() => {
      pendingCategories.delete(cacheKey);
    });

  pendingCategories.set(cacheKey, request);
  return request;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") || "uz";
  const cacheControl = buildPublicCacheControl(cacheDurations.categories);

  try {
    const payload = await getCategoriesPayload(locale);

    return NextResponse.json(payload, {
      headers: { "Cache-Control": cacheControl },
    });
  } catch (error) {
    console.error("Failed to build categories payload", error);

    return NextResponse.json(
      { categories: [] },
      {
        status: 500,
        headers: { "Cache-Control": "no-store, max-age=0" },
      }
    );
  }
}
