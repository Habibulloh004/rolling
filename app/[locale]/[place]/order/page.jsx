import Container from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import React from "react";

const order = [
  {
    id: 1,
    price: "200 000",
    count: 2,
    type: "Наличный",
    date: "14.07.2024",
  },
  {
    id: 2,
    price: "200 000",
    count: 5,
    type: "Наличный",
    date: "14.07.2024",
  },
  {
    id: 3,
    price: "200 000",
    count: 7,
    type: "Наличный",
    date: "14.07.2024",
  },
  {
    id: 4,
    price: "200 000",
    count: 7,
    type: "Наличный",
    date: "14.07.2024",
  },
];

const Order = () => {
  return (
    <Container className={"flex flex-col pt-8 w-11/12"}>
      <div className="w-full flex justify-between items-center ">
        <h1 className="text-[#004032] textNormal4 font-bold">
          Мои заказы
        </h1>
        <Button className={"hidden lg:block hover:bg-primary textSmall4 "}>
          История заказов
        </Button>
      </div>

      <div className="hidden py-[35px] lg:grid grid-cols-3 w-full gap-6">
        {order.map((item, i) => (
          <div
            className="w-full rounded-2xl bg-background p-5 flex flex-col justify-between gap-4"
            key={i}
          >
            <div className="flex flex-col gap-y-3">
              <p className="textSmall4 font-semibold text-thin">
                Заказ №{item.id}
              </p>
              <p className="textNormal4 font-bold text-thin">
                {item.price} сум
              </p>
              <p className="textSmall3 font-semibold text-thin">
                Товаров: {item.count}
              </p>
              <p className="hidden lg:block textSmall1 pt-[14px]">
                Тип оплаты:{" "}
                <span className="text-[#0000009E]">{item.type} Бонусом</span>{" "}
              </p>
              <p className="textSmall2 font-normal text-[#A098AE]">
                {item.date}
              </p>
            </div>
            <Button
              className={"w-full hover:bg-primary text-[13px] text-white"}
            >
              Отслеживать заказ
            </Button>
          </div>
        ))}
      </div>

      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full mt-[29px] flex gap-5 lg:hidden"
      >
        <CarouselContent>
          {order.map((item, i) => (
            <CarouselItem key={i} className="basis-[100%]  md:basis-1/2">
              <div className="w-full  bg-white rounded-2xl p-5 flex flex-col justify-between">
                <div className="flex flex-col gap-2">
                  <div className="w-full flex justify-between">
                    <p className="text-[15px] lg:text-lg font-semibold text-thin">
                      Заказ №{item.id}
                    </p>
                    <p className="text-[13px] lg:text-lg font-semibold text-[#004032]">
                      В пути
                    </p>
                  </div>
                  <p className="text-[13px] lg:text-2xl font-bold text-thin">
                    {item.price} сум
                  </p>
                  <p className="text-[13px] lg:text-lg font-semibold text-thin">
                    Товаров: {item.count}
                  </p>
                  <p className="text-[13px] lg:text-lg font-normal text-[#A098AE]">
                    {item.date}
                  </p>
                </div>
                <Button
                  className={
                    "w-full h-8 hover:bg-primary text-[13px] text-white mt-2"
                  }
                >
                  Отслеживать заказ
                </Button>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </Container>
  );
};

export default Order;
