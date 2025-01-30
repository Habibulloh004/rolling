"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
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
  param,
  locale,
}) {
  const all = useTranslations("All");
  const deliveryText = useTranslations("Cart.Delivery");
  const cartText = useTranslations("Cart.Total");
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

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

          switch (order?.status) {
            case "":
              setCurrentStep(0);
              break;
            case "accept":
              setCurrentStep(1);
              break;
            case "cooking":
              setCurrentStep(2);
              break;
            case "delivery":
              setCurrentStep(3);
              break;
            case "finished":
              setCurrentStep(4);
              break;
            default:
              setCurrentStep(0);
              break;
          }
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
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };
    fetchAddress();
  }, []);

  return (
    <div className="w-full lg:w-full lg:space-x-10">
      <div className="flex flex-col-reverse lg:flex-row lg:justify-between w-full gap-4">
        <div className=" lg:w-2/3">
          {orderData?.type.includes("delivery") && (
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
                  <Stepper currentStep={currentStep} />
                </div>
              </div>
            </>
          )}
          {isLoading ? (
            <div className="w-full lg:w-10/12 mx-auto mt-5">
              <div className="flex flex-col gap-3">
                <div className="">
                  <Skeleton className="bg-primary h-10 w-full" />
                </div>
                <div className="flex justify-between gap-2">
                  <Skeleton className="bg-primary h-64 w-full" />
                  <Skeleton className="bg-primary h-64 w-full" />
                </div>
              </div>
            </div>
          ) : (
            <>
              {orderData?.type.includes("take_away") && (
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
                            orderData?.spotData?.spot_name,
                            locale
                          )}
                        </p>
                        <p className="text-[9px] font-light">
                          {translateTextSpotAddress(
                            orderData?.spotData?.spot_adress,
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
                    <Stepper currentStep={currentStep} />
                  </div>
                </>
              )}
            </>
          )}
        </div>
        <div className="w-full lg:w-1/3 space-y-4">
          <Products
            locale={locale}
            products={orderData?.products}
            isLoading={isLoading}
          />
          <div className="h-[0.5px] w-full bg-[#DBDBDB]" />
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="bg-primary-modal w-full h-6" />
              <Skeleton className="bg-primary-modal w-full h-6" />
            </div>
          ) : (
            <div className="flex flex-col gap-y-4">
              <div className="w-full flex justify-between">
                <p className="font-medium textSmall3  leading-5 text-[#2E2E2E] text-start md:text-end">
                  {cartText("products_sum")}
                </p>
                <p className="font-normal textNormal2 leading-7 text-[#2E2E2E]">
                  {formatNumber(Number(orderData?.all_price) / 100)}{" "}
                  {all("sum")}
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
                <p className="font-normal textNormal3 leading-7 text-[#2E2E2E]">
                  {formatNumber(Number(orderData?.payed_sum / 100))}{" "}
                  {all("sum")}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
