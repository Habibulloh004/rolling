import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { location, pencil } from "@/public";
import Image from "next/image";
import React from "react";
import { useTranslations } from "use-intl";
import Products from "./products";

const Pickup = ({ locale }) => {
  const pickupText = useTranslations("Cart.Pickup");
  const all = useTranslations("All");
  return (
    <div className="w-full flex flex-col gap-6">
      {/* <Products locale={locale} /> */}
      <div className="w-full space-y-3">
        <p className="text-[#A098AE] font-normal textSmall3">
          {pickupText("address")}
        </p>
        <section className="flex flex-col gap-2 rounded-md border border-primary p-3">
          <div className="flex flex-col w-full justify-between gap-1">
            <div className="flex justify-between items-center gap-2">
              <p className="flex items-center textSmall3 font-bold leading-7">
                <Image
                  src={location}
                  alt="location"
                  width={100}
                  height={100}
                  className="w-6 h-6 md:w-8 md:h-8"
                />
                Яккасарайский филиал
              </p>
              <Button
                className={
                  "h-8 max-sm:text-[12px] md:h-10 px-4 md:px-5 bg-transparent text-[#004032] shadow-none border-[1px] rounded-[8px] border-[#004032]"
                }
              >
                {all("choose")}
              </Button>
            </div>
            <p className="text-[#A098AE] text-normal textSmall1">
              Яшнабадский р-й. Улица Боткина 1А дом №20
            </p>
          </div>
          <div className="flex flex-col w-full justify-between gap-1">
            <div className="flex justify-between items-center gap-2">
              <p className="flex items-center textSmall3 font-bold leading-7">
                <Image
                  src={location}
                  alt="location"
                  width={100}
                  height={100}
                  className="w-6 h-6 md:w-8 md:h-8"
                />
                Яккасарайский филиал
              </p>
              <Button
                className={
                  "h-8 max-sm:text-[12px] md:h-10 px-4 md:px-5 bg-transparent text-[#004032] shadow-none border-[1px] rounded-[8px] border-[#004032]"
                }
              >
                {all("choose")}
              </Button>
            </div>
            <p className="text-[#A098AE] text-normal textSmall1">
              Яшнабадский р-й. Улица Боткина 1А дом №20
            </p>
          </div>
          <div className="flex flex-col w-full justify-between gap-1">
            <div className="flex justify-between items-center gap-2">
              <p className="flex items-center textSmall3 font-bold leading-7">
                <Image
                  src={location}
                  alt="location"
                  width={100}
                  height={100}
                  className="w-6 h-6 md:w-8 md:h-8"
                />
                Яккасарайский филиал
              </p>
              <Button
                className={
                  "h-8 max-sm:text-[12px] md:h-10 px-4 md:px-5 bg-transparent text-[#004032] shadow-none border-[1px] rounded-[8px] border-[#004032]"
                }
              >
                {all("choose")}
              </Button>
            </div>
            <p className="text-[#A098AE] text-normal textSmall1">
              Яшнабадский р-й. Улица Боткина 1А дом №20
            </p>
          </div>
        </section>
      </div>
      <div className="flex w-full items-center justify-between pt-2 gap-2">
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
    </div>
  );
};

export default Pickup;
