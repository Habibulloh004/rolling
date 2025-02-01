"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
export function ProductDialog({ product }) {
  const [isFavorite, setIsFavorite] = React.useState(product.isFavorite);

  return (
    <div className="cursor-pointer rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow-md">
      <div className="relative">
        <Image
          src={product.image || "/placeholder.svg?height=200&width=200"}
          alt={product.name}
          width={200}
          height={200}
          className="rounded-lg"
        />
        <button
        aria-label={`prmodal heart`}
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          className="absolute right-2 top-2 rounded-full bg-white p-1.5 shadow-sm transition-colors hover:bg-gray-100"
        >
          <Heart
            className={cn(
              "h-5 w-5",
              isFavorite ? "fill-[#43674E] text-[#43674E]" : "text-gray-400"
            )}
          />
        </button>
      </div>
      <div className="mt-4">
        <h3 className="font-medium text-gray-900">{product.name}</h3>
        <p className="mt-1 text-sm text-[#6B6B6B]">{product.price}</p>
      </div>
      <div className="relative mt-4 aspect-square overflow-hidden rounded-lg">
        <Image
          src={product.image || "/placeholder.svg?height=400&width=400"}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      <p className="mt-2 text-[#6B6B6B]">{product.description}</p>
      <div className="mt-6 flex items-center justify-between">
        <span className="text-lg font-semibold">{product.price}</span>
        <Button aria-label={`prmodal add`} className="bg-[#43674E] hover:bg-[#43674E]/90">
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
