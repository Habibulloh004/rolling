import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { location, pencil } from "@/public";
import Image from "next/image";
import React from "react";
import { useTranslations } from "use-intl";

const Spot = () => {
  const spotText = useTranslations("Cart.Spot");
  const all = useTranslations("All");
  return (
    <div className="w-full flex flex-col">
      <div className="w-full space-y-2">
        <p className="text-[#A098AE] font-normal">
          {spotText("choose_spot")}
        </p>
        <div className="flex w-full justify-between pt-2">
          <p className="flex items-center text-lg font-bold leading-7">
            <Image src={location} alt="location" width={32} height={32} />
            Яккасарайский филиал
          </p>
          <Button
            className={
              "bg-transparent text-[#004032] shadow-none border-[1px] rounded-[8px] border-[#004032]"
            }
          >
            {all("choose")}
          </Button>
        </div>
        <p className="text-[#A098AE] font-normal leading-">
          {spotText("choose_table")}
        </p>
        <div className="flex w-full justify-between pt-2">
          <p className="flex items-center text-lg font-bold leading-7">
            <Image src={location} alt="location" width={32} height={32} />5 стол
          </p>
          <Button
            className={
              "bg-transparent text-[#004032] shadow-none border-[1px] rounded-[8px] border-[#004032]"
            }
          >
            Выбрать
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Spot;
