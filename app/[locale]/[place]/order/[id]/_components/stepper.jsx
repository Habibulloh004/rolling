"use client";

import Image from "next/image";
import React from "react";
import { useTranslations } from "use-intl";

const Stepper = ({ currentStep }) => {
  const statusData = useTranslations("Order.OrderStatus");
  const steps = [
    {
      id: 1,
      label: statusData("confirmed"),
      icon: "/assets/Confirmation.webp",
    },
    { id: 2, label: statusData("cooking"), icon: "/assets/Cooking.webp" },
    { id: 3, label: statusData("in-deliver"), icon: "/assets/Shipped.png" },
    { id: 4, label: statusData("finished"), icon: "/assets/Delivered.webp" },
  ];

  return (
    <div className="max-w-xl w-full flex flex-col items-center justify-center relative">
      {steps.map((step, index) => (
        <div key={step.id} className="w-full grid grid-cols-3 gap-5">
          <div className="w-full flex justify-end">
            <Image
              src={step.icon}
              alt="image"
              width={100}
              height={100}
              className="h-12 w-12 -top-4 relative"
            />
          </div>
          <div className="w-full flex flex-col items-center justify-start relative ">
            <div
              className={`w-4 h-4 flex justify-center items-center rounded-full duration-300 ${
                currentStep >= step.id
                  ? "bg-[#004032] w-5 h-5"
                  : "bg-[#00403280] w-5 h-5"
              } ${currentStep == step.id && "w-6 h-6"}`}
            ></div>
            {/* Vertical Line */}
            {index !== steps.length - 1 && (
              <div
                className={`h-16 w-0.5 duration-300 ${
                  currentStep > step.id
                    ? "bg-[#004032]"
                    : "bg-transparent border-none"
                }`}
                style={{
                  backgroundImage:
                    currentStep <= step.id
                      ? "linear-gradient(to bottom, #004032 25%, transparent 25%)"
                      : "none",
                  backgroundSize: "1px 8px", // Nuqtalar orasidagi masofa
                  backgroundRepeat: "repeat-y",
                }}
              />
            )}
          </div>

          <div className="">
            <p className="text-start text-sm">{step.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stepper;
