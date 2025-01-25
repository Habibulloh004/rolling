import Container from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import Stepper from "./_components/stepper";
import { getLocale, getTranslations } from "next-intl/server";
import Products from "./_components/products";
import Link from "next/link";

const basket = [
  {
    barcode: "",
    category_name:
      "Мега-Роллы ***Mega-Rollar ***Mega-Rolls***name>Мега-Роллы<name/>  <description>Большие роллы с насыщенными вкусами.<description/>  <keywords>мега, суши, Ташкент<keywords/>***",
    color: "grey",
    cooking_time: "0",
    cost: "8756281",
    cost_netto: "8756281",
    different_spots_prices: "1",
    fiscal: "0",
    hidden: "0",
    ingredient_id: "0",
    master_id: "0",
    menu_category_id: "9",
    nodiscount: "0",
    out: 397,
    photo: "/upload/pos_cdb_355820/menu/product_1724036321_100.jpeg",
    photo_origin:
      "/upload/pos_cdb_355820/menu/product_1724036321_100_original.jpeg",
    price: { 1: "7500000", 2: "7500000", 3: "7500000" },
    product_code: "",
    product_id: "100",
    product_name: "Мега-Роллы с Креветками, 10 шт. $10202001006000003",
  },
  {
    barcode: "",
    category_name:
      "Мега-Роллы ***Mega-Rollar ***Mega-Rolls***name>Мега-Роллы<name/>  <description>Большие роллы с насыщенными вкусами.<description/>  <keywords>мега, суши, Ташкент<keywords/>***",
    color: "grey",
    cooking_time: "0",
    cost: "8756281",
    cost_netto: "8756281",
    different_spots_prices: "1",
    fiscal: "0",
    hidden: "0",
    ingredient_id: "0",
    master_id: "0",
    menu_category_id: "9",
    nodiscount: "0",
    out: 397,
    photo: "/upload/pos_cdb_355820/menu/product_1724036321_100.jpeg",
    photo_origin:
      "/upload/pos_cdb_355820/menu/product_1724036321_100_original.jpeg",
    price: { 1: "7500000", 2: "7500000", 3: "7500000" },
    product_code: "",
    product_id: "100",
    product_name: "Мега-Роллы с Креветками, 10 шт. $10202001006000003",
  },
  {
    barcode: "",
    category_name:
      "Мега-Роллы ***Mega-Rollar ***Mega-Rolls***name>Мега-Роллы<name/>  <description>Большие роллы с насыщенными вкусами.<description/>  <keywords>мега, суши, Ташкент<keywords/>***",
    color: "grey",
    cooking_time: "0",
    cost: "8756281",
    cost_netto: "8756281",
    different_spots_prices: "1",
    fiscal: "0",
    hidden: "0",
    ingredient_id: "0",
    master_id: "0",
    menu_category_id: "9",
    nodiscount: "0",
    out: 397,
    photo: "/upload/pos_cdb_355820/menu/product_1724036321_100.jpeg",
    photo_origin:
      "/upload/pos_cdb_355820/menu/product_1724036321_100_original.jpeg",
    price: { 1: "7500000", 2: "7500000", 3: "7500000" },
    product_code: "",
    product_id: "100",
    product_name: "Мега-Роллы с Креветками, 10 шт. $10202001006000003",
  },
  {
    barcode: "",
    category_name:
      "Мега-Роллы ***Mega-Rollar ***Mega-Rolls***name>Мега-Роллы<name/>  <description>Большие роллы с насыщенными вкусами.<description/>  <keywords>мега, суши, Ташкент<keywords/>***",
    color: "grey",
    cooking_time: "0",
    cost: "8756281",
    cost_netto: "8756281",
    different_spots_prices: "1",
    fiscal: "0",
    hidden: "0",
    ingredient_id: "0",
    master_id: "0",
    menu_category_id: "9",
    nodiscount: "0",
    out: 397,
    photo: "/upload/pos_cdb_355820/menu/product_1724036321_100.jpeg",
    photo_origin:
      "/upload/pos_cdb_355820/menu/product_1724036321_100_original.jpeg",
    price: { 1: "7500000", 2: "7500000", 3: "7500000" },
    product_code: "",
    product_id: "100",
    product_name: "Мега-Роллы с Креветками, 10 шт. $10202001006000003",
  },
  {
    barcode: "",
    category_name:
      "Мега-Роллы ***Mega-Rollar ***Mega-Rolls***name>Мега-Роллы<name/>  <description>Большие роллы с насыщенными вкусами.<description/>  <keywords>мега, суши, Ташкент<keywords/>***",
    color: "grey",
    cooking_time: "0",
    cost: "8756281",
    cost_netto: "8756281",
    different_spots_prices: "1",
    fiscal: "0",
    hidden: "0",
    ingredient_id: "0",
    master_id: "0",
    menu_category_id: "9",
    nodiscount: "0",
    out: 397,
    photo: "/upload/pos_cdb_355820/menu/product_1724036321_100.jpeg",
    photo_origin:
      "/upload/pos_cdb_355820/menu/product_1724036321_100_original.jpeg",
    price: { 1: "7500000", 2: "7500000", 3: "7500000" },
    product_code: "",
    product_id: "100",
    product_name: "Мега-Роллы с Креветками, 10 шт. $10202001006000003",
  },
  {
    barcode: "",
    category_name:
      "Мега-Роллы ***Mega-Rollar ***Mega-Rolls***name>Мега-Роллы<name/>  <description>Большие роллы с насыщенными вкусами.<description/>  <keywords>мега, суши, Ташкент<keywords/>***",
    color: "grey",
    cooking_time: "0",
    cost: "8756281",
    cost_netto: "8756281",
    different_spots_prices: "1",
    fiscal: "0",
    hidden: "0",
    ingredient_id: "0",
    master_id: "0",
    menu_category_id: "9",
    nodiscount: "0",
    out: 397,
    photo: "/upload/pos_cdb_355820/menu/product_1724036321_100.jpeg",
    photo_origin:
      "/upload/pos_cdb_355820/menu/product_1724036321_100_original.jpeg",
    price: { 1: "7500000", 2: "7500000", 3: "7500000" },
    product_code: "",
    product_id: "100",
    product_name: "Мега-Роллы с Креветками, 10 шт. $10202001006000003",
  },
  {
    barcode: "",
    category_name:
      "Мега-Роллы ***Mega-Rollar ***Mega-Rolls***name>Мега-Роллы<name/>  <description>Большие роллы с насыщенными вкусами.<description/>  <keywords>мега, суши, Ташкент<keywords/>***",
    color: "grey",
    cooking_time: "0",
    cost: "8756281",
    cost_netto: "8756281",
    different_spots_prices: "1",
    fiscal: "0",
    hidden: "0",
    ingredient_id: "0",
    master_id: "0",
    menu_category_id: "9",
    nodiscount: "0",
    out: 397,
    photo: "/upload/pos_cdb_355820/menu/product_1724036321_100.jpeg",
    photo_origin:
      "/upload/pos_cdb_355820/menu/product_1724036321_100_original.jpeg",
    price: { 1: "7500000", 2: "7500000", 3: "7500000" },
    product_code: "",
    product_id: "100",
    product_name: "Мега-Роллы с Креветками, 10 шт. $10202001006000003",
  },
];

export default async function OrderList({ params }) {
  const [locale, path, orderText, all, deliveryText, cartText] =
    await Promise.all([
      getLocale(),
      params,
      getTranslations("Order"),
      getTranslations("All"),
      getTranslations("Cart.Delivery"),
      getTranslations("Cart.Total"),
    ]);
  return (
    <Container className={"w-11/12 py-5 flex flex-col gap-5"}>
      <div className="w-full flex justify-between items-start ">
        <div>
          <h1 className="text-[#004032] textNormal4 font-bold">
            {orderText("order_title")} №{""}1
            <span className="hidden">{orderText("delivered")}!</span>
          </h1>
          <p className="hidden text-[#004032] text-xl font-bold lg:text-2xl pt-3">
            {orderText("info")}
          </p>
        </div>
        <Link href={`/${locale}/${path.place}/create-review`}>
          <Button
            className={
              "md:h-12 md:textNormal2 md:px-4 hidden lg:block hover:bg-primary textSmall4"
            }
          >
            {orderText("comment")}
          </Button>
        </Link>
      </div>
      <div className="flex flex-col-reverse lg:flex-row lg:justify-between w-full gap-4">
        <div className=" lg:w-2/3">
          <div className="flex flex-col justify-start items-start w-full gap-[10px] pt-5 lg:p-0">
            <p className="textSmall3 text-[#A098AE]">
              {deliveryText("address")}
            </p>
            <p className="flex items-center textSmall3 font-bold leading-7 md:gap-2">
              <Image
                src={`/assets/Location.svg`}
                alt="location"
                width={100}
                height={100}
                className="w-6 h-6 md:w-8 md:h-8"
              />
              Дом 1
            </p>
            <p className="font-normal text-[#A098AE] textSmall1">
              Яшнабадский р-й. Улица Боткина 1А дом №20
            </p>
            <div className="border-[1px] border-[#A098AE] px-4 py-2 rounded-[8px]">
              <p className="textSmall2 text-[#2E2E2E] text-center ">
                До квартиры №12
              </p>
            </div>
          </div>
          <div className="flex flex-col-reverse items-center  gap-10 lg:flex-row lg:justify-between mt-12">
            <div className="max-sm:w-10/12 max-md:w-2/3 md:w-[300px] py-3 px-5 bg-white rounded-xl flex flex-col justify-center items-center">
              <Image
                src={`/assets/Location.svg`}
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
        </div>

        <div className="w-full lg:w-1/3 space-y-4">
          <Products locale={locale} />
          <div className="h-[0.5px] w-full bg-[#DBDBDB]" />
          <div className="flex flex-col gap-y-4">
            <div className="w-full flex justify-between">
              <p className="font-medium textSmall3  leading-5 text-[#2E2E2E] text-start md:text-end">
                {cartText("delivery")}
              </p>
              <p className="font-normal textNormal2 leading-7 text-[#2E2E2E]">
                10 000 {all("sum")}
              </p>
            </div>
            <div className="w-full flex justify-between">
              <p className="font-medium textSmall3 leading-5 text-[#2E2E2E] text-start md:text-end">
                {cartText("bonus")}
              </p>
              <p className="font-normal textNormal2 leading-7 text-[#2E2E2E]">
                20 000 {all("sum")}
              </p>
            </div>
            <div className="w-full flex justify-between">
              <p className="font-medium textSmall3 leading-5 text-[#2E2E2E] text-start md:text-end">
                {cartText("total")}
              </p>
              <p className="font-normal textNormal3 leading-7 text-[#2E2E2E]">
                230 000 {all("sum")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
