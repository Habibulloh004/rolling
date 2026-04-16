import { NextResponse } from "next/server";
import { ApiService } from "@/service/api.services";
import { toSearchCategory, toSearchProduct } from "@/lib/public-menu-data";
 

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [categoriesData, productsData] = await Promise.all([
      ApiService.getPosterData("menu.getCategories", "", 0),
      ApiService.getPosterData("menu.getProducts", "", 0),
    ]);

    const categories = (categoriesData?.response || [])
      .map(toSearchCategory)
      .filter(
        (category) =>
          category &&
          Number(category.category_hidden) === 0 &&
          Number(category.category_id) !== 0
      );

    const products = (productsData?.response || [])
      .map(toSearchProduct)
      .filter(
        (product) =>
          product &&
          Number(product.hidden) === 0 &&
          Number(product.menu_category_id) !== 0
      );

    return NextResponse.json(
      { categories, products },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("Failed to build header search payload", error);
    return NextResponse.json(
      { categories: [], products: [] },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  }
}
