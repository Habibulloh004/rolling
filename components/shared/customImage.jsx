"use client";
import { cn } from "@/lib/utils";
import Image from "next/legacy/image";
import React, { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const CustomImage = ({ src, alt, className }) => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="relative w-full h-full">
      {loading && <Skeleton className="absolute inset-0 h-full w-full" />}
      <Image
        src={src}
        alt={alt}
        layout="fill"
        quality={100}
        className={cn(
          className,
          "duration-700 ease-in-out group-hover:opacity-75",
          loading
            ? "scale-110 blur-2xl grayscale"
            : "scale-100 blur-0 grayscale-0"
        )}
        onLoadingComplete={() => setLoading(false)}
      />
    </div>
  );
};

export default CustomImage;
