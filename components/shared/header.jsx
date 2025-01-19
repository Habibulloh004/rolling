"use client";

import { navItems, translateTextSpot } from "@/lib/utils";
import { accountIcon, hamburgerIcon, navLogo, secondaryIcon } from "@/public";
import { Search } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/legacy/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ResponsiveSVG from "@/public/assets/responsive";
import { useProductStore, useStore } from "@/store";
import Link from "next/link";
import LngChange from "./lngChange";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

export default function Header({ locale, param, spotData }) {
  const searchParams = useSearchParams();
  const spot = searchParams.get("spot");
  const table_id = searchParams.get("table_id");
  const table_num = searchParams.get("table_num");
  const service = searchParams.get("service");

  const pathName = usePathname();
  const navbar = useTranslations("Navbar");
  const allT = useTranslations("All");
  const { products } = useProductStore();
  const { toggleOpen, open, initializeFavorites } = useStore();
  const { initializeProducts } = useProductStore();
  const [isOpen, setisOpen] = useState(true);
  const router = useRouter();

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

  useEffect(() => {
    if (spot && table_id && table_num && !service && param.place == "branch") {
      setisOpen(true);
    } else if (
      spot &&
      table_id &&
      table_num &&
      service &&
      param.place == "branch"
    ) {
      setisOpen(false);
    } else if ((!spot || !table_id || !table_num) && param.place == "branch") {
      setisOpen(true);
    } else {
      setisOpen(false);
    }
  }, [spot, table_id, table_num, service]);

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
          href={
            param?.place !== "branch"
              ? `/${locale}/${param?.place}`
              : `/${locale}/${param?.place}?spot=${spot}&table_id=${table_id}&table_num=${table_num}&service=${service}`
          }
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
          href={
            param?.place !== "branch"
              ? `/${locale}/${param?.place}`
              : `/${locale}/${param?.place}?spot=${spot}&table_id=${table_id}&table_num=${table_num}&service=${service}`
          }
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
          {param.place !== "branch" && (
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
          )}
          <Link
            href={
              param?.place !== "branch"
                ? `/${locale}/${param?.place}`
                : `/${locale}/${param?.place}?spot=${spot}&table_id=${table_id}&table_num=${table_num}&service=${service}`
            }
            className=" flex-shrink-0"
          >
            <Image
              src={secondaryIcon}
              alt="Rolling Sushi"
              width={146}
              height={36}
              className=""
            />
          </Link>
        </div>

        {param.place !== "branch" && (
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
        )}

        <div className="flex items-center gap-3">
          {param.place !== "branch" && (
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
          )}

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
            {param.place !== "branch" && (
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
            )}

            {/* Language Selector */}
            <div
              className={`${param.place == "branch" ? "" : "hidden md:block"}`}
            >
              <LngChange param={param} />
            </div>

            {/* Cart */}
            <div>
              <Link
                href={
                  param?.place !== "branch"
                    ? `/${locale}/${param?.place}/cart`
                    : `/${locale}/${param?.place}/cart?spot=${spot}&table_id=${table_id}&table_num=${table_num}&service=${service}`
                }
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
      {param?.place == "branch" && (
        <Dialog open={isOpen}>
          <DialogTrigger className="hidden">Open</DialogTrigger>
          <DialogContent className="bg-transparent border-none shadow-none md:max-w-2xl w-11/12 sm:w-full focus:ring-0 focus:outline-none">
            <DialogHeader>
              <DialogTitle className="hidden bg-white px-4 py-3 rounded-md text-center leading-9">
                {
                  translateTextSpot(
                    spotData?.response?.find((sp) => sp.spot_id == spot)?.name,
                    locale
                  )?.split("-")[1]
                }{" "}
                {allT("spot")} {allT("table")} № {table_num}
              </DialogTitle>
              <DialogDescription className="hidden">
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>
            <div className="bg-white flex justify-between items-center gap-1">
              <h1 className=" px-4 py-3 rounded-md text-center leading-9 font-bold textNormal3 text-thin">
                {
                  translateTextSpot(
                    spotData?.response?.find((sp) => sp.spot_id == spot)?.name,
                    locale
                  )?.split("-")[1]
                }{" "}
                {allT("spot")} {allT("table")} № {table_num}
              </h1>
              <LngChange />
            </div>
            <main className="md:mt-3 w-full flex max-md:flex-col justify-between items-stretch gap-4 md:gap-5">
              <section className="p-5 rounded-md text-center w-full bg-white flex justify-between items-center gap-3 flex-col">
                <div className="space-y-2">
                  <h1 className="textNormal3 font-bold text-thin">
                    {allT("waiter")}
                  </h1>
                  <p className="textSmall1">{allT("waiter_desc")}</p>
                </div>
                <Button
                  onClick={() => {
                    history.pushState(
                      null,
                      "",
                      `?spot=${spot}&table_id=${table_id}&table_num=${table_num}&service=waiter`
                    );
                    setisOpen(false);
                  }}
                  className="hover:bg-primary-modal focus:border-none focus:outline-none focus:ring-0 focus-visible:ring-0"
                >
                  {allT("choose")}
                </Button>
              </section>
              <section className="p-5 rounded-md text-center w-full bg-white flex justify-between items-center gap-3 flex-col">
                <div className="space-y-2">
                  <h1 className="textNormal3 font-bold text-thin">
                    {allT("self")}
                  </h1>
                  <p className="textSmall1">{allT("self_desc")}</p>
                </div>
                <Button
                  onClick={() => {
                    history.pushState(
                      null,
                      "",
                      `?spot=${spot}&table_id=${table_id}&table_num=${table_num}&service=self`
                    );
                    setisOpen(false);
                  }}
                  className="hover:bg-primary-modal focus:border-none focus:outline-none focus:ring-0 focus-visible:ring-0"
                >
                  {allT("choose")}
                </Button>
              </section>
            </main>
          </DialogContent>
        </Dialog>
      )}
    </header>
  );
}
