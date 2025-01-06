"use client";

import CustomImage from "@/components/shared/customImage";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { cn, posterUrl } from "@/lib/utils";
import { Heart, Plus } from "lucide-react";
import React, { useState } from "react";

const Card = ({
  item,
  localizedName,
  locale,
  defaultHref = "/web/categories",
}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="relative w-full bg-white rounded-md p-2 space-y-2">
      {/* Wrap the clickable area with Link */}
      <Link locale={locale} href={defaultHref} className="block space-y-2">
        <div className="relative w-full aspect-square overflow-hidden bg-secondary rounded-sm">
          <CustomImage
            src={`${posterUrl}${item.category_photo}`}
            className="w-full h-full"
            alt={`${localizedName}`}
          />
        </div>
        <div>
          <h1 className="textSmall1 font-bold">
            {localizedName} <span className="font-[400]">Classic</span>
          </h1>
          <p className="textSmall2 font-bold">{} сум</p>
        </div>
      </Link>
      {/* Favorite Button */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent Link navigation when clicking the button
          setIsFavorite(!isFavorite);
        }}
        className="absolute right-1 top-1 md:right-2 md:top-2 rounded-full bg-white p-1 shadow-sm transition-colors hover:bg-gray-100"
      >
        <Heart
          className={cn(
            "h-6 w-6",
            isFavorite ? "fill-[#43674E] text-[#43674E]" : "text-gray-400"
          )}
        />
      </button>
      {/* Add Button */}
      <div className="flex justify-end items-center gap-2">
        <Button className="w-8 h-8 hover:bg-primary-modal">
          <Plus />
        </Button>
      </div>
    </div>
  );
};

export default Card;
