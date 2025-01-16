import Container from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { posterUrl } from "@/lib/utils";
import { location } from "@/public";
import Image from "next/image";
import React from "react";
import Stepper from "./_components/stepper";

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

const Delivery = () => {
  return (
    <Container className={"py-5 lg:py-16 flex flex-col"}>
      <div className="w-full flex justify-between items-start ">
        <div>
          <h1 className="text-[#004032] text-xl font-bold lg:text-3xl">
            Заказ №1 <span className="hidden">доставлен!</span>
          </h1>
          <p className="hidden text-[#004032] text-xl font-bold lg:text-2xl pt-3">
            Что нам стоит улучшить? Ждём вашу обратную связь!
          </p>
        </div>
        <Button
          className={
            "hidden lg:block w-[267px] h-[48px] hover:bg-primary text-lg "
          }
        >
          Оставить отзыв
        </Button>
      </div>

      <div className="flex flex-col-reverse lg:flex-row lg:justify-between w-full lg:pt-9">
        <div className=" lg:w-2/3">
          <div className="flex flex-col w-full gap-[10px] pt-5 lg:p-0">
            <p className="text-sm lg:text-lg text-[#A098AE]">Адрес доставки</p>
            <p className="flex items-center text-sm lg:text-lg font-bold leading-7">
              <Image
                src={location}
                alt="location"
                width={100}
                height={100}
                className="w-7 h-6"
              />
              Дом 1
            </p>
            <p className="font-normal text-[#A098AE] text-sm lg:text-lg pt-[10px] felx">
              Яшнабадский р-й. Улица Боткина 1А дом №20
            </p>
            <div className="border-[1px] border-[#A098AE] w-[200] h-[34px] rounded-[8px] flex justify-center items-center">
              <p className="text-sm text-[#2E2E2E] text-center ">
                До квартиры №12
              </p>
            </div>
          </div>

          <div className="flex flex-col-reverse items-center  gap-10 lg:flex-row lg:justify-between mt-12">
            <div className="w-[191px] h-52 py-3 px-5 bg-white rounded-xl flex flex-col">
              <Image
                src={location}
                alt="image"
                width={100}
                height={100}
                className="w-[152px] h-[92px]"
              />
              <article className="pt-3">
                <p className="text-xs font-medium">Паркентский филиал</p>
                <p className="text-[9px] font-light">Улица Паркент 2</p>
              </article>
              <Button className={"h-6 text-[8px] mt-[10px] hover:bg-primary "}>
                +99899 777-77-77
              </Button>
            </div>
            <Stepper currentStep={3} />
          </div>
        </div>

        <div className="w-full lg:w-1/3">
          <h1 className="hidden lg:block font-bold text-lg lg:text-2xl leading-9 text-black text-start">
            Ваш заказ
          </h1>
          <div className="overflow-y-scroll flex flex-col h-[545px] w-full lg:pt-7 simple-scrollbar">
            {basket.map((item, i) => (
              <div key={i} className="flex h-20 gap-4 mt-6 relative mr-[20] ">
                <Image
                  src={`${posterUrl}${item.photo}`}
                  alt="product"
                  width={100}
                  height={100}
                />
                <div className="h-full flex flex-col justify-center gap-y-3 ">
                  <p className="font-semibold text-base lg:text-lg leading-7">
                    {item.product_name.replace(/\$.*/, "").trim() || "No Name"}
                  </p>
                  <div className="flex justify-between">
                    <p className="font-normal text-sm text-[#A098AE]">1x</p>
                    <p className="font-semibold text-sm leading-5 text-end">
                      {item?.price["1"]
                        ? `${item.price["1"] / 100} UZS`
                        : "Price not available"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-y-4 pt-6 border-t-2 border-[#DBDBDB] mt-5">
            <div className="hidden w-full lg:flex justify-between">
              <p className="font-medium text-base leading-5 text-[#2E2E2E] text-end w-[120px]">
                Доставка
              </p>
              <p className="font-normal text-lg leading-7 text-[#2E2E2E]">
                10 000 сум
              </p>
            </div>
            <div className="hidden w-full lg:flex justify-between">
              <p className="font-medium text-base leading-5 text-[#2E2E2E] text-end w-[120px]">
                Бонус
              </p>
              <p className="font-normal text-lg leading-7 text-[#2E2E2E]">
                20 000 сум
              </p>
            </div>
            <div className="w-full flex justify-between">
              <p className="font-medium text-base lg:text-lg leading-5 text-[#2E2E2E] text-end ">
                Общая сумма
              </p>
              <p className="font-medium text-xl lg:text-2xl leading-7 text-[#2E2E2E]">
                230 000 сум
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Delivery;
