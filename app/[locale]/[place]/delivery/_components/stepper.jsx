import { Confirmation, Cooking, Delivered, Shipped } from "@/public";
import Image from "next/image";
import React from "react";

const Stepper = ({ currentStep }) => {
  const steps = [
    { id: 1, label: "Заказ подтверждён", icon: Confirmation },
    { id: 2, label: "Готовится", icon: Cooking },
    { id: 3, label: "Заказ доставляется", icon: Shipped },
    { id: 4, label: "Заказ доставлен", icon: Delivered },
  ];

  return (
    <div className="flex flex-col items-center relative">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-start gap-11">
          <Image
            src={step.icon}
            alt="image"
            width={32}
            height={32}
            className="w-8 h-7 relative -top-1"
          />

          <div className="flex flex-col items-center justify-center relative ">
            <div
              className={`w-4 h-4 flex justify-center items-center rounded-full duration-300 ${
                currentStep >= step.id
                  ? "bg-[#004032] h-5 w-5"
                  : "bg-[#00403280] w-4 h-4"
              }`}
            ></div>
            {/* Vertical Line */}
            {index !== steps.length - 1 && (
              <div
                className={`h-12 w-0.5 duration-300 ${
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
