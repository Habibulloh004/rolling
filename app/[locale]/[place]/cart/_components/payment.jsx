"use client";
import { decryptData } from "@/lib/hashing";
import { hashSecretKey } from "@/lib/utils";
import { useOrderStore } from "@/store";
import { BadgeCheck, HandCoins, Plus } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { paymeCheck, paymeCreate } from "@/actions/post";
import Cookies from "js-cookie";

const Payment = ({ locale, place, auth }) => {
  const searchParams = useSearchParams();
  const spot = searchParams.get("spot");
  const paymentText = useTranslations("Cart.Payment");
  const cardT = useTranslations("Profile.MyCard");
  const all = useTranslations("All");
  const { orderData, setOrderData, totalSum } = useOrderStore();
  const [existingCards, setExistingCards] = useState([]);
  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

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
    // { id: 5, icon: `/assets/uzum.webp`, text: "Uzum", type: "uzum" },
  ];

  const handleSelectPayment = (item) => {
    if (!auth?.client_id && !spot && orderData?.payment_method == "cash") {
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
    } else if (item.type != "card") {
      setOrderData({
        ...orderData,
        payment_method: item.type,
      });
    } else {
      toast.error(all("no_active"));
    }
  };

  function getRandomDatePlusNumber() {
    // Bugungi kun
    const today = new Date().getTime(); // Millisekundlarda timestamp

    // 10 xonali tasodifiy son yaratish
    const randomTenDigitNumber = Math.floor(
      1000000000 + Math.random() * 9000000000
    );

    // Ikkisini qo'shish
    const result = today + randomTenDigitNumber;

    return result;
  }

  function getTodayDate() {
    const today = new Date();
    // Yil, oy va kunni olish
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Oyni 2 xonali qilish uchun (01, 02, ...)
    const day = String(today.getDate()).padStart(2, "0"); // Kundni 2 xonali qilish uchun

    // Formatlash
    return `${year}-${month}-${day}`;
  }

  const handlePayment = async () => {
    const paymentData = localStorage.getItem("paymentData")
      ? JSON.parse(localStorage.getItem("paymentData"))
      : null;
    if (paymentData && paymentData.payment_id) {
      return null;
    }
    try {
      setIsPaymentLoading(true);
      switch (orderData?.payment_method) {
        case "payme":
          toast.success("payme " + getRandomDatePlusNumber());
          const paymeData = {
            id: getRandomDatePlusNumber(),
            order_id: "Rolling-Sushi",
            amount: 100,
            // amount:
            //   Number(totalSum) -
            //   (orderData?.pay_bonus ? Number(orderData?.pay_bonus) : 0),
          };
          console.log(paymeData);
          const result = await paymeCreate(paymeData);
          console.log(result[1]?.result?.receipt?._id);

          if (result[1]?.result?.receipt?._id) {
            const paymentData = {
              amount: paymeData?.amount,
              payment_id: result[1]?.result?.receipt?._id,
              success: false,
            };
            localStorage.setItem("paymentData", JSON.stringify(paymentData));
            window.open(
              `https://payme.uz/checkout/${result[1]?.result?.receipt?._id}?back=null&timeout=15000&lang=${locale}`,
              "_blank"
            );
          }
          break;
        case "click":
          toast.success("click");
          break;
        default:
          toast.error(all("no_active"));
          break;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsPaymentLoading(false);
    }
  };

  const handleCheck = async () => {
    const paymentData = localStorage.getItem("paymentData")
      ? JSON.parse(localStorage.getItem("paymentData"))
      : null;
    if (paymentData && paymentData?.success) {
      toast.success("To'lov muvofaqiyatli yakunlandi!");
      return null;
    }
    try {
      setIsPaymentLoading(true);
      switch (orderData?.payment_method) {
        case "payme":
          if (paymentData?.payment_id) {
            toast.success("payme check" + getRandomDatePlusNumber());
            const paymeData = {
              id: getRandomDatePlusNumber(),
              check_id: paymentData?.payment_id,
            };
            console.log(paymeData);
            const result = await paymeCheck(paymeData);
            console.log(result);
            if (result[1]?.result?.state == 4) {
              toast.success("To'lov muvofaqiyatli yakunlandi!");
              localStorage.setItem(
                "paymentData",
                JSON.stringify({
                  ...paymentData,
                  success: true,
                })
              );
            }
          }
          break;
        case "click":
          toast.success("click");
          break;
        default:
          toast.error(all("no_active"));
          break;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsPaymentLoading(false);
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
              ${item.type != "card" ? "" : "opacity-[0.5]"}
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
      <div>
        {(orderData?.payment_method == "click" ||
          orderData?.payment_method == "payme") && (
          <div className="flex justify-between items-center gap-5">
            <Button
              disabled={isPaymentLoading}
              onClick={handlePayment}
              className={`${isPaymentLoading && "opacity-[0.6]"} relative`}
            >
              <div className="flex justify-center items-center gap-2">
                {isPaymentLoading ? (
                  <div className=" w-full h-full flex items-center gap-4 justify-center">
                    <div role="status">
                      <svg
                        aria-hidden="true"
                        className="w-6 h-6 text-gray-300 animate-spin dark:text-gray-600 fill-gray-700"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <span className="text-black sr-only">
                        {all("loading")}
                      </span>
                    </div>
                  </div>
                ) : (
                  <HandCoins size={48} />
                )}
                <h1>To'lov qilish</h1>
              </div>
            </Button>
            <Button
              onClick={handleCheck}
              className="flex justify-center items-center gap-2"
            >
              <BadgeCheck size={48} />
              <h1>To'lov tekshirish</h1>
            </Button>
          </div>
        )}
      </div>
      <div className="w-full relative">
        {orderData?.payment_method == "card" && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default Payment;
