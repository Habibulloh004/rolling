"use client";
import React, { useEffect } from "react";
import { useTranslations } from "use-intl";
import Delivery from "./delivery";
import Pickup from "./pickup";
import Spot from "./spot";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CartSidebar = ({ locale, place }) => {
  const cart = useTranslations("Cart");
  const deliveryText = useTranslations("Cart.Delivery");
  const pickupText = useTranslations("Cart.Pickup");
  const spot = useTranslations("Cart.Spot");
  console.log({ place });

  useEffect(() => {
    if (place == "web") {
    }
  }, [place]);

  return (
    <div className="">
      <Tabs
        defaultValue={place == "web" ? "delivery" : "spot"}
        className="w-full"
      >
        <TabsList className="w-full bg-transparent min-h-8 md:min-h-10 border p-1">
          <TabsTrigger
            disabled={place != "web"}
            className="w-full h-8 md:h-10 textSmall2"
            value="delivery"
          >
            {deliveryText("title")}
          </TabsTrigger>
          <TabsTrigger
            disabled={place != "web"}
            className="w-full h-8 md:h-10 textSmall2"
            value="pickup"
          >
            {pickupText("title")}
          </TabsTrigger>
          <TabsTrigger
            disabled={place == "web"}
            className="w-full h-8 md:h-10 textSmall2"
            value="spot"
          >
            {spot("title")}
          </TabsTrigger>
        </TabsList>
        <TabsContent className="md:px-10" value="delivery">
          <Delivery locale={locale} />
        </TabsContent>
        <TabsContent className="md:px-10" value="pickup">
          <Pickup locale={locale} />
        </TabsContent>
        <TabsContent className="md:px-10" value="spot">
          <Spot locale={locale} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CartSidebar;
