import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { location, pencil } from "@/public";
import Image from "next/image";
import React from "react";
import { useTranslations } from "use-intl";

const Delivery = () => {
  const deliveryText = useTranslations("Cart.Delivery");
  const all = useTranslations("All");
  return (
    <div className="w-full flex flex-col">
      <div className="w-full">
        <p className="text-[#A098AE] font-normal leading-">
          {deliveryText("address")}
        </p>
        <div className="flex w-full justify-between pt-2">
          <p className="flex items-center text-lg font-bold leading-7 gap-2">
            <Image src={location} alt="location" width={32} height={32} />
            Дом 1
          </p>
          <Button
            className={
              "bg-transparent text-[#004032] shadow-none border-[1px] rounded-[8px] border-[#004032]"
            }
          >
            {all("edit")}
          </Button>
        </div>
        <p className="text-[#A098AE] text-normal text-sm pt-2">
          Яшнабадский р-й. Улица Боткина 1А дом №20
        </p>
        <div className="flex w-full items-center justify-between pt-2 mt-10">
          <div className="w-2/3 flex border-[1px] border-[#A098AE] rounded-[8px] px-6">
            {" "}
            <Input
              type="text"
              placeholder={all("add_comment")}
              className={
                "border-none outline-none shadow-none focus:outline-none focus-visible:ring-0"
              }
            />{" "}
            <Image src={pencil} alt="pencil" width={16} height={16} />
          </div>
          <Button
            className={
              "bg-transparent text-[#004032] shadow-none border-[1px] rounded-[8px] border-[#004032]"
            }
          >
            {all("save")}
          </Button>
        </div>
        <p className="text-[#A098AE] text-normal text-sm pt-2 leading-6">
          {all("add_comment_info")}
        </p>
      </div>
    </div>
  );
};

export default Delivery;
