"use client";
import { Button } from "@/components/ui/button";
import { formatNumber, getLocalizedProduct, posterUrl } from "@/lib/utils";
import { bucket } from "@/public";
import { useProductStore } from "@/store";
import { Minus, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";

const Products = ({ locale }) => {
  const cart = useTranslations("Cart");
  const all = useTranslations("All");
  const { products, incrementCount, decrementCount, deleteProduct } =
    useProductStore();

  const handleIncrementCount = (item) => {
    incrementCount(item?.product_id);
  };
  const handleDecrementCount = (item) => {
    decrementCount(item?.product_id);
  };

  return (
    <div className="max-md:bg-white p-3 w-full rounded-md pb-4 space-y-2">
      <h1 className="font-bold textNormal3 text-black text-start">
        {cart("your_order")}
      </h1>
      {products.length > 0 ? (
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
                        <Button
                          onClick={() => deleteProduct(item.product_id)}
                          className={
                            "bg-white active:bg-white/10 hover:bg-white p-0 h-8 w-8"
                          }
                        >
                          <Image
                            src={bucket}
                            alt="bucket"
                            width={16}
                            height={16}
                          />
                        </Button>
                      </div>
                      <div className="col-span-3 row-span-1 flex justify-between item-start sm:items-center">
                        <p className="font-semibold textSmall2 leading-5 w-full">
                          {item?.price["1"]
                            ? `${formatNumber(item.price["1"] / 100)} ${all(
                                "sum"
                              )}`
                            : "Price not available"}
                        </p>
                        <div className="grid grid-cols-3 w-full sm:w-[100px] h-[34px] bg-white border-2 rounded-md">
                          <button
                            onClick={() => handleDecrementCount(item)}
                            className={
                              "transition-all rounded-l-md ease-linear duration-75 bg-white h-full flex items-center justify-center font-bold text-[#646464] active:shadow-[-1px_0_2px_rgba(0,0,0,0.3)] active:opacity-75"
                            }
                          >
                            <Minus size={16} />
                          </button>
                          <p className="w-full h-full text-center flex items-center justify-center bg-foreground/10 font-[600]">
                            {item.count > 9 ? item.count : `0${item.count}`}
                          </p>
                          <button
                            onClick={() => handleIncrementCount(item)}
                            className={
                              "transition-all rounded-r-md ease-linear duration-75 bg-white h-full flex items-center justify-center font-bold text-[#646464] active:shadow-[1px_0_2px_rgba(0,0,0,0.3)] active:opacity-75"
                            }
                          >
                            <Plus size={16} />
                          </button>
                        </div>
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
