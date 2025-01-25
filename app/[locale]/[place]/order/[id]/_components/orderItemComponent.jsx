"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useTranslations } from "use-intl";
import Stepper from "./stepper";
import Products from "./products";
import { location } from "@/public";
import { getOrder } from "@/actions";
import { formatNumber } from "@/lib/utils";

export default function OrderItemComponent({ productsData, param, locale }) {
  const all = useTranslations("All");
  const deliveryText = useTranslations("Cart.Delivery");
  const cartText = useTranslations("Cart.Total");
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const order = await getOrder(param.id);
        if (order) {
          const products = JSON.parse(order?.products);

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
            )}&lon=${String(location[1])}&format=json&accept-language=${locale}`
          );
          const addressRes = await res.json();
          setOrderData({
            ...order,
            address: String(addressRes?.display_name),
            products: orderedProducts,
          });
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };
    fetchAddress();
  }, []);

  console.log(orderData);

  return (
    <div>
      <div className="flex flex-col-reverse lg:flex-row lg:justify-between w-full gap-4">
        <div className=" lg:w-2/3">
          {orderData?.type.includes("delivery") && (
            <div className="flex flex-col justify-start items-start w-full gap-[10px] pt-5 lg:p-0">
              <p className="textSmall3 text-[#A098AE]">
                {deliveryText("address")}
              </p>
              <p className="flex items-center textSmall2 font-bold gap-3">
                <Image
                  src={location}
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
            </div>
          )}
          {orderData?.type.includes("take_away") && (
            <div className="flex flex-col-reverse items-center  gap-10 lg:flex-row lg:justify-between mt-12">
              <div className="max-sm:w-10/12 max-md:w-2/3 md:w-[300px] py-3 px-5 bg-white rounded-xl flex flex-col justify-center items-center">
                <Image
                  src={location}
                  alt="image"
                  width={100}
                  height={100}
                  className=""
                />
                <article className="pt-3">
                  <p className="text-xs font-medium">Паркентский филиал</p>
                  <p className="text-[9px] font-light">Улица Паркент 2</p>
                </article>
                <Button
                  className={
                    "h-8 text-[12px] md:text-sm mt-[10px] hover:bg-primary "
                  }
                >
                  +99899 777-77-77
                </Button>
              </div>
              <Stepper currentStep={1} />
            </div>
          )}
        </div>

        <div className="w-full lg:w-1/3 space-y-4">
          <Products locale={locale} products={orderData?.products} />
          <div className="h-[0.5px] w-full bg-[#DBDBDB]" />
          <div className="flex flex-col gap-y-4">
            <div className="w-full flex justify-between">
              <p className="font-medium textSmall3  leading-5 text-[#2E2E2E] text-start md:text-end">
                {cartText("products_sum")}
              </p>
              <p className="font-normal textNormal2 leading-7 text-[#2E2E2E]">
                {formatNumber(Number(orderData?.all_price))} {all("sum")}
              </p>
            </div>
            <div className="w-full flex justify-between">
              <p className="font-medium textSmall3  leading-5 text-[#2E2E2E] text-start md:text-end">
                {cartText("delivery")}
              </p>
              <p className="font-normal textNormal2 leading-7 text-[#2E2E2E]">
                0 {all("sum")}
              </p>
            </div>
            {orderData?.payed_bonus && (
              <div className="w-full flex justify-between">
                <p className="font-medium textSmall3 leading-5 text-[#2E2E2E] text-start md:text-end">
                  {cartText("bonus")}
                </p>
                <p className="font-normal textNormal2 leading-7 text-[#2E2E2E]">
                  {formatNumber(Number(orderData?.payed_bonus / 100))}{" "}
                  {all("sum")}
                </p>
              </div>
            )}
            <div className="w-full flex justify-between">
              <p className="font-medium textSmall3 leading-5 text-[#2E2E2E] text-start md:text-end">
                {cartText("total")}
              </p>
              <p className="font-normal textNormal3 leading-7 text-[#2E2E2E]">
                {formatNumber(Number(orderData?.payed_sum / 100))} {all("sum")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
