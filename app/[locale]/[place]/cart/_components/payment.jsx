"use client";

import { card, cash, click, payme, uzcard, uzum } from "@/public";
import { useStore } from "@/store";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useTranslations } from "use-intl";

const Payment = ({ locale, place }) => {
  const paymentText = useTranslations("Cart.Payment");
  const { activeTab } = useStore();

  const pay = [
    {
      id: 1,
      icon: card,
      text: paymentText("card"),
    },
    {
      id: 2,
      icon: cash,
      text: paymentText("cash"),
    },
    {
      id: 3,
      icon: payme,
      text: "PayMe",
    },
    {
      id: 4,
      icon: click,
      text: "Click",
    },
    {
      id: 5,
      icon: uzum,
      text: "Uzum",
    },
  ];

  return (
    <div className="w-full flex flex-col items-start md:px-12 pt-6 gap-5">
      <h2 className="hidden textNormal4 font-bold leading-9">{paymentText("thanks_payment")}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {pay.map((item) => (
          <button
            key={item.id}
            className="group w-[118px] min-h-[70px] rounded-[7px] border-[#004032] border-b-2 p-3 flex flex-col justify-start focus:border-2 gap-1"
          >
            <Image
              src={item.icon}
              alt="card"
              width={100}
              height={100}
              className={`${item.id == 1 ? "w-10" : "w-16"}`}
            />
            <p className="font-normal text-sm text-[#00000099] group-focus:text-[#004032] group-focus:font-bold">
              {item.text}
            </p>
          </button>
        ))}
      </div>
      {activeTab !== "spot" || false && (
        <Link
          href={`/${locale}/${place}/create-card`}
          className="w-full sm:w-2/3 md:w-8/12 lg:w-full 2xl:w-9/12 h-40 md:h-48 flex justify-center items-center"
        >
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white absolute z-50 flex justify-center items-center">
            <Plus />
          </div>
          <div className="w-full h-full relative bg-[#428B7B] rounded-[17px] overflow-hidden my-9 blur-[1px] mx-auto">
            <Image
              src={uzcard}
              alt="uzcard"
              width={100}
              height={100}
              className=" absolute z-40 top-[18px] right-[5%]"
            />
            <div className="bg-[#EB5757] absolute w-60 h-60 rounded-full -left-[120px] -top-10 opacity-50"></div>
            <div className="bg-[#A6C44A] absolute w-60 h-60 rounded-full left-0 -bottom-32 opacity-50 z-10"></div>
            <p className="absolute font-semibold textSmall4 leading-6 left-[5%] top-5 text-white">
              {paymentText("card_name")}
            </p>
            <p className="absolute font-semibold textSmall4 leading-6 right-[5%] top-[88px] text-white">
              01/01
            </p>
            <p className="font-semibold textSmall4 leading-6 absolute text-center w-full bottom-[10px] text-white z-50">
              000 000 0000 0000
            </p>
          </div>
        </Link>
      )}
    </div>
  );
};

export default Payment;
