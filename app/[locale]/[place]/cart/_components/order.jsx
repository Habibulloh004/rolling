"use client";

import { Button } from "@/components/ui/button";
import { gift, gold } from "@/public";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useTranslations } from "use-intl";

const Order = () => {
  const all = useTranslations("All");
  const total = useTranslations("Cart.Total");
  return (
    <div className="w-full flex flex-col pt-6">
      <div className="flex flex-col gap-y-4">
        <div className="w-full flex justify-between">
          <p className="font-medium textSmall2  leading-5 text-[#2E2E2E] text-end w-[120px]">
            {total("delivery")}
          </p>
          <p className="font-normal textNormal2 leading-7 text-[#2E2E2E]">
            10 000 сум
          </p>
        </div>
        <div className="w-full flex justify-between">
          <p className="font-medium textSmall2 leading-5 text-[#2E2E2E] text-end w-[120px]">
            {total("bonus")}
          </p>
          <p className="font-normal textNormal2 leading-7 text-[#2E2E2E]">
            20 000 сум
          </p>
        </div>
        <div className="w-full flex justify-between">
          <p className="font-medium textSmall2 leading-5 text-[#2E2E2E] text-end w-[120px]">
            {total("total")}
          </p>
          <p className="font-normal textNormal3 leading-7 text-[#2E2E2E]">
            230 000 сум
          </p>
        </div>
      </div>
      <div className="pt-[31px]">
        <Button
          className={
            "bg-[#F5F5F5] w-full h-16 flex justify-center items-center gap-1 border-[1px] rounded-2xl"
          }
        >
          <Image
            src={gift}
            alt="gift"
            width={100}
            height={100}
            className="w-10 h-10"
          />
          <p className="font-medium text-base leading-5 text-[#2E2E2E]">
            {total("bonus_pay")}
          </p>
          <p className="text-[#2E2E2E]">
            <ChevronRight />
          </p>
        </Button>
        <div className="hidden flex-col w-full p-5 border-[1px] border-[#979797] rounded-xl mt-3">
          <div className="w-full flex justify-between ">
            <div className="flex flex-col items-center gap-4">
              <p className="text-[#373737]">Имеющийся бонусы</p>
              <p className="text-xl">100 000 сум</p>
            </div>
            <div className="bg-primary rounded-xl w-[138px] h-[92px] flex flex-col justify-between items-center relative py-[5px]">
              <div>
                <p className="font-bold text-[#F3D67E]">GOLD</p>
                <p className="font-bold text-[#F3D67E] text-center">30%</p>
              </div>
              <Image
                src={gold}
                alt="gold"
                width={150}
                height={100}
                className="absolute top-0 w"
              />
              <p className="font-bold text-[#F3D67E] text-center text-[6px]">
                ROLLINGSUSHI
              </p>
            </div>
          </div>

          <div className="mt-[7px]">
            <p className="text-[#373737] pb-3">Выбрать сумму</p>
            <input
              type="text"
              placeholder="45 000 сум"
              className="outline-none border-[1px] bg-transparent p-6 rounded-[10px] w-full "
            />
          </div>
          <div className="w-full flex justify-around items-center pt-7">
            <Button className={"h-11 min-w-[178px] hover:bg-primary"}>
              Подтвердить
            </Button>
            <Button
              className={
                "h-11 text-[#004032] shadow-none bg-transparent hover:bg-transparent"
              }
            >
              Отменить
            </Button>
          </div>
        </div>
        <Button
          className={
            "w-full h-16 flex justify-center items-center gap-1 border-[1px] rounded-2xl hover:bg-primary mt-5 font-medium text-lg"
          }
        >
          {total("submit")}
        </Button>
        <div className="hidden w-full h-[141px] p-5 border-[1px] border-[#979797] rounded-xl mt-3">
          <p className="font-medium">{total("note")}</p>
        </div>
      </div>
    </div>
  );
};

export default Order;
