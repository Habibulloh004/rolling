"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { gift, gold } from "@/public";
import { useStore } from "@/store";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useTranslations } from "use-intl";

const Order = () => {
  const all = useTranslations("All");
  const total = useTranslations("Cart.Total");
  const { activeTab } = useStore();

  return (
    <div className="w-full flex flex-col pt-6 gap-5">
      <div className="flex flex-col gap-y-4">
        {activeTab == "delivery" && (
          <div className="w-full flex justify-between">
            <p className="font-medium textSmall3  leading-5 text-[#2E2E2E] text-start md:text-end">
              {total("delivery")}
            </p>
            <p className="font-normal textNormal2 leading-7 text-[#2E2E2E]">
              10 000 {all("sum")}
            </p>
          </div>
        )}
        {!activeTab == "spot" && (
          <div className="w-full flex justify-between">
            <p className="font-medium textSmall3 leading-5 text-[#2E2E2E] text-start md:text-end">
              {total("bonus")}
            </p>
            <p className="font-normal textNormal2 leading-7 text-[#2E2E2E]">
              20 000 {all("sum")}
            </p>
          </div>
        )}
        <div className="w-full flex justify-between">
          <p className="font-medium textSmall3 leading-5 text-[#2E2E2E] text-start md:text-end">
            {total("total")}
          </p>
          <p className="font-normal textNormal3 leading-7 text-[#2E2E2E]">
            230 000 {all("sum")}
          </p>
        </div>
      </div>
      <div className="">
        {activeTab != "spot" && (
          <>
            <Button
              className={
                "bg-[#F5F5F5] w-full h-10 md:h-16 flex justify-center items-center gap-1 border-[1px] rounded-xl"
              }
            >
              <Image
                src={gift}
                alt="gift"
                width={100}
                height={100}
                className="w-7 md:w-10 h-7 md:h-10"
              />
              <p className="font-medium text-sm sm:text-md leading-5 text-[#2E2E2E]">
                {total("bonus_pay")}
              </p>
              <p className="text-[#2E2E2E]">
                <ChevronRight />
              </p>
            </Button>
            <div className="flex-col w-full p-5 border-[1px] shadow-md rounded-xl mt-3">
              <div className="w-full flex justify-between gap-2">
                <div className="flex flex-col items-center gap-4">
                  <p className="text-[#373737] textNormal2">
                    {total("have_bonus")}
                  </p>
                  <p className="textSmall5">100 000 {all("sum")}</p>
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
                <p className="text-[#373737] pb-1 font-medium">
                  {all("choose")} {all("sum")}
                </p>
                <Input
                  type="text"
                  placeholder={`45 000 ${all("sum")}`}
                  className="outline-none border-[2px] bg-transparent p-2 md:p-6 rounded-[10px] w-full text-[12px] md:text-sm"
                />
              </div>
              <div className="w-full flex justify-around items-center pt-7 gap-2 textSmall2">
                <Button className={"w-full hover:bg-primary md:py-2 md:h-12"}>
                  {all("confirm")}
                </Button>
                <Button
                  className={
                    "w-full border text-[#004032] shadow-none bg-transparent hover:bg-transparent md:py-2 md:h-12"
                  }
                >
                  {all("cancel")}
                </Button>
              </div>
            </div>
          </>
        )}
        <Button
          className={
            "mb-3 w-full h-10 md:h-16 flex justify-center items-center gap-1 border-[1px] rounded-xl hover:bg-primary mt-5 font-medium text-sm md:text-md"
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
