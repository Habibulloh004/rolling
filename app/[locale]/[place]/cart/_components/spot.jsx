import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { translateTextSpot } from "@/lib/utils";
import { location, pencil } from "@/public";
import Image from "next/image";
import React from "react";
import { useTranslations } from "use-intl";

const Spot = ({ locale, spotData, searchParamsData }) => {
  const spotText = useTranslations("Cart.Spot");
  const allT = useTranslations("All");
  const { spot, table_id, table_num, service } = searchParamsData;

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
          {/* <Button
            className={
              "h-8 max-sm:text-[12px] md:h-10 px-4 md:px-5 bg-transparent text-[#004032] shadow-none border-[1px] rounded-[8px] border-[#004032]"
            }
          >
            {all("choose")}
          </Button> */}
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
          {/* <Button
            className={
              "h-8 max-sm:text-[12px] md:h-10 px-4 md:px-5 bg-transparent text-[#004032] shadow-none border-[1px] rounded-[8px] border-[#004032]"
            }
          >
            {all("choose")}
          </Button> */}
        </div>
      </div>
    </div>
  );
};

export default Spot;
