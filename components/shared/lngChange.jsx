"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { lngItems } from "@/lib/utils";
import { useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import Image from "next/legacy/image";

const LngChange = () => {
  const locale = useLocale();
  const pathName = usePathname();
  const findLocale = lngItems.find((item) => item.locale == locale);
  const router = useRouter(); // Next.js router
  return (
    <Select
      defaultValue={findLocale.id}
      onValueChange={(selectedValue) => {
        const selectedLocale = lngItems.find(
          (item) => item.id == selectedValue
        );
        if (selectedLocale) {
          router.replace(pathName, {
            locale: selectedLocale.locale,
          });
        }
      }}
    >
      <SelectTrigger className="bg-white text-black border-none w-20 focus:outline-none cursor-pointer">
        <SelectValue asChild>
          <Image
            src={findLocale.icon.src}
            alt={findLocale.title}
            width={25}
            height={25}
          />
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="z-[999]">
        {lngItems.map((item) => (
          <SelectItem key={item.locale} value={item.id}>
            <Link
              href={`${pathName}`}
              locale={item.locale}
              className="flex items-center pr-6 py-1.5 gap-2"
            >
              <Image
                src={item.icon.src}
                alt={item.title}
                width={25}
                height={25}
              />
              <span
                className={item.locale === "ru" ? "text-[13px]" : "text-sm"}
              >
                {item.title}
              </span>
            </Link>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LngChange;
