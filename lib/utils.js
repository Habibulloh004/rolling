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
export const posterToken = process.env.NEXT_PUBLIC_TOKEN;

export const getLocalizedCategoryName = (categoryName, locale) => {
  const parts = categoryName.split("***"); // Split by '***'
  const localeMap = {
    ru: parts[0], // Russian name (e.g., "Сеты")
    uz: parts[1], // Uzbek name (e.g., "Setlar")
    en: parts[2], // English name (e.g., "Sets")
  };

  return localeMap[locale] || parts[0]; // Default to Russian if locale is not found
};

export const formatTimestampToDate = (timestampMs) => {
  // Convert milliseconds to a Date object
  const date = new Date(timestampMs);
  
  // Format the date as YYYY-MM-DD
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

export const generateRandomFourDigitNumber = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

export const getUrl = (url) => {
  return url.split("/").slice(0, 3).join("/");
};

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

export const footItems = [
  {
    id: 1,
    title: "aboutUs",
    path: "/about-us",
  },
  {
    id: 2,
    title: "reviews",
    path: "/reviews",
  },
  {
    id: 3,
    title: "vacansies",
    path: "/vacansies",
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
