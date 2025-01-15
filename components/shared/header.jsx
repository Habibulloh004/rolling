"use client";
import { lngItems, navItems } from "@/lib/utils";
import { accountIcon, hamburgerIcon, navLogo, secondaryIcon } from "@/public";
import { Search } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/legacy/image";

import ResponsiveSVG from "@/public/assets/responsive";
import { useStore } from "@/store";
import { usePathname } from "next/navigation";
import Link from "next/link";
import LngChange from "./lngChange";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";

export default function Header({ param }) {
  const navbar = useTranslations("Navbar");
  const allT = useTranslations("All");
  const locale = useLocale();
  const pathName = usePathname();

  const { toggleOpen, open } = useStore();

  return (
    <header className="sticky top-0 md:bg-custom-gradient z-[999] bg-white text-white h-16 sm:h-24 items-center">
      {/* Mobile Navigation Menu */}
      <div
        className={`absolute z-[998] top-0 h-screen w-[70%] md:w-[60%] p-3 lg:hidden transition-transform duration-300 ${
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
        <nav className="flex flex-col gap-5 sm:gap-7 mt-5 justify-start items-start w-10/12 md:w-9/12">
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
                  width={35}
                  height={35}
                  className=""
                />
                <p
                  className={`${
                    `/${locale}/${param?.place}${item.path}` == pathName
                      ? "font-semibold"
                      : ""
                  }`}
                >
                  {navbar(`${item.title}`)}
                </p>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Overlay for closing the menu */}
      <div
        onClick={toggleOpen}
        className={`absolute right-0 top-0 z-[900] bg-black/30 h-screen w-[100%] lg:hidden transition-opacity duration-300 ${
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
            className="p1 sm:p-3 bg-white min-w-6 rounded-md flex items-center"
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

        <nav className="hidden lg:flex items-center space-x-6">
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
                  width={33}
                  height={33}
                  className=""
                />
                <p
                  className={`${
                    `/${locale}/${param?.place}${item.path}` == pathName
                      ? "font-semibold"
                      : ""
                  }`}
                >
                  {navbar(`${item.title}`)}
                </p>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-5">
          <span
            className="bg-white p-3 rounded-md hidden md:flex lg:hidden items-center"
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

          {/* Desktop Navigation */}

          {/* Right Section */}
          <div className="flex items-center space-x-6">
            {/* Search */}
            <div className="flex items-center">
              <div className="p-3 bg-white rounded-md block xl:hidden">
                <Search className="text-gray-400 size-6 text-primary" />
              </div>
              <div className="hidden xl:block relative h-12">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-6 text-primary" />
                <input
                  type="text"
                  placeholder={`${allT("search")}`}
                  className="max-w-64 h-full pl-12 pr-2 rounded-2xl text-gray-900 placeholder-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-primary"
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
                  <ResponsiveSVG size="28" color="hsla(167, 100%, 13%, 1)" />
                </span>
                <div className="relative">
                  <span className="absolute -top-1 -right-2 size-5 md:size-6 rounded-full bg-red-500 flex items-center justify-center">
                    1
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
