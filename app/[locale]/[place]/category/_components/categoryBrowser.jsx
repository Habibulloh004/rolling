"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { cn, formatText, posterUrl } from "@/lib/utils";
import CustomImage from "@/components/shared/customImage";
import Card from "@/components/shared/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const TRIGGER_COOLDOWN_MS = 700; // sentinel anti-bounce
const LOADING_DELAY_MS = 500;    // "loading..." ko'rsatish vaqti

export default function CategoryBrowser({
  categories,
  productsByCategory,
  locale,
  path,
  searchParamsData,
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // 1) Initial active category id (searchParams → kategoriya mavjud bo'lsa, aks holda 1-kategoriya)
  const initialCategoryId = useMemo(() => {
    const spCat = searchParams.get("category_id");
    if (spCat && categories.some((c) => c.id === Number(spCat))) {
      return Number(spCat);
    }
    return categories[0]?.id;
  }, [searchParams, categories]);

  const [activeIdx, setActiveIdx] = useState(
    Math.max(0, categories.findIndex((c) => c.id === initialCategoryId))
  );

  // 2) Stack: pastga qo'shib boramiz (category indexlari)
  const [renderStack, setRenderStack] = useState([activeIdx]);

  // 3) Loading va guardlar
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  const [userScrolled, setUserScrolled] = useState(false);
  const lastTriggerRef = useRef(0);

  // Sticky fonni boshqarish uchun sentinel
  const [isStuck, setIsStuck] = useState(false);
  const stickySentinelRef = useRef(null);

  // URL update (category_id ni aktiv bilan sync qilamiz) — ✅ faqat o'zgarganda yozamiz
  useEffect(() => {
    const newId = String(categories[activeIdx]?.id ?? "");
    if (!newId) return;

    const current = new URLSearchParams(window.location.search).get("category_id");
    if (current === newId) return; // bir xil bo'lsa, router.replace chaqirmaymiz

    const url = new URL(window.location.href);
    url.searchParams.set("category_id", newId);
    router.replace(url.toString(), { scroll: false });
  }, [activeIdx, router]); // <- faqat activeIdx bilan bog'ladik

  // Foydalanuvchi haqiqatan scroll qilganini belgilash (auto-triggerning oldini olish)
  useEffect(() => {
    const onScroll = () => {
      if (!userScrolled && window.scrollY > 40) setUserScrolled(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [userScrolled]);

  // Carousel'dan kategoriya tanlansa — stackni reset qilamiz
  const onSelectCategory = (idx) => {
    setActiveIdx(idx);
    setRenderStack([idx]);
    setIsLoadingNext(false);
    // ixtiyoriy: yuqoriga qaytarish
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Sticky sentinel observer: sentinel ko‘rinmay qolsa → sticky boshlandi
  useEffect(() => {
    const el = stickySentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setIsStuck(!entry.isIntersecting),
      { root: null, threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Infinite scroll sentinel
  const sentinelRef = useRef(null);
  useEffect(() => {
    if (!sentinelRef.current) return;
    const el = sentinelRef.current;

    const onIntersect = (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || entry.intersectionRatio < 1 || !userScrolled) return;

        const now = Date.now();
        if (now - lastTriggerRef.current < TRIGGER_COOLDOWN_MS) return;
        lastTriggerRef.current = now;

        const lastIdx = renderStack[renderStack.length - 1];
        if (lastIdx < categories.length - 1 && !isLoadingNext) {
          setIsLoadingNext(true);
          setTimeout(() => {
            setRenderStack((prev) => [...prev, lastIdx + 1]);
            // setActiveIdx(lastIdx + 1); // agar highlight ham o‘tsin desangiz, shu qatordan kommentni oling
            setIsLoadingNext(false);
          }, LOADING_DELAY_MS);
        }
      });
    };

    const obs = new IntersectionObserver(onIntersect, {
      root: null,
      rootMargin: "0px",
      threshold: 1,
    });

    obs.observe(el);
    return () => obs.disconnect();
  }, [renderStack, categories.length, userScrolled, isLoadingNext]);

  const { spot, table_id, table_num, service } = searchParamsData || {};

  return (
    <div className="space-y-6">
      {/* Sticky qachon boshlanishini tekshiruvchi sentinel */}
      <div ref={stickySentinelRef} className="h-px" />

      {/* ----- Categories carousel ----- */}
      <div
        className={cn(
          "md:w-11/12 mx-auto sticky top-0 md:rounded-md z-20 w-full backdrop-blur-sm transition-colors",
          isStuck ? "bg-secondary shadow-sm" : "bg-transparent"
        )}
      >
        <div className="relative w-full">
          <Carousel className="w-full">
            <CarouselContent className="-ml-2">
              {categories.map((c, idx) => (
                <CarouselItem
                  key={c.id}
                  className="basis-[22%] sm:basis-[15%] md:basis-[12%] xl:basis-[8%] pl-2"
                >
                  <button
                    onClick={() => onSelectCategory(idx)}
                    className={cn(
                      "w-full flex flex-col items-center gap-2 p-1 m-1 rounded-2xl border transition",
                      idx === activeIdx
                        ? "border-primary ring-2 ring-primary/40"
                        : "border-transparent hover:border-muted"
                    )}
                    aria-pressed={idx === activeIdx}
                  >
                    <div className="w-full aspect-square relative rounded-2xl md:rounded-3xl overflow-hidden">
                      <CustomImage
                        src={c.photo_origin ? `${posterUrl}${c.photo_origin}` : "/empty.jpg"}
                        alt={c.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="line-clamp-1 text-center text-xs md:text-sm font-semibold">
                      {c.name}
                    </div>
                  </button>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>

      {/* ----- Stack: Category 1, keyin Category 2, ... ----- */}
      <div className="w-11/12 mx-auto space-y-10">
        {renderStack.map((catIdx) => {
          const cat = categories[catIdx];
          const items = productsByCategory[cat.id] || [];

          return (
            <section key={`section-${cat.id}`} className="space-y-4">
              {/* bo'lim sarlavhasi */}
              <h2 className="text-base sm:text-lg font-bold">
                {cat.name}
              </h2>

              {/* grid */}
              <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-5">
                {items.map((item, i) => {
                  const linkNameProduct = formatText(item.linkNameProduct);
                  const linkNameCategory = formatText(item.linkNameCategory);
                  return (
                    <Card
                      key={`${cat.id}-${item.product_id}-${i}`}
                      defaultHref={
                        path?.place !== "branch"
                          ? `/${locale}/${path.place}/category/${item?.menu_category_id}-${linkNameCategory}/product/${item?.product_id}-${linkNameProduct}`
                          : `/${locale}/${path.place}/category/${item?.menu_category_id}-${linkNameCategory}/product/${item?.product_id}-${linkNameProduct}?spot=${spot}&table_id=${table_id}&table_num=${table_num}&service=${service}`
                      }
                      locale={locale}
                      item={item}
                      localizedDesc={item.localizedDesc}
                      localizedName={item.localizedName}
                      photo={item.photo_origin}
                      price={item.price["1"] / 100}
                    />
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* ----- Loading va sentinel (faqat keyingi kategoriya bo'lsa) ----- */}
      {renderStack[renderStack.length - 1] < categories.length - 1 && (
        <>
          {isLoadingNext && (
            <div className="w-full flex flex-col items-center justify-center py-10 space-y-6">
              {/* Spinner */}
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          <div
            ref={sentinelRef}
            className="w-full h-8"
            aria-label="infinite-scroll-sentinel"
          />
        </>
      )}
    </div>
  );
}
