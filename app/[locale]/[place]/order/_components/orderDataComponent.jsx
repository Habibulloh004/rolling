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

export default function OrderDataComponent({ locale, path }) {
  const orderText = useTranslations("Order");
  const all = useTranslations("All");
  const [orderData, setOrderData] = useState([]);

  useEffect(() => {
    const order = localStorage.getItem("orderList")
      ? JSON.parse(localStorage.getItem("orderList"))
      : [];
    setOrderData(order);
  }, []);
  return (
    <div>
      <div className="hidden lg:grid grid-cols-4 w-full gap-6">
        {orderData?.map((item, i) => (
          <Link
            href={`/${locale}/${path.place}/order/${item?.order_id}`}
            className="w-full rounded-2xl bg-background p-5 flex flex-col justify-between gap-4"
            key={i}
          >
            <div className="flex flex-col gap-y-3">
              <p className="textSmall4 font-semibold text-thin">
                {orderText("order_title")} № {item?.order_id}
              </p>
              <p className="textNormal4 font-bold text-thin">
                {formatNumber(item?.all_price / 100)} {all("sum")}
              </p>
              <p className="textSmall3 font-semibold text-thin">
                {orderText("product_title")}: {item?.address}
              </p>
              <p className="hidden lg:block textSmall1 pt-[14px]">
                {orderText("payment_method")} :{" "}
                <span className="text-[#0000009E]">{item?.type}</span>{" "}
              </p>
              <p className="textSmall2 font-normal text-[#A098AE]">
                {item?.created_at}
              </p>
            </div>
            <Button
              className={"w-full hover:bg-primary text-[13px] text-white"}
            >
              {orderText("show_order")}
            </Button>
          </Link>
        ))}
      </div>
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full mt-[29px] flex gap-5 lg:hidden"
      >
        <CarouselContent>
          {orderData?.map((item, i) => (
            <CarouselItem key={i} className="basis-auto">
              <Link
                href={`/${locale}/${path.place}/order/${item?.order_id}`}
                className="bg-white rounded-2xl p-5 flex flex-col justify-between w-[300px]"
              >
                <div className="flex flex-col gap-2">
                  <div className="w-full flex justify-between">
                    <p className="text-[15px] lg:text-lg font-semibold text-thin">
                      Заказ №{item?.order_id}
                    </p>
                    <p className="text-[13px] lg:text-lg font-semibold text-[#004032]">
                      В пути
                    </p>
                  </div>
                  <p className="text-[13px] lg:text-2xl font-bold text-thin">
                    {item?.all_price / 100} сум
                  </p>
                  <p className="text-[13px] lg:text-lg font-semibold text-thin">
                    Товаров: {item?.products?.length}
                  </p>
                  <p className="text-[13px] lg:text-lg font-normal text-[#A098AE]">
                    {item?.created_at}
                  </p>
                </div>
                <Button
                  className={
                    "w-full h-8 hover:bg-primary text-[13px] text-white mt-2"
                  }
                >
                  Отслеживать заказ
                </Button>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
