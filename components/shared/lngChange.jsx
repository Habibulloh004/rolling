"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { lngItems } from "@/lib/utils"; // Til elementlari ro'yxati
import { useLocale } from "next-intl"; // Hozirgi tilni aniqlash uchun hook
import { usePathname, useRouter } from "@/i18n/routing"; // Router va Pathname uchun
import Image from "next/legacy/image"; // Rasm uchun komponent
import { useSearchParams } from "next/navigation"; // Query parametrlarni olish uchun

const LngChange = () => {
  const locale = useLocale(); // Hozirgi tilni olish
  const pathName = usePathname(); // Hozirgi URL'ni olish
  const findLocale = lngItems.find((item) => item.locale === locale); // Hozirgi til obyekti
  const router = useRouter(); // Router instance
  const searchParams = useSearchParams(); // Query parametrlarni o'qish uchun

  // Query parametrlarni olish
  const spot = searchParams.get("spot");
  const table_id = searchParams.get("table_id");
  const table_num = searchParams.get("table_num");
  const service = searchParams.get("service");

  return (
    <Select
      defaultValue={findLocale?.id} // Hozirgi tilni avtomatik tanlash
      onValueChange={(selectedValue) => {
        const selectedLocale = lngItems.find((item) => item.id === selectedValue);
        if (selectedLocale) {
          // Mavjud query parametrlarini yangilash
          const updatedParams = new URLSearchParams(searchParams.toString());

          // Yangi URL hosil qilish
          const newUrl = `${pathName}?${updatedParams.toString()}`;

          // Sahifani yangilash
          router.replace(newUrl, {
            locale: selectedLocale.locale,
          });
        }
      }}
    >
      {/* Til tanlash trigger */}
      <SelectTrigger className="bg-foreground/5 md:bg-white xl:h-11 text-black border-none w-20 focus:outline-none cursor-pointer">
        <SelectValue asChild>
          <Image
            src={findLocale?.icon.src} // Hozirgi til ikonkasi
            alt={findLocale?.title} // Hozirgi til nomi
            width={25}
            height={25}
          />
        </SelectValue>
      </SelectTrigger>

      {/* Til tanlash variantlari */}
      <SelectContent className="z-[999]">
        {lngItems.map((item) => (
          <SelectItem key={item.locale} value={item.id}>
            <div className="flex items-center pr-6 py-1.5 gap-2">
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
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LngChange;
