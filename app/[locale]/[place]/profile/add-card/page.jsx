"use client";
import Container from "@/components/shared/container";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useTranslations } from "use-intl";
import { getUrl, hashSecretKey, truncateText } from "@/lib/utils";
import { decryptData, encryptData, hashWithSecret } from "@/lib/hashing";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const MyCard = () => {
  const [color, setColor] = useState("#B18CFE");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cardName, setCardName] = useState("");
  const allT = useTranslations("All");
  const cardT = useTranslations("Profile.MyCard");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const spot = searchParams.get("spot");
  const tableId = searchParams.get("table_id");
  const tableNum = searchParams.get("table_num");
  const service = searchParams.get("service");
  const place = pathname.split("/")[2];
  const numberChange = (e) => {
    let value = e.target.value;

    // Faqat raqamlarni saqlash
    value = value.replace(/\D/g, "");

    // Har 4 ta raqamdan keyin probel qo'yish
    value = value.replace(/(.{4})(?=.)/g, "$1 ");

    // 16 ta raqamdan oshmasligini tekshirish
    if (value.replace(/\D/g, "").length > 16) {
      value = value.slice(0, 19); // 16 raqamdan keyin barcha belgilarni olib tashlash
    }

    setCardNumber(value);
  };

  const dateChange = (e) => {
    let value = e.target.value;

    // Faqat raqamlarni saqlash
    value = value.replace(/\D/g, "");

    // Har 2 ta raqamdan keyin / qo'yish
    value = value.replace(/(.{2})(?=.)/g, "$1/");

    // 5 ta belgidan oshmasligini tekshirish (MM/YY formatida)
    if (value.length > 5) {
      value = value.slice(0, 5); // MM/YY formatida faqat 5 ta belgidan oshmasligi kerak
    }

    setExpiryDate(value);
  };

  function getHash(params) {
    if (!cardNumber.trim()) {
      alert("Iltimos Tuliq tuldiring");
      console.warn("Card number is empty. Skipping save operation.");
      return;
    }

    if (!hashSecretKey) {
      console.error("Secret key is not defined!");
      return;
    }
    router.push(
      place == "branch"
        ? `${getUrl(
            pathname
          )}/cart?spot=${spot}&table_id=${tableId}&table_num=${tableNum}&service=${service}`
        : `${getUrl(pathname)}/cart`
    );
    const cardData = JSON.stringify({
      cardName: cardName,
      cardNumber: cardNumber,
      expiryDate: expiryDate,
      color: color,
    });

    // Ma'lumotlarni shifrlash
    const encryptedCard = encryptData(cardData, hashSecretKey);
    // Avvalgi kartalarni olish
    const existingCards = JSON.parse(localStorage.getItem("hashedCards")) || [];
    // Yangi kartani ro'yxatga qo'shish
    existingCards.push(encryptedCard);
    // Yangilangan ro'yxatni saqlash
    localStorage.setItem("hashedCards", JSON.stringify(existingCards));
    // Shifrlangan kartalarni ochish
    const decryptedCards = existingCards.map((card) =>
      decryptData(card, hashSecretKey)
    );

    // Formani tozalash
    setCardNumber("");
    setCardName("");
    setExpiryDate("");
  }

  return (
    <Container className={"w-11/12 flex flex-col pt-3 md:pt-8"}>
      <h1 className="w-full textNormal4 font-semibold text-primary">
        {cardT("add")}
      </h1>
      <div className="w-full flex flex-col lg:flex-row gap-5 mt-7">
        <div className="lg:w-1/2 flex flex-col items-center gap-5">
          <div className="w-full bg-white rounded-xl px-4 py-3 md:py-6 md:px-7 flex flex-col gap-2">
            <h1 className="text-thin textSmall3 font-bold">{cardT("title")}</h1>
            <Label htmlFor="name" className={"textSmall2 leading-6 pt-2"}>
              {cardT("card_name")}
            </Label>
            <Input
              id="name"
              type="text"
              onChange={(e) => setCardName(e.target.value)}
              placeholder={cardT("card_name_pls")}
              className={
                "text-[14px] focus-visible:outline-none focus-visible:ring-0 shadow-none textSmall2"
              }
            />

            <Label htmlFor="phone" className={"textSmall2 leading-6"}>
              {cardT("card_num")}
            </Label>
            {/* <Input id="phone" disabled value="+998935204050" /> */}
            <Input
              onChange={numberChange}
              id="name"
              value={cardNumber}
              type="text"
              placeholder={"000 000 000 000"}
              className={
                "text-[14px] focus-visible:outline-none focus-visible:ring-0 shadow-none"
              }
            />

            <Label htmlFor="phone" className={"textSmall2 leading-6"}>
              {cardT("card_date")}
            </Label>
            {/* <Input id="phone" disabled value="+998935204050" /> */}
            <Input
              id="name"
              value={expiryDate}
              type="text"
              placeholder="01/01"
              onChange={dateChange}
              className={
                "text-[14px] focus-visible:outline-none focus-visible:ring-0 shadow-none"
              }
            />
          </div>
        </div>
        <div className="lg:w-1/2 flex flex-col justify-center items-center">
          <div
            className="w-full  max-w-[350px] relative rounded-[17px] h-44 md:h-48 overflow-hidden my-4"
            style={{ backgroundColor: color }}
          >
            <Image
              src={`/assets/secondaryIcon.webp`}
              alt="Rolling Sushi"
              width={120}
              height={70}
              className="absolute z-20 top-[18px] right-[22px]"
            />
            <p className="absolute font-semibold text-base leading-6 left-5 top-5 text-white">
              {cardName ? truncateText(cardName, 15) : cardT("card_name")}
            </p>
            <p className="absolute font-semibold text-sm leading-6 right-11 top-[88px] text-white">
              {expiryDate ? expiryDate : "00/00"}
            </p>
            <p className="font-semibold text-lg leading-6 absolute text-center w-full bottom-[16px] text-white z-50">
              {cardNumber ? cardNumber : "0000 0000 0000 0000"}
            </p>
          </div>
          <div className="flex justify-between w-11/12 md:w-full max-w-72">
            <Button
              onClick={() => setColor("#B18CFE")}
              className={`rounded-full w-[30px] p-0 h-[30px] bg-[#B18CFE] hover:bg-[#B18CFE] border-[#004032] ${
                color == "#B18CFE" ? "border-[3px]" : ""
              }`}
            ></Button>
            <Button
              onClick={() => setColor("#EE719E")}
              className={`rounded-full w-[30px] p-0 h-[30px] bg-[#EE719E] hover:bg-[#EE719E] border-[#004032] ${
                color == "#EE719E" ? "border-[3px]" : ""
              }`}
            ></Button>
            <Button
              onClick={() => setColor("#4D22B2")}
              className={`rounded-full w-[30px] p-0 h-[30px] bg-[#4D22B2] hover:bg-[#4D22B2] border-[#004032] ${
                color == "#4D22B2" ? "border-[3px]" : ""
              }`}
            ></Button>
            <Button
              onClick={() => setColor("#D8C9FE")}
              className={`rounded-full w-[30px] p-0 h-[30px] bg-[#D8C9FE] hover:bg-[#D8C9FE] border-[#004032] ${
                color == "#D8C9FE" ? "border-[3px]" : ""
              }`}
            ></Button>
            <Button
              onClick={() => setColor("#FFAB01")}
              className={`rounded-full w-[30px] p-0 h-[30px] bg-[#FFAB01] hover:bg-[#FFAB01] border-[#004032] ${
                color == "#FFAB01" ? "border-[3px]" : ""
              }`}
            ></Button>
            <Button
              onClick={() => setColor("#FF8C82")}
              className={`rounded-full w-[30px] p-0 h-[30px] bg-[#FF8C82] hover:bg-[#FF8C82] border-[#004032] ${
                color == "#FF8C82" ? "border-[3px]" : ""
              }`}
            ></Button>
          </div>

          <div className="w-full max-w-md grid grid-cols-1 gap-y-4 lg:grid-cols-2 gap-x-2 mt-10 mx-7">
            <Button
              onClick={getHash}
              className={"hover:bg-primary h-11 rounded-xl"}
            >
              {allT("confirm")}
            </Button>

            <Button
              onClick={() => router.back()}
              variant={"ghost"}
              className={"w-full border-2 h-11 rounded-xl"}
            >
              {allT("cancel")}
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default MyCard;
