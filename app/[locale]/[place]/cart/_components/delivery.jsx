import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { location, pencil } from "@/public";
import Image from "next/image";
import React from "react";
import { useTranslations } from "use-intl";
import Products from "./products";

const Delivery = ({ locale }) => {
  const deliveryText = useTranslations("Cart.Delivery");
  const all = useTranslations("All");
  return (
    <div className="w-full flex flex-col">
      {/* <Products locale={locale} /> */}
      <div className="w-full space-y-2 md:space-y-4">
        <p className="text-[#A098AE] font-normal textSmall3">
          {deliveryText("address")}
        </p>
        <div className="flex w-full justify-between">
          <p className="flex items-center textSmall3 font-bold leading-7 md:gap-2">
            <Image
              src={location}
              alt="location"
              width={100}
              height={100}
              className="w-6 h-6 md:w-8 md:h-8"
            />
            Дом 1
          </p>
          <Button
            className={
              "h-8 max-sm:text-[12px] md:h-10 px-4 md:px-5 bg-transparent text-[#004032] shadow-none border-[1px] rounded-[8px] border-[#004032]"
            }
          >
            {all("edit")}
          </Button>
        </div>  
        <p className="text-[#A098AE] text-normal textSmall2 pt-2">
          Яшнабадский р-й. Улица Боткина 1А дом №20
        </p>
        <div className="flex w-full items-center justify-between pt-2 md:gap-2">
          <div className="w-2/3 flex border-[1px] border-[#A098AE] rounded-[8px] pr-6">
            {" "}
            <Input
              type="text"
              placeholder={all("add_comment")}
              className={
                "text-[12px] md:text-sm max-md:h-8 border-none outline-none shadow-none focus:outline-none focus-visible:ring-0"
              }
            />{" "}
            <Image src={pencil} alt="pencil" width={16} height={16} />
          </div>
          <Button
            className={
              "h-8 max-sm:text-[12px] md:h-10 px-4 md:px-5 bg-transparent text-[#004032] shadow-none border-[1px] rounded-[8px] border-[#004032]"
            }
          >
            {all("save")}
          </Button>
        </div>
        <p className="text-[#A098AE] text-normal textSmall2 pt-2 leading-6">
          {all("add_comment_info")}
        </p>
      </div>
    </div>
  );
};

export default Delivery;
