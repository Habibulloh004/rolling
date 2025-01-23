"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "use-intl";
import Delivery from "./delivery";
import Pickup from "./pickup";
import Spot from "./spot";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/store";
import Cookies from "js-cookie";
import { getClientData, getSpotsData } from "@/actions";

const CartSidebar = ({ locale, place, spotData, searchParamsData, auth }) => {
  const deliveryText = useTranslations("Cart.Delivery");
  const pickupText = useTranslations("Cart.Pickup");
  const spot = useTranslations("Cart.Spot");
  const { setActiveTab, activeTab } = useStore();
  const [clientData, setClientData] = useState(null);
  const [branchsData, setBranchesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleTabChange = (value) => {
    console.log("Selected Tab:", value);
    setActiveTab(value);
    setOrderData((prevData) => ({
      ...prevData,
      service_mode: (() => {
        switch (value) {
          case "delivery":
            return 3;
          case "pickup":
            return 2;
          case "spot":
            return 2;
          default:
            return 3;
        }
      })(),
    }));
  };

  useEffect(() => {
    if (place == "web" && activeTab == "spot") {
      setActiveTab("delivery");
    } else if (
      (activeTab == "pickup" || activeTab == "delivery") &&
      place == "branch"
    ) {
      setActiveTab("spot");
    }
  }, [place]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getClientData(Number(auth.client_id));
        const spots = await getSpotsData();
        console.log(spots, "spots");

        setClientData(response[0]);
        setBranchesData(spots);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };
    if (auth) {
      fetchData();
    }
  }, [auth]);

  return (
    <div className="">
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
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
          <Delivery
            locale={locale}
            clientData={clientData}
            spotData={spotData}
            auth={auth}
            place={place}
          />
        </TabsContent>
        <TabsContent className="md:px-10" value="pickup">
          <Pickup
            locale={locale}
            isLoading={isLoading}
            clientData={clientData}
            auth={auth}
            branchsData={branchsData}
          />
        </TabsContent>
        <TabsContent className="md:px-10" value="spot">
          <Spot
            locale={locale}
            spotData={spotData}
            searchParamsData={searchParamsData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CartSidebar;
