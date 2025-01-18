import Container from "@/components/shared/container";
import React from "react";
import Products from "./_components/products";
import Order from "./_components/order";
import Payment from "./_components/payment";
import Right from "./_components/right";
import Left from "./_components/left";
import { getLocale, getTranslations } from "next-intl/server";
import { ApiService } from "@/service/api.services";
import CartSidebar from "./_components/sidebar";

const Basket = async ({ params }) => {
  const [cart, products, locale, path] = await Promise.all([
    getTranslations("Cart"),
    ApiService.getPosterData("menu.getProducts"),
    getLocale(),
    params,
  ]);
  return (
    <Container className={"w-11/12 flex flex-col md:gap-5 pt-4 md:pt-8 gap-2"}>
      <h1 className="w-full text-primary font-bold font-Poppins leading-10 text-start textNormal4">
        {cart("title")}
      </h1>
      {/* Desktop version */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-16 w-full">
        <Left place={path.place} locale={locale} />
        <Right
          products={products.response
            .filter((c) => c.menu_category_id != 0)
            .slice(0, 10)}
          locale={locale}
        />
      </div>
      {/* Mobile version */}
      <div className="lg:hidden w-full space-y-2">
        <CartSidebar locale={locale} place={path.place} />
        <Products locale={locale} />
        <Payment locale={locale} place={path.place} />
        <Order />
      </div>
    </Container>
  );
};

export default Basket;
