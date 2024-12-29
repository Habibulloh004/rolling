import {
  aboutIcon,
  enIcon,
  mainIcon,
  reviewIcon,
  ruIcon,
  saveIcon,
  uzIcon,
} from "@/public";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const url = process.env.NEXT_PUBLIC_URL;
export const posterUrl = process.env.NEXT_PUBLIC_POSTER_URL;

export const getLocalizedCategoryName = (categoryName, locale) => {
  const parts = categoryName.split("***"); // Split by '***'
  const localeMap = {
    ru: parts[0], // Russian name (e.g., "Сеты")
    uz: parts[1], // Uzbek name (e.g., "Setlar")
    en: parts[2], // English name (e.g., "Sets")
  };

  return localeMap[locale] || parts[0]; // Default to Russian if locale is not found
}

export const navItems = [
  {
    id: 1,
    title: "main",
    icon: mainIcon,
    path: "/",
  },
  {
    id: 2,
    title: "news",
    icon: reviewIcon,
    path: "/news",
  },
  {
    id: 3,
    title: "saved",
    icon: saveIcon,
    path: "/saved",
  },
  {
    id: 4,
    title: "about-us",
    icon: aboutIcon,
    path: "/about-us",
  },
];
export const lngItems = [
  {
    id: 1,
    title: "Рус",
    icon: ruIcon,
    locale: "ru",
  },
  {
    id: 2,
    title: "Uzb",
    icon: uzIcon,
    locale: "uz",
  },
  {
    id: 3,
    title: "Eng",
    icon: enIcon,
    locale: "en",
  },
];
