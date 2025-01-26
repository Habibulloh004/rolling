import Container from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { posterUrl } from "@/lib/utils";
import Image from "next/image";
import React from "react";

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

const Confirmed = () => {
  return (
    <Container className="w-11/12 pt-8 flex flex-col ">
      <h1 className="font-bold text-xl leading-7 lg:text-3xl text-[#004032] lg:leading-[54px] text-start w-full">
        Заказ подтверждён{" "}
      </h1>
      <p className="hidden lg:block text-2xl font-normal text-[#004032] pt-4">
        Спасибо, что выбрали <span className="font-medium">Rolling Sushi!</span>{" "}
        Мы готовим ваши блюда с любовью и заботой, чтобы они радовали вас
        свежестью и вкусом. Если у вас возникнут вопросы, наша команда всегда
        готова помочь.
      </p>
      <div className="flex flex-col lg:flex-row mt-4 lg:mt-10 w-full">
        <div className=" w-full lg:w-1/3 mr-32">
          <h1 className="font-bold text-lg lg:text-2xl leading-9 text-black text-start">
            Ваш заказ
          </h1>
          <div className="overflow-y-scroll flex flex-col h-[400px] w-full pt-7 simple-scrollbar">
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
        </div>
        <div className="w-full lg:w-1/3 relative">
          <h1 className="font-bold text-lg lg:text-2xl leading-9 text-black text-start">
            Доставка
          </h1>
          <div className="flex flex-col w-full justify-between pt-2">
            <p className="flex items-center text-lg font-bold leading-7">
              <Image
                src={`/assets/Location.svg`}
                alt="location"
                width={100}
                height={100}
                className="w-7 h-6"
              />
              Дом 1
            </p>
            <p className="font-normal text-[#A098AE] text-sm pt-[10px] ">
              Яшнабадский р-й. Улица Боткина 1А дом №20
            </p>
          </div>
          <div className="hidden lg:flex flex-col gap-y-4 mt-10 pb-5 border-b-[1px] border-[#DBDBDB]">
            <div className="w-full flex justify-between">
              <p className="font-medium text-sm leading-5 text-[#2E2E2E]  ">
                Товар
              </p>
              <p className="font-normal text-2xl leading-7 text-[#2E2E2E]">
                230 000 сум
              </p>
            </div>
            <div className="w-full flex justify-between">
              <p className="font-medium text-sm leading-5 text-[#2E2E2E]  w-[120px]">
                {" "}
                Бонус
              </p>
              <p className="font-normal text-lg leading-7 text-[#2E2E2E]">
                10 000 сум
              </p>
            </div>
            <div className="w-full flex justify-between">
              <p className="font-medium text-sm leading-5 text-[#2E2E2E]  w-[120px]">
                Доставка
              </p>
              <p className="font-normal text-lg leading-7 text-[#2E2E2E]">
                20 000 сум
              </p>
            </div>
          </div>
          <div className="border-t-[1px] border-[#DBDBDB] pt-5 flex items-center justify-between my-9 lg:border-0 lg:p-0">
            <p className="font-medium text-lg leading-5 text-[#2E2E2E] ">
              Общая сумма
            </p>
            <p className="font-medium text-2xl leading-7 text-[#2E2E2E]">
              200 000 сум
            </p>
          </div>

          <div className="lg:mx-7">
            <Button
              className={
                "w-full h-14 rounded-2xl text-center bg-[#43674E] hover:bg-[#43674E] font-medium text-lg"
              }
            >
              Вернуться к меню
            </Button>
            <Button
              className={
                "w-full h-14 rounded-2xl text-center bg-[#F5F5F5] hover:bg-[#F5F5F5] font-medium text-lg text-[#004032] mt-[11px]"
              }
            >
              Отслеживать заказ
            </Button>
            <Button
              className={
                "w-full h-14 rounded-2xl text-center bg-[#F5F5F5] hover:bg-[#F5F5F5] font-medium text-lg text-[#004032] mt-[11px]"
              }
            >
              Оставить отзыв
            </Button>
          </div>
          <p className="hidden lg:flex text-sm font-normal absolute bottom-16 -right-80 w-72 leading-6">
            Вы можете увидеть статус вашего заказа в реальном времени.
          </p>
        </div>
      </div>
    </Container>
  );
};

export default Confirmed;
