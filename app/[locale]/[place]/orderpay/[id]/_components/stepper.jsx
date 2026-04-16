"use client";

import Image from "next/image";
import React from "react";
import { useTranslations } from "use-intl";

const Stepper = ({ currentStep, isCancelled = false, orderType = "delivery", paymentType = "cash" }) => {
  const statusData = useTranslations("Order.OrderStatus");
  const deliverySteps = [
    {
      id: 1,
      label: statusData("pending"),
      icon: "/assets/Confirmation.webp",
    },
    {
      id: 2,
      label: statusData("confirmed"),
      icon: "/assets/Confirmation.webp",
    },
    { id: 3, label: statusData("cooking"), icon: "/assets/Cooking.webp" },
    { id: 4, label: statusData("in-deliver"), icon: "/assets/Shipped.png" },
    { id: 5, label: statusData("finished"), icon: "/assets/Delivered.webp" },
  ];
  const takeawaySteps = [
    {
      id: 1,
      label: statusData("pending"),
      icon: "/assets/Confirmation.webp",
    },
    {
      id: 2,
      label: statusData("confirmed"),
      icon: "/assets/Confirmation.webp",
    },
    { id: 3, label: statusData("cooking"), icon: "/assets/Cooking.webp" },
    { id: 4, label: statusData("ready-pickup"), icon: "/assets/Shipped.png" },
    { id: 5, label: statusData("taken"), icon: "/assets/Delivered.webp" },
  ];
  const spotSteps = [
    {
      id: 1,
      label: statusData("pending"),
      icon: "/assets/Confirmation.webp",
    },
    {
      id: 2,
      label: statusData("confirmed"),
      icon: "/assets/Confirmation.webp",
    },
    { id: 3, label: statusData("cooking"), icon: "/assets/Cooking.webp" },
    { id: 4, label: statusData("finished"), icon: "/assets/Delivered.webp" },
  ];

  const normalizedType = String(orderType || "").toLowerCase();
  const isDelivery = normalizedType.includes("delivery");
  const isTakeaway =
    normalizedType.includes("take_away") || normalizedType.includes("pickup");
  const steps = isDelivery ? deliverySteps : isTakeaway ? takeawaySteps : spotSteps;

  const isOnlinePayment = paymentType === "click" || paymentType === "payme";

  if (isCancelled) {
    return (
      <div className="max-w-xl w-full flex items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 to-white px-4 py-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full border border-red-200 bg-red-100 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-5 w-5 text-red-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="8.5" />
                <path d="M9.5 9.5L14.5 14.5M14.5 9.5L9.5 14.5" />
              </svg>
            </div>
            <div className="flex flex-col">
              <p className="text-[15px] font-semibold text-red-600 leading-5">
                {statusData("cancelled")}
              </p>
            </div>
          </div>

          {isOnlinePayment && (
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-5 w-5 flex-shrink-0 text-amber-500 mt-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p className="text-[13px] text-amber-800 leading-5">
                {statusData("refund_notice")}
              </p>
            </div>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            {steps.map((step) => (
              <span
                key={step.id}
                className="rounded-full border border-red-100 bg-white px-2.5 py-1 text-[11px] text-red-400 line-through"
              >
                {step.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl w-full flex flex-col items-center justify-center relative">
      {steps.map((step, index) => (
        <div key={step.id} className="w-full grid grid-cols-5 gap-5">
          <div className="w-full flex justify-end col-span-2">
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
