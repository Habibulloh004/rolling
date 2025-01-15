"use client";

import { card, cash, click, payme, uzcard, uzum } from "@/public";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useTranslations } from "use-intl";

const Payment = () => {
  const paymentText = useTranslations("Cart.Payment");
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
    <div className="w-full flex flex-col items-start md:px-12 pt-6">
      <h2 className="text-2xl font-bold leading-9">Способ оплаты</h2>
      <div className="grid grid-cols-3 gap-2 pt-7">
        {pay.map((item) => (
          <button
            key={item.id}
            className="group w-[118px] min-h-[70px] rounded-[7px] border-[#004032] border-b-2 p-3 flex flex-col justify-start active:border-2 gap-1"
          >
            <Image
              src={item.icon}
              alt="card"
              width={30}
              height={30}
              className=""
            />
            <p className="font-normal text-sm text-[#00000099] group-active:text-[#004032] group-active:font-bold">
              {item.text}
            </p>
          </button>
        ))}
      </div>
      <div className="flex justify-center items-center">
        <Link
          href="/"
          className="w-[50px] h-[50px] rounded-full bg-white absolute z-50 flex justify-center items-center"
        >
          <Plus />
        </Link>
        <div className="w-[375px] relative bg-[#428B7B] rounded-[17px] h-[165px] overflow-hidden my-9 blur-[1px]">
          <Image
            src={uzcard}
            alt="uzcard"
            width={100}
            height={100}
            className="absolute z-20 top-[18px] right-[22px]"
          />
          <div className="bg-[#EB5757] absolute w-60 h-60 rounded-full -left-[120px] -top-10 opacity-50"></div>
          <div className="bg-[#A6C44A] absolute w-60 h-60 rounded-full left-0 -bottom-32 opacity-50 z-10"></div>
          <p className="absolute font-semibold text-lg leading-6 left-9 top-5 text-white">
            Названия карты
          </p>
          <p className="absolute font-semibold text-lg leading-6 right-11 top-[88px] text-white">
            01/01
          </p>
          <p className="font-semibold text-lg leading-6 absolute text-center w-full bottom-[10px] text-white z-50">
            9860 * * * * * * * * 1222
          </p>
        </div>
      </div>
    </div>
  );
};

export default Payment;
