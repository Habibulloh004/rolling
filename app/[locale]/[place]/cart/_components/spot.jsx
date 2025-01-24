import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { translateTextSpot } from "@/lib/utils";
import { location, pencil } from "@/public";
import { useOrderStore, useStore } from "@/store";
import Image from "next/image";
import React, { useEffect } from "react";
import { useTranslations } from "use-intl";

const Spot = ({ place, locale, spotData, searchParamsData }) => {
  const spotText = useTranslations("Cart.Spot");
  const allT = useTranslations("All");
  const profileT = useTranslations("Profile");
  const { spot, table_id, table_num, service } = searchParamsData;
  const { setActiveTab } = useStore();
  const { orderData, setOrderData } = useOrderStore();

  // Telefon raqami o'zgarishini boshqaruvchi funksiya
  const handleChangePhone = (e) => {
    const inputValue = e.target.value;

    // Faqat raqamlar va "+" belgisi kiritilishi mumkin
    const sanitizedValue = inputValue.replace(/[^0-9+]/g, "");

    // "+ bilan boshlashni tekshirish"
    if (!sanitizedValue.startsWith("+")) {
      setOrderData({ ...orderData, phone: "+" });
      return;
    }

    // Maksimal uzunlikni 13 ta belgiga cheklash
    if (sanitizedValue.length <= 13) {
      setOrderData({ ...orderData, phone: sanitizedValue });
    }
  };

  useEffect(() => {
    if (place == "web") {
      setActiveTab("delivery");
    }
  }, []);

  return (
    <div className="w-full flex flex-col">
      <div className="w-full md:space-y-2">
        <p className="text-[#A098AE] textSmall3 font-normal">
          {spotText("choose_spot")}
        </p>
        <div className="flex w-full justify-between pt-2">
          <p className="flex items-center textSmall3 font-bold md:gap-2">
            <Image
              src={location}
              alt="location"
              width={100}
              height={100}
              className="w-6 h-6 md:w-8 md:h-8"
            />
            {translateTextSpot(spotData?.response?.name, locale)?.split("-")[1]}{" "}
            {allT("spot")}
          </p>
        </div>
        <p className="text-[#A098AE] font-normal textSmall3 pt-2">
          {spotText("choose_table")}
        </p>
        <div className="flex w-full justify-between pt-2 md:gap-2">
          <p className="flex items-center textSmall3 font-bold leading-7">
            <Image
              src={location}
              alt="location"
              width={100}
              height={100}
              className="w-6 h-6 md:w-8 md:h-8"
            />
            {allT("table")} № {table_num}
          </p>
        </div>
        <p className="text-[#A098AE] font-normal textSmall3 pt-2">
          {profileT("phone")}
        </p>
        <div className="flex w-full justify-between pt-2 md:gap-2">
          {/* Telefon raqami uchun input */}
          <Input
            onChange={handleChangePhone}
            value={orderData?.phone || "+"} // "+" bilan boshlanadi
          />
        </div>
      </div>
    </div>
  );
};

export default Spot;
