"use client";
import { Button } from "@/components/ui/button";
import { formatNumber, getLocalizedProduct, posterUrl } from "@/lib/utils";
import { bucket } from "@/public";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";

const Products = ({ products, locale }) => {
  const cart = useTranslations("Cart");
  return (
    <div className="w-full border-b-2 border-[#DBDBDB] pb-[95px]">
      <h1 className="font-bold text-lg lg:text-2xl leading-9 text-black text-start">
        {cart("your_order")}
      </h1>
      <div className="overflow-y-scroll flex flex-col h-[400px] w-full simple-scrollbar">
        {products?.map((item, i) => {
          const localizedName = getLocalizedProduct(
            item.product_production_description,
            locale,
            "name"
          );
          return (
            <div key={i} className="flex h-20 gap-4 mt-6 relative mr-[20]">
              <Image
                src={`${posterUrl}${item.photo_origin}`}
                alt="product"
                width={100}
                height={100}
                className="object-cover aspect-square rounded-md"
              />
              <div className="h-full flex flex-col justify-center gap-y-3 ">
                <p className="font-semibold text-base  textSmall1 leading-7">
                  {localizedName}
                </p>
                <p className="font-semibold text-sm leading-5">
                  {item?.price["1"]
                    ? `${formatNumber(item.price["1"] / 100)} UZS`
                    : "Price not available"}
                </p>
              </div>
              <Button className={"bg-white absolute right-0 hover:bg-white"}>
                <Image src={bucket} alt="bucket" width={16} height={16} />
              </Button>

              <div className="grid grid-cols-3 w-[90px] h-[30px] absolute bottom-0 right-0 bg-white">
                <button
                  className={
                    "bg-white h-full flex items-center justify-center font-bold text-[#646464]"
                  }
                >
                  -
                </button>
                <p className="h-full text-center flex items-center justify-center">
                  2
                </p>
                <button
                  className={
                    "bg-white h-full flex items-center justify-center font-bold text-[#646464]"
                  }
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Products;
