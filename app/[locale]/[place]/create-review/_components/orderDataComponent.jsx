"use client";

import React, { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useTranslations } from "use-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/utils";
import ReviewForm from "@/components/forms/ReviewForm";

export default function OrderDataComponent({ locale, path }) {
  const orderText = useTranslations("Order");
  const orderTextItem = useTranslations("Cart.Payment");
  const all = useTranslations("All");
  const [orderData, setOrderData] = useState([]);
  const [orderId, setOrderId] =useState(null)

  useEffect(() => {
    const order = localStorage.getItem("orderList")
      ? JSON.parse(localStorage.getItem("orderList"))
      : [];
    setOrderData(order);
  }, []);
  return (
    <div className="w-full flex flex-col lg:flex-row gap-5">
      <ReviewForm id={orderId}/>
      
    <div className="w-full">
    <Carousel
        opts={{
          align: "start",
        }}
        className="w-full mt-[29px] flex gap-5"
      >
        <CarouselContent>
          {orderData?.map((item, i) => {
            const products = JSON.parse(item.products);
            let countProducts = 0;
            products?.map((product, i) => {
              countProducts += product.amount;
            });
            return (
              <CarouselItem key={i} className="basis-auto">
                <button
                onClick={()=>setOrderId(item?.order_id)}
                type="button"
                  className={`bg-white rounded-2xl p-5 flex flex-col justify-between w-[300px] duration-300 ${orderId == item?.order_id ? "bg-slate-200" : ""}`}
                >
                  <div className="flex flex-col gap-2 w-full">
                    <div className="w-full flex justify-between">
                      <p className="text-[15px] lg:text-lg font-semibold text-thin">
                        {orderText("order_title")} № {item?.order_id}
                      </p>
                      {/* <p className="text-[13px] lg:text-lg font-semibold text-[#004032]">
                        В пути
                      </p> */}
                    </div>
                    <p className="text-[13px] lg:text-2xl font-bold text-thin">
                      {formatNumber(item?.all_price / 100)} {all("sum")}
                    </p>
                    <p className="w-full textSmall3 text-thin flex justify-between">
                      <strong>{orderText("product_title")}: </strong>
                      <span>{countProducts}</span>
                    </p>
                    <div className="w-full flex justify-between textSmall1 pt-[14px]">
                      {orderText("payment_method")} :{" "}
                      <p className="textSmall3 text-thin">
                        {item?.payment == "cash"
                          ? orderTextItem("cash")
                          : orderTextItem("card")}
                      </p>
                    </div>
                    <p className="text-[13px] lg:text-lg font-normal text-[#A098AE]">
                      {item?.created_at}
                    </p>
                  </div>
                </button>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </div>
    </div>
  );
}
