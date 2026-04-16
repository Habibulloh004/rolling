import { NextResponse } from "next/server";
import { ApiService } from "@/service/api.services";
import { toCategoryBrowserProduct } from "@/lib/public-menu-data";
import { shouldIncludeProduct } from "@/lib/product-visibility";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") || "en";
  const limit = Math.max(1, Number(searchParams.get("limit") || 12));

  try {
    const { response: products = [] } = await ApiService.getPosterData(
      "menu.getProducts",
      "",
      0
    );

    const popularProducts = products
      .filter((item) =>
        shouldIncludeProduct(item, {
          requirePhoto: true,
          requirePopularIngredient: true,
        })
      )
      .map((product) => toCategoryBrowserProduct(product, locale))
      .filter(Boolean)
      .slice(0, limit);

    return NextResponse.json(
      { products: popularProducts },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("Failed to build popular products payload", error);

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
