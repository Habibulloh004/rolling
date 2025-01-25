"use client";
import { formatNumber, getLocalizedProduct, posterUrl } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";

const Products = ({ products, locale }) => {
  const cart = useTranslations("Cart");
  const all = useTranslations("All");

  return (
    <div className="max-md:bg-white max-md:p-3 w-full rounded-md pb-4 space-y-4">
      <h1 className="font-bold textNormal3 text-black text-start">
        {cart("your_order")}
      </h1>
      {products?.length > 0 ? (
        <div className="overflow-y-scroll flex flex-col min-h-[200px] max-h-[300px] sm:max-h-[400px] w-full simple-scrollbar gap-5">
          {products
            ?.slice()
            ?.reverse()
            ?.map((item, i) => {
              const localizedName = getLocalizedProduct(
                item.product_production_description,
                locale,
                "name"
              );
              return (
                <div key={item.product_id} className="flex gap-2 md:gap-4 mr-4">
                  <Image
                    src={`${posterUrl}${item.photo_origin}`}
                    alt="product"
                    width={100}
                    height={100}
                    className="max-sm:w-20 max-sm:h-20 object-cover aspect-square rounded-md col-span-2 row-span-2"
                  />
                  <div className="w-full flex flex-col justify-between min-h-16 md:min-h-20 gap-2 md:gap-4 relative">
                    <div className="w-full row-span-1 h-full flex items-start justify-between gap-y-3 gap-1">
                      <p className="font-semibold textSmall3">
                        {localizedName}
                      </p>
                    </div>
                    <div className="w-full col-span-3 row-span-1 flex justify-between item-start sm:items-center">
                      <p className="text-center flex items-center justify-center font-[500]">
                        x{item.count}
                      </p>
                      <p className="font-semibold textSmall2 leading-5">
                        {item?.price["1"]
                          ? `${formatNumber(item.price["1"] / 100)} ${all(
                              "sum"
                            )}`
                          : "Price not available"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      ) : (
        <h1 className="textSmall3">{cart("empty_product")}</h1>
      )}
    </div>
  );
};

export default Products;
