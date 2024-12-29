"use client";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { lngItems, navItems } from "@/lib/utils";
import { cartIcon, hamburgerIcon, navLogo, secondaryIcon } from "@/public";
import { Search } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/legacy/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ResponsiveSVG from "@/public/assets/responsive";
import { useStore } from "@/store";

export default function Header() {
  const locale = useLocale();
  const findLocale = lngItems.find((item) => item.locale == locale);
  const pathName = usePathname();
  const router = useRouter(); // Next.js router
  const navbar = useTranslations("Navbar");

  const { toggleOpen, open } = useStore();

  return (
    <header className="sticky top-0 md:bg-custom-gradient z-50 bg-white text-white h-16 sm:h-24 items-center">
      {/* Mobile Navigation Menu */}
      <div
        className={`absolute z-50 top-0 h-screen w-[60%] p-3 lg:hidden transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } flex flex-col items-center bg-custom-gradient-top-bottom gap-5`}
      >
        {/* Logo */}
        <Link locale={locale} href="/" className="flex-shrink-0 mt-5">
          <Image
            src={navLogo}
            alt="Rolling Sushi"
            width={223}
            height={74}
            className=""
          />
        </Link>

        {/* Navigation */}
        <nav className="flex flex-col gap-5 sm:gap-7 mt-5 justify-start items-start w-9/12">
          {navItems.map((item) => {
            return (
              <Link
                locale={locale}
                key={item.id}
                href={`${item.path}`}
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
                <p className={`${item.path == pathName ? "font-semibold" : ""}`}>
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
        className={`absolute right-0 top-0 z-40 bg-black/30 h-screen w-[100%] lg:hidden transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      ></div>

      {/* Header Content */}
      <div className="flex container fixed max-w-[1440px] z-10 top-0 px-3 left-1/2 -translate-x-1/2 m-auto items-center justify-between h-16 sm:h-24">
        {/* Desktop Logo */}
        <Link locale={locale} href="/" className="hidden md:flex flex-shrink-0">
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
          <Link locale={locale} href="/" className=" flex-shrink-0">
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
                locale={locale}
                key={item.id}
                href={`${item.path}`}
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
                <p className={`${item.path == pathName ? "font-semibold" : ""}`}>{navbar(`${item.title}`)}</p>
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
                  type="search"
                  placeholder="Поиск по меню"
                  className="max-w-64 h-full pl-12 pr-2 rounded-2xl text-gray-900 placeholder-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Language Selector */}
            <div className="hidden md:block">
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
                <SelectContent>
                  {lngItems.map((item) => (
                    <SelectItem key={item.locale} value={item.id}>
                      <Link
                        href={pathName}
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
                          className={
                            item.locale === "ru" ? "text-[13px]" : "text-sm"
                          }
                        >
                          {item.title}
                        </span>
                      </Link>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Cart */}
            <div>
              <Link
                href="/cart"
                className="flex items-center hover:text-gray-200"
              >
                <span className="hidden md:block">
                  <ResponsiveSVG size="35" color="white" />
                </span>
                <span className="block md:hidden">
                  <ResponsiveSVG size="35" color="hsla(167, 100%, 13%, 1)" />
                </span>
                <div className="relative">
                  <span className="absolute -top-1 -right-2 size-6 rounded-full bg-red-500 flex items-center justify-center">
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
