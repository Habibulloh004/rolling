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
  const { setActiveTab } = useStore();
  const [clientData, setClientData] = useState(null);
  const [branchsData, setBranchesData] = useState([]);

  const handleTabChange = (value) => {
    console.log("Selected Tab:", value);
    setActiveTab(value);
  };

  useEffect(() => {
    if (place == "web") {
      setActiveTab("delivery");
    } else {
      setActiveTab("spot");
    }
  }, [place]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getClientData(Number(auth.client_id));
        const spots = await getSpotsData();
        console.log(spots,"spots");
        
        setClientData(response[0]);
        setBranchesData(spots);
      } catch (error) {}
    };
    if (auth) {
      fetchData();
    }
  }, [auth]);

  return (
    <div className="">
      <Tabs
        defaultValue={place == "web" ? "delivery" : "spot"}
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
