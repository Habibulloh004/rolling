import Container from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import React from "react";
import { getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import OrderItemComponent from "./_components/orderItemComponent";
import { ApiService } from "@/service/api.services";

export default async function OrderList({ params }) {
  const [locale, path, orderText, productsData, spotsData, promotions] =
    await Promise.all([
      getLocale(),
      params,
      getTranslations("Order"),
      ApiService.getPosterData("menu.getProducts", "", 7200),
      ApiService.getPosterData("access.getSpots", "", 604800),
      ApiService.getPosterData("clients.getPromotions", "", 600),
    ]);
  return (
    <Container className={"w-11/12 py-5 flex flex-col gap-5"}>
      <div className="w-full flex justify-between items-start ">
        <div>
          <h1 className="text-[#004032] textNormal4 font-bold">
            {orderText("order_title")} <span>№ {path?.id}</span>
            <span className="hidden">{orderText("delivered")}!</span>
          </h1>
          <p className="hidden text-[#004032] text-xl font-bold lg:text-2xl pt-3">
            {orderText("info")}
          </p>
        </div>
        <Link href={`/${locale}/${path.place}/create-review`}>
          <Button
            aria-label={`orderid comment`}
            className={
              "md:h-12 md:textNormal2 md:px-4 hidden lg:block hover:bg-primary textSmall4"
            }
          >
            {orderText("comment")}
          </Button>
        </Link>
      </div>
      <OrderItemComponent
        promotions={promotions}
        productsData={productsData?.response}
        locale={locale}
        param={path}
        spotsData={spotsData?.response}
      />
    </Container>
  );
}
