"use client";

import { getOrder, getOrderRender } from "@/actions";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  formatNumber,
  getLocalizedProduct,
  posterUrl,
  translateTextSpot,
  translateTextSpotAddress,
} from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useTranslations } from "use-intl";
import confetti from "canvas-confetti";

export default function OrderItemComponent({
  spotsData,
  promotions,
  productsData,
  locale,
  param,
}) {
  const orderText = useTranslations("Order.Item");
  const promotionT = useTranslations("Order.Promocode");
  const all = useTranslations("All");
  const total = useTranslations("Cart.Total");
  const [orderData, setOrderData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [payError, setPayError] = useState(true);
  const [promotionData, setPromotionData] = useState();

  const handleSuccess = () => {
    const duration = 2 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  useEffect(() => {
    setIsLoading(true);

    const fetchAddress = async () => {
      try {
        const orderPay = await getOrderRender(param?.id);
        if (orderPay) {
          const order = await getOrder(orderPay?.order_id);

          if (order) {
            const match = order?.comment?.match(/Промокод:\s*(\S+)/);
            if (match) {
              const promoCode = match[1];
              const promo = promotions?.response?.find((prm) => {
                const promoFind = prm?.name?.split("$")[1].toLowerCase().trim();
                return promoFind === promoCode.toLowerCase();
              });
              setPromotionData(promo);
            }
            setPayError(false);
            const products = JSON.parse(order?.products);
            handleSuccess();
            const orderedProducts = products
              .map((orderItem) => {
                const product = productsData?.find(
                  (prod) => prod.product_id == orderItem.product_id
                );
                if (product) {
                  return {
                    ...product,
                    count: orderItem.amount,
                  };
                }
                return null;
              })
              .filter(Boolean);

            const location = order?.client_address.split(",");
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${String(
                location[0]
              )}&lon=${String(
                location[1]
              )}&format=json&accept-language=${locale}`
            );
            const addressRes = await res.json();

            if (order?.spot_id != 0) {
              const spot = spotsData?.find((s) => s.spot_id == order?.spot_id);
              setOrderData({
                ...order,
                address: String(addressRes?.display_name),
                products: orderedProducts,
                spotData: spot,
              });
            } else {
              setOrderData({
                ...order,
                address: String(addressRes?.display_name),
                products: orderedProducts,
              });
            }
          } else {
            setPayError(true);
          }
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };
    fetchAddress();
  }, []);

  if (payError && !isLoading) {
    return (
      <div className="w-full lg:w-11/12 mx-auto flex flex-col items-center justify-center gap-4 mt-10">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-5 rounded-lg shadow-sm w-full text-center">
          <h2 className="text-xl font-semibold">⚠️ {orderText("waiting")} </h2>
          <p className="mt-2">{orderText("waiting_order")}</p>
        </div>
        <Button
          onClick={() => window.location.reload()}
          className="lg:h-12 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white"
        >
          {orderText("try_again")}
        </Button>
        <Link href={`/${locale}/${param?.place}`}>
          <Button
            aria-label={`order menu`}
            className="w-full lg:h-12 rounded-xl bg-[#43674E] hover:bg-[#43674E]"
          >
            {orderText("menu_btn")}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-11/12 mx-auto flex flex-col lg:grid grid-cols-2 gap-5 lg:gap-20 mt-4 lg:mt-10">
      <div className="w-full lg:max-w-md space-y-3">
        <h1 className="font-bold textNormal3 text-black text-start">
          {isLoading ? (
            <Skeleton className="w-1/2 h-6" />
          ) : (
            orderText("my_order")
          )}
        </h1>
        <div className="overflow-y-scroll flex flex-col max-h-[500px] w-full py-4 simple-scrollbar space-y-4 pr-2">
          {isLoading
            ? Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex gap-2 md:gap-4">
                  <Skeleton className="aspect-square w-20 h-20 rounded-md" />
                  <div className="flex flex-col justify-between w-full">
                    <Skeleton className="w-full h-4" />
                    <Skeleton className="w-3/4 h-4" />
                  </div>
                </div>
              ))
            : orderData?.products
                ?.slice()
                ?.reverse()
                ?.map((item) => {
                  const localizedName = getLocalizedProduct(
                    item.product_production_description,
                    locale,
                    "name"
                  );
                  return (
                    <div
                      key={item.product_id}
                      className="flex gap-2 md:gap-4 mr-4"
                    >
                      <Image
                        src={
                          item?.photo_origin
                            ? `${posterUrl}${item.photo_origin}`
                            : "/empty.jpg"
                        }
                        alt="product"
                        width={100}
                        height={100}
                        className="border max-sm:w-20 max-sm:h-20 h-20 object-cover aspect-square rounded-md col-span-2 row-span-2"
                      />
                      <div className="w-full flex flex-col justify-between min-h-16 md:min-h-20 gap-2 md:gap-4 relative">
                        <p className="font-semibold textSmall3">
                          {localizedName}
                        </p>
                        <div className="flex justify-between">
                          <p>{item?.count}x</p>
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
      </div>
      <div className="w-full relative space-y-3">
        <h1 className="font-bold textNormal2 text-black text-start">
          {isLoading ? (
            <Skeleton className="w-1/2 h-6" />
          ) : orderData?.type?.includes("delivery") ? (
            orderText("status_delivery")
          ) : orderData?.type?.includes("take_away") ? (
            orderText("status_pickup")
          ) : (
            orderData?.type?.includes("spot") && orderText("status_spot")
          )}
        </h1>
        <div className="flex items-center gap-2">
          {isLoading ? (
            <div className="flex flex-col w-full justify-between gap-2">
              <div
                className={`w-full flex flex-col justify-start items-start gap-2 max-sm:p-1 max-sm:rounded-md max-sm:border-2`}
              >
                <div className="w-full flex items-start gap-2">
                  <Skeleton className="w-[20] sm:w-[24] h-[20px] sm:h-[24px] rounded-md" />
                  <Skeleton className="w-10/12 h-[20] sm:h-[20] rounded-md" />
                </div>
                <Skeleton className="w-10/12 h-[20] sm:h-[20] rounded-md" />
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-2 textSmall3 font-bold">
                  <Image
                    src={"/assets/Location.svg"}
                    alt="location"
                    width={100}
                    height={100}
                    className="w-6 h-6 md:w-8 md:h-8"
                  />
                  {orderData?.type?.includes("take_away") ? (
                    <div>
                      <p className="font-semibold textSmall3">
                        {translateTextSpot(
                          orderData?.spotData?.spot_name,
                          locale
                        )}
                      </p>
                      <p className="text-thin font-[500] textSmall2 mt-2">
                        {translateTextSpotAddress(
                          orderData?.spotData?.spot_adress,
                          locale
                        )}
                      </p>
                    </div>
                  ) : (
                    <p className="font-semibold textSmall3">
                      {orderData?.address}
                    </p>
                  )}
                </div>
                {orderData?.address_comment && (
                  <>
                    {orderData?.address_comment != "no" && (
                      <p className="text-thin font-[500] textSmall2 mt-2">
                        {orderData?.address_comment}
                      </p>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </div>
        <div className="flex flex-col gap-y-4">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="w-full h-6" />
              <Skeleton className="w-full h-6" />
            </div>
          ) : (
            <>
              <div className="w-full flex justify-between">
                <p className="font-medium textNormal2 leading-5 text-[#2E2E2E]">
                  {total("products_sum")}
                </p>
                <p className="font-normal textNormal2 text-[#2E2E2E]">
                  {formatNumber(
                    orderData?.all_price / 100 -
                      (orderData?.type?.includes("delivery") ? 10000 : 0)
                  )}{" "}
                  {all("sum")}
                </p>
              </div>
              {promotionData && (
                <div className="w-full flex justify-between">
                  <p className="font-medium textNormal2 leading-5 text-[#2E2E2E]">
                    {promotionT("titleDialog")}
                  </p>
                  {promotionData?.params?.result_type == 3 && (
                    <p className="font-normal text-primary textNormal2 text-[#2E2E2E]">
                      {formatNumber(promotionData?.params?.discount_value)}%{" "}
                      {all("disc")}
                    </p>
                  )}
                  {promotionData?.params?.result_type == 2 && (
                    <p className="text-primary font-normal textNormal2 text-[#2E2E2E]">
                      -
                      {formatNumber(
                        promotionData?.params?.discount_value / 100
                      )}{" "}
                      {all("sum")}
                    </p>
                  )}
                  {promotionData?.params?.result_type == 1 && (
                    <p className="text-primary font-normal textNormal2 text-[#2E2E2E]">
                      {promotionData?.name?.split("$")[1]}
                    </p>
                  )}
                </div>
              )}
              {orderData?.payed_bonus != 0 && orderData?.payed_bonus && (
                <div className="w-full flex justify-between">
                  <p className="font-medium textNormal2 leading-5 text-[#2E2E2E]">
                    {total("bonus")}
                  </p>
                  <p className="font-normal textNormal2 text-[#2E2E2E]">
                    {formatNumber(orderData?.payed_bonus / 100)} {all("sum")}
                  </p>
                </div>
              )}
              {orderData?.type?.includes("delivery") && (
                <div className="w-full flex justify-between">
                  <p className="font-medium textNormal2 leading-5 text-[#2E2E2E]">
                    {total("delivery")}
                  </p>
                  <p className="font-normal textNormal2 text-[#2E2E2E]">
                    {formatNumber(10000)} {all("sum")}
                  </p>
                </div>
              )}
              <div className="border-b-[1px] border-[#DBDBDB]" />
              <div className="flex items-center justify-between">
                <p className="font-medium textNormal3 text-[#2E2E2E]">
                  {total("total")}
                </p>
                <p className="font-medium textNormal3 text-[#2E2E2E]">
                  {formatNumber(orderData?.payed_sum / 100)} {all("sum")}
                </p>
              </div>
            </>
          )}
        </div>
        <div className="w-full">
          <>
            <Link href={`/${locale}/${param?.place}`}>
              <Button
                aria-label={`order menu`}
                className="w-full lg:h-12 rounded-xl bg-[#43674E] hover:bg-[#43674E]"
              >
                {orderText("menu_btn")}
              </Button>
            </Link>
            <Link href={`/${locale}/${param?.place}/orderpay/${param?.id}`}>
              <Button
                aria-label={`order open`}
                className="w-full lg:h-12 rounded-xl bg-[#F5F5F5] hover:bg-[#F5F5F5] text-[#004032] mt-[11px]"
              >
                {orderText("open_btn")}
              </Button>
            </Link>
            <Link href={`/${locale}/${param?.place}/create-review`}>
              <Button
                aria-label={`order add`}
                className="w-full lg:h-12 rounded-xl bg-[#F5F5F5] hover:bg-[#F5F5F5] text-[#004032] mt-[11px]"
              >
                {orderText("add_comment")}
              </Button>
            </Link>
          </>
        </div>
      </div>
    </div>
  );
}
