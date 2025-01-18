"use client";

import Image from "next/image";
import React from "react";
import { useTranslations } from "use-intl";

const Stepper = ({ currentStep }) => {
  const statusData = useTranslations("Order.OrderStatus");
  const steps = [
    { id: 1, label: statusData("confirmed"), icon: "/assets/Confirmation.svg" },
    { id: 2, label: statusData("cooking"), icon: "/assets/Cooking.svg" },
    { id: 3, label: statusData("in-deliver"), icon: "/assets/Shipped.svg" },
    { id: 4, label: statusData("finished"), icon: "/assets/Delivered.svg" },
  ];

  return (
    <div className="w-full flex flex-col items-center relative">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-start gap-10">
          <Image
            src={step.icon}
            alt="image"
            width={100}
            height={100}
            className="h-12 -top-4 relative"
          />

          <div className="flex flex-col items-center justify-center relative ">
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

          <div className="w-48">
            <p className="text-start text-sm">{step.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stepper;
