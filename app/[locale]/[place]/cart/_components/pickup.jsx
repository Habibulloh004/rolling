import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useEffect } from "react";
import { useTranslations } from "use-intl";
import { useOrderStore, useStore } from "@/store";
import { Textarea } from "@/components/ui/textarea";
import { translateTextSpot, translateTextSpotAddress } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";

const Pickup = ({
  locale,
  auth,
  clientData,
  place,
  branchsData,
  isLoading,
}) => {
  const pickupText = useTranslations("Cart.Pickup");
  const profileT = useTranslations("Profile");
  const all = useTranslations("All");
  const { orderData, setOrderData } = useOrderStore();
  const { setActiveTab } = useStore();
  const pathname = usePathname();
  const handleSelectAddress = (spot) => {
    setOrderData({
      ...orderData,
      spot_name: spot?.name,
      spot_id: spot?.spot_id,
    });
  };

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
    if (place == "branch") {
      setActiveTab("spot");
    }
  }, [pathname]);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* <Products locale={locale} /> */}
      <div className="w-full space-y-3">
        <p className="text-[#A098AE] font-normal textSmall3">
          {pickupText("address")}
        </p>
        <section className="flex flex-col gap-2 rounded-md sm:border border-primary sm:p-3">
          {isLoading ? (
            // Skeleton loading view
            <>
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col w-full justify-between gap-2"
                >
                  <div
                    className={`w-full flex justify-between items-center gap-2 max-sm:p-1 max-sm:rounded-md max-sm:border-2`}
                  >
                    <div className="w-full flex flex-col items-start">
                      <Skeleton className="bg-primary-modal w-1/2 h-[20px] sm:h-[24px] rounded-full mb-2" />
                      <Skeleton className="bg-primary-modal w-10/12 h-[16px] sm:h-[16px] rounded-md" />
                    </div>
                    <Skeleton className="max-sm:hidden bg-primary-modal h-8 md:h-10 max-w-[100px] w-full rounded-md" />
                  </div>
                </div>
              ))}
            </>
          ) : (
            // Render branch data
            <>
              {branchsData?.map((spot, i) => {
                return (
                  <div
                    key={i}
                    className="flex flex-col w-full justify-between gap-1"
                  >
                    {/* Mobile */}
                    <div
                      onClick={() => handleSelectAddress(spot)}
                      className={`${
                        orderData?.spot_id == spot?.spot_id
                          ? "border-primary bg-primary-modal/10"
                          : ""
                      } sm:hidden flex justify-between items-center gap-2 max-sm:border-2 max-sm:rounded-md max-sm:p-1 active:border-primary max-sm:cursor-pointer`}
                    >
                      <div className="flex flex-col items-start">
                        <div className="flex items-center textSmall3 font-bold  leading-3 lg:leading-7">
                          <Image
                            src={`/assets/Location.svg`}
                            alt="location"
                            width={100}
                            height={100}
                            className="w-6 h-6 md:w-8 md:h-8"
                          />
                          {translateTextSpot(spot?.name, locale)}
                        </div>
                        <p className="text-[#A098AE] text-normal textSmall1">
                          {translateTextSpotAddress(spot?.address, locale)}
                        </p>
                      </div>
                    </div>
                    {/* Desktop */}
                    <div className="max-sm:hidden flex justify-between items-center gap-2 max-sm:border-2 max-sm:rounded-md max-sm:p-1 active:border-primary max-sm:cursor-pointer">
                      <div className="flex flex-col items-start">
                        <div className="flex items-center textSmall3 font-bold  leading-3 lg:leading-7">
                          <Image
                            src={`/assets/Location.svg`}
                            alt="location"
                            width={100}
                            height={100}
                            className="w-6 h-6 md:w-8 md:h-8"
                          />
                          {translateTextSpot(spot?.name, locale)}
                        </div>
                        <p className="text-[#A098AE] text-normal textSmall1">
                          {translateTextSpotAddress(spot?.address, locale)}
                        </p>
                      </div>
                      <Button
                        onClick={() => handleSelectAddress(spot)}
                        className={`${
                          orderData?.spot_id == spot?.spot_id
                            ? "bg-primary text-white"
                            : "text-primary bg-transparent"
                        } max-sm:hidden h-8 max-sm:text-[12px] md:h-10 px-4 md:px-5 shadow-none border-[1px] rounded-[8px] border-[#004032] max-w-[100px] w-full`}
                      >
                        {orderData?.spot_id == spot?.spot_id
                          ? all("selected")
                          : all("choose")}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </section>
      </div>
      <div>
        <p className="text-[#A098AE] font-normal textSmall3 pt-2">
          {profileT("phone")}
        </p>
        <div className="lg:w-2/3 flex w-full justify-between pt-2 md:gap-2">
          {/* Telefon raqami uchun input */}
          <Input
            onChange={handleChangePhone}
            value={orderData?.phone || "+"} // "+" bilan boshlanadi
          />
        </div>
      </div>
      <div className="flex w-full items-center justify-between pt-2 md:gap-2">
        <div className="w-full md:w-2/3 flex flex-col gap-1">
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
