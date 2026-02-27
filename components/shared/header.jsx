"use client";

import {
  cn,
  formatNumber,
  formatText,
  getLocalizedCategoryName,
  getLocalizedProduct,
  getUrl,
  navItems,
  translateTextSpot,
} from "@/lib/utils";
import { ArrowUp, Search } from "lucide-react";
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
  apiTime,
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
  const [isScrolled, setIsScrolled] = useState(false);
  const isDev = process.env.NODE_ENV === "development";
  const defaultTime = isDev
    ? { closed_time: "23:59", opened_time: "00:00" }
    : { closed_time: "23:00", opened_time: "10:00" };
  const [showBackTop, setShowBackTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowBackTop(window.scrollY > 350); // 350px dan keyin ko‘rsin
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCategories([]);
      setFilteredProducts([]);
      return;
    }

    setFilteredCategories(
      categories?.filter(
        (category) =>
          String(category?.category_name)
            ?.toLowerCase()
            ?.includes(String(searchTerm?.toLowerCase())) &&
          category?.category_hidden == 0 &&
          category?.category_id != 0
      )
    );

    setFilteredProducts(
      productsData?.filter(
        (product) =>
          String(product?.product_production_description)
            ?.toLowerCase()
            ?.includes(String(searchTerm?.toLowerCase())) &&
          product?.hidden == 0 &&
          product?.menu_category_id != 0
      )
    );
  }, [searchTerm, categories, productsData]);

  useEffect(() => {
    initializeFavorites();
    initializeProducts();
    initializeOrderData();
  }, []);

  useEffect(() => {
    console.log(apiTime);
    let closedTime = defaultTime.closed_time;
    let openedTime = defaultTime.opened_time;

    if (
      !isDev &&
      apiTime?.opened_time &&
      apiTime?.opened_time !== null &&
      apiTime?.opened_time !== "" &&
      apiTime?.closed_time &&
      apiTime?.closed_time !== null &&
      apiTime?.closed_time !== ""
    ) {
      closedTime = apiTime?.closed_time;
      openedTime = apiTime?.opened_time;
    }

    const [closedHour, closedMinute] = closedTime.split(":").map(Number);
    const [openedHour, openedMinute] = openedTime.split(":").map(Number);

    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();

    const currentMinutes = hours * 60 + minutes;
    const openedMinutes = openedHour * 60 + openedMinute;
    const closedMinutes = closedHour * 60 + closedMinute;

    let isDisabled;

    if (openedMinutes <= closedMinutes) {
      isDisabled =
        currentMinutes < openedMinutes || currentMinutes >= closedMinutes;
    } else {
      isDisabled =
        currentMinutes < openedMinutes && currentMinutes >= closedMinutes;
    }

    setIsDisabled(isDisabled);
  }, [apiTime]);

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
  const totalAmount = products?.reduce((sum, product) => {
    const price = Number(product?.price?.["1"] / 100 || 0);
    const count = Number(product?.count || 0);
    return sum + price * count;
  }, 0);

  const introText = wrapWithLink(
    t("intro"),
    ["Зарегистрируйтесь", "Register", "Hozir ro'yxatdan o'ting"],
    param.locale
  );

  return (
    <>
      <header
        className={`sticky top-0 w-full md:bg-custom-gradient z-50 bg-white text-white h-16 sm:h-24 items-center transition-transform duration-300 ${isScrolled ? "-translate-y-full" : "translate-y-0"
          }`}
      >
        <div className="flex container fixed max-w-[1440px] z-10 top-0 px-3 left-1/2 -translate-x-1/2 m-auto items-center justify-between h-16 sm:h-24">
          {/* Mobile Navigation Menu */}
          <div
            className={`absolute z-50 top-0 h-screen w-[70%] p-3 lg:hidden transition-transform duration-300 ${open ? "-translate-x-5" : "-translate-x-[110%]"
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
                loading="eager"
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
                      loading="eager"
                      className=""
                    />
                    <p
                      className={`${`${getUrl(pathName)}${item.path}` == pathName
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
                href={`${cl
                  ? `${getUrl(pathName)}/profile`
                  : `${getUrl(pathName)}/login`
                  }`}
                onClick={toggleOpen}
                className="flex-shrink-0 flex items-center gap-2 w-full"
              >
                <Image
                  src={`/assets/accountIcon.webp`}
                  alt={`Account icon`}
                  loading="eager"
                  width={33}
                  height={33}
                  className=""
                />
                <p
                  className={`${`${pathName}/profile` == pathName ? "font-semibold" : ""
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
            className={`absolute right-0 top-0 z-40 bg-black/30 h-screen w-[100%] lg:hidden transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
          ></div>

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
              loading="eager"
              className=""
            />
          </Link>

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
                  loading="eager"
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
                loading="eager"
              />
            </Link>
          </div>

          {param.place !== "branch" && (
            <nav className="hidden lg:flex items-center lg:space-x-4 xl:space-x-6">
              {navItems.map((item) => (
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
                    loading="eager"
                  />
                  <p
                    className={`${`${getUrl(pathName)}${item.path}` == pathName
                      ? "font-semibold"
                      : "lg:text-sm xl:text-base"
                      }`}
                  >
                    {navbar(`${item.title}`)}
                  </p>
                </Link>
              ))}
              <Link
                href={`${cl
                  ? `${getUrl(pathName)}/profile`
                  : `${getUrl(pathName)}/login`
                  }`}
                onClick={toggleOpen}
                className="flex-shrink-0 flex items-center gap-2"
              >
                <Image
                  src={`/assets/accountIcon.webp`}
                  alt={`Account icon`}
                  width={30}
                  height={30}
                  className=""
                  loading="eager"
                />
                <p
                  className={`${`${pathName}/profile` == pathName ? "font-semibold" : ""
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
                  loading="eager"
                />
              </span>
            )}

            <div className="flex items-center space-x-3">
              {param.place !== "branch" && (
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
                                        ? `/${locale}/${param.place}/category?category_id=${category.category_id}`
                                        : `/${locale}/${param.place}/category?category_id=${category.category_id}&spot=${spot}&table_id=${table_id}&table_num=${table_num}&service=${service}`
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
              )}

              <div
                className={`${param.place == "branch" ? "" : "hidden md:block"
                  }`}
              >
                <LngChange param={param} />
              </div>
              {/* Cart */}
              <div
                onClick={() => {
                  window.dataLayer?.push({
                    event: "add_to_cart",
                    ecommerce: {
                      items: products?.map((prd) => {
                        const localizedName = getLocalizedProduct(
                          prd.product_production_description,
                          locale,
                          "name"
                        );
                        return {
                          item_name: localizedName,
                          price: formatNumber(prd?.price["1"] / 100),
                          quantity: prd?.count,
                        };
                      }),
                    },
                  });
                }}
              >
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
                  {translateTextSpot(
                    spotData?.response?.find((sp) => sp.spot_id == spot)?.name,
                    locale
                  )?.split("Rolling Sushi -")}
                  {allT("spot")} {allT("table")} № {table_num}
                </DialogTitle>
                <DialogDescription className="hidden">
                  This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="bg-white flex justify-between items-center gap-1 px-2">
                <h1 className="px-4 py-3 rounded-md md:text-center leading-9 font-bold textNormal3 text-thin">
                  {translateTextSpot(
                    spotData?.response?.find((sp) => sp.spot_id == spot)?.name,
                    locale
                  ).split("Rolling Sushi -")}
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
      {/* Fixed Cart at Bottom */}
      {products?.length > 0 &&
        !(
          pathName?.includes("/cart") ||
          pathName?.includes("/login") ||
          pathName?.includes("/sign-up")
        ) && (
          <div
            onClick={() => {
              window.dataLayer?.push({
                event: "add_to_cart",
                ecommerce: {
                  items: products?.map((prd) => {
                    const localizedName = getLocalizedProduct(
                      prd.product_production_description,
                      locale,
                      "name"
                    );
                    return {
                      item_name: localizedName,
                      price: formatNumber(prd?.price["1"] / 100),
                      quantity: prd?.count,
                    };
                  }),
                },
              });
            }}
            className="bg-white sm:hidden fixed justify-center items-center w-full bottom-0 z-40 p-2"
          >
            <Link
              href={
                param?.place !== "branch"
                  ? `${getUrl(pathName)}/cart`
                  : `${getUrl(
                    pathName
                  )}/cart?spot=${spot}&table_id=${table_id}&table_num=${table_num}&service=${service}`
              }
              className="w-11/12  mx-auto block"
            >
              <div className="bg-primary w-full text-sm flex items-center justify-between px-4 py-4 rounded-[999px] text-white font-semibold shadow-lg">
                <span className="bg-white text-primary w-6 h-6 flex items-center justify-center rounded-full text-sm font-bold">
                  {products?.length}
                </span>
                <span>{allT("payment_sum")}</span>
                <span>
                  {formatNumber(totalAmount)} {allT("sum")}
                </span>
              </div>
            </Link>
          </div>
        )}

      {isScrolled &&
        !(
          pathName?.includes("/cart") ||
          pathName?.includes("/login") ||
          pathName?.includes("/sign-up")
        ) &&
        products?.length > 0 && (
          <>
            <div
              onClick={() => {
                window.dataLayer?.push({
                  event: "add_to_cart",
                  ecommerce: {
                    items: products?.map((prd) => {
                      const localizedName = getLocalizedProduct(
                        prd.product_production_description,
                        locale,
                        "name"
                      );
                      return {
                        item_name: localizedName,
                        price: formatNumber(prd?.price["1"] / 100),
                        quantity: prd?.count,
                      };
                    }),
                  },
                });
              }}
              className="max-sm:hidden fixed bottom-4 right-4 z-40"
            >
              <Link
                href={
                  param?.place !== "branch"
                    ? `${getUrl(pathName)}/cart`
                    : `${getUrl(
                      pathName
                    )}/cart?spot=${spot}&table_id=${table_id}&table_num=${table_num}&service=${service}`
                }
                className="flex items-center relative"
              >
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-green-400 rounded-full opacity-75 animate-wave"></div>
                  <div className="relative bg-white p-2 rounded-full shadow-lg">
                    <span className="hidden md:block">
                      <ResponsiveSVG
                        size="35"
                        color="hsla(167, 100%, 13%, 1)"
                      />
                    </span>
                    <span className="block md:hidden">
                      <ResponsiveSVG
                        size="30"
                        color="hsla(167, 100%, 13%, 1)"
                      />
                    </span>
                    {products.length > 0 && (
                      <div className="relative">
                        <span className="textSmall3 absolute -top-12 -right-3 size-5 md:size-6 rounded-full bg-red-500 flex items-center justify-center text-white">
                          {products?.length}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          </>
        )}
      {param?.place !== "branch" && !cl && (
        <div className={cn(`bg-secondary text-primary text-center`)}>
          <div className="max-xl:block hidden max-sm:text-xs">
            <Marquee pauseOnHover className="[--duration:20s]">
              <p>{introText}</p>
            </Marquee>
          </div>
          <p className="hidden xl:block py-2">{introText}</p>
        </div>
      )}
      {/* Back-to-Top (floating) */}
      {/* Back-to-Top — cartdagi wave bilan */}
      {showBackTop && (
        <button
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed z-40 right-5 bottom-20 md:bottom-[84px]"
        >
          <div className="relative group">
            {/* <<<— CARTDAGI WAVE AYNAN SHU —>>> */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-green-400 rounded-full opacity-75 animate-wave"></div>

            {/* Card tugma — oq, yumaloq, soyali */}
            <div className="relative bg-white p-2 md:p-2.5 rounded-full shadow-lg border border-primary/10">
              <ArrowUp className="size-5 md:size-6 text-primary transition-transform duration-200 group-hover:-translate-y-0.5" />
            </div>
          </div>
        </button>
      )}


      {/* CSS for wave animation */}
      <style jsx>{`
        @keyframes wave {
          0% {
            transform: scale(1);
            opacity: 0.75;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.5;
          }
          100% {
            transform: scale(1);
            opacity: 0.75;
          }
        }
        .animate-wave {
          animation: wave 2s infinite ease-in-out;
        }
        @keyframes wave {
           0%   { transform: scale(1);   opacity: 0.75; }
           50%  { transform: scale(1.1); opacity: 0.5; }
           100% { transform: scale(1);   opacity: 0.75; }
        }
      .animate-wave { animation: wave 2s infinite ease-in-out; }

      `}</style>

    </>
  );
}
