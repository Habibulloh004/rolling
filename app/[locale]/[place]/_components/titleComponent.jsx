"use client";

import React, { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Container from "@/components/shared/container";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import {
  formatText,
  getLocalizedCategoryName,
  getLocalizedProduct,
  translateTextSpot,
} from "@/lib/utils";
import Card from "@/components/shared/card";
import {
  getProductDisplayName,
  getProductSearchText,
  getProductSlugBaseName,
} from "@/lib/search-utils";
import Link from "next/link";
import {
  invalidateClientRequestCaches,
  loadCachedJson,
} from "@/lib/client-request-cache";

const SEARCH_LOAD_TIMEOUT_MS = 20000;

export default function TitleComponent({
  locale,
  path,
  initialSearchCatalog,
}) {
  const allT = useTranslations("All");
  const SearchText = useTranslations("Search");
  const searchParams = useSearchParams();
  const spot = searchParams.get("spot") || "";
  const table_id = searchParams.get("table_id") || "";
  const table_num = searchParams.get("table_num") || "";
  const service = searchParams.get("service") || "";
  const [spotData, setSpotData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [openSearch, setOpenSearch] = useState(false);
  const [searchCatalog, setSearchCatalog] = useState(() => ({
    categories: initialSearchCatalog?.categories || [],
    products: initialSearchCatalog?.products || [],
  }));
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const deferredSearchTerm = useDeferredValue(searchTerm.trim().toLowerCase());

  useEffect(() => {
    if (!spot) return;
    let cancelled = false;
    const backendUrl = process.env.NEXT_PUBLIC_ROLLING_BACK_URL || process.env.NEXT_PUBLIC_URL;
    fetch(`${backendUrl}/api/poster/spots`, { cache: "no-store" })
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (cancelled) return;
        const spots = data?.data?.response ?? data?.response ?? [];
        const found = Array.isArray(spots)
          ? spots.find((s) => String(s.spot_id) === String(spot))
          : null;
        if (found) setSpotData({ response: found });
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [spot]);

  useEffect(() => {
    const onCacheRevalidate = (event) => {
      const resources = event?.detail?.resources || [];
      if (!Array.isArray(resources)) {
        return;
      }

      if (
        resources.includes("categories") ||
        resources.includes("products") ||
        resources.includes("promotions")
      ) {
        invalidateClientRequestCaches(["poster:header-search"]);
        setSearchCatalog({ categories: [], products: [] });
      }
    };

    window.addEventListener("rolling:cache-revalidate", onCacheRevalidate);
    return () =>
      window.removeEventListener("rolling:cache-revalidate", onCacheRevalidate);
  }, []);

  useEffect(() => {
    if (!openSearch || isSearchLoading) {
      return;
    }

    let cancelled = false;

    async function loadSearchCatalog() {
      let timeoutId;
      try {
        setIsSearchLoading(true);
        const data = await Promise.race([
          loadCachedJson({
            cacheKey: `poster:header-search:${locale}`,
            url: "/api/header-search",
            validatePayload: (payload) =>
              Array.isArray(payload?.categories) &&
              Array.isArray(payload?.products),
            onRevalidate: (freshData) => {
              if (cancelled) {
                return;
              }

              setSearchCatalog({
                categories: freshData?.categories || [],
                products: freshData?.products || [],
              });
            },
            requestInit: {
              cache: "no-store",
            },
          }),
          new Promise((_, reject) => {
            timeoutId = setTimeout(() => {
              reject(new Error("Header search request timed out"));
            }, SEARCH_LOAD_TIMEOUT_MS);
          }),
        ]);

        if (!cancelled) {
          setSearchCatalog({
            categories: data?.categories || [],
            products: data?.products || [],
          });
        }
      } catch {
        if (!cancelled && initialSearchCatalog) {
          setSearchCatalog({
            categories: initialSearchCatalog.categories || [],
            products: initialSearchCatalog.products || [],
          });
        }
      } finally {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        if (!cancelled) {
          setIsSearchLoading(false);
        }
      }
    }

    loadSearchCatalog();

    return () => {
      cancelled = true;
    };
  }, [isSearchLoading, locale, openSearch]);

  const filteredCategories = useMemo(() => {
    if (!deferredSearchTerm) {
      return [];
    }

    return (
      searchCatalog.categories?.filter((category) => {
        const categoryName = String(category?.category_name || "").toLowerCase();
        return (
          categoryName.includes(deferredSearchTerm) &&
          Number(category?.category_hidden) === 0 &&
          Number(category?.category_id) !== 0
        );
      }) || []
    );
  }, [deferredSearchTerm, searchCatalog.categories]);

  const filteredProducts = useMemo(() => {
    if (!deferredSearchTerm) {
      return [];
    }

    return (
      searchCatalog.products?.filter((product) => {
        return (
          getProductSearchText(product).includes(deferredSearchTerm) &&
          Number(product?.hidden) === 0 &&
          Number(product?.menu_category_id) !== 0
        );
      }) || []
    );
  }, [deferredSearchTerm, searchCatalog.products]);


  return (
    <Container
      className={"w-11/12 pt-3 md:pt-5 flex-col gap-3 md:gap-5 border-b-2"}
    >
      <h1 className="text-start textNormal4 w-full text-primary">
        {allT("welcome")} ,{" "}
        <span className="font-bold">
          {translateTextSpot(spotData?.response?.name, locale)}
        </span>
      </h1>

      <div className="flex w-full justify-between items-center gap-5">
        <h1 className="w-[33%] textNormal4 md:textNormal2 font-bold text-thin">
          {allT("table")} № {table_num}
        </h1>
        <div>
          <Sheet open={openSearch} onOpenChange={setOpenSearch}>
            <SheetTrigger>
              <div className="w-full relative bg-white p-2 rounded-md">
                <Search className="text-gray-400 size-6 text-primary" />
              </div>
            </SheetTrigger>
            <SheetContent className={"h-[80vh] p-0"} side="bottom">
              <SheetHeader>
                <SheetTitle className={"hidden"}>Search Results</SheetTitle>
                <SheetDescription className="hidden">
                  Find matching categories and products.
                </SheetDescription>
              </SheetHeader>
              <div className="pt-12 px-4 h-full space-y-3">
                <div className="w-full relative h-10 md:h-12">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-6 text-primary" />
                  <Input
                    type="text"
                    placeholder={`${allT("search")}`}
                    className="max-w-xl w-full h-full pl-12 pr-2 rounded-md md:rounded-2xl text-gray-900 placeholder-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="space-y-6 max-h-[60vh] overflow-y-scroll pr-2">
                  {/* Products Section */}
                  <div className="w-full space-y-2">
                    <h2 className="textSmall5 font-semibold text-gray-700">
                      {SearchText("search_pr")}
                    </h2>
                    {isSearchLoading && !searchCatalog.products.length ? (
                      <p className="text-gray-500">Loading...</p>
                    ) : filteredProducts.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {filteredProducts.map((product, index) => {
                          const localizedName = getProductDisplayName(
                            product,
                            locale
                          );
                          const localizedDesc = getLocalizedProduct(
                            product?.product_production_description,
                            locale,
                            "desc"
                          );
                          const linkNameCategory = formatText(
                            getLocalizedCategoryName(
                              product.category_name,
                              "en"
                            )
                          );
                          const linkNameProducts = formatText(
                            getProductSlugBaseName(product)
                          );
                          return (
                            <Card
                              key={`search-${product.product_id}-${index}`}
                              defaultHref={
                                path?.place !== "branch"
                                  ? `/${locale}/${path.place}/category/${product.menu_category_id}-${linkNameCategory}/product/${product.product_id}-${linkNameProducts}`
                                  : `/${locale}/${path.place}/category/${product.menu_category_id}-${linkNameCategory}/product/${product.product_id}-${linkNameProducts}?spot=${spot}&table_id=${table_id}&table_num=${table_num}&service=${service}`
                              }
                              locale={locale}
                              item={product}
                              localizedName={localizedName}
                              localizedDesc={localizedDesc}
                              photo={product.photo_origin || product.photo}
                              price={product.price?.["1"] ? product.price["1"] / 100 : 0}
                            />
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-gray-500">
                        {SearchText("not_search_pr")}
                      </p>
                    )}
                  </div>
                  {/* Categories Section */}
                  <div className="w-full space-y-2">
                    <h2 className="textSmall5 font-semibold text-gray-700">
                      {SearchText("search_ct")}
                    </h2>
                    {isSearchLoading && !searchCatalog.categories.length ? (
                      <p className="text-gray-500">Loading...</p>
                    ) : filteredCategories.length > 0 ? (
                      <ul className="max-md:flex max-md:flex-col gap-3 md:space-x-3 md:space-y-3">
                        {filteredCategories.map((category, index) => {
                          const linkNameCategory = formatText(
                            getLocalizedCategoryName(
                              category.category_name,
                              "en"
                            )
                          );
                          const nameCategory = getLocalizedCategoryName(
                            category.category_name,
                            locale
                          );

                          return (
                            <Link
                              href={
                                path?.place !== "branch"
                                  ? `/${locale}/${path.place}/category?category_id=${category.category_id}`
                                  : `/${locale}/${path.place}/category?category_id=${category.category_id}&spot=${spot}&table_id=${table_id}&table_num=${table_num}&service=${service}`
                              }
                              key={index}
                              className="md:inline-block textSmall3 p-3 bg-gray-100 rounded-md shadow"
                            >
                              {nameCategory}
                            </Link>
                          );
                        })}
                      </ul>
                    ) : (
                      <p className="text-gray-500">
                        {SearchText("not_search_ct")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </Container>
  );
}
