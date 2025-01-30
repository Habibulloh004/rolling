"use client";

import {
  formatText,
  getLocalizedCategoryName,
  getLocalizedProduct,
  getUrl,
  navItems,
  translateTextSpot,
} from "@/lib/utils";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
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
import {
  useProductStore,
  useStore,
  useOrderStore,
  useClientStore,
} from "@/store";
import Link from "next/link";
import LngChange from "./lngChange";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Cookies from "js-cookie";
import Marquee from "../ui/marquee";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "../ui/input";

export default function Header({
  locale,
  param,
  spotData,
  products: productsData,
  categories,
}) {
  const { client } = useClientStore();
  const searchParams = useSearchParams();
  const spot = searchParams.get("spot");
  const table_id = searchParams.get("table_id");
  const table_num = searchParams.get("table_num");
  const service = searchParams.get("service");
  const pathName = usePathname();
  const navbar = useTranslations("Navbar");
  const allT = useTranslations("All");
  const t = useTranslations("HomePage");
  const { products } = useProductStore();
  const { toggleOpen, open, initializeFavorites, setIsDisabled } = useStore();
  const { initializeOrderData, paymentData } = useOrderStore();
  const { initializeProducts } = useProductStore();
  const [isOpen, setisOpen] = useState(true);
  const [cl, setCl] = useState(
    Cookies.get("client") && JSON.parse(Cookies.get("client"))
  );
  const SearchText = useTranslations("Search");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [openSearch, setOpenSearch] = useState(false);
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCategories([]);
      setFilteredProducts([]);
      return;
    }

    setFilteredCategories(
      categories?.filter((category) =>
        String(category?.category_name)
          ?.toLowerCase()
          ?.includes(String(searchTerm?.toLowerCase()))
      )
    );

    setFilteredProducts(
      productsData?.filter((product) =>
        String(product?.product_production_description)
          ?.toLowerCase()
          ?.includes(String(searchTerm?.toLowerCase()))
      )
    );
  }, [searchTerm, categories, productsData]);

  useEffect(() => {
    initializeFavorites();
    initializeProducts();
    initializeOrderData();
  }, []);

  useEffect(() => {
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    if (hours < 10 || (hours === 10 && minutes < 0) || hours >= 23) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, []);

  useEffect(() => {
    setCl(client);
  }, [client]);

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

  const wrapWithLink = (text, words, loc) => {
    const parts = text.split(new RegExp(`(${words.join("|")})`, "g"));
    return parts.map((part, index) =>
      words.includes(part) ? (
        <Link
          key={index}
          className="font-semibold inline"
          href={`/${param.locale}/${param.place}/sign-up`}
        >
          {part}
        </Link>
      ) : (
        part
      )
    );
  };

  const introText = wrapWithLink(
    t("intro"),
    ["Зарегистрируйтесь", "Register", "Hozir ro'yxatdan o'ting"],
    param.locale
  );

  if (!isMounted) {
    return null;
  }

  return (
    <>
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
                ? `${getUrl(pathName)}`
                : `${getUrl(
                    pathName
                  )}?spot=${spot}&table_id=${table_id}&table_num=${table_num}&service=${service}`
            }
            className="flex-shrink-0 mt-5"
          >
            <Image
              src={`/assets/navLogo.webp`}
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
                  href={`${getUrl(pathName)}${item.path}`}
                  onClick={toggleOpen}
                  className="flex-shrink-0 flex items-center gap-2 w-full"
                >
                  <Image
                    src={`${item.icon}`}
                    alt={`${item.title}`}
                    width={item.id == 3 ? 25 : 29}
                    height={30}
                    className=""
                  />
                  <p
                    className={`${
                      `${getUrl(pathName)}${item.path}` == pathName
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
              href={`${
                cl ? `${getUrl(pathName)}/profile` : `${getUrl(pathName)}/login`
              }`}
              onClick={toggleOpen}
              className="flex-shrink-0 flex items-center gap-2 w-full"
            >
              <Image
                src={`/assets/accountIcon.webp`}
                alt={`Account icon`}
                width={33}
                height={33}
                className=""
              />
              <p
                className={`${
                  `${pathName}/profile` == pathName ? "font-semibold" : ""
                }`}
              >
                {cl
                  ? cl.firstname && cl.firstname.length > 0
                    ? cl.firstname
                    : cl.lastname || "-"
                  : allT("sign_in")}
              </p>
            </Link>
            <div className="flex justify-start items-center w-10/12">
              <LngChange param={param} />
            </div>
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
                ? `${getUrl(pathName)}`
                : `${getUrl(
                    pathName
                  )}?spot=${spot}&table_id=${table_id}&table_num=${table_num}&service=${service}`
            }
            className="hidden md:flex flex-shrink-0"
          >
            <Image
              src={`/assets/navLogo.webp`}
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
                  src={"/assets/hamburgerIcon.svg"}
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
                  ? `${getUrl(pathName)}`
                  : `${getUrl(
                      pathName
                    )}?spot=${spot}&table_id=${table_id}&table_num=${table_num}&service=${service}`
              }
              className=" flex-shrink-0"
            >
              <Image
                src={`/assets/secondaryIcon.webp`}
                alt="Rolling Sushi"
                width={146}
                height={36}
                className=""
              />
            </Link>
          </div>

          {param.place !== "branch" && (
            <nav className="hidden lg:flex items-center lg:space-x-4 xl:space-x-6">
              {/* desktop version */}
              {navItems.map((item) => {
                return (
                  <Link
                    key={item.id}
                    href={`${getUrl(pathName)}${item.path}`}
                    onClick={toggleOpen}
                    className="flex-shrink-0 flex items-center gap-2"
                  >
                    <Image
                      src={`${item.icon}`}
                      alt={`${item.title}`}
                      width={item.id == 3 ? 25 : 29}
                      height={30}
                      className="lg:w-7 lg:h-7 w-[30px]"
                    />
                    <p
                      className={`${
                        `${getUrl(pathName)}${item.path}` == pathName
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
                href={`${
                  cl
                    ? `${getUrl(pathName)}/profile`
                    : `${getUrl(pathName)}/login`
                }`}
                onClick={toggleOpen}
                className="flex-shrink-0 flex items-center gap-2 w-full"
              >
                <Image
                  src={`/assets/accountIcon.webp`}
                  alt={`Account icon`}
                  width={30}
                  height={30}
                  className=""
                />
                <p
                  className={`${
                    `${pathName}/profile` == pathName ? "font-semibold" : ""
                  }`}
                >
                  {cl
                    ? cl.firstname && cl.firstname.length > 0
                      ? cl.firstname
                      : cl.lastname || "-"
                    : allT("sign_in")}
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
                  src={"/assets/hamburgerIcon.svg"}
                  alt="Menu"
                  width={25}
                  height={25}
                  className=""
                />
              </span>
            )}

            {/* Desktop Navigation */}

            {/* Right Section */}
            <div className="flex items-center space-x-3">
              {/* Search */}
              {param.place !== "branch" && (
                <div className="flex items-center">
                  <Sheet open={openSearch}>
                    <SheetTrigger>
                      <div
                        onClick={() => setOpenSearch(true)}
                        className="w-full relative bg-white p-2 rounded-md"
                      >
                        <Search className="text-gray-400 size-5 xl:size-7 text-primary" />
                      </div>
                    </SheetTrigger>
                    <SheetContent
                      onClose={() => setOpenSearch(false)}
                      className={"h-[80vh] p-0"}
                      side="bottom"
                    >
                      <SheetHeader>
                        <SheetTitle className={"hidden"}>
                          Search Results
                        </SheetTitle>
                        <SheetDescription className="hidden">
                          Find matching categories and products.
                        </SheetDescription>
                      </SheetHeader>
                      <div className="pt-12 px-4 h-full space-y-3">
                        <div className="w-full relative h-10 md:h-12">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-6 text-primary" />
                          <Input
                            type="text"
                            placeholder={`${allT("search")}`}
                            className="max-w-xl w-full h-full pl-12 pr-2 rounded-md md:rounded-2xl text-gray-900 placeholder-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                        <div className="space-y-6 max-h-[60vh] overflow-y-scroll pr-2">
                          {/* Products Section */}
                          <div className="w-full space-y-2">
                            <h2 className="textSmall5 font-semibold text-gray-700">
                              {SearchText("search_pr")}
                            </h2>
                            {filteredProducts.length > 0 ? (
                              <ul className="max-md:flex flex-col gap-3 md:space-x-3 md:space-y-3">
                                {filteredProducts?.map((product, index) => {
                                  const localizedName = getLocalizedProduct(
                                    String(
                                      product.product_production_description
                                    ),
                                    locale,
                                    "name"
                                  );
                                  const linkNameCategory = formatText(
                                    getLocalizedCategoryName(
                                      String(product.category_name),
                                      "en"
                                    )
                                  );
                                  const linkNameProducts = formatText(
                                    getLocalizedProduct(
                                      String(
                                        product?.product_production_description
                                      ),
                                      "en",
                                      "name"
                                    )
                                  );
                                  return (
                                    <Link
                                      onClick={() => setOpenSearch(false)}
                                      href={
                                        param?.place !== "branch"
                                          ? `/${locale}/${param.place}/category/${product.menu_category_id}-${linkNameCategory}/product/${product.product_id}-${linkNameProducts}`
                                          : `/${locale}/${param.place}/category/${product.menu_category_id}-${linkNameCategory}/product/${product.product_id}-${linkNameProducts}?spot=${spot}&table_id=${table_id}&table_num=${table_num}&service=${service}`
                                      }
                                      key={index}
                                      className="inline-block p-3 textSmall3 bg-gray-100 rounded-md shadow"
                                    >
                                      {localizedName}
                                    </Link>
                                  );
                                })}
                              </ul>
                            ) : (
                              <p className="text-gray-500">
                                {SearchText("not_search_pr")}
                              </p>
                            )}
                          </div>
                          {/* Categories Section */}
                          <div className="w-full space-y-2">
                            <h2 className="textSmall5 font-semibold text-gray-700">
                              {SearchText("search_ct")}
                            </h2>
                            {filteredCategories.length > 0 ? (
                              <ul className="max-md:flex max-md:flex-col gap-3 md:space-x-3 md:space-y-3">
                                {filteredCategories.map((category, index) => {
                                  const linkNameCategory = formatText(
                                    getLocalizedCategoryName(
                                      String(category.category_name),
                                      "en"
                                    )
                                  );
                                  const nameCategory = getLocalizedCategoryName(
                                    String(category.category_name),
                                    locale
                                  );

                                  return (
                                    <Link
                                      onClick={() => setOpenSearch(false)}
                                      href={
                                        param?.place !== "branch"
                                          ? `/${locale}/${param.place}/category/${category.category_id}-${linkNameCategory}`
                                          : `/${locale}/${param.place}/category/${category.category_id}-${linkNameCategory}?spot=${spot}&table_id=${table_id}&table_num=${table_num}&service=${service}`
                                      }
                                      key={index}
                                      className="md:inline-block textSmall3 p-3 bg-gray-100 rounded-md shadow"
                                    >
                                      {nameCategory}
                                    </Link>
                                  );
                                })}
                              </ul>
                            ) : (
                              <p className="text-gray-500">
                                {SearchText("not_search_ct")}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              )}

              {/* Language Selector */}
              <div
                className={`${
                  param.place == "branch" ? "" : "hidden md:block"
                }`}
              >
                <LngChange param={param} />
              </div>

              {/* Cart */}
              <div>
                <Link
                  href={
                    param?.place !== "branch"
                      ? `${getUrl(pathName)}/cart`
                      : `${getUrl(
                          pathName
                        )}/cart?spot=${spot}&table_id=${table_id}&table_num=${table_num}&service=${service}`
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
                      spotData?.response?.find((sp) => sp.spot_id == spot)
                        ?.name,
                      locale
                    )?.split("-")[1]
                  }{" "}
                  {allT("spot")} {allT("table")} № {table_num}
                </DialogTitle>
                <DialogDescription className="hidden">
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </DialogDescription>
              </DialogHeader>
              <div className="bg-white flex justify-between items-center gap-1 px-2">
                <h1 className=" px-4 py-3 rounded-md md:text-center leading-9 font-bold textNormal3 text-thin">
                  {
                    translateTextSpot(
                      spotData?.response?.find((sp) => sp.spot_id == spot)
                        ?.name,
                      locale
                    )?.split("-")[1]
                  }{" "}
                  {allT("spot")} <br className="sm:hidden" />
                  {allT("table")} № {table_num}
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
      {param?.place !== "branch" && !cl && (
        <div className="bg-secondary text-primary text-center">
          <div className="max-xl:block hidden max-sm:text-xs">
            <Marquee pauseOnHover className="[--duration:20s]">
              <p>{introText}</p>
            </Marquee>
          </div>
          <p className="hidden xl:block py-2">{introText}</p>
        </div>
      )}
    </>
  );
}
