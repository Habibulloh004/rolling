"use client";

import CustomImage from "@/components/shared/customImage";
import { Button } from "@/components/ui/button";
import { cn, posterUrl } from "@/lib/utils";
import { useProductStore } from "@/store";
import { Heart, Minus, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

export default function ProductCard({
  localizedDesc,
  localizedName,
  productData,
}) {
  const { products, setProducts, incrementCount, decrementCount } =
    useProductStore();
  const handleAddProduct = () => {
    setProducts(productData);
  };
  const handleIncrementCount = () => {
    incrementCount(productData?.product_id);
  };
  const handleDecrementCount = () => {
    decrementCount(productData?.product_id);
  };
  const all = useTranslations("All");
  const findProduct = products.find(
    (pr) => pr.product_id == productData.product_id
  );

  return (
    <main className="w-full h-full relative py-5 flex max-md:flex-col gap-5">
      <button className="z-50 absolute right-1 top-1 md:right-2 md:top-2 rounded-full bg-white p-1 shadow-sm transition-colors hover:bg-gray-100">
        <Heart
          className={cn(
            "h-6 w-6",
            true ? "fill-[#43674E] text-[#43674E]" : "text-gray-400"
          )}
        />
      </button>
      <section className="w-full md:w-[400px] h-full xl:w-[450px] 2xl:w-[500px] flex flex-col gap-3">
        <div className="aspect-[16/12] md:aspect-square relative rounded-md overflow-hidden bg-secondary">
          <CustomImage
            src={`${posterUrl}${productData.photo_origin}`}
            alt="text"
            className={"w-full h-full object-cover md:object-contain"}
          />
        </div>
      </section>
      <section className="w-11/12 justify-between flex-grow flex flex-col gap-5">
        <div className="space-y-2">
          <h1 className="textNormal4 text-primary font-bold">
            {localizedName}
          </h1>
          <p
            className="textSmall"
            dangerouslySetInnerHTML={{
              __html: localizedDesc.replace(/\./g, ".<br />"),
            }}
          ></p>

          <h2 className="text-primary font-bold textNormal5">
            {productData.price["1"] / 100} сум
          </h2>
        </div>
        <div className="flex justify-end items-center gap-5 col-span-2">
          {findProduct ? (
            <div className="max-md:w-full flex justify-end items-center gap-2">
              <div className="max-sm:w-full w-[250px] flex justify-around items-center gap-1 bg-white rounded-md">
                <button
                  onClick={handleIncrementCount}
                  className="flex justify-center items-center w-full rounded-l-md p-2 bg-white active:bg-gradient-to-r active:from-foreground/10 active:to-white/10"
                >
                  <Plus
                    className="text-primary max-md:w-4 max-md:h-4 w-5 h-5"
                    size={18}
                  />
                </button>
                <span className="font-bold text-[12px] md:textNormal2 text-primary min-w-6 text-center">
                  {findProduct?.count > 9
                    ? findProduct?.count
                    : `0${findProduct?.count}`}
                </span>
                <button
                  onClick={handleDecrementCount}
                  className="flex justify-center items-center w-full rounded-r-md p-2 bg-white active:bg-gradient-to-l active:from-foreground/10 active:to-white/20"
                >
                  <Minus className="text-primary max-md:w-4 max-md:h-4 w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="max-md:w-full"></div>
          )}
          <Button
            onClick={handleAddProduct}
            className="w-full md:w-40 hover:bg-primary-modal"
          >
            {all("add")}
          </Button>
        </div>
      </section>
    </main>
  );
}
