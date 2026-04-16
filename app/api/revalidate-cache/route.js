import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { clearCategoryProductsCache } from "@/app/api/category-products/route";
import { clearCategoriesCache } from "@/app/api/categories/route";

const RESOURCE_TAG_MAP = {
  categories: ["poster:menu", "poster:categories"],
  products: ["poster:menu", "poster:products"],
  promotions: ["poster:promotions"],
  clients: ["poster:clients"],
  clientgroups: ["poster:client-groups"],
  spots: ["poster:spots"],
  employees: ["poster:employees"],
  banners: ["api:banners"],
};


function normalizeResourceName(value = "") {
  const normalized = String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  switch (normalized) {
    case "category":
    case "categories":
      return "categories";
    case "product":
    case "products":
    case "dish":
      return "products";
    case "promotion":
    case "promotions":
    case "promotionprize":
      return "promotions";
    case "client":
    case "clients":
    case "clientbonus":
    case "clientpayedsum":
      return "clients";
    case "clientgroup":
    case "clientgroups":
    case "clientsgroup":
      return "clientgroups";
    case "spot":
    case "spots":
      return "spots";
    case "employee":
    case "employees":
      return "employees";
    case "banner":
    case "banners":
      return "banners";
    default:
      return "";
  }
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const resources = Array.isArray(body?.resources) ? body.resources : [];

    const uniqueTags = new Set();
    resources.forEach((resource) => {
      const normalized = normalizeResourceName(resource);
      const tags = RESOURCE_TAG_MAP[normalized] || [];
      tags.forEach((tag) => uniqueTags.add(tag));
    });

    uniqueTags.forEach((tag) => revalidateTag(tag));

    // Also clear in-memory route caches
    const normalizedResources = resources.map(normalizeResourceName).filter(Boolean);
    const shouldRevalidateMenuPages =
      normalizedResources.includes("products") ||
      normalizedResources.includes("categories") ||
      normalizedResources.length === 0;

    if (
      shouldRevalidateMenuPages
    ) {
      clearCategoryProductsCache();
      clearCategoriesCache();
    }

    if (shouldRevalidateMenuPages) {
      revalidatePath("/", "layout");
    }

    const response = NextResponse.json({
      ok: true,
      revalidatedTags: Array.from(uniqueTags),
      revalidatedAll: shouldRevalidateMenuPages,
    });

    if (shouldRevalidateMenuPages) {
      response.cookies.set("cache_version", String(Date.now()), {
        path: "/",
        httpOnly: false,
        maxAge: 60 * 60 * 24 * 365,
      });
    }

    return response;
  } catch (error) {
    console.error("Failed to revalidate cache tags", error);
    return NextResponse.json(
      { ok: false, error: "revalidation_failed" },
      { status: 500 }
    );
  }
}
