import Container from "@/components/shared/container";
import { getLocale, getTranslations } from "next-intl/server";
import React from "react";
import OrderItemComponent from "./_components/orderItemComponent";
import { ApiService } from "@/service/api.services";

const Confirmed = async ({ params }) => {
  const [param, locale, orderText, productsData, spotsData] = await Promise.all([
    params,
    getLocale(),
    getTranslations("Order.Item"),
    ApiService.getPosterData("menu.getProducts"),
    ApiService.getPosterData("access.getSpots"),
  ]);
  return (
    <Container className="w-11/12 pt-3 md:pt-8 flex flex-col ">
      <h1 className="font-bold  text-primary textNormal4 text-start w-full">
        {orderText("title")}
      </h1>
      <p
        className="hidden lg:block textSmall4 font-normal text-[#004032] pt-4"
        dangerouslySetInnerHTML={{
          __html: orderText("desc").replace(
            /Rolling Sushi/g,
            "<strong>Rolling Sushi</strong>"
          ),
        }}
      ></p>
      <OrderItemComponent
        locale={locale}
        param={param}
        productsData={productsData?.response}
        spotsData={spotsData?.response}
      />
      <p
        className="block lg:hidden textSmall4 font-normal text-[#004032] pt-4"
        dangerouslySetInnerHTML={{
          __html: orderText("desc").replace(
            /Rolling Sushi/g,
            "<strong>Rolling Sushi</strong>"
          ),
        }}
      ></p>
    </Container>
  );
};

export default Confirmed;
