"use client";
import { Button } from "@/components/ui/button";
import {
  formatNumber,
  getLocalizedProduct,
  getUrl,
  posterUrl,
  roundToTwoDecimals,
} from "@/lib/utils";
import { useOrderStore, useProductStore } from "@/store";
import { BadgeCheck, Minus, Plus, Ticket } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

const Products = ({ apiTime, locale, place }) => {
  const searchParams = useSearchParams();
  const spot = searchParams.get("spot");
  const table_id = searchParams.get("table_id");
  const table_num = searchParams.get("table_num");
  const service = searchParams.get("service");
  const cart = useTranslations("Cart");
  const all = useTranslations("All");
  const orderT = useTranslations("Order.Item");
  const pathname = usePathname();
  const { products, incrementCount, decrementCount, deleteProduct } =
    useProductStore();
  const { setOrderData, setTotalSum, orderData, paymentData } = useOrderStore();

  const handleIncrementCount = (item) => {
    incrementCount(item?.product_id);
  };
  const handleDecrementCount = (item) => {
    decrementCount(item?.product_id);
  };
  const calculateProductTotal = (product) => {
    if (!product || !product.price || !product.count) {
      return 0;
    }
    let productPrice = Number(product.price["1"]) / 100;

    // Faqat foizli chegirma (result_type == 3) va active shart bo'lganda narxni o'zgartirish
    if (orderData?.promocode && orderData?.promocode?.params?.result_type == 3) {
      const conditions = orderData?.promocode?.params?.conditions;
      const discountValue = Number(orderData?.promocode?.params?.discount_value);

      // Faqat 0-100 oralig'ida bo'lgan foizli chegirmalarni qo'llash
      if (discountValue > 0 && discountValue <= 100) {
        const findCond = conditions?.find((cd) => {
          if (!cd?.active) return false;

          // Barcha mahsulotlar (type 0)
          if (cd?.type == 0) {
            return true;
          }
          // Kategoriya bo'yicha (type 1) - active bo'lganda barcha mahsulotlarga
          if (cd?.type == 1) {
            return true;
          }
          // Mahsulot bo'yicha (type 2)
          if (cd?.type == 2 && String(cd?.id) === String(product?.product_id)) {
            return true;
          }
          return false;
        });

        if (findCond) {
          productPrice = productPrice * (1 - discountValue / 100);
        }
      }
    }

    const count = product.count || 0;
    return roundToTwoDecimals(productPrice * count);
  };

  useEffect(() => {
    const calculateTotals = async () => {
      let totalSum = 0;

      products.forEach((product) => {
        const productTotal = calculateProductTotal(product);
        totalSum += productTotal;
      });
      setTotalSum(roundToTwoDecimals(totalSum));
    };
    calculateTotals();
  }, [products, orderData?.promocode]);

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
                item?.product_production_description,
                locale,
                "name"
              );
              // Faqat foizli chegirma (result_type == 3) va valid discount uchun
              const isPercentDiscount = orderData?.promocode?.params?.result_type == 3;
              const discountValue = Number(orderData?.promocode?.params?.discount_value);
              const isValidDiscount = isPercentDiscount && discountValue > 0 && discountValue <= 100;

              const conditions = orderData?.promocode?.params?.conditions;
              const findCond = isValidDiscount ? conditions?.find((cd) => {
                if (!cd?.active) return false;

                // Barcha mahsulotlar (type 0)
                if (cd?.type == 0) {
                  return true;
                }
                // Kategoriya bo'yicha (type 1) - active bo'lganda barcha mahsulotlarga
                if (cd?.type == 1) {
                  return true;
                }
                // Mahsulot bo'yicha (type 2)
                if (cd?.type == 2 && String(cd?.id) === String(item?.product_id)) {
                  return true;
                }
                return false;
              }) : null;
              return (
                <div key={item.product_id} className="flex gap-2 md:gap-4 mr-4">
                  <Image
                    src={
                      item?.photo_origin
                        ? `${posterUrl}${item.photo_origin}`
                        : "/empty.jpg"
                    }
                    alt="product"
                    width={100}
                    height={100}
                    className="border max-sm:w-20 max-sm:h-20 object-cover aspect-square rounded-md col-span-2 row-span-2"
                  />
                  <div className="w-full flex flex-col justify-between min-h-16 md:min-h-20 gap-2 md:gap-4 relative">
                    <div className="w-full row-span-1 h-full flex items-start justify-between gap-y-3 gap-1">
                      <p className="font-semibold textSmall3">
                        {localizedName}
                      </p>
                      {!item?.promocode && (
                        <Button
                          aria-label={`product image`}
                          disabled={paymentData && paymentData?.payment_id}
                          onClick={() => deleteProduct(item.product_id)}
                          className={
                            "bg-white active:bg-white/10 hover:bg-white p-0 h-8 w-8"
                          }
                        >
                          <Image
                            src={`/assets/bucket.svg`}
                            alt="bucket"
                            width={16}
                            height={16}
                          />
                        </Button>
                      )}
                    </div>
                    <div className="col-span-3 row-span-1 flex justify-between item-start sm:items-center">
                      {findCond ? (
                        <div className="font-semibold textSmall2 leading-5 w-full">
                          <h1>
                            {" "}
                            {item?.price["1"]
                              ? `${formatNumber(
                                  (item.price["1"] / 100) *
                                    (1 - discountValue / 100)
                                )} ${all("sum")}`
                              : "Price not available"}
                          </h1>
                          <p className="text-xs text-gray-500 line-through">
                            {" "}
                            {item?.price["1"]
                              ? `${formatNumber(item.price["1"] / 100)} ${all(
                                  "sum"
                                )}`
                              : "Price not available"}
                          </p>
                        </div>
                      ) : (
                        <p className="font-semibold textSmall2 leading-5 w-full">
                          {item?.price["1"]
                            ? `${formatNumber(item.price["1"] / 100)} ${all(
                                "sum"
                              )}`
                            : "Price not available"}
                        </p>
                      )}
                      {!item?.promocode?.promotion_id ? (
                        <div className="grid grid-cols-3 w-full sm:w-[100px] h-[34px] bg-white border-2 rounded-md">
                          <button
                            aria-label={`product minus`}
                            disabled={paymentData && paymentData?.payment_id}
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
                            aria-label={`product plus`}
                            disabled={paymentData && paymentData?.payment_id}
                            onClick={() => handleIncrementCount(item)}
                            className={
                              "transition-all rounded-r-md ease-linear duration-75 bg-white h-full flex items-center justify-center font-bold text-[#646464] active:shadow-[1px_0_2px_rgba(0,0,0,0.3)] active:opacity-75"
                            }
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-start items-center gap-2">
                          <h1 className="text-green-700 font-medium">
                            {item?.promocode?.name?.split("$")[1]}
                          </h1>
                          <div className="w-4 h-4 mb-4">
                            <Ticket
                              className="transform rotate-45 w-full text-green-500"
                              size={32}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      ) : (
        <div className="flex flex-col gap-2 justify-start items-start">
          <h1 className="textSmall3">{cart("empty_product")}</h1>
          <Link
            href={
              place != "branch"
                ? `${getUrl(pathname)}`
                : `${getUrl(
                    pathname
                  )}?spot=${spot}&table_id=${table_id}&table_num=${table_num}&service=${service}`
            }
          >
            <Button
              aria-label={`product menu`}
              className="w-full p-3 text-white text-center font-bold"
            >
              {orderT("menu_btn")}
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Products;
