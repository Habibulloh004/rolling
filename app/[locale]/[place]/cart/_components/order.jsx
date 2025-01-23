"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatNumber } from "@/lib/utils";
import { gift, gold } from "@/public";
import { useOrderStore, useStore } from "@/store";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { useTranslations } from "use-intl";

// DiscountBadge Component
const DiscountBadge = ({ auth }) => {
  const discountColor = {
    10: "#E2E2E2",
    20: "#ED7403",
    30: "#F3D67E",
  };
  const discountLabel = {
    10: "SILVER",
    20: "BRONZA",
    30: "GOLD",
  };
  const discountImage = {
    10: "/assets/Silver.png",
    20: "/assets/Bronze.png",
    30: gold,
  };

  // const discount = auth?.client_groups_discount || 0;
  const discount = 10;

  return (
    <div className="bg-primary rounded-xl w-[150px] h-[100px] flex flex-col justify-between items-center relative py-[5px]">
      {discount && (
        <div>
          <p className="font-bold" style={{ color: discountColor[discount] }}>
            {discountLabel[discount]}
          </p>
          <p
            className="font-bold text-center"
            style={{ color: discountColor[discount] }}
          >
            {discount}%
          </p>
        </div>
      )}
      <Image
        src={discountImage[discount] || gold}
        alt={discountLabel[discount] || "gold"}
        width={150}
        height={100}
        className="absolute top-0"
      />
      <p
        className="font-bold text-center text-[6px]"
        style={{ color: discountColor[discount] }}
      >
        ROLLINGSUSHI
      </p>
    </div>
  );
};

// Main Order Component
const Order = ({ auth }) => {
  const all = useTranslations("All");
  const total = useTranslations("Cart.Total");
  const { activeTab } = useStore();
  const [bonus, setBonus] = useState(0);
  const [activeBonus, setActiveBonus] = useState(false);
  const { orderData, setOrderData, totalSum } = useOrderStore();

  const handleSetBonus = () => {
    setOrderData({ ...orderData, pay_bonus: Number(bonus) });
    setBonus(0);
    setActiveBonus(false);
  };

  return (
    <div className="w-full flex flex-col pt-6 gap-5">
      <div className="flex flex-col gap-y-4">
        <div className="w-full flex justify-between">
          <p className="font-medium textSmall3 leading-5 text-[#2E2E2E] text-start md:text-end">
            {total("products_sum")}
          </p>
          <p className="font-normal textNormal2 leading-7 text-[#2E2E2E]">
            {formatNumber(totalSum)} {all("sum")}
          </p>
        </div>
        {activeTab === "delivery" && (
          <div className="w-full flex justify-between">
            <p className="font-medium textSmall3 leading-5 text-[#2E2E2E] text-start md:text-end">
              {total("delivery")}
            </p>
            <p className="font-normal textNormal2 leading-7 text-[#2E2E2E]">
              10 000 {all("sum")}
            </p>
          </div>
        )}
        {activeTab !== "spot" && (
          <div className="w-full flex justify-between">
            <p className="font-medium textSmall3 leading-5 text-[#2E2E2E] text-start md:text-end">
              {total("bonus")}
            </p>
            <p className="font-normal textNormal2 leading-7 text-[#2E2E2E]">
              {formatNumber(Number(orderData?.pay_bonus))} {all("sum")}
            </p>
          </div>
        )}
        <div className="w-full flex justify-between">
          <p className="font-medium textSmall3 leading-5 text-[#2E2E2E] text-start md:text-end">
            {total("total")}
          </p>
          <p className="font-normal textNormal3 leading-7 text-[#2E2E2E]">
            {formatNumber(Number(totalSum) - Number(orderData?.pay_bonus || 0))}{" "}
            {all("sum")}
          </p>
        </div>
      </div>
      <div className="">
        {activeTab !== "spot" && (
          <>
            <Button
              onClick={() => setActiveBonus(true)}
              className="bg-[#F5F5F5] w-full h-10 md:h-12 flex justify-center items-center gap-1 border-[1px] rounded-xl"
            >
              <Image
                src={gift}
                alt="gift"
                width={100}
                height={100}
                className="w-7 md:w-9 h-7 md:h-8"
              />
              <p className="font-medium text-sm sm:text-md leading-5 text-[#2E2E2E]">
                {total("bonus_pay")}
              </p>
              <p className="text-[#2E2E2E]">
                <ChevronRight />
              </p>
            </Button>
            {activeBonus && (
              <div className="flex-col w-full p-5 border-[1px] shadow-md rounded-xl mt-3">
                <div className="w-full flex justify-between gap-2">
                  <div className="flex flex-col items-center gap-4">
                    <p className="text-[#373737] textNormal2">
                      {total("have_bonus")}
                    </p>
                    <p className="textSmall5">
                      {formatNumber(Number(auth.bonus / 100))} {all("sum")}
                    </p>
                  </div>
                  <DiscountBadge auth={auth} />
                </div>
                <div className="mt-[7px]">
                  <p className="text-[#373737] pb-1 font-medium">
                    {all("choose")} {all("sum")}
                  </p>
                  <Input
                    onChange={(e) => {
                      let value = e.target.value;

                      value = value.replace(/[^0-9]/g, "");

                      const maxBonus = Math.min(auth?.bonus / 100, totalSum);
                      value = Math.min(Number(value), maxBonus);

                      setBonus(value);
                    }}
                    value={formatNumber(Number(bonus))}
                    type="text"
                    placeholder={`45 000 ${all("sum")}`}
                    className="outline-none border-[2px] bg-transparent p-2 md:p-3 focus-visible:ring-0 focus:border-primary w-full text-[12px] md:text-sm rounded-md"
                  />
                </div>
                <div className="w-full flex justify-around items-center pt-7 gap-2 textSmall2">
                  <Button
                    onClick={handleSetBonus}
                    className="w-full hover:bg-primary md:py-2 md:h-12"
                  >
                    {all("confirm")}
                  </Button>
                  <Button
                    onClick={() => setActiveBonus(false)}
                    className="w-full border text-[#004032] shadow-none bg-transparent hover:bg-transparent md:py-2 md:h-12"
                  >
                    {all("cancel")}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
        <Button className="mb-3 w-full h-10 md:h-12 flex justify-center items-center gap-1 border-[1px] rounded-xl hover:bg-primary mt-5 font-medium text-sm md:text-md">
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
