"use client";
import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "use-intl";
import Delivery from "./delivery";
import Pickup from "./pickup";
import Spot from "./spot";

const CartSidebar = () => {
  const cart = useTranslations("Cart");
  const deliveryText = useTranslations("Cart.Delivery");
  const pickupText = useTranslations("Cart.Pickup");
  const spot = useTranslations("Cart.Spot");
  const delivery = [
    {
      id: 1,
      title: deliveryText("title"),
    },
    {
      id: 2,
      title: pickupText("title"),
    },
    {
      id: 3,
      title: spot("title"),
    },
  ];

  const [activeTab, setActiveTab] = useState(1);
  const customComponent = (id) => {
    switch (id) {
      case 1:
        return <Delivery />;
      case 2:
        return <Pickup />;
      case 3:
        return <Spot />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <section className="w-full flex items-center gap-6 rounded-md border p-1">
        {delivery.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`${
              activeTab == item.id ? "text-white" : "text-primary"
            } transition-all duration-300 ease-linear w-[33%] rounded-[6px] cursor-pointer relative py-3 flex justify-center items-center gap-[8px] font-medium`}
          >
            <h1 className="relative z-10 textSmall2">{item.title}</h1>
            {activeTab === item.id && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 bg-primary rounded-[6px]"
              />
            )}
          </div>
        ))}
      </section>
      {/* Fixed overflow logic */}
      <section className="px-10">
        <div className="">{customComponent(activeTab)}</div>
      </section>
    </div>
  );
};

export default CartSidebar;
