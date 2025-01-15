import Container from "@/components/shared/container";
import React from "react";
import Category from "./_components/sidebar";
import Products from "./_components/products";
import Order from "./_components/order";
import Payment from "./_components/payment";
import Right from "./_components/right";
import Left from "./_components/left";
import { getLocale, getTranslations } from "next-intl/server";
import { ApiService } from "@/service/api.services";

const Basket = async () => {
  const [cart, products, locale] = await Promise.all([
    getTranslations("Cart"),
    ApiService.getPosterData("menu.getProducts"),
    getLocale(),
  ]);
  return (
    <Container className={"w-11/12 flex flex-col gap-5 pt-8"}>
      <h1 className="w-full text-primary font-bold font-Poppins leading-10 text-start textNormal4">
        {cart("title")}
      </h1>
      {/* Desktop version */}
      <div className="hidden lg:grid lg:grid-cols-2 md:gap-10 w-full">
        <Left />
        <Right
          products={products.response
            .filter((c) => c.menu_category_id != 0)
            .slice(0, 10)}
          locale={locale}
        />
      </div>
      {/* Mobile version */}
      <div className="lg:hidden w-full">
        <Category />
        <Products
          products={products.response
            .filter((c) => c.menu_category_id != 0)
            .slice(0, 10)}
          locale={locale}
        />
        <Payment />
        <Order />
      </div>
    </Container>
  );
};

export default Basket;
