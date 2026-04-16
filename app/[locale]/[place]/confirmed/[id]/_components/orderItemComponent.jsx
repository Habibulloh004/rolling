"use client";

import { getOrder } from "@/actions";
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
import React, { useCallback, useEffect, useState } from "react";
import { useTranslations } from "use-intl";
import confetti from "canvas-confetti";

export default function OrderItemComponent({
  spotsData,
  productsData,
  locale,
  param,
  fallbackTransactionId = null,
  promotions = [],
}) {
  const orderText = useTranslations("Order.Item");
  const promotionT = useTranslations("Order.Promocode");
  const all = useTranslations("All");
  const total = useTranslations("Cart.Total");
  const [orderData, setOrderData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [promotionData, setPromotionData] = useState();
  const asNumber = (value, fallback = 0) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  };
  const normalizeServiceType = (order) => {
    const rawType = String(order?.type || "").toLowerCase();
    if (rawType.includes("delivery")) return "delivery";
    if (rawType.includes("take_away") || rawType.includes("pickup")) return "take_away";
    if (rawType.includes("spot")) return "spot";
    const mode = asNumber(order?.service_mode ?? order?.serviceMode, 0);
    if (mode === 3) return "delivery";
    if (mode === 2) return "take_away";
    if (mode === 1) return "spot";
    return rawType || "delivery";
  };
  const getOrderTotals = (order) => {
    const products = Array.isArray(order?.products) ? order.products : [];
    const productsFromItems = products.reduce((sum, item) => {
      const count = Number(item?.count ?? item?.amount ?? item?.quantity ?? 0);
      const fallbackUnit =
        Number(item?.price?.["1"] || 0) > 0
          ? Number(item.price["1"]) / 100
          : Number(item?.unit_price || item?.price || 0);
      const lineTotal = Number(item?.total_price || 0);
      const safeLineTotal =
        lineTotal > 0
          ? lineTotal
          : (Number.isFinite(fallbackUnit) ? fallbackUnit : 0) *
            (Number.isFinite(count) ? count : 0);
      return sum + (Number.isFinite(safeLineTotal) ? safeLineTotal : 0);
    }, 0);

    const totalFromOrder = Number(order?.payed_sum || order?.all_price || 0) / 100;
    const deliveryRaw = Number(order?.delivery_fee || order?.delivery_price || order?.deliveryFee || 0);
    const isDelivery = String(order?.type || "").includes("delivery");

    const productsSum =
      productsFromItems > 0
        ? productsFromItems
        : Math.max(0, totalFromOrder - (isDelivery ? Math.max(0, deliveryRaw) : 0));

    const deliverySum = isDelivery
      ? deliveryRaw > 0
        ? deliveryRaw
        : Math.max(0, totalFromOrder - productsSum)
      : 0;

    const totalSum =
      totalFromOrder > 0 ? totalFromOrder : Math.max(0, productsSum + deliverySum);

    return { productsSum, deliverySum, totalSum };
  };
  const getLocalOrder = (orderId) => {
    try {
      const list = JSON.parse(localStorage.getItem("orderList") || "[]");
      return list.find((item) => String(item?.order_id) === String(orderId)) || null;
    } catch {
      return null;
    }
  };
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

  const fetchAddress = useCallback(async () => {
    try {
      let order = await getOrder(param.id);
      if ((!order || typeof order !== "object") && fallbackTransactionId) {
        order = await getOrder(fallbackTransactionId);
      }
      if (!order || typeof order !== "object") {
        order = getLocalOrder(param.id) || getLocalOrder(fallbackTransactionId);
      }
      if (order) {
        const products = (() => {
          if (typeof order?.products === "string") {
            try {
              const parsed = JSON.parse(order.products || "[]");
              return Array.isArray(parsed) ? parsed : [];
            } catch {
              return [];
            }
          }
          if (Array.isArray(order?.products)) return order.products;
          if (Array.isArray(order?.items)) return order.items;
          return [];
        })();
        const match = order?.comment?.match(/Промокод:\s*(\S+)/);
        if (match) {
          const promoCode = match[1];
          const promo = promotions?.response?.find((prm) => {
            const promoFind = prm?.name?.split("$")[1].toLowerCase().trim();
            return promoFind === promoCode.toLowerCase();
          });
          setPromotionData(promo);
        }

        const orderedProducts = products
          .map((orderItem) => {
            const itemProductId = orderItem?.product_id ?? orderItem?.menuItemId ?? 0;
            const itemCount = asNumber(
              orderItem?.amount ?? orderItem?.count ?? orderItem?.quantity,
              0
            );
            const itemUnitPrice = asNumber(
              orderItem?.unit_price ?? orderItem?.price,
              0
            );
            const product = productsData?.find(
              (prod) => prod.product_id == itemProductId
            );
            if (product) {
              return {
                ...product,
                count: itemCount,
                unit_price: itemUnitPrice,
                price:
                  product?.price && typeof product.price === "object"
                    ? product.price
                    : { 1: Math.round(itemUnitPrice * 100) },
              };
            }
            return {
              product_id: itemProductId,
              count: itemCount,
              name: String(orderItem?.name || ""),
              backend_name: String(orderItem?.name || ""),
              product_production_description: `*** *** *** ${String(orderItem?.name || "")} *** ${String(orderItem?.name || "")} *** ${String(orderItem?.name || "")}`,
              photo_origin: "",
              price: {
                1: Math.round(itemUnitPrice * 100),
              },
              unit_price: itemUnitPrice,
            };
          })
          .filter(Boolean);

        const location = String(order?.client_address || "0,0").split(",");
        let resolvedAddress = order?.address || order?.deliveryAddress || "";
        if (location.length >= 2 && Number(location[0]) && Number(location[1])) {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${String(
              location[0]
            )}&lon=${String(location[1])}&format=json&accept-language=${locale}`
          );
          const addressRes = await res.json();
          resolvedAddress = String(addressRes?.display_name || resolvedAddress);
        }

        if (order?.spot_id != 0) {
          const resolvedSpotId =
            order?.spot_id ?? order?.posterSpotId ?? order?.branch?.id ?? 0;
          const spot = spotsData?.find((s) => s.spot_id == resolvedSpotId);
          setOrderData({
            ...order,
            address: resolvedAddress,
            spot_id: resolvedSpotId,
            type: normalizeServiceType(order),
            address_comment:
              order?.address_comment ?? order?.deliveryAddressComment ?? null,
            delivery_fee:
              order?.delivery_fee ??
              order?.delivery_price ??
              order?.deliveryFee ??
              0,
            all_price:
              order?.all_price ??
              Math.round(
                (asNumber(order?.subtotal, 0) + asNumber(order?.deliveryFee, 0)) * 100
              ),
            payed_sum:
              order?.payed_sum ?? Math.round(asNumber(order?.total, 0) * 100),
            products: orderedProducts,
            spotData: spot,
          });
        } else {
          setOrderData({
            ...order,
            address: resolvedAddress,
            type: normalizeServiceType(order),
            address_comment:
              order?.address_comment ?? order?.deliveryAddressComment ?? null,
            delivery_fee:
              order?.delivery_fee ??
              order?.delivery_price ??
              order?.deliveryFee ??
              0,
            all_price:
              order?.all_price ??
              Math.round(
                (asNumber(order?.subtotal, 0) + asNumber(order?.deliveryFee, 0)) * 100
              ),
            payed_sum:
              order?.payed_sum ?? Math.round(asNumber(order?.total, 0) * 100),
            products: orderedProducts,
          });
        }

        handleSuccess();
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, [fallbackTransactionId, locale, param.id, productsData, promotions?.response, spotsData]);

  useEffect(() => {
    fetchAddress();
  }, [fetchAddress]);

  useEffect(() => {
    const normalizeId = (value) =>
      String(value ?? "")
        .trim()
        .replace(/^#/, "")
        .toLowerCase();

    const onOrderUpdate = (event) => {
      const payloadOrder = event?.detail?.order;
      if (!payloadOrder) {
        return;
      }

      const targetId = normalizeId(param.id);
      const incomingIds = [
        payloadOrder?.id,
        payloadOrder?.orderNumber,
        payloadOrder?.order_id,
      ]
        .map(normalizeId)
        .filter(Boolean);

      if (incomingIds.includes(targetId)) {
        fetchAddress();
      }
    };

    window.addEventListener("rolling:order-update", onOrderUpdate);
    return () =>
      window.removeEventListener("rolling:order-update", onOrderUpdate);
  }, [fetchAddress, param.id]);

  const totals = getOrderTotals(orderData);

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
                  const localizedNameValue = getLocalizedProduct(
                    item.product_production_description,
                    locale,
                    "name"
                  );
                  const localizedName =
                    localizedNameValue ||
                    item?.name ||
                    item?.backend_name ||
                    "Product";
                  let activePromocode = false;
                  let resultPromo = null;
                  promotionData?.params?.conditions?.forEach((condition) => {
                    if (condition?.type == 2) {
                      const findProductsData = orderData?.products?.find(
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
                            conditions: promotionData?.params?.conditions?.map(
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
                        <div className="flex justify-between gap-1">
                          <p>{item?.count}x</p>
                          {activePromocode && resultPromo ? (
                            <div className="flex justify-end  flex-col font-semibold textSmall2 leading-5">
                              <h1>
                                {" "}
                                {item?.price["1"]
                                  ? `${formatNumber(
                                      (item.price["1"] / 100) *
                                        (1 -
                                          Number(
                                            resultPromo?.params?.discount_value
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
                              {item?.price?.["1"]
                                ? `${formatNumber(item.price["1"] / 100)} ${all(
                                    "sum"
                                  )}`
                                : Number(item?.unit_price || 0) > 0
                                  ? `${formatNumber(
                                      Number(item.unit_price)
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
                          orderData?.spotData?.spot_name ||
                            orderData?.spotData?.name ||
                            orderData?.branch_name,
                          locale
                        )}
                      </p>
                      <p className="text-thin font-[500] textSmall2 mt-2">
                        {translateTextSpotAddress(
                          orderData?.spotData?.spot_adress ||
                            orderData?.spotData?.address ||
                            orderData?.branch_address,
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
                  {formatNumber(totals.productsSum)}{" "}
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
                    {formatNumber(Number(orderData?.payed_bonus || 0) / 100)} {all("sum")}
                  </p>
                </div>
              )}
              {orderData?.type?.includes("delivery") && (
                <div className="w-full flex justify-between">
                  <p className="font-medium textNormal2 leading-5 text-[#2E2E2E]">
                    {total("delivery")}
                  </p>
                  <p className="font-normal textNormal2 text-[#2E2E2E]">
                    {formatNumber(totals.deliverySum)} {all("sum")}
                  </p>
                </div>
              )}
              <div className="border-b-[1px] border-[#DBDBDB]" />
              <div className="flex items-center justify-between">
                <p className="font-medium textNormal3 text-[#2E2E2E]">
                  {total("total")}
                </p>
                <p className="font-medium textNormal3 text-[#2E2E2E]">
                  {formatNumber(totals.totalSum)}
                  {all("sum")}
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
            <Link href={`/${locale}/${param?.place}/order/${param?.id}`}>
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
