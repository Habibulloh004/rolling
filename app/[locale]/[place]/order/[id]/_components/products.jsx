"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber, getLocalizedProduct, posterUrl } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";

const Products = ({ promotionData, isLoading, products, locale }) => {
  const cart = useTranslations("Cart");
  const all = useTranslations("All");

  return (
    <div className="w-full max-md:bg-white max-md:p-3 rounded-md pb-4 space-y-4">
      <h1 className="font-bold textNormal3 text-black text-start">
        {cart("your_order")}
      </h1>
      <>
        {isLoading ? (
          <>
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex gap-2 md:gap-4">
                <Skeleton className="aspect-square w-20 h-20 rounded-md" />
                <div className="flex flex-col justify-between w-full">
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-3/4 h-4" />
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
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
                    let activePromocode = false;
                    let resultPromo = null;
                    promotionData?.params?.conditions?.forEach((condition) => {
                      if (condition?.type == 2) {
                        const findProductsData = products?.find(
                          (prd) => prd?.product_id == condition.id
                        );
                        console.log({ findProductsData });

                        const allSummaProducts =
                          (findProductsData?.price["1"] / 100) *
                          findProductsData?.count;
                        console.log({
                          condition: condition?.sum / 100,
                          allSummaProducts,
                        });
                        if (
                          promotionData?.params?.discount_value > 0 &&
                          promotionData?.params?.result_type == 3 &&
                          allSummaProducts >= condition?.sum / 100 &&
                          findProductsData?.product_id == item?.product_id
                        ) {
                          activePromocode = true;
                          resultPromo = {
                            ...promotionData,
                            params: {
                              ...promotionData.params,
                              conditions:
                                promotionData?.params?.conditions?.map(
                                  (cond) => {
                                    if (cond?.id == condition?.id) {
                                      return {
                                        ...cond,
                                        active: true,
                                      };
                                    }
                                    return cond;
                                  }
                                ),
                            },
                          };
                        }
                      }
                    });
                    return (
                      <div
                        key={item.product_id}
                        className="flex gap-2 md:gap-4 mr-4"
                      >
                        <Image
                          src={
                            item.photo_origin
                              ? `${posterUrl}${item.photo_origin}`
                              : "/empty.jpg"
                          }
                          alt="product"
                          width={100}
                          height={100}
                          className="border max-sm:w-20 max-sm:h-20 h-20 object-cover aspect-square rounded-md col-span-2 row-span-2"
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
                            {activePromocode && resultPromo ? (
                              <div className="flex justify-end  flex-col font-semibold textSmall2 leading-5">
                                <h1>
                                  {" "}
                                  {item?.price["1"]
                                    ? `${formatNumber(
                                        (item.price["1"] / 100) *
                                          (1 -
                                            Number(
                                              resultPromo?.params
                                                ?.discount_value
                                            ) /
                                              100)
                                      )} ${all("sum")}`
                                    : "Price not available"}
                                </h1>
                                <p className="text-xs text-gray-500 line-through">
                                  {" "}
                                  {item?.price["1"]
                                    ? `${formatNumber(
                                        item.price["1"] / 100
                                      )} ${all("sum")}`
                                    : "Price not available"}
                                </p>
                              </div>
                            ) : (
                              <p className="font-semibold textSmall2 leading-5">
                                {item?.price["1"]
                                  ? `${formatNumber(
                                      item.price["1"] / 100
                                    )} ${all("sum")}`
                                  : "Price not available"}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <h1 className="textSmall3">{cart("empty_product")}</h1>
            )}
          </>
        )}
      </>
    </div>
  );
};

export default Products;
