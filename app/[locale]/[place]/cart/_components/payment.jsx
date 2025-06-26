"use client";
import { decryptData } from "@/lib/hashing";
import { formatNumber, hashSecretKey, truncateText } from "@/lib/utils";
import {
  useClientStore,
  useOrderStore,
  useProductStore,
  useStore,
} from "@/store";
import {
  CircleAlert,
  CircleCheckBig,
  HandCoins,
  Plus,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "use-intl";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { checkCard, payCard } from "@/actions/post";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const Payment = ({ apiTime, locale, place, auth }) => {
  const promocodeT = useTranslations("Order.Promocode");
  const searchParams = useSearchParams();
  const spot = searchParams.get("spot");
  const tableId = searchParams.get("table_id");
  const tableNum = searchParams.get("table_num");
  const service = searchParams.get("service");
  const paymentText = useTranslations("Cart.Payment");
  const paymentText1 = useTranslations("Cart.Total");
  const cardT = useTranslations("Profile.MyCard");
  const all = useTranslations("All");
  const {
    orderData,
    setOrderData,
    totalSum,
    paymentData,
    setPaymentData,
    setSelectCard,
    selectCard,
  } = useOrderStore();
  const { isDisabled, activeTab } = useStore();
  const { products } = useProductStore();
  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [isCheckLoading, setIsCheckLoading] = useState(false);
  const initialCountdown = 60;
  const [countdown, setCountdown] = useState(initialCountdown);
  const [retry, setRetry] = useState(false);
  const [optCheck, setOptCheck] = useState(0);
  const [existingCards, setExistingCards] = useState([]);
  const [decryptedCards, setDecryptedCards] = useState([]);
  const [attemptsCount, setAttempts] = useState(0);
  const total = useTranslations("Cart.Total");
  const { client } = useClientStore();

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
    // { id: 4, icon: `/assets/click.webp`, text: "Click", type: "click" },
  ];

  const handleSelectPayment = (item) => {
    // if (!auth?.client_id && !spot && item?.type == "cash") {
    //   toast.error(
    //     <div className="w-full h-full flex justify-start items-center">
    //       <h1 className="w-full">{all("no_auth")} </h1>
    //       <Link
    //         href={`/${locale}/${place}/login`}
    //         className="min-w-[80px] flex justify-center items-center h-full bg-black text-white rounded-md px-3 py-2"
    //       >
    //         {all("sign_in")}
    //       </Link>
    //     </div>
    //   );
    // } else {
    setOrderData({
      ...orderData,
      payment_method: item.type,
    });
    // }
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

  const handlePayment = async () => {
    if (isDisabled) {
      toast.error(paymentText1("note"));
      return;
    }
    if (totalSum <= 0) {
      toast.error(all("products_empty"));
      return;
    }
    if (products.length == 0) {
      toast.error(all("products_empty"));
      return;
    }
    if (!orderData?.phone && !auth?.client_id) {
      toast.error(all("phone_empty"));
      return;
    }
    if (orderData?.phone && orderData?.phone?.length != 13) {
      toast.error(all("phone_empty"));
      return;
    }
    if (!orderData?.phone && spot) {
      toast.error(all("phone_empty"));
      return;
    }

    if (activeTab == "pickup" && orderData?.spot_id == 0) {
      toast.error(all("spot_empty"));
      return;
    }

    if (
      activeTab == "delivery" &&
      (!orderData?.lat || orderData?.lat == 0) &&
      (!orderData?.lng || orderData?.lng == 0)
    ) {
      toast.error(all("location_empty"));
      return;
    }

    try {
      setIsPaymentLoading(true);
      let totalAmount =
        Number(totalSum) -
        (orderData?.pay_bonus ? Number(orderData?.pay_bonus) : 0);
      if (activeTab == "delivery") {
        totalAmount += Number(orderData?.delivery_price);
      }
      if (orderData?.promocodePrice > 0) {
        totalAmount = Number(totalAmount - orderData?.promocodePrice);
      }

      if (service == "waiter") {
        totalAmount = Number(totalAmount + (totalAmount * 10) / 100);
      }
      if (orderData?.discountPromocode > 0) {
        totalAmount = Number(
          totalAmount - (totalAmount * orderData?.discountPromocode) / 100
        );
      }
      switch (orderData?.payment_method) {
        case "card":
          if (!selectCard && !selectCard?.cardNumber) {
            toast.error("Siz karta tanlamadingiz!!!");
            return;
          }
          const cardData = {
            id: getRandomDatePlusNumber(),
            expireDate: Number(
              selectCard?.expiryDate.split("/")[1] +
                "" +
                selectCard?.expiryDate.split("/")[0]
            ),
            cardNumber: selectCard?.cardNumber?.replace(/\s/g, ""),
            amount: totalAmount,
          };
          const resultCard = await payCard(cardData);
          if (resultCard?.error == null) {
            let paymentDataCard = {
              amount: cardData?.amount,
              payment_id: resultCard?.result?.session,
              success: false,
              place,
              resultCard: resultCard?.result,
            };
            if (spot && tableId && tableNum && service) {
              paymentDataCard.spot = spot;
              paymentDataCard.table_id = tableId;
              paymentDataCard.table_num = tableNum;
              paymentDataCard.service = service;
            }
            setCountdown(initialCountdown);
            setRetry(false);
            localStorage.setItem("countdown", initialCountdown);
            localStorage.setItem("countdownTimestamp", Date.now());
            setPaymentData(paymentDataCard);
            localStorage.setItem(
              "paymentData",
              JSON.stringify(paymentDataCard)
            );
          } else {
            toast.error("Kartangizni tekshiring , to'lov tasdiqlanmadi!!!");
            return;
          }
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
    if (paymentData && paymentData?.success) {
      return null;
    }
    setIsCheckLoading(true);
    try {
      switch (orderData?.payment_method) {
        case "card":
          if (paymentData?.payment_id) {
            const cardData = {
              session: paymentData?.payment_id,
              otp: Number(optCheck),
            };
            const result = await checkCard(cardData);
            console.log(result);
            if (result?.error == null && result?.result?.status == 1) {
              localStorage.setItem(
                "paymentData",
                JSON.stringify({
                  ...paymentData,
                  success: true,
                  transactionId: result.result?.transactionId,
                })
              );
              setPaymentData({
                ...paymentData,
                success: true,
                transactionId: result.result?.transactionId,
              });
            } else {
              toast.error(paymentText("pay_error"));
            }
          }
          break;
        default:
          toast.error(all("no_active"));
          break;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsCheckLoading(false);
    }
  };

  const handleSelectCard = (card) => {
    setSelectCard(card);
  };

  const deleteCard = (idx) => {
    // Retrieve cards from localStorage
    let cardsData = localStorage.getItem("hashedCards")
      ? JSON.parse(localStorage.getItem("hashedCards"))
      : [];

    if (cardsData.length > idx) {
      // Remove the card at the specified index
      cardsData.splice(idx, 1);

      // Update localStorage with the new array
      localStorage.setItem("hashedCards", JSON.stringify(cardsData));

      // Update the state for existingCards and decryptedCards
      setExistingCards(cardsData);

      // Re-decrypt the remaining cards
      const updatedDecryptedCards = cardsData
        .map((card) => {
          try {
            const decryptedString = decryptData(card, hashSecretKey);
            return JSON.parse(decryptedString);
          } catch (error) {
            return null;
          }
        })
        .filter(Boolean);

      setDecryptedCards(updatedDecryptedCards);
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

  useEffect(() => {
    const storedCountdown = localStorage.getItem("countdown");
    if (storedCountdown && !retry) {
      setCountdown(Number(storedCountdown));
    }
  }, []);

  // useEffect(() => {
  //   console.log(client);

  //   const orderDataLocal = localStorage.getItem("orderData")
  //     ? JSON.parse(localStorage.getItem("orderData"))
  //     : null;
  //   if (
  //     !client &&
  //     orderDataLocal?.payment_method == "cash" &&
  //     !spot &&
  //     orderDataLocal
  //   ) {
  //     setOrderData({
  //       ...orderDataLocal,
  //       payment_method: "",
  //     });
  //   }
  // }, [auth, client, orderData?.payment_method]);

  useEffect(() => {
    // Sahifa refresh bo'lganda qayta hisoblashni tiklash
    const savedTime = Number(localStorage.getItem("countdown"));
    const savedTimestamp = Number(localStorage.getItem("countdownTimestamp"));
    const currentTime = Date.now();

    if (savedTime > 0 && savedTimestamp) {
      const elapsedSeconds = Math.floor((currentTime - savedTimestamp) / 1000);
      const remainingTime = Math.max(savedTime - elapsedSeconds, 0);

      setCountdown(remainingTime);
      if (remainingTime === 0) setRetry(true);
    }
  }, []);

  useEffect(() => {
    // Countdown davomida holatni saqlash
    if (countdown > 0 && !retry) {
      localStorage.setItem("countdown", countdown);
      localStorage.setItem("countdownTimestamp", Date.now());

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            setRetry(true);
            clearInterval(timer);
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }

    if (countdown === 0) {
      setRetry(true);
    }
  }, [countdown, retry]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        // Get hashed cards from localStorage
        const cards = JSON.parse(localStorage.getItem("hashedCards")) || [];
        setExistingCards(cards);

        // Decrypt cards
        const decrypted = cards
          .map((card) => {
            try {
              const decryptedString = decryptData(card, hashSecretKey);
              return JSON.parse(decryptedString); // Parse the decrypted string
            } catch (error) {
              console.error("Failed to decrypt or parse card:", error);
              return null; // Return null for invalid cards
            }
          })
          .filter(Boolean); // Filter out null values
        setDecryptedCards(decrypted);
      } catch (error) {
        console.error("Error reading cards from localStorage:", error);
      }
    }
  }, [decryptData, hashSecretKey]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cards = JSON.parse(localStorage.getItem("hashedCards")) || [];
      setExistingCards(cards);
    }
  }, []);

  return (
    <div className="w-full flex flex-col items-start md:px-12 pt-6 gap-5">
      <h2 className="hidden textNormal4 font-bold leading-9">
        {paymentText("thanks_payment")}
      </h2>
      {paymentData && paymentData?.success ? (
        <div className="flex justify-start items-center w-full gap-2">
          <Image src="/assets/thankspay.png" alt="pay" height={50} width={50} />
          <h1 className="textNormal4 font-bold text-primary">
            {paymentText("thanks_payment")}
          </h1>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {pay.map((item, idx) => (
              <div key={item.id} className="relative w-full h-full">
                <Button
                  aria-label={`payment ${idx}`}
                  disabled={paymentData && paymentData?.payment_id}
                  onClick={() => handleSelectPayment(item)}
                  key={item.id}
                  className={`relative w-[118px] h-full bg-transparent shadow-none rounded-[7px] border-[#004032] border-b-2 p-3 flex flex-col justify-start gap-1
                  ${paymentData && paymentData?.payment_id && "opacity-[0.5] "}
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
                </Button>
              </div>
            ))}
          </div>{" "}
          <div className="w-full relative">
            {orderData?.payment_method == "card" && (
              <>
                {!decryptedCards.length ? (
                  <Link
                    href={
                      place == "branch"
                        ? `/${locale}/${place}/profile/add-card?spot=${spot}&table_id=${tableId}&table_num=${tableNum}&service=${service}`
                        : `/${locale}/${place}/profile/add-card`
                    }
                    className="w-full sm:w-2/3 md:w-8/12 lg:w-full 2xl:w-9/12 h-40 md:h-48 flex justify-center items-center"
                  >
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white absolute z-50 flex justify-center items-center">
                      <Plus />
                    </div>
                    <div className="w-full h-full relative bg-[#428B7B] rounded-[17px] overflow-hidden my-9 blur-[1px] mx-auto">
                      <Image
                        src={`/assets/secondaryIcon.webp`}
                        alt="Rolling Sushi"
                        width={120}
                        height={70}
                        className="absolute z-20 top-[18px] right-[22px]"
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
                            onClick={() => handleSelectCard(item)}
                            key={i}
                            className={`cursor-pointer w-full mx-auto max-w-[350px] relative rounded-[17px] h-44 md:h-48 overflow-hidden my-4`}
                            style={{ backgroundColor: item.color }}
                          >
                            <Image
                              src={`/assets/secondaryIcon.webp`}
                              alt="Rolling Sushi"
                              width={120}
                              height={70}
                              className="absolute z-20 top-[18px] right-[22px]"
                            />
                            <div
                              onClick={() => deleteCard(i)}
                              className="cursor-pointer text-red-500 absolute top-1 right-1 bg-white p-1 rounded-md"
                            >
                              <Trash2 size={16} />
                            </div>
                            <p className="absolute font-semibold text-base leading-6 left-5 top-5 text-white">
                              {item.cardName
                                ? truncateText(item.cardName, 16)
                                : cardT("card_name")}
                            </p>
                            <p className="absolute font-semibold text-sm leading-6 right-11 top-[88px] text-white">
                              {item.expiryDate ? item.expiryDate : "00/00"}
                            </p>
                            {selectCard?.cardNumber == item?.cardNumber && (
                              <div className="absolute bottom-4 text-white left-3">
                                <CircleCheckBig />
                              </div>
                            )}
                            <div className="text-white flex justify-center">
                              <p className="font-semibold text-lg leading-6 absolute text-center w-full bottom-[16px] text-white z-50">
                                {item.cardNumber
                                  ? item.cardNumber
                                  : "0000 0000 0000 0000"}
                              </p>
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                      <CarouselItem className="flex justify-center items-center">
                        <Link
                          href={
                            place == "branch"
                              ? `/${locale}/${place}/profile/add-card?spot=${spot}&table_id=${tableId}&table_num=${tableNum}&service=${service}`
                              : `/${locale}/${place}/profile/add-card`
                          }
                          className="w-full sm:w-2/3 md:w-8/12 lg:w-full 2xl:w-9/12 h-44 md:h-48 overflow-hidden my-4 flex justify-center items-center"
                        >
                          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white absolute z-50 flex justify-center items-center">
                            <Plus />
                          </div>
                          <div className="w-full h-full relative bg-[#428B7B] rounded-[17px] overflow-hidden my-9 blur-[1px] mx-auto">
                            <Image
                              src={`/assets/secondaryIcon.webp`}
                              alt="Rolling Sushi"
                              width={120}
                              height={70}
                              className="absolute z-20 top-[18px] right-[22px]"
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
                      </CarouselItem>
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
          <div className="w-full lg:hidden flex flex-col gap-y-4">
            <div className="w-full flex justify-between">
              <p className="font-medium textSmall3 leading-5 text-[#2E2E2E] text-start md:text-end">
                {service == "self" ? total("total") : total("products_sum")}{" "}
              </p>
              <p className="font-normal textNormal2 leading-7 text-[#2E2E2E]">
                {formatNumber(totalSum)} {all("sum")}
              </p>
            </div>
            {orderData?.promocodePrice > 0 && (
              <div className="w-full flex justify-between">
                <p className="font-medium textSmall3 leading-5 text-[#2E2E2E] text-start md:text-end">
                  {promocodeT("titleDialog")}
                </p>
                <p className="text-primary font-normal textNormal2 leading-7 text-[#2E2E2E]">
                  -{formatNumber(orderData?.promocodePrice)} {all("sum")}
                </p>
              </div>
            )}
            {orderData?.discountPromocode > 0 && (
              <div className="w-full flex justify-between">
                <p className="font-medium textSmall3 leading-5 text-[#2E2E2E] text-start md:text-end">
                  {promocodeT("titleDialog")}
                </p>
                <p className="text-primary font-normal textNormal2 leading-7 text-[#2E2E2E]">
                  {formatNumber(orderData?.discountPromocode)}% {all("disc")}
                </p>
              </div>
            )}
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
                    (Number(totalSum) -
                      Number(orderData?.pay_bonus) +
                      (activeTab == "delivery"
                        ? orderData?.delivery_price
                        : 0) -
                      (orderData?.promocodePrice > 0 &&
                        Number(orderData?.promocodePrice))) *
                      (orderData?.discountPromocode > 0
                        ? 1 - orderData?.discountPromocode / 100
                        : 1)
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
          <div className="w-full">
            {orderData?.payment_method &&
              orderData?.payment_method == "card" && (
                <div className="w-full flex max-md:flex-col md:justify-between justify-center items-center gap-5">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        aria-label={`payment loading`}
                        disabled={
                          isPaymentLoading ||
                          (paymentData && !paymentData?.success) ||
                          isDisabled
                        }
                        className={`${
                          (isPaymentLoading ||
                            (paymentData && !paymentData?.success)) &&
                          "opacity-[0.6]"
                        } relative w-full h-10 md:h-12  rounded-xl`}
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
                          <h1 className="w-full">{paymentText("pay")}</h1>
                        </div>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="w-11/12 rounded-md">
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {paymentText("sure_to_pay")}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {paymentText("sure_desc")}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{all("cancel")}</AlertDialogCancel>
                        <AlertDialogAction asChild>
                          <Button
                            className=""
                            aria-label={`hand`}
                            onClick={handlePayment}
                          >
                            <HandCoins size={48} />
                            {paymentText("pay")}
                          </Button>
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  {orderData?.payment_method &&
                    orderData?.payment_method == "card" && (
                      <div>
                        <AlertDialog open={paymentData?.resultCard}>
                          <AlertDialogTrigger asChild></AlertDialogTrigger>
                          <AlertDialogContent className="rounded-md w-11/12 max-w-[365px] ">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-xl text-center relative">
                                {paymentText("check")}
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-black/60 text-center text-sm">
                                {paymentText("otp_desc")} <br />
                                {paymentData?.resultCard?.otpSentPhone}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="w-full flex justify-center items-center">
                              <InputOTP
                                onChange={(e) => setOptCheck(e)}
                                maxLength={6}
                              >
                                <InputOTPGroup>
                                  <InputOTPSlot
                                    className="max-sm:w-[30px] max-sm:h-[30px]"
                                    index={0}
                                  />
                                  <InputOTPSlot
                                    className="max-sm:w-[30px] max-sm:h-[30px]"
                                    index={1}
                                  />
                                  <InputOTPSlot
                                    className="max-sm:w-[30px] max-sm:h-[30px]"
                                    index={2}
                                  />
                                  <InputOTPSlot
                                    className="max-sm:w-[30px] max-sm:h-[30px]"
                                    index={3}
                                  />
                                  <InputOTPSlot
                                    className="max-sm:w-[30px] max-sm:h-[30px]"
                                    index={4}
                                  />
                                  <InputOTPSlot
                                    className="max-sm:w-[30px] max-sm:h-[30px]"
                                    index={5}
                                  />
                                </InputOTPGroup>
                              </InputOTP>
                            </div>
                            <AlertDialogFooter className="flex justify-center gap-2 items-center w-full">
                              {optCheck?.length != 6 ? (
                                <div className="w-full">
                                  {retry ? (
                                    <button
                                      aria-label={`otp`}
                                      onClick={handlePayment}
                                      className="w-full bg-primary text-white py-2 rounded-md hover:opacity-90"
                                    >
                                      {paymentText("otp_again")}
                                    </button>
                                  ) : (
                                    <button
                                      aria-label={`secound`}
                                      disabled
                                      className="w-full bg-gray-300 text-gray-600 py-2 rounded-md"
                                    >
                                      {countdown} {paymentText("secound")}
                                    </button>
                                  )}
                                </div>
                              ) : (
                                <button
                                  aria-label={`confirmpay`}
                                  onClick={handleCheck}
                                  className="w-full bg-primary text-white py-2 rounded-md hover:opacity-90"
                                >
                                  {all("confirm")}
                                </button>
                              )}
                            </AlertDialogFooter>
                            <button
                              aria-label={`cancelpay`}
                              onClick={() => {
                                setPaymentData(null);
                                setRetry(true);
                                setCountdown(60);
                                localStorage.setItem("countdown", 60);
                              }}
                              className="w-full bg-red-500 text-white py-2 rounded-md hover:opacity-90"
                            >
                              {all("cancel")}
                            </button>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  {paymentData && (
                    <button
                      aria-label={`cancel payment`}
                      onClick={() => {
                        setPaymentData(null);
                        setRetry(true);
                      }}
                      className="w-full bg-red-500 text-white py-2 px-3 rounded-md hover:opacity-90"
                    >
                      {all("cancel")}
                    </button>
                  )}
                </div>
              )}
          </div>
          <AlertDialog
            open={
              paymentData &&
              !paymentData?.success &&
              orderData?.payment_method != "card"
            }
          >
            <AlertDialogTrigger asChild></AlertDialogTrigger>
            <AlertDialogContent className="rounded-md w-11/12 max-w-[365px] ">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-xl text-center relative">
                  {paymentText("check")}
                </AlertDialogTitle>
                <AlertDialogDescription className="text-black/60 text-center text-sm">
                  {paymentText("check_wait")} <br />
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="w-full flex justify-center items-center">
                {attemptsCount == 5 ? (
                  /* From Uiverse.io by ilkhoeri */
                  <div className="relative w-full max-w-64 flex gap-2 items-center justify-center py-3 pl-4 pr-14 rounded-lg text-base font-medium [transition:all_0.5s_ease] border-solid border border-[#f85149] text-[#b22b2b] [&amp;_svg]:text-[#b22b2b] group bg-[linear-gradient(#f851491a,#f851491a)]">
                    <div className="flex flex-row items-center mr-auto gap-x-2">
                      <svg
                        stroke="currentColor"
                        fill="none"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        height="28"
                        width="28"
                        className="h-7 w-7"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                        <path d="M12 9v4"></path>
                        <path d="M12 17h.01"></path>
                      </svg>
                    </div>
                    {paymentText("pay_error")}
                  </div>
                ) : (
                  <div className="loader-payment">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                )}
              </div>
              <AlertDialogFooter className="flex flex-col justify-center gap-2 items-center w-full">
                <button
                  aria-label={`cancelpay`}
                  onClick={() => {
                    setPaymentData(null);
                    setAttempts(1);
                  }}
                  className="w-full bg-red-500 text-white py-2 rounded-md hover:opacity-90"
                >
                  {all("cancel")}
                </button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
};

export default Payment;
