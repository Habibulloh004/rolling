"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useTranslations } from "use-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useOrderStore, useStore } from "@/store";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

const Delivery = ({ locale, auth, clientData, place }) => {
  const [addressData, setAddressData] = useState([]);
  const deliveryText = useTranslations("Cart.Delivery");
  const profileT = useTranslations("Profile");
  const cartText = useTranslations("Cart");
  const all = useTranslations("All");
  const { orderData, setOrderData, paymentData } = useOrderStore();
  const [modalAdd, setModalAdd] = useState(false);
  const { setActiveTab } = useStore();

  const handleSelectAddress = (address) => {
    setModalAdd(false);
    setOrderData({
      ...orderData,
      address: address?.address,
      lat: address?.lat,
      lng: address?.lng,
      client_addresses_id: address?.id,
      address_comment: address?.comment,
    });
  };

  useEffect(() => {
    if (place == "branch") {
      setActiveTab("spot");
    }
    const address = localStorage.getItem("myAddresses")
      ? JSON.parse(localStorage.getItem("myAddresses"))
      : [];

    if (address?.length) {
      setAddressData(address);
    }
  }, []);

  const handleSelectModal = () => {
    setModalAdd(true);
  };

  const handleChangePhone = (value) => {
    setOrderData({ ...orderData, phone: value });
  };

  useEffect(() => {
    if (addressData && addressData?.length > 0) {
      const savedOrderData =
        JSON.parse(localStorage.getItem("orderData")) || null;
      if (!savedOrderData?.client_addresses_id) {
        setOrderData({
          ...orderData,
          address: addressData[0]?.address || "",
          lat: Number(addressData[0]?.lat || 0),
          lng: Number(addressData[0]?.lng || 0),
          client_addresses_id: addressData[0]?.id,
          address_comment: addressData[0]?.comment || "",
        });
      }
    }
  }, [addressData, setOrderData]);

  return (
    <div className="w-full flex flex-col">
      <div className="w-full space-y-2 md:space-y-4">
        <p className="text-[#A098AE] font-normal textSmall3">
          {deliveryText("address")}
        </p>
        <div className="flex w-full justify-between">
          <p className="flex items-center textSmall3 font-bold gap-2">
            <Image
              src={"/assets/Location.svg"}
              alt="location"
              width={100}
              height={100}
              className="w-6 h-6 md:w-8 md:h-8"
            />
            {orderData?.address ? orderData.address : cartText("empty_address")}
          </p>
          <Dialog open={modalAdd}>
            <DialogTrigger asChild>
              <Button
                onClick={handleSelectModal}
                className={
                  "h-8 max-sm:text-[12px] md:h-10 px-4 md:px-5 bg-transparent text-[#004032] shadow-none border-[1px] rounded-[8px] border-[#004032]"
                }
              >
                {all("edit")}
              </Button>
            </DialogTrigger>
            <DialogContent
              handleClose={() => setModalAdd(false)}
              mark="false"
              className="max-w-xl w-11/12 md:w-full rounded-md max-sm:px-3"
            >
              <DialogHeader className={""}>
                <DialogTitle className="w-full text-start lg:text-md text-base">
                  {deliveryText("selected_address")}
                </DialogTitle>
                <DialogDescription className="hidden">
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </DialogDescription>
              </DialogHeader>
              <main>
                <section className="space-y-3">
                  {addressData?.length > 0 ? (
                    <div className="space-y-2">
                      {addressData?.map((address, i) => (
                        <div
                          key={i}
                          className="w-full flex items-center justify-between gap-2 px-2 py-1 rounded-md border"
                        >
                          <p className="textSmall3 font-medium">
                            {address.address}
                          </p>
                          <Button
                            onClick={() => handleSelectAddress(address)}
                            className="hover:bg-primary-modal"
                          >
                            {all("choose")}
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[#A098AE] text-normal textSmall2">
                      {cartText("empty_address")}
                    </p>
                  )}
                  <div className="flex justify-end items-center w-full">
                    {!(paymentData && paymentData?.payment_id) && (
                      <Link href={`/${locale}/${place}/profile/address/add`}>
                        <Button
                          className={
                            "h-8 max-sm:w-full max-sm:text-[12px] md:h-10 px-4 md:px-5 bg-transparent text-[#004032] shadow-none border-[1px] rounded-[8px] border-[#004032]"
                          }
                        >
                          {all("add")}
                        </Button>
                      </Link>
                    )}
                  </div>
                </section>
              </main>
            </DialogContent>
          </Dialog>
        </div>
        {orderData?.address_comment && (
          <p className="text-[#A098AE] text-normal textSmall2">
            {orderData?.address_comment}
          </p>
        )}
        {!auth?.client_id && (
          <div>
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
                value={orderData?.phone}
                onChange={handleChangePhone}
                className={cn("input-phone-cart rounded-md w-full")}
                style={{ borderColor: "white" }}
                countryCallingCodeEditable={false}
                focusInputOnCountrySelection
              />
            </div>
          </div>
        )}
        <div className="flex w-full items-center justify-between pt-2 md:gap-2">
          <div className="w-full lg:w-2/3 flex flex-col gap-1">
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
            />
          </div>
        </div>
        <p className="text-[#A098AE] text-normal textSmall2 pt-2 leading-6">
          {all("add_comment_info")}
        </p>
      </div>
    </div>
  );
};

export default Delivery;
