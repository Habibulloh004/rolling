"use client";

import CustomImage from "@/components/shared/customImage";
import { cn, formatNumber, posterUrl, truncateText } from "@/lib/utils";
import { useOrderStore, useProductStore, useStore } from "@/store";
import { Heart, Minus, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const Card = ({
  item,
  localizedName,
  localizedDesc,
  locale,
  defaultHref = "/web/category",
  ...props
}) => {
  const pathname = usePathname();
  const all = useTranslations("All");
  const [isFavorites, setIsFavorites] = useState([]);
  const { setFavorites } = useStore();
  const { photo, price } = props;
  const { products, setProducts, incrementCount, decrementCount } =
    useProductStore();
  const { paymentData } = useOrderStore();

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("isFavorites")) || [];
    setIsFavorites(favorites);
  }, []);

  const handleAddProduct = () => {
    setProducts(item);
  };
  const handleIncrementCount = () => {
    incrementCount(item?.product_id);
  };
  const handleDecrementCount = () => {
    decrementCount(item?.product_id);
  };

  const handleAddFavorite = (product) => {
    const favorite = isFavorites.find(
      (f) => f.product_id === product.product_id
    );
    let updatedFavorites;

    if (!favorite) {
      updatedFavorites = [...isFavorites, product];
    } else {
      updatedFavorites = isFavorites.filter(
        (f) => f.product_id !== product.product_id
      );
    }

    setIsFavorites(updatedFavorites);
    setFavorites(updatedFavorites);
    localStorage.setItem("isFavorites", JSON.stringify(updatedFavorites));
  };

  const findProduct = products.find((pr) => pr.product_id == item.product_id);
  const favorite = isFavorites.find((f) => f.product_id === item.product_id);
  return (
    <div className="relative w-full bg-white rounded-md p-2 space-y-2 h-full flex flex-col justify-between">
      {/* Wrap the clickable area with Link */}
      <Link locale={locale} href={defaultHref} className="block space-y-2">
        <div className="relative border-border border w-full aspect-square overflow-hidden rounded-sm">
          <CustomImage
            src={photo ? `${posterUrl}${photo}` : "/empty.jpg"}
            className="w-full h-full"
            alt={`${localizedName}`}
          />
        </div>
        <div className="space-y-1">
          <h1 className="textSmall2 font-bold">
            {truncateText(localizedName, 40)}{" "}
          </h1>
          <h1 className="textSmall1 font-[400">
            {truncateText(localizedDesc, 50)}{" "}
          </h1>
          <p className="textSmall2 font-bold">
            {price ? formatNumber(price) : 0} сум
          </p>
        </div>
      </Link>
      {/* Favorite Button */}
      {!defaultHref?.startsWith(`/${locale}/branch`) && (
        <button
          aria-label={`shcard heart`}
          onClick={(e) => {
            e.stopPropagation(); // Prevent Link navigation when clicking the button
            handleAddFavorite(item);
          }}
          className="absolute right-3 top-1 md:top-2 rounded-full bg-white p-1 shadow-sm transition-colors hover:bg-gray-100"
        >
          <Heart
            className={cn(
              "h-6 w-6",
              favorite ? "fill-[#43674E] text-[#43674E]" : "text-gray-400"
            )}
          />
        </button>
      )}
      {!findProduct ? (
        <div className="flex justify-end items-center gap-2">
          <button
            aria-label={`shcard plus`}
            disabled={paymentData && paymentData.payment_id}
            onClick={handleAddProduct}
            className="rounded-md px-3 py-[10px] bg-primary active:bg-primary-modal text-white text-xs"
          >
            {all("add")}
          </button>
        </div>
      ) : (
        <div className="flex justify-end items-center gap-2">
          <div className="max-sm:w-full flex justify-around sm:justify-center items-center gap-1 bg-primary rounded-md">
            <button
              aria-label={`shcard plus2`}
              disabled={paymentData && paymentData.payment_id}
              onClick={handleIncrementCount}
              className="max-sm:w-full rounded-l-md p-2 bg-primary active:bg-gradient-to-r active:from-white/20 active:to-primary"
            >
              <Plus
                className="text-white max-md:w-4 max-md:h-4 w-5 h-5"
                size={18}
              />
            </button>
            <span className="font-bold text-[12px] md:textSmall4 text-white min-w-6 text-center">
              {findProduct.count >= 10
                ? findProduct.count
                : `0${findProduct.count}`}
            </span>
            <button
              aria-label={`shcard minus`}
              disabled={paymentData && paymentData.payment_id}
              onClick={handleDecrementCount}
              className="max-sm:flex justify-center items-center max-sm:w-full rounded-r-md p-2 bg-primary active:bg-gradient-to-l active:from-white/20 active:to-primary"
            >
              <Minus className="text-white max-md:w-4 max-md:h-4 w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
