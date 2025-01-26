import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, translateTextSpot } from "@/lib/utils";
import { useOrderStore, useStore } from "@/store";
import Image from "next/image";
import React, { useEffect } from "react";
import { useTranslations } from "use-intl";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
const Spot = ({ place, locale, spotData, searchParamsData }) => {
  const spotText = useTranslations("Cart.Spot");
  const allT = useTranslations("All");
  const profileT = useTranslations("Profile");
  const { spot, table_id, table_num, service } = searchParamsData;
  const { setActiveTab } = useStore();
  const { orderData, setOrderData } = useOrderStore();

  const handleChangePhone = (value) => {
    setOrderData({ ...orderData, phone: value });
  };

  useEffect(() => {
    if (place == "web") {
      setActiveTab("delivery");
    }
  }, []);

  return (
    <div className="w-full flex flex-col mb-3">
      <div className="w-full md:space-y-2">
        <p className="text-[#A098AE] textSmall3 font-normal">
          {spotText("choose_spot")}
        </p>
        <div className="flex w-full justify-between pt-2">
          <p className="flex items-center textSmall3 font-bold md:gap-2">
            <Image
              src={`/assets/Location.svg`}
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
              src={`/assets/Location.svg`}
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
        <div className="lg:w-2/3 flex w-full justify-between pt-2 md:gap-2">
          <PhoneInput
            country="UZ"
            defaultCountry="UZ"
             placeholder=""
            international
            withCountryCallingCode
            value={orderData?.phone || ""}
            onChange={handleChangePhone}
            className={cn("input-phone-cart rounded-md w-full")}
            style={{ borderColor: "white" }}
            countryCallingCodeEditable={false}
            focusInputOnCountrySelection
          />
        </div>
      </div>
    </div>
  );
};

export default Spot;
