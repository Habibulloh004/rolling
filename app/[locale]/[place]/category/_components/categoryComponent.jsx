import { ApiService } from "@/service/api.services";
import { getLocale, getTranslations } from "next-intl/server";
import { getLocalizedCategoryName, getLocalizedProduct } from "@/lib/utils";
import CategoryBrowser from "./categoryBrowser";

export default async function CategoryComponent({ searchParamsData, path }) {
  const [locale, all, categoriesData, productsData] = await Promise.all([
    getLocale(),
    getTranslations("All"),
    ApiService.getPosterData("menu.getCategories", "", 86400),
    ApiService.getPosterData("menu.getProducts", "", 7200),
  ]);

  const rawCategories = categoriesData?.response || [];
  const rawProducts = productsData?.response || [];

  const categories = rawCategories
  .filter(
    (c) =>
      c?.category_photo != null &&
      c?.category_hidden != "1" &&
      c?.category_id != 0 // 👈 shu
  )
  .map((c) => ({
    id: Number(c?.category_id), // 👈 shu
    name: getLocalizedCategoryName(c?.category_name, locale),
    name_en: getLocalizedCategoryName(c?.category_name, "en"),
    photo_origin: c?.category_photo_origin ?? null,
  }));


  // productlarni kategoriyaga ajratib chiqamiz
  const productsByCategory = {};
  rawProducts.forEach((p) => {
    const catId = Number(p?.menu_category_id);
    if (!productsByCategory[catId]) productsByCategory[catId] = [];
    productsByCategory[catId].push({
      ...p,
      localizedName: getLocalizedProduct(
        p?.product_production_description,
        locale,
        "name"
      ),
      localizedDesc: getLocalizedProduct(
        p?.product_production_description,
        locale,
        "desc"
      ),
      linkNameProduct: getLocalizedProduct(
        p?.product_production_description,
        "en",
        "name"
      ),
      linkNameCategory: getLocalizedCategoryName(p.category_name, "en", "name"),
    });
  });

  return (
    <section className="w-full space-y-3">
      <div className="flex justify-between items-center gap-3">
        <h1 className="font-bold text-primary textNormal4 w-full">
          {all("categories")}
        </h1>
      </div>

      <CategoryBrowser
        categories={categories}
        productsByCategory={productsByCategory}
        locale={locale}
        path={path}
        searchParamsData={searchParamsData}
      />
    </section>
  );
}
