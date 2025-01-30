"use client";

import { getUrl } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const ErrorPage = ({ code }) => {
  const all = useTranslations("All.Errors");
  const errorMessages = {
    404: {
      title: `404 - ${all("404_title")}`,
      message: all("404_desc"),
    },
    500: {
      title: `500 - ${all("500_title")}`,
      message: all("500_desc"),
    },
  };
  const { title, message } = errorMessages[code] || errorMessages[404];
  const pathname = usePathname();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#1A3D34] text-center p-2 md:p-4 text-white">
      <h1 className="text-xl md:text-5xl font-bold text-[#FFB400]">{title}</h1>
      <p className="md:text-lg text-gray-300 mt-4">{message}</p>
      <Link
        href={`${getUrl(pathname)}`}
        className="mt-6 px-3 md:px-6 md:py-3 py-2 text-sm bg-[#FF4500] text-white rounded-lg hover:bg-[#D93800] transition"
      >
        {all("redirect")}
      </Link>
    </div>
  );
};

export default ErrorPage;
