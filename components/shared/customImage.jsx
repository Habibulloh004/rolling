"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const loadedSrcCache = new Set();
const BLUR_PLACEHOLDER_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNlZWVlZWUiLz48L3N2Zz4=";

function getImageCacheKey(src) {
  if (typeof src !== "string" || !src) {
    return "/empty.jpg";
  }

  try {
    const parsedUrl = new URL(src, "http://local");
    const normalizedPath = parsedUrl.pathname.replace(/\/+$/, "") || "/";
    return normalizedPath;
  } catch {
    return src.replace(/[?#].*$/, "").replace(/\/+$/, "") || "/empty.jpg";
  }
}

function shouldBypassOptimization(src) {
  if (typeof src !== "string") {
    return false;
  }

  if (src.endsWith(".svg") || src.includes("_original.")) {
    return true;
  }
  if (
    src.includes("joinposter.com/upload/") ||
    src.includes("rollingadmin.uz:5000/")
  ) {
    return true;
  }
  if (/^(data:|blob:)/i.test(src)) {
    return true;
  }

  return false;
}

const CustomImage = ({
  src,
  alt,
  className,
  cacheKey,
  loading: loadingImg,
  property,
  sizes = "100vw",
  priority = false,
  quality = 72,
  unoptimized,
}) => {
  const isCached = (explicitKey, sourceKey) => {
    if (explicitKey && loadedSrcCache.has(explicitKey)) {
      return true;
    }
    return loadedSrcCache.has(sourceKey);
  };

  const initialSrc = src || "/empty.jpg";
  const initialExplicitKey = cacheKey ? getImageCacheKey(cacheKey) : null;
  const initialSrcKey = getImageCacheKey(initialSrc);
  const [resolvedSrc, setResolvedSrc] = useState(initialSrc);
  const [loading, setLoading] = useState(
    () => !isCached(initialExplicitKey, initialSrcKey)
  );

  useEffect(() => {
    const nextSrc = src || "/empty.jpg";
    const nextExplicitKey = cacheKey ? getImageCacheKey(cacheKey) : null;
    const nextSrcKey = getImageCacheKey(nextSrc);
    setResolvedSrc(nextSrc);
    setLoading(!isCached(nextExplicitKey, nextSrcKey));
  }, [src, cacheKey]);

  const finalUnoptimized =
    typeof unoptimized === "boolean"
      ? unoptimized
      : shouldBypassOptimization(resolvedSrc);

  return (
    <div className="relative w-full h-full">
      {loading && <Skeleton className="absolute inset-0 h-full w-full" />}
      <Image
        src={resolvedSrc}
        alt={alt}
        fill
        sizes={sizes}
        placeholder="blur"
        blurDataURL={BLUR_PLACEHOLDER_DATA_URL}
        loading={priority ? undefined : loadingImg ? loadingImg : "lazy"}
        priority={priority}
        quality={quality}
        unoptimized={finalUnoptimized}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        className={cn(
          className,
          "object-cover",
          "duration-700 ease-in-out group-hover:opacity-75",
          loading
            ? "opacity-70 scale-[1.03] blur-md"
            : "opacity-100 scale-100 blur-0"
        )}
        onLoad={() => {
          const sourceKey = getImageCacheKey(resolvedSrc);
          loadedSrcCache.add(sourceKey);
          if (cacheKey) {
            loadedSrcCache.add(getImageCacheKey(cacheKey));
          }
          setLoading(false);
        }}
        onError={() => {
          if (resolvedSrc !== "/empty.jpg") {
            const fallbackSrc = "/empty.jpg";
            setResolvedSrc(fallbackSrc);
            setLoading(!loadedSrcCache.has(getImageCacheKey(fallbackSrc)));
          } else {
            setLoading(false);
          }
        }}
        property={property}
      />
    </div>
  );
};

export default CustomImage;
