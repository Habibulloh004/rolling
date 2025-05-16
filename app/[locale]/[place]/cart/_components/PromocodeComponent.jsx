"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { BadgeCheck, ChevronRight, Ticket, X } from "lucide-react";
import { useOrderStore, useProductStore } from "@/store";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { formatNumber, getLocalizedProduct, posterUrl } from "@/lib/utils";
import Image from "next/image";

export default function PromoCodeDialog({ locale, promotions, productsData }) {
  const promocodeT = useTranslations("Order.Promocode");
  const all = useTranslations("All");
  const [promoCode, setPromoCode] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { orderData, setOrderData, totalSum } = useOrderStore();
  const { products, setProductsData } = useProductStore();
  const [error, setError] = useState(null);
  const [hovered, setHovered] = useState(true);
  const [addingProducts, setAddingProducts] = useState([]);

  const handleRemovePromo = () => {
    setOrderData({ ...orderData, promocode: null });
    setProductsData(products?.filter((product) => !product?.promocode));
    setPromoCode("");
    setIsOpen(false);
    setHovered(false);
    toast(promocodeT("success_del"), {
      type: "success",
      duration: 2000,
    });
  };

  const handleApply = () => {
    if (!promoCode) {
      setError({
        title: promocodeT("input_pls"),
        type: "invalid_code",
      });
      return;
    }
    if (orderData?.promocode) {
      setError({
        title: promocodeT("already_use"),
        type: "invalid_code",
      });
      return;
    }
    const findPromo = promotions.find((promo) => {
      const promoCodeFind = promo?.name?.split("$")[1];
      if (
        String(promoCodeFind).toLowerCase().trim() ===
        String(promoCode).toLowerCase().trim()
      ) {
        return true;
      }
      return false;
    });

    if (findPromo) {
      const filterProducts = productsData
        ?.filter((product) => {
          const findProduct = findPromo?.params?.bonus_products?.find(
            (pr) => pr?.id === product?.product_id
          );
          return !!findProduct;
        })
        ?.map((prd) => ({
          ...prd,
          promocode: findPromo,
          count: findPromo?.params?.bonus_products_pcs,
        }));
      console.log(filterProducts);
      if (totalSum >= findPromo?.params?.conditions[0]?.sum / 100) {
        setAddingProducts(filterProducts);

        setProductsData([...products, ...filterProducts]);
        setError(null);
        setOrderData({ ...orderData, promocode: findPromo });
        toast(promocodeT("success"), {
          type: "success",
          duration: 2000,
        });
        setPromoCode("");
        setHovered(false);
      } else {
        setError({
          title: `${(
            findPromo?.params?.conditions[0]?.sum / 100
          )?.toLocaleString()} ${promocodeT("error_min_sum")}`,
          type: "not_enough_price",
        });
      }
    } else {
      setError({
        title: promocodeT("error"),
        type: "invalid_code",
      });
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setError(null);
  };

  useEffect(() => {
    if (orderData?.promocode) {
      if (totalSum < orderData?.promocode?.params?.conditions[0]?.sum / 100) {
        handleRemovePromo();
      }
    }
  }, [totalSum]);

  return (
    <div className="space-y-2 md:space-y-4">
      <Dialog open={isOpen} onOpenChange={() => {}}>
        <DialogTrigger asChild>
          {orderData?.promocode ? (
            <div
              className="relative group"
              onClick={() => setHovered(!hovered)}
            >
              <Button
                variant="outline"
                className="bg-[#F5F5F5] w-full h-12 flex justify-center items-center gap-1 border-[1px] rounded-xl space-x-2"
              >
                <div className="flex justify-start items-center gap-2">
                  <div>
                    <BadgeCheck className="w-full text-green-500" size={48} />
                  </div>
                  <h1 className="text-green-700 font-medium">
                    {promocodeT("active_promo")}
                  </h1>
                </div>
              </Button>

              <AnimatePresence>
                {hovered && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-2 right-2 flex items-center gap-1 bg-white shadow-md px-2 py-1 rounded-md cursor-pointer border hover:bg-red-100"
                    onClick={handleRemovePromo}
                  >
                    <X className="text-red-500" size={20} />
                    <span className="text-sm text-red-600 font-semibold">
                      {promocodeT("cancel")}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Button
              onClick={() => setIsOpen(true)}
              variant="outline"
              className="bg-[#F5F5F5] w-full h-10 md:h-12 flex justify-center items-center gap-1 border-[1px] rounded-xl space-x-2"
            >
              <div className="flex justify-start items-center gap-2">
                <div className="transform rotate-45">
                  <Ticket className="w-full text-3xl" size={48} />
                </div>
                <h1>{promocodeT("title")}</h1>
              </div>
              <div className="text-[#2E2E2E]">
                <ChevronRight />
              </div>
            </Button>
          )}
        </DialogTrigger>

        <DialogContent
          handleClose={handleClose}
          mark="false"
          className="max-w-md w-11/12"
        >
          <DialogHeader>
            <DialogTitle className="text-2xl w-full text-start">
              {addingProducts?.length > 0 ? (
                <h1>{promocodeT("titleDialogAdd")}</h1>
              ) : (
                <h1>{promocodeT("titleDialog")}</h1>
              )}
            </DialogTitle>
            <DialogDescription />
          </DialogHeader>
          {addingProducts?.length > 0 ? (
            <>
              <div className="overflow-y-scroll flex flex-col w-full simple-scrollbar gap-5">
                {addingProducts
                  ?.slice()
                  ?.reverse()
                  ?.map((item, i) => {
                    const localizedName = getLocalizedProduct(
                      item?.product_production_description,
                      locale,
                      "name"
                    );
                    return (
                      <div
                        key={item.product_id}
                        className="flex gap-2 md:gap-4 mr-4"
                      >
                        <Image
                          src={
                            item?.photo_origin
                              ? `${posterUrl}${item.photo_origin}`
                              : "/empty.jpg"
                          }
                          alt="product"
                          width={100}
                          height={100}
                          className="border max-sm:w-20 max-sm:h-20 object-cover aspect-square rounded-md col-span-2 row-span-2"
                        />
                        <div className="w-full flex flex-col justify-between min-h-16 md:min-h-20 gap-2 md:gap-4 relative">
                          <div className="w-full row-span-1 h-full flex items-start justify-between gap-y-3 gap-1">
                            <p className="font-semibold textSmall3">
                              {localizedName}
                            </p>
                          </div>
                          <div className="col-span-3 row-span-1 flex justify-between item-start sm:items-center">
                            <p className="font-semibold textSmall2 leading-5 w-full">
                              {item?.price["1"]
                                ? `${formatNumber(item.price["1"] / 100)} ${all(
                                    "sum"
                                  )}`
                                : "Price not available"}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
              <Button
                onClick={() => {
                  setAddingProducts([]);
                  setIsOpen(false);
                }}
                className="w-full h-12"
              >
                OK
              </Button>
            </>
          ) : (
            <>
              {/* Input */}
              <div className="space-y-1">
                <Input
                  placeholder={promocodeT("input_pls")}
                  value={promoCode}
                  className={`h-12 ${
                    error ? "border-red-500 focus-visible:ring-red-500" : ""
                  }`}
                  onChange={(e) => {
                    setPromoCode(e.target.value);
                    setError(null);
                  }}
                />

                {/* Error chiqishi */}
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.25 }}
                      className="text-sm text-red-500 font-medium"
                    >
                      {error.title}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <Button onClick={handleApply} className="w-full h-12">
                {promocodeT("submit_btn")}
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
