import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const url = process.env.NEXT_PUBLIC_URL;
export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
export const posterUrl = process.env.NEXT_PUBLIC_POSTER_URL;
export const posterToken = process.env.NEXT_PUBLIC_TOKEN;
export const hashSecretKey = process.env.NEXT_PUBLIC_SECRET_KEY;

export const formatCurrency = (value, decimalSeparator = ".") => {
  // Ensure the input is a number
  const number = parseFloat(value);
  if (isNaN(number)) return "Invalid number";

  // Split the number into integer and decimal parts
  const [integerPart, decimalPart] = number.toFixed(2).split(".");

  // Add spaces as thousand separators
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  // Combine integer and decimal parts with the specified decimal separator
  return `${formattedInteger}`;
  // return `${formattedInteger}${decimalSeparator}${decimalPart}`;
};

export const generateUrl = ({ locale, place, category, product }) => {
  return `/${locale}/${place}/category/${category}/product/${product}`;
};

export const getLocalizedCategoryName = (categoryName, locale) => {
  const parts = categoryName?.split("***"); // Split by '***'
  const localeMap = {
    ru: parts[0], // Russian name (e.g., "Сеты")
    uz: parts[1], // Uzbek name (e.g., "Setlar")
    en: parts[2], // English name (e.g., "Sets")
  };

  return localeMap[locale] || parts[0]; // Default to Russian if locale is not found
};

export const translateTextSpot = (name, locale) => {
  const Olmazor = `Rolling Sushi - Алмазар *** Rolling Sushi - Olmazor *** Rolling Sushi - Almazar`;
  const Yakkasaroy = `Rolling Sushi - Яккасарай *** Rolling Sushi - Yakkasaroy *** Rolling Sushi - Yakkasaray`;
  const MirzoUlugbek = `Rolling Sushi - Мирзо-Улугбек *** Rolling Sushi - Mirzo-Ulug'bek *** Rolling Sushi - Mirza-Ulugbek`;
  // const Olmazor = `
  // Добро пожаловать, <strong className="font-bold">в Rolling Sushi - Алмазар</strong> ***
  // Xush kelibsiz <strong className="font-bold">Rolling Sushi - Almazar</strong> ga ***
  // Welcome to <strong className="font-bold">Rolling Sushi - Olmazor</strong>`;

  // const Yakkasaroy = `
  // Добро пожаловать, в <strong className="font-bold">Rolling Sushi - Яккасарай</strong> ***
  // Xush kelibsiz <strong className="font-bold">Rolling Sushi - Yakkasaray</strong> ga ***
  // Welcome to <strong className="font-bold">Rolling Sushi - Yakkasaroy</strong>`;

  // const MirzoUlugbek = `
  // Добро пожаловать, в <strong className="font-bold">Rolling Sushi - Мирзо-Улугбек</strong> ***
  // Xush kelibsiz <strong className="font-bold">Rolling Sushi - Mirza-Ulug'bek</strong> ga ***
  // Welcome to <strong className="font-bold">Rolling Sushi - Mirzo-Ulugbek</strong>`;

  switch (name) {
    case "Rolling Sushi - Алмазар":
      return getLocalizedCategoryName(Olmazor, locale);
    case "Rolling Sushi - Яккасарай":
      return getLocalizedCategoryName(Yakkasaroy, locale);
    case "Rolling Sushi - Мирзо-Улугбек":
      return getLocalizedCategoryName(MirzoUlugbek, locale);
    default:
      return name;
  }
};

export const translateTextSpotAddress = (name, locale) => {
  const Olmazor = `улица Янги Олмазор 7, Ташкент, Ташкент. *** Yangi Olmazor ko'chasi 7, Тоshkent, Toshkent *** New Olmazor Street 7, Tashkent, Tashkent`;
  const Yakkasaroy = ` улица Боғистон, Ташкент, Ташкент. *** Bog'iston ko'chasi, Тоshkent, Toshkent. *** Bogiston Street, Tashkent, Tashkent.`;
  const MirzoUlugbek = `улица Олтинтепа 253, Ташкент, Ташкент. ***Oltintepa ko'chasi 253, Toshkent, Toshkent. *** Oltintepa Street 253, Tashkent, Tashkent.`;

  switch (name) {
    case "Боғистон кўчаси, Тоshkent, Toshkent":
      return getLocalizedCategoryName(Olmazor, locale);
    case "Yangi Olmazor ko'chasi 7, Тоshkent, Toshkent":
      return getLocalizedCategoryName(Yakkasaroy, locale);
    case "Oltintepa ko'chasi 253, Тоshkent, Toshkent":
      return getLocalizedCategoryName(MirzoUlugbek, locale);
    default:
      return name;
  }
};

export const formatCreatedAt = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Oylar 0 dan boshlanadi
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${day}.${month}.${year} ${hours}:${minutes}`;
};

export const getLocalizedProduct = (text, locale, type) => {
  const parts = text?.split("***"); // Split by '***'
  const descMap = {
    ru: parts[0], // Russian name (e.g., "Сеты")
    uz: parts[1], // Uzbek name (e.g., "Setlar")
    en: parts[2], // English name (e.g., "Sets")
  };
  const nameMap = {
    ru: parts[3], // Russian name (e.g., "Сеты")
    uz: parts[4], // Uzbek name (e.g., "Setlar")
    en: parts[5], // English name (e.g., "Sets")
  };
  if (type === "desc") {
    return descMap[locale] || parts[0];
  } else if (type === "name") {
    return nameMap[locale] || parts[0];
  }
};

export const extractKeywords = (productProductionDescription) => {
  const keywordsMatch = productProductionDescription.match(
    /<keywords>(.*?)<\/keywords>/
  );
  return keywordsMatch ? keywordsMatch[1].trim() : "";
};
export const extractDescription = (productProductionDescription) => {
  const descriptionMatch = productProductionDescription.match(
    /<description>(.*?)<\/description>/
  );
  return descriptionMatch ? descriptionMatch[1].trim() : "";
};

export const formatTimestampToDate = (timestampMs) => {
  // Convert milliseconds to a Date object
  const date = new Date(timestampMs);

  // Format the date as YYYY-MM-DD
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export function formatText(input) {
  return input
    .toLowerCase() // Kichik harflarga o'tkazish
    .replace(/[\d.,]+/g, "") // Raqamlarni va sonlarga tegishli belgilarni olib tashlash
    .replace(/\b(pcs|dona|шт)\b/gi, "") // Istalmagan so'zlarni olib tashlash
    .replace(/[^a-z\s]/g, "") // Maxsus belgilarni olib tashlash (faqat harflarni qoldirish)
    .trim() // Boshi va oxiridagi bo'sh joylarni olib tashlash
    .replace(/\s+/g, "-"); // Bo'sh joylarni "-" bilan almashtirish
}

export function formatNumber(number) {
  return number
    .toString() // Raqamni satrga aylantirish
    .replace(/\B(?=(\d{3})+(?!\d))/g, " "); // Har 3 ta raqamdan keyin bo'sh joy qo'shish
}

export const generateRandomFourDigitNumber = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

export function truncateText(text, maxLength) {
  if (text?.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }
  return text;
}

export const getUrl = (url) => {
  return url.split("/").slice(0, 3).join("/");
};

export const roundToTwoDecimals = (value) => {
  return Number((Math.round(value * 100) / 100).toFixed(2));
};

export const navItems = [
  {
    id: 1,
    title: "main",
    icon: "/assets/mainIcon.webp",
    path: "",
  },
  {
    id: 2,
    title: "news",
    icon: "/assets/reviewIcon.webp",
    path: "/news",
  },
  {
    id: 3,
    title: "saved",
    icon: "/assets/saveIcon.webp",
    path: "/saved",
  },
  {
    id: 4,
    title: "about-us",
    icon: "/assets/aboutIcon.webp",
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
    icon: "/assets/ruIcon.svg",
    locale: "ru",
  },
  {
    id: 2,
    title: "Uzb",
    icon: "/assets/uzIcon.webp",
    locale: "uz",
  },
  {
    id: 3,
    title: "Eng",
    icon: "/assets/enIcon.svg",
    locale: "en",
  },
];
