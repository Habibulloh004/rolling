"use client";

import React, { useState, useEffect } from "react";
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
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function TitleComponent({
  products,
  categories,
  locale,
  path,
  spotData,
  searchParamsData,
}) {
  const allT = useTranslations("All");
  const SearchText = useTranslations("Search");
  const { spot, table_id, table_num, service } = searchParamsData;
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCategories([]);
      setFilteredProducts([]);
      return;
    }

    setFilteredCategories(
      categories?.filter((category) =>
        String(category?.category_name)
          ?.toLowerCase()
          ?.includes(searchTerm?.toLowerCase())
      )
    );

    setFilteredProducts(
      products?.filter((product) =>
        String(product?.product_production_description)
          ?.toLowerCase()
          ?.includes(String(searchTerm?.toLowerCase()))
      )
    );
  }, [searchTerm, categories, products]);


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
          <Sheet>
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
                    {filteredProducts.length > 0 ? (
                      <ul className="max-md:flex flex-col gap-3 md:space-x-3 md:space-y-3">
                        {filteredProducts.map((product, index) => {
                          const localizedName = getLocalizedProduct(
                            product.product_production_description,
                            locale,
                            "name"
                          );
                          const linkNameCategory = formatText(
                            getLocalizedCategoryName(
                              product.category_name,
                              "en"
                            )
                          );
                          const linkNameProducts = formatText(
                            getLocalizedProduct(
                              product?.product_production_description,
                              "en",
                              "name"
                            )
                          );
                          return (
                            <Link
                              href={
                                path?.place !== "branch"
                                  ? `/${locale}/${path.place}/category/${product.menu_category_id}-${linkNameCategory}/product/${product.product_id}-${linkNameProducts}`
                                  : `/${locale}/${path.place}/category/${product.menu_category_id}-${linkNameCategory}/product/${product.product_id}-${linkNameProducts}?spot=${spot}&table_id=${table_id}&table_num=${table_num}&service=${service}`
                              }
                              key={index}
                              className="inline-block p-3 textSmall3 bg-gray-100 rounded-md shadow"
                            >
                              {localizedName}
                            </Link>
                          );
                        })}
                      </ul>
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
                    {filteredCategories.length > 0 ? (
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
