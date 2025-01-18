"use client";

import { navItems } from "@/lib/utils";
import { accountIcon, hamburgerIcon, navLogo, secondaryIcon } from "@/public";
import { Search } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/legacy/image";

import ResponsiveSVG from "@/public/assets/responsive";
import { useProductStore, useStore } from "@/store";
import Link from "next/link";
import LngChange from "./lngChange";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function Header({ locale, param }) {
  const pathName = usePathname();
  const navbar = useTranslations("Navbar");
  const allT = useTranslations("All");
  const { products } = useProductStore();
  const { toggleOpen, open, initializeFavorites } = useStore();
  const { initializeProducts } = useProductStore();

  useEffect(() => {
    initializeFavorites();
    initializeProducts();
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [open]);

  return (
    <header className="sticky top-0 md:bg-custom-gradient z-50 bg-white text-white h-16 sm:h-24 items-center">
      {/* Mobile Navigation Menu */}
      <div
        className={`absolute z-50 top-0 h-screen w-[70%] p-3 lg:hidden transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } flex flex-col items-center bg-custom-gradient-top-bottom gap-5`}
      >
        {/* Logo */}
        <Link
          href={`/${locale}/${param?.place}`}
          className="flex-shrink-0 mt-5"
        >
          <Image
            src={navLogo}
            alt="Rolling Sushi"
            width={223}
            height={74}
            className=""
          />
        </Link>

        {/* Navigation */}
        <nav className="max-sm:w-10/12 flex flex-col gap-5 sm:gap-7 mt-5 justify-start items-start">
          {navItems.map((item) => {
            return (
              <Link
                key={item.id}
                href={`/${locale}/${param?.place}${item.path}`}
                onClick={toggleOpen}
                className="flex-shrink-0 flex items-center gap-2 w-full"
              >
                <Image
                  src={`${item.icon.src}`}
                  alt={`${item.title}`}
                  width={33}
                  height={33}
                  className=""
                />
                <p
                  className={`${
                    `/${locale}/${param.place}${item.path}` == pathName
                      ? "font-semibold"
                      : ""
                  }`}
                >
                  {navbar(`${item.title}`)}
                </p>
              </Link>
            );
          })}

          <Link
            href={`/${locale}/${param?.place}/profile`}
            onClick={toggleOpen}
            className="flex-shrink-0 flex items-center gap-2 w-full"
          >
            <Image
              src={`${accountIcon.src}`}
              alt={`Account icon`}
              width={33}
              height={33}
              className=""
            />
            <p
              className={`${
                `/${locale}/${param?.place}` == pathName ? "font-semibold" : ""
              }`}
            >
              Abdulloh
            </p>
          </Link>
        </nav>
      </div>

      {/* Overlay for closing the menu */}
      <div
        onClick={toggleOpen}
        className={`absolute right-0 top-0 z-40 bg-black/30 h-screen w-[100%] lg:hidden transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      ></div>

      {/* Header Content */}
      <div className="flex container fixed max-w-[1440px] z-10 top-0 px-3 left-1/2 -translate-x-1/2 m-auto items-center justify-between h-16 sm:h-24">
        {/* Desktop Logo */}
        <Link
          href={`/${locale}/${param?.place}`}
          className="hidden md:flex flex-shrink-0"
        >
          <Image
            src={navLogo}
            alt="Rolling Sushi"
            width={223}
            height={74}
            className=""
          />
        </Link>

        {/* Mobile Menu Toggle */}
        <div className="flex gap-3 items-center md:hidden">
          <span
            className="p-1 sm:p-[7px] bg-white min-w-6 rounded-md flex items-center"
            onClick={toggleOpen}
          >
            <Image
              src={hamburgerIcon}
              alt="Menu"
              width={25}
              height={25}
              className=""
            />
          </span>
          <Link href={`/${locale}/${param?.place}`} className=" flex-shrink-0">
            <Image
              src={secondaryIcon}
              alt="Rolling Sushi"
              width={146}
              height={36}
              className=""
            />
          </Link>
        </div>

        <nav className="hidden lg:flex items-center lg:space-x-4 xl:space-x-6">
          {navItems.map((item) => {
            return (
              <Link
                key={item.id}
                href={`/${locale}/${param?.place}${item.path}`}
                onClick={toggleOpen}
                className="flex-shrink-0 flex items-center gap-2"
              >
                <Image
                  src={`${item.icon.src}`}
                  alt={`${item.title}`}
                  width={30}
                  height={30}
                  className="lg:w-7 lg:h-7"
                />
                <p
                  className={`${
                    `/${locale}/${param?.place}${item.path}` == pathName
                      ? "font-semibold"
                      : "lg:text-sm xl:text-base"
                  }`}
                >
                  {navbar(`${item.title}`)}
                </p>
              </Link>
            );
          })}

          <Link
            href={`/${locale}/${param?.place}/profile`}
            onClick={toggleOpen}
            className="flex-shrink-0 flex items-center gap-2 w-full"
          >
            <Image
              src={`${accountIcon.src}`}
              alt={`Account icon`}
              width={30}
              height={30}
              className=""
            />
            <p
              className={`${
                `/${locale}/${param?.place}/profile` == pathName
                  ? "font-semibold"
                  : "lg:text-sm xl:text-base"
              }`}
            >
              Abdulloh
            </p>
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <span
            className="bg-white p-[6px] rounded-md hidden md:flex lg:hidden items-center"
            onClick={toggleOpen}
          >
            <Image
              src={hamburgerIcon}
              alt="Menu"
              width={25}
              height={25}
              className=""
            />
          </span>

          {/*           
                      <Link
            href={`/${locale}/${getPlace(clientPathName || "/")}/profile`}
            onClick={toggleOpen}
            className="flex-shrink-0 flex items-center gap-2 w-full"
          >
            <Image
              src={`${accountIcon.src}`}
              alt={`Account icon`}
              width={35}
              height={35}
              className=""
            />
            <p className={`${"/profile" == clientPathName || "/" ? "font-semibold" : ""}`}>
              Anna
            </p>
          </Link>
            */}

          {/* Desktop Navigation */}

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="flex items-center">
              <div className="p-[6px] bg-white rounded-md block xl:hidden">
                <Search className="text-gray-400 size-6 text-primary" />
              </div>
              <div className="hidden xl:block relative h-12">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-6 text-primary" />
                <input
                  type="text"
                  placeholder={`${allT("search")}`}
                  className="xl:max-w-52 2xl:max-w-64 h-full pl-12 pr-2 rounded-2xl text-gray-900 placeholder-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Language Selector */}
            <div className="hidden md:block">
              <LngChange />
            </div>

            {/* Cart */}
            <div>
              <Link
                href={`/${locale}/${param?.place}/cart`}
                className="flex items-center hover:text-gray-200"
              >
                <span className="hidden md:block">
                  <ResponsiveSVG size="35" color="white" />
                </span>
                <span className="block md:hidden">
                  <ResponsiveSVG size="30" color="hsla(167, 100%, 13%, 1)" />
                </span>
                {products.length > 0 && (
                  <div className="relative">
                    <span className="textSmall3 absolute -top-1 -right-2 size-5 md:size-6 rounded-full bg-red-500 flex items-center justify-center">
                      {products?.length}
                    </span>
                  </div>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
