"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import CategoryBrowser from "./categoryBrowser";
import {
  getCachedCategories,
  loadCategories,
} from "@/lib/client-category-cache";

export default function CategoryComponent({ path }) {
  const locale = useLocale();
  const all = useTranslations("All");

  const [categories, setCategories] = useState(
    () => getCachedCategories(locale) || []
  );
  const [isLoading, setIsLoading] = useState(categories.length === 0);

  useEffect(() => {
    let cancelled = false;

    loadCategories(locale)
      .then((data) => {
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setCategories(data);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [locale]);

  if (isLoading) {
    return (
      <section className="w-full space-y-3">
        <div className="w-11/12 mx-auto flex justify-between items-center gap-3">
          <h1 className="font-bold text-primary textNormal4 w-full">
            {all("categories")}
          </h1>
        </div>

        {/* Category slider skeleton */}
        <div className="md:w-11/12 mx-auto w-full pt-2 pb-2">
          <div className="flex gap-2 overflow-hidden">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={`cat-skel-${i}`}
                className="flex-shrink-0 basis-[22%] sm:basis-[15%] md:basis-[12%] xl:basis-[8%] animate-pulse"
              >
                <div className="flex flex-col items-center gap-2 p-1 m-1">
                  <div className="w-full aspect-square rounded-2xl md:rounded-3xl bg-gray-200" />
                  <div className="h-3 w-3/4 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product cards skeleton */}
        <div className="w-11/12 mx-auto space-y-10">
          <div className="space-y-4">
            <div className="h-5 w-32 rounded bg-gray-200 animate-pulse" />
            <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={`prod-skel-${i}`}
                  className="w-full bg-white rounded-md p-2 space-y-2 animate-pulse"
                >
                  <div className="w-full aspect-square rounded-sm bg-gray-200" />
                  <div className="space-y-2">
                    <div className="h-3 w-3/4 rounded bg-gray-200" />
                    <div className="h-2.5 w-1/2 rounded bg-gray-200" />
                    <div className="h-3 w-1/3 rounded bg-gray-200" />
                  </div>
                  <div className="flex justify-end">
                    <div className="h-8 w-16 rounded-md bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!categories.length) {
    return null;
  }

  return (
    <section className="w-full space-y-3">
      <div className="w-11/12 mx-auto flex justify-between items-center gap-3">
        <h1 className="font-bold text-primary textNormal4 w-full">
          {all("categories")}
        </h1>
      </div>

      <CategoryBrowser
        categories={categories}
        locale={locale}
        path={path}
      />
    </section>
  );
}
