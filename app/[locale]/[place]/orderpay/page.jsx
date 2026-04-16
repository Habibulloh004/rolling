import Container from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import React from "react";
import OrderDataComponent from "../order/_components/orderDataComponent";
import { getAllOrders } from "@/actions";
import { ApiService } from "@/service/api.services";
import { cacheDurations } from "@/lib/cache-config";

export default async function Order({ params }) {
  const [locale, path, orderText, all, allOrders, productsData] = await Promise.all([
    getLocale(),
    params,
    getTranslations("Order"),
    getTranslations("All"),
    getAllOrders(),
    ApiService.getPosterData("menu.getProducts", "", cacheDurations.products),
  ]);
  return (
    <Container className={"flex flex-col pt-8 w-11/12 gap-5"}>
      <div className="w-full flex justify-between items-center ">
        <h1 className="text-[#004032] textNormal4 font-bold">
          {orderText("title")}
        </h1>
        <Link href={`/${locale}/${path.place}/create-review`}>
          <Button
          aria-label={`orderpage comment`}
            className={
              "md:h-12 md:textNormal2 md:px-4 hidden lg:block hover:bg-primary textSmall4"
            }
          >
            {orderText("comment")}
          </Button>
        </Link>
      </div>
      <OrderDataComponent
        locale={locale}
        path={path}
        backendOrders={allOrders?.orders || []}
        productsData={productsData?.response || []}
      />
    </Container>
  );
}
