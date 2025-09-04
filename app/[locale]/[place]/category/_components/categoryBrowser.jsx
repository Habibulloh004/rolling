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

  // URL update (category_id ni birinchi (stackning birinchi) bilan sync qilamiz, yoki aktiv bilan?)
  // Talabingizda birinchisi aktiv qolsin degansiz — carousel highlight shu activeIdx bo'lsin.
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("category_id", String(categories[activeIdx]?.id));
    router.replace(url.toString(), { scroll: false });
  }, [activeIdx, categories, router]);

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

  // Sentinel: faqat stackdagi oxirgi bo'lim tugagach next qo'shish
  const sentinelRef = useRef(null);
  useEffect(() => {
    if (!sentinelRef.current) return;
    const el = sentinelRef.current;

    const onIntersect = (entries) => {
      entries.forEach((entry) => {
        // Faqat to'liq pastga yetganda (threshold:1) va foydalanuvchi scroll qilgan bo'lsa
        if (!entry.isIntersecting || entry.intersectionRatio < 1 || !userScrolled) return;

        const now = Date.now();
        if (now - lastTriggerRef.current < TRIGGER_COOLDOWN_MS) return;
        lastTriggerRef.current = now;

        // Hozirgi stackdagi oxirgi kategoriya:
        const lastIdx = renderStack[renderStack.length - 1];
        // Agar keyingi kategoriya mavjud bo'lsa, loading -> qo'shish
        if (lastIdx < categories.length - 1 && !isLoadingNext) {
          setIsLoadingNext(true);
          // kichik loading effektidan keyin keyingisini qo'shamiz
          setTimeout(() => {
            setRenderStack((prev) => [...prev, lastIdx + 1]);
            // ixtiyoriy: carousel highlightni ham oldinga siljitish uchun quyidagini yoqing
            // setActiveIdx(lastIdx + 1);
            setIsLoadingNext(false);
          }, LOADING_DELAY_MS);
        }
      });
    };

    const obs = new IntersectionObserver(onIntersect, {
      root: null,
      rootMargin: "0px",
      threshold: 1, // to'liq pastga kelganda
    });

    obs.observe(el);
    return () => obs.disconnect();
  }, [renderStack, categories.length, userScrolled, isLoadingNext]);

  const { spot, table_id, table_num, service } = searchParamsData || {};

  return (
    <div className="space-y-6">
      {/* ----- Categories carousel ----- */}
      <div className="md:w-11/12 mx-auto sticky top-0 bg-white md:rounded-md z-10 shadow-md w-full">
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
                  <div className="w-full aspect-square relative md:rounded-3xl overflow-hidden">
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

        {/* Chap oq shadow */}
        <div className="max-md:hidden pointer-events-none absolute left-0 top-0 h-full w-4 bg-gradient-to-r from-white to-transparent z-20" />
        {/* O‘ng oq shadow */}
        <div className="max-md:hidden pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-white to-transparent z-20" />
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
