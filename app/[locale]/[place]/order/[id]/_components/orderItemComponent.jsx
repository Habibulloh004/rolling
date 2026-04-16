"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslations } from "use-intl";
import Stepper from "./stepper";
import Products from "./products";
import { getOrder } from "@/actions";
import {
  formatNumber,
  translateTextSpot,
  translateTextSpotAddress,
} from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrderItemComponent({
  spotsData,
  productsData,
  promotions,
  param,
  locale,
}) {
  const all = useTranslations("All");
  const promotionT = useTranslations("Order.Promocode");
  const deliveryText = useTranslations("Cart.Delivery");
  const cartText = useTranslations("Cart.Total");
  const [isLoading, setIsLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isCancelledOrder, setIsCancelledOrder] = useState(false);
  const [promotionData, setPromotionData] = useState();
  const normalizeOrderType = (order) => {
    const explicitType = String(order?.type || "").toLowerCase();
    if (explicitType.includes("delivery")) return "delivery";
    if (explicitType.includes("take_away") || explicitType.includes("pickup")) {
      return "take_away";
    }
    if (explicitType.includes("spot")) return "spot";

    const serviceMode = Number(order?.service_mode ?? order?.serviceMode ?? 0);
    if (serviceMode === 3) return "delivery";
    if (serviceMode === 2) return "take_away";
    if (serviceMode === 1) return "spot";
    return "delivery";
  };
  const getLocalOrder = (orderId) => {
    try {
      const list = JSON.parse(localStorage.getItem("orderList") || "[]");
      return list.find((item) => String(item?.order_id) === String(orderId)) || null;
    } catch {
      return null;
    }
  };

  const getNormalizedStatus = (order) => {
    const type = normalizeOrderType(order);
    if (type === "spot") {
      const history = Array.isArray(order?.history) ? order.history : [];
      const hasCloseEvent = history.some(
        (entry) => String(entry?.type_history || "").toLowerCase() === "close"
      );
      const hasCancelEvent = history.some((entry) => {
        const eventType = String(entry?.type_history || "").toLowerCase();
        const eventValue = String(entry?.value || "").trim();
        return eventType === "changeorderstatus" && eventValue === "4";
      });
      if (hasCancelEvent) return "cancel";
      if (hasCloseEvent) return "finished";

      const txStatus = Number(order?.status);
      if (txStatus === 4) return "cancel";
      if (txStatus === 2) return "finished";

      const processing = Number(order?.processing_status ?? order?.processingStatus);
      if (Number.isFinite(processing)) {
        if (processing === 10 || processing === 0) return "pending";
        if (processing === 20 || processing === 1) return "accept";
        if (
          processing === 30 ||
          processing === 40 ||
          processing === 2 ||
          processing === 3 ||
          processing === 4
        ) {
          return "cooking";
        }
        if (processing >= 50) return "finished";
      }
    }

    const statusCandidates = [
      order?.status,
      order?.order_status,
      order?.orderStatus,
      order?.OrderStatus,
      order?.transaction_status,
      order?.transactionStatus,
      order?.state,
      order?.orderDetails?.status,
      order?.orderDetails?.orderStatus,
      order?.orderDetails?.order_status,
    ];

    const rawStatus = statusCandidates.find(
      (value) => value !== undefined && value !== null && String(value).trim() !== ""
    );
    return String(rawStatus || "").toLowerCase().replace(/[\s_-]+/g, "");
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

  const resolveStatusStep = (normalized, orderType) => {
    const type = String(orderType || "").toLowerCase();
    const isDelivery = type.includes("delivery");
    const isTakeaway = type.includes("take_away") || type.includes("pickup");
    if (normalized === "pending" || normalized === "awaitingpayment") {
      return 1;
    }
    if (normalized === "accept" || normalized === "accepted" || normalized === "confirmed") {
      return 2;
    }
    if (normalized === "cooking" || normalized === "preparing" || normalized === "inprogress" || normalized === "prepared") {
      return 3;
    }
    if (normalized === "delivery" || normalized === "ontheway" || normalized === "indelivery" || normalized === "courier") {
      return isDelivery || isTakeaway ? 4 : 3;
    }
    if (normalized === "finished" || normalized === "delivered" || normalized === "completed" || normalized === "done" || normalized === "taken" || normalized === "closed") {
      return isDelivery || isTakeaway ? 5 : 4;
    }

    if (
      normalized === "cancel" ||
      normalized === "cancelled" ||
      normalized === "canceled" ||
      normalized === "rejected"
    ) {
      return 0;
    }

    const numeric = Number(normalized);
    if (Number.isFinite(numeric)) {
      if (isDelivery || isTakeaway) {
        if (numeric >= 4) return 5;
        if (numeric >= 3) return 4;
        if (numeric >= 2) return 3;
        if (numeric >= 1) return 2;
      } else {
        if (numeric >= 4) return 4;
        if (numeric >= 3) return 3;
        if (numeric >= 2) return 2;
        if (numeric >= 1) return 1;
      }
    }

    return 0;
  };

  const fetchAddress = useCallback(async () => {
    try {
      let order = await getOrder(param.id);
      if (!order || typeof order !== "object") {
        order = getLocalOrder(param.id);
      }
      if (order) {
        const products =
          typeof order?.products === "string"
            ? JSON.parse(order.products || "[]")
            : Array.isArray(order?.products)
              ? order.products
              : [];
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
            const product = productsData?.find(
              (prod) => prod.product_id == orderItem.product_id
            );
            if (product) {
              return {
                ...product,
                count: orderItem.amount,
                unit_price: Number(orderItem?.unit_price || 0),
              };
            }
            return {
              product_id: orderItem?.product_id || 0,
              count: Number(orderItem?.amount || 0),
              name: String(orderItem?.name || ""),
              backend_name: String(orderItem?.name || ""),
              product_production_description: `*** *** *** ${String(orderItem?.name || "")} *** ${String(orderItem?.name || "")} *** ${String(orderItem?.name || "")}`,
              photo_origin: "",
              price: {
                1: Math.round(Number(orderItem?.unit_price || 0) * 100),
              },
              unit_price: Number(orderItem?.unit_price || 0),
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

        const orderType = normalizeOrderType(order);
        const normalizedStatus = getNormalizedStatus(order);
        setCurrentStep(resolveStatusStep(normalizedStatus, orderType));
        setIsCancelledOrder(
          ["cancel", "cancelled", "canceled", "rejected"].includes(
            normalizedStatus
          )
        );
        if (order?.spot_id != 0) {
          const spot = spotsData?.find((s) => s.spot_id == order?.spot_id);
          setOrderData({
            ...order,
            type: orderType,
            address: resolvedAddress,
            products: orderedProducts,
            spotData: spot,
          });
        } else {
          setOrderData({
            ...order,
            type: orderType,
            address: resolvedAddress,
            products: orderedProducts,
          });
        }
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, [locale, param.id, productsData, promotions?.response, spotsData]);

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

  return (
    <div className="w-full lg:w-full lg:space-x-10">
      <div className="flex flex-col-reverse lg:flex-row lg:justify-between w-full gap-4">
        <div className=" lg:w-2/3">
          {orderData?.type?.includes("delivery") && (
            <>
              <div className="flex flex-col justify-start items-start w-full gap-[10px] pt-5 lg:p-0">
                <p className="textSmall3 text-[#A098AE]">
                  {deliveryText("address")}
                </p>
                <p className="md:w-10/12 flex items-center textSmall2 font-bold gap-3">
                  <Image
                    src={"/assets/Location.svg"}
                    alt="location"
                    width={100}
                    height={100}
                    className="w-6 h-6 md:w-8 md:h-8"
                  />
                  {orderData?.address}
                </p>
                <p className="textSmall2 text-[#2E2E2E] text-center ">
                  {orderData?.address_comment}
                </p>
                <div className="mt-5 w-full">
                  <Stepper
                    currentStep={currentStep}
                    isCancelled={isCancelledOrder}
                    orderType={orderData?.type}
                    paymentType={orderData?.payment_type}
                  />
                </div>
              </div>
            </>
          )}
          {isLoading ? (
            <div className="w-full lg:w-10/12 mx-auto mt-5">
              <div className="flex flex-col gap-3">
                <div className="">
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="flex justify-between gap-2">
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                </div>
              </div>
            </div>
          ) : (
            <>
              {orderData?.type?.includes("take_away") && (
                <>
                  <div className="flex flex-col-reverse items-center  gap-10 lg:flex-row lg:justify-center mt-12">
                    <div className="max-sm:w-10/12 max-md:w-2/3 md:w-[300px] py-3 px-5 bg-white rounded-xl flex flex-col justify-center items-center">
                      <Image
                        src={"/assets/Location.svg"}
                        alt="image"
                        width={100}
                        height={100}
                        className=""
                      />
                      <article className="pt-3 space-y-1">
                        <p className="text-xs font-medium">
                          {translateTextSpot(
                            orderData?.spotData?.spot_name ||
                              orderData?.spotData?.name ||
                              orderData?.branch_name,
                            locale
                          )}
                        </p>
                        <p className="text-[9px] font-light">
                          {translateTextSpotAddress(
                            orderData?.spotData?.spot_adress ||
                              orderData?.spotData?.address ||
                              orderData?.branch_address,
                            locale
                          )}
                        </p>
                      </article>
                      <a
                        href={`tel:${
                          orderData?.spot_id === 1
                            ? "+998771212424"
                            : orderData?.spot_id === 2
                            ? "+998771202424"
                            : "+998770792424"
                        }`}
                      >
                        <Button
                          aria-label={`oritem spot`}
                          className={
                            "h-8 text-[12px] md:text-sm mt-[10px] hover:bg-primary "
                          }
                        >
                          {orderData?.spot_id === 1
                            ? "+998 (77) 121 24 24"
                            : orderData?.spot_id === 2
                            ? "+998 (77) 120 24 24"
                            : "+998 (77) 079 24 24"}
                        </Button>
                      </a>
                    </div>
                    <Stepper
                      currentStep={currentStep}
                      isCancelled={isCancelledOrder}
                      orderType={orderData?.type}
                    />
                  </div>
                </>
              )}
              {orderData?.type?.includes("spot") && (
                <div className="flex flex-col-reverse items-center gap-10 lg:flex-row lg:justify-center mt-12">
                  <div className="max-sm:w-10/12 max-md:w-2/3 md:w-[300px] py-3 px-5 bg-white rounded-xl flex flex-col justify-center items-center">
                    <Image
                      src={"/assets/Location.svg"}
                      alt="image"
                      width={100}
                      height={100}
                    />
                    <article className="pt-3 space-y-1">
                      <p className="text-xs font-medium">
                        {translateTextSpot(
                          orderData?.spotData?.spot_name ||
                            orderData?.spotData?.name ||
                            orderData?.branch_name,
                          locale
                        )}
                      </p>
                      <p className="text-[9px] font-light">
                        {translateTextSpotAddress(
                          orderData?.spotData?.spot_adress ||
                            orderData?.spotData?.address ||
                            orderData?.branch_address,
                          locale
                        )}
                      </p>
                    </article>
                  </div>
                  <Stepper
                    currentStep={currentStep}
                    isCancelled={isCancelledOrder}
                    orderType={orderData?.type}
                    paymentType={orderData?.payment_type}
                  />
                </div>
              )}
            </>
          )}
        </div>
        <div className="w-full lg:w-1/3 space-y-4">
          {(() => {
            const totals = getOrderTotals(orderData);
            return (
              <>
          <Products
          promotionData={promotionData}
            locale={locale}
            products={orderData?.products}
            isLoading={isLoading}
          />
          <div className="h-[0.5px] w-full bg-[#DBDBDB]" />
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="w-full h-6" />
              <Skeleton className="w-full h-6" />
            </div>
          ) : (
            <div className="flex flex-col gap-y-4">
              <div className="w-full flex justify-between">
                <p className="font-medium textSmall3  leading-5 text-[#2E2E2E] text-start md:text-end">
                  {cartText("products_sum")}
                </p>
                <p className="font-normal textNormal2 leading-7 text-[#2E2E2E]">
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
              {orderData?.type?.includes("delivery") && (
                <div className="w-full flex justify-between">
                  <p className="font-medium textSmall3  leading-5 text-[#2E2E2E] text-start md:text-end">
                    {cartText("delivery")}
                  </p>
                  <p className="font-normal textNormal2 leading-7 text-[#2E2E2E]">
                    {formatNumber(totals.deliverySum)} {all("sum")}
                  </p>
                </div>
              )}
              {orderData?.payed_bonus && orderData?.payed_bonus != 0 ? (
                <div className="w-full flex justify-between">
                  <p className="font-medium textSmall3 leading-5 text-[#2E2E2E] text-start md:text-end">
                    {cartText("bonus")}
                  </p>
                  <p className="font-normal textNormal2 leading-7 text-[#2E2E2E]">
                    {formatNumber(Number(orderData?.payed_bonus / 100))}{" "}
                    {all("sum")}
                  </p>
                </div>
              ) : null}
              <div className="w-full flex justify-between">
                <p className="font-medium textSmall3 leading-5 text-[#2E2E2E] text-start md:text-end">
                  {cartText("total")}
                </p>
                <p className="font-medium textNormal3 text-[#2E2E2E]">
                  {formatNumber(totals.totalSum)} {all("sum")}
                </p>
              </div>
            </div>
          )}
        </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
