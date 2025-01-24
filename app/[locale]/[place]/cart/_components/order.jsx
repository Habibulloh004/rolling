"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCreatedAt, formatNumber } from "@/lib/utils";
import { gift } from "@/public";
import { useOrderStore, useProductStore, useStore } from "@/store";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";
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
    30: "/assets/Gold.png",
  };

  const discount = auth?.client_groups_discount || 0;

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
        src={discountImage[discount]}
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
const Order = ({ auth, searchParamsData, locale, place }) => {
  const all = useTranslations("All");
  const total = useTranslations("Cart.Total");
  const { activeTab } = useStore();
  const [bonus, setBonus] = useState(0);
  const [activeBonus, setActiveBonus] = useState(false);
  const { orderData, setOrderData, totalSum } = useOrderStore();
  const { products } = useProductStore();
  const { service } = searchParamsData;

  const handleSetBonus = () => {
    setOrderData({ ...orderData, pay_bonus: Number(bonus) });
    setBonus(0);
    setActiveBonus(false);
  };
  const handleSubmit = async () => {
    if (!auth?.client_id) {
      toast.warning(
        <div className="w-full h-full flex justify-between items-center">
          {all("no_auth")}{" "}
          <Link
            href={`/${locale}/${place}/login`}
            className="bg-black text-white rounded-md px-2 py-1"
          >
            {all("sign_in")}
          </Link>
        </div>
      );

      return;
    }
    try {
      const {
        spot_id,
        spot_name,
        phone,
        service_mode,
        payment_method,
        delivery_price,
        lng,
        lat,
        pay_cash,
        pay_card,
        pay_click,
        pay_payme,
        pay_uzum,
        pay_bonus,
        comment,
        address,
        client_addresses_id,
        address_comment,
      } = orderData;

      const filterProductsAbdugani = products?.map((p) => {
        return {
          product_id: +p.product_id,
          amount: +p.count,
        };
      });

      let deliveryData = {
        address_comment,
        all_price: Number((+totalSum + +delivery_price) * 100),
        client_address: `${lat || 42},${lng || 62}`,
        client_id: Number(auth?.client_id),
        comment,
        created_at: formatCreatedAt(),
        payed_bonus: pay_bonus ? Number(pay_bonus) * 100 : 0,
        payed_sum: Number(
          +totalSum + +delivery_price - (pay_bonus ? +pay_bonus : 0)
        ),
        payment: payment_method,
        phone: `+${auth?.phone_number}`,
        products: JSON.stringify(filterProductsAbdugani),
        promotion: "no",
        spot_id: Number(spot_id),
        status: "accept",
        type: "delivery",
      };

      let pickupData = {
        address_comment: "no",
        all_price: Number((+totalSum + +delivery_price) * 100),
        client_address: `${42},${62}`,
        client_id: Number(auth?.client_id),
        comment,
        created_at: formatCreatedAt(),
        payed_bonus: pay_bonus ? Number(pay_bonus) * 100 : 0,
        payed_sum: Number(+totalSum - (pay_bonus ? +pay_bonus : 0)),
        payment: payment_method,
        phone: `+${auth?.phone_number}`,
        products: JSON.stringify(filterProductsAbdugani),
        promotion: "no",
        spot_id: Number(spot_id),
        status: "accept",
        type: `take_away ${spot_name}`,
      };

      let spotData = {};
    } catch (error) {}
  };
  console.log(orderData);

  return (
    <div className="w-full flex flex-col pt-6 gap-5">
      <div className="flex flex-col gap-y-4">
        <div className="w-full flex justify-between">
          <p className="font-medium textSmall3 leading-5 text-[#2E2E2E] text-start md:text-end">
            {service == "self" ? total("total") : total("products_sum")}{" "}
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
              {formatNumber(orderData?.delivery_price)} {all("sum")}
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
        {activeTab !== "spot" && (
          <div className="w-full flex justify-between">
            <p className="font-medium textSmall3 leading-5 text-[#2E2E2E] text-start md:text-end">
              {total("total")}
            </p>
            <p className="font-normal textNormal3 leading-7 text-[#2E2E2E]">
              {formatNumber(
                Number(totalSum) -
                  Number(orderData?.pay_bonus) +
                  (orderData?.service_mode == 3 ? orderData?.delivery_price : 0)
              )}{" "}
              {all("sum")}
            </p>
          </div>
        )}
        {activeTab == "spot" && service == "waiter" && (
          <div className="w-full flex justify-between">
            <p className="font-medium textSmall3 leading-5 text-[#2E2E2E] text-start md:text-end">
              {all("waiter")}
            </p>
            <p className="font-normal textNormal2 leading-7 text-[#2E2E2E]">
              10%
            </p>
          </div>
        )}
        {activeTab == "spot" && service == "waiter" && (
          <div className="w-full flex justify-between">
            <p className="font-medium textSmall3 leading-5 text-[#2E2E2E] text-start md:text-end">
              {total("total")}
            </p>
            <p className="font-normal textNormal3 leading-7 text-[#2E2E2E]">
              {formatNumber(Number(totalSum + (totalSum * 10) / 100))}
              {all("sum")}
            </p>
          </div>
        )}
      </div>
      <div className="space-y-2 md:space-y-4">
        {activeTab !== "spot" && (
          <>
            <Button
              onClick={() => {
                if (auth?.client_id) {
                  setActiveBonus(true);
                } else {
                  toast.warning(
                    <div className="w-full h-full flex justify-between items-center">
                      {all("no_auth")}{" "}
                      <Link
                        href={`/${locale}/${place}/login`}
                        className="bg-black text-white rounded-md px-2 py-1"
                      >
                        {all("sign_in")}
                      </Link>
                    </div>
                  );
                }
              }}
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
            {activeBonus && auth?.client_id && (
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
        <Button
          onClick={handleSubmit}
          className="mb-3 w-full h-10 md:h-12 flex justify-center items-center gap-1 border-[1px] rounded-xl hover:bg-primary md:mt-5 font-medium text-sm md:text-md"
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
