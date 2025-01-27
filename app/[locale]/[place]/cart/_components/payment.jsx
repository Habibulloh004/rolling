"use client";
import { decryptData } from "@/lib/hashing";
import { hashSecretKey } from "@/lib/utils";
import { useOrderStore } from "@/store";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "use-intl";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useSearchParams } from "next/navigation";

const Payment = ({ locale, place, auth }) => {
  const searchParams = useSearchParams();
  const spot = searchParams.get("spot");
  const paymentText = useTranslations("Cart.Payment");
  const cardT = useTranslations("Profile.MyCard");
  const all = useTranslations("All");
  const { orderData, setOrderData } = useOrderStore();
  const [existingCards, setExistingCards] = useState([]);
  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  // Fetch cards from localStorage on the client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const cards = JSON.parse(localStorage.getItem("hashedCards")) || [];
      setExistingCards(cards);
    }
  }, []);

  const decryptedCards = existingCards
    .map((card) => {
      try {
        // Decrypt the card
        const decryptedString = decryptData(card, hashSecretKey);

        // Parse JSON string into an object
        return JSON.parse(decryptedString);
      } catch (error) {
        console.error("Failed to decrypt or parse card:", error);
        return null; // Return null for invalid cards
      }
    })
    .filter(Boolean);

  const pay = [
    {
      id: 1,
      icon: `/assets/card.svg`,
      text: paymentText("card"),
      type: "card",
    },
    {
      id: 2,
      icon: `/assets/cash.webp`,
      text: paymentText("cash"),
      type: "cash",
    },
    { id: 3, icon: `/assets/payme.webp`, text: "PayMe", type: "payme" },
    { id: 4, icon: `/assets/click.webp`, text: "Click", type: "click" },
    { id: 5, icon: `/assets/uzum.webp`, text: "Uzum", type: "uzum" },
  ];

  const handleSelectPayment = (item) => {
    if (!auth?.client_id && !spot) {
      toast.error(
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
    } else if (item.type == "cash") {
      setOrderData({
        ...orderData,
        payment_method: item.type,
      });
    } else if (spot && item.type == "cash") {
      setOrderData({
        ...orderData,
        payment_method: item.type,
      });
    } else {
      toast.error(all("no_active"));
    }
  };

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // useEffect(() => {
  //   if (!auth?.client_id && orderData?.payment_method === "cash" && !spot) {
  //     setOrderData({
  //       ...orderData,
  //       payment_method: "card",
  //     });
  //   }
  // }, [auth, orderData?.payment_method]);

  return (
    <div className="w-full flex flex-col items-start md:px-12 pt-6 gap-5">
      <h2 className="hidden textNormal4 font-bold leading-9">
        {paymentText("thanks_payment")}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {pay.map((item) => (
          <button
            onClick={() => handleSelectPayment(item)}
            key={item.id}
            className={`w-[118px] min-h-[70px] rounded-[7px] border-[#004032] border-b-2 p-3 flex flex-col justify-start gap-1
              ${
                item.type === "cash" || (item.type == "cash" && spot)
                  ? ""
                  : "opacity-[0.5]"
              }
              ${
                orderData?.payment_method === item?.type
                  ? "border-2 font-semibold"
                  : ""
              }`}
          >
            <Image
              src={item.icon}
              alt="card"
              width={100}
              height={100}
              className={`${item.id === 1 ? "w-10" : "w-16"}`}
            />
            <p className="text-sm text-[#00000099] group-focus:text-[#004032]">
              {item.text}
            </p>
          </button>
        ))}
      </div>
      <div className="w-full relative">
        {orderData?.payment_method !== "card" && (
          <div className="w-full h-full absolute left-0 top-0 backdrop-blur-[2px] z-10" />
        )}
        {!decryptedCards.length ? (
          <Link
            href={`/${locale}/${place}/profile/add-card`}
            className="w-full sm:w-2/3 md:w-8/12 lg:w-full 2xl:w-9/12 h-40 md:h-48 flex justify-center items-center"
          >
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white absolute z-50 flex justify-center items-center">
              <Plus />
            </div>
            <div className="w-full h-full relative bg-[#428B7B] rounded-[17px] overflow-hidden my-9 blur-[1px] mx-auto">
              <Image
                src={`/assets/uzcard.webp`}
                alt="uzcard"
                width={100}
                height={100}
                className="absolute z-40 top-[18px] right-[5%]"
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
        ) : (
          <Carousel setApi={setApi} className="w-full">
            <CarouselContent>
              {decryptedCards.map((item, i) => (
                <CarouselItem key={i}>
                  <div
                    key={i}
                    className={`cursor-pointer w-full mx-auto max-w-[350px] relative rounded-[17px] h-44 md:h-48 overflow-hidden my-4`}
                    style={{ backgroundColor: item.color }}
                  >
                    <Image
                      src={`/assets/uzcard.webp`}
                      alt="uzcard"
                      width={100}
                      height={100}
                      className="h-11 w-[83px] absolute z-20 top-[18px] right-[22px]"
                    />
                    <p className="absolute font-semibold text-base leading-6 left-5 top-5 text-white">
                      {item.cardName ? item.cardName : cardT("card_name")}
                    </p>
                    <p className="absolute font-semibold text-sm leading-6 right-11 top-[88px] text-white">
                      {item.expiryDate ? item.expiryDate : "00/00"}
                    </p>
                    <p className="font-semibold text-lg leading-6 absolute text-center w-full bottom-[16px] text-white z-50">
                      {item.cardNumber
                        ? item.cardNumber
                        : "0000 0000 0000 0000"}
                    </p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="py-1 flex gap-2 justify-center">
              {Array.from({ length: count }).map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    current === index ? "bg-blue-500" : "bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </Carousel>
        )}
      </div>
    </div>
  );
};

export default Payment;
