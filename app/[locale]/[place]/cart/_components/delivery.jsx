import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { location, pencil } from "@/public";
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
import { toast } from "sonner";

const Delivery = ({ locale, auth, clientData, place }) => {
  const deliveryText = useTranslations("Cart.Delivery");
  const all = useTranslations("All");
  const { orderData, setOrderData } = useOrderStore();
  const [modalAdd, setModalAdd] = useState(false);
  const { setActiveTab } = useStore();
  const handleSelectAddress = (address) => {
    setModalAdd(false);
    setOrderData({
      ...orderData,
      address: address?.address1,
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
  }, []);

  const handleSelectModal = () => {
    if (auth?.client_id) {
      setModalAdd(true);
    } else {
      toast.warning(
        <div className="w-full h-full flex justify-between items-center">
          {all("no_auth")}{" "}
          <Link
            href={`/${locale}/${place}/login`}
            className="bg-black text-white rounded-md px-2 py-1"
          >
            {all("sign_in")}
          </Link>
        </div>
      );
    }
  };

  useEffect(() => {
    if (clientData && clientData.addresses && clientData.addresses.length > 0) {
      const savedOrderData =
        JSON.parse(localStorage.getItem("orderData")) || null;

      if (!savedOrderData?.client_addresses_id) {
        setOrderData({
          ...orderData,
          address: clientData.addresses[0]?.address1 || "",
          lat: Number(clientData.addresses[0]?.lat || 0),
          lng: Number(clientData.addresses[0]?.lng || 0),
          client_addresses_id: clientData.addresses[0]?.id,
          address_comment: clientData.addresses[0]?.comment || "",
        });
      }
    }
  }, [clientData, setOrderData]);

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
            {orderData?.address ? orderData.address : "addres mavjud emas"}
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
                <DialogTitle>Manzilni tanlang</DialogTitle>
                <DialogDescription className="hidden">
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </DialogDescription>
              </DialogHeader>
              <main>
                {auth ? (
                  <section className="space-y-3">
                    <div className="space-y-2">
                      {clientData?.addresses.map((address, i) => (
                        <div
                          key={i}
                          className="w-full flex items-center justify-between gap-2 px-2 py-1 rounded-md border"
                        >
                          <p className="textSmall3 font-medium">
                            {address.address1}
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
                    <div className="flex justify-end items-center w-full">
                      <Link href={`/${locale}/${place}/profile/address/add`}>
                        <Button
                          className={
                            "h-8 max-sm:w-full max-sm:text-[12px] md:h-10 px-4 md:px-5 bg-transparent text-[#004032] shadow-none border-[1px] rounded-[8px] border-[#004032]"
                          }
                        >
                          {all("add")}
                        </Button>
                      </Link>
                    </div>
                  </section>
                ) : (
                  <h1 className="text-thin">
                    Tizimga kirmagansiz.{" "}
                    <Link
                      href={`/${locale}/${place}/login`}
                      className="font-bold underline text-blue-600"
                    >
                      Kirish
                    </Link>
                  </h1>
                )}
              </main>
            </DialogContent>
          </Dialog>
        </div>
        {orderData?.address_comment && (
          <p className="text-[#A098AE] text-normal textSmall2">
            {orderData?.address_comment}
          </p>
        )}
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
            {/* <Image src={pencil} alt="pencil" width={16} height={16} /> */}
          </div>
          {/* <Button
            className={
              "h-8 max-sm:text-[12px] md:h-10 px-4 md:px-5 bg-transparent text-[#004032] shadow-none border-[1px] rounded-[8px] border-[#004032]"
            }
          >
            {all("save")}
          </Button> */}
        </div>
        <p className="text-[#A098AE] text-normal textSmall2 pt-2 leading-6">
          {all("add_comment_info")}
        </p>
      </div>
    </div>
  );
};

export default Delivery;
