import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { location, pencil } from "@/public";
import Image from "next/image";
import React, { useEffect } from "react";
import { useTranslations } from "use-intl";
import Products from "./products";
import { useOrderStore } from "@/store";
import { Textarea } from "@/components/ui/textarea";
import { translateTextSpot } from "@/lib/utils";

const Pickup = ({ locale, auth, clientData, place, branchsData }) => {
  const pickupText = useTranslations("Cart.Pickup");
  const all = useTranslations("All");
  const { orderData, setOrderData } = useOrderStore();

  const handleSelectAddress = (address) => {
    setOrderData({
      ...orderData,
      address: address?.address1,
      lat: address?.lat,
      lng: address?.lng,
      client_addresses_id: address?.id,
      address_comment: address?.comment,
    });
  };
  console.log({ branchsData });

  return (
    <div className="w-full flex flex-col gap-6">
      {/* <Products locale={locale} /> */}
      <div className="w-full space-y-3">
        <p className="text-[#A098AE] font-normal textSmall3">
          {pickupText("address")}
        </p>
        <section className="flex flex-col gap-2 rounded-md border border-primary p-3">
          {branchsData?.map((spot, i) => {
            return (
              <div
                key={i}
                className="flex flex-col w-full justify-between gap-1"
              >
                <div className="flex justify-between items-center gap-2">
                  <p className="flex items-center textSmall3 font-bold leading-7">
                    <Image
                      src={location}
                      alt="location"
                      width={100}
                      height={100}
                      className="w-6 h-6 md:w-8 md:h-8"
                    />
                    {translateTextSpot(spot?.name)}
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
            );
          })}
        </section>
      </div>
      <div className="flex w-full items-center justify-between pt-2 md:gap-2">
        <div className="w-2/3 flex flex-col gap-1">
          <p className="text-[#A098AE] font-normal textSmall3">
            {all("add_comment")}
          </p>
          <Textarea
            type="text"
            value={orderData?.comment || ""}
            onChange={(e) =>
              setOrderData({
                ...orderData,
                comment: e.target.value,
              })
            }
            placeholder={all("add_comment_pls")}
            className={
              "text-[12px] md:text-sm max-md:h-8 border-2 focus-visible:ring-0 focus:border-primary"
            }
          />{" "}
        </div>
      </div>
    </div>
  );
};

export default Pickup;
