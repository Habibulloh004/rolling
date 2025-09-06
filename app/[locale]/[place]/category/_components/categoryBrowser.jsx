"use client";

import React, { useEffect, useMemo, useRef, useState, useLayoutEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { cn, formatText, posterUrl } from "@/lib/utils";
import CustomImage from "@/components/shared/customImage";
import Card from "@/components/shared/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Loader2 } from "lucide-react";

const TRIGGER_COOLDOWN_MS = 700;
const LOADING_DELAY_MS = 400; // biroz qisqartirdim — kamroq lag
const HEADER_EXTRA_GAP = 12;  // title yopilib qolmasin uchun offset

export default function CategoryBrowser({
  categories,
  productsByCategory,
  locale,
  path,
  searchParamsData,
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // --- initial active
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

  // lazily pastga qo‘shib boramiz
  const [renderStack, setRenderStack] = useState([activeIdx]);

  // guards
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  const [userScrolled, setUserScrolled] = useState(false);
  const lastTriggerRef = useRef(0);

  // sticky boshqaruv
  const [isStuck, setIsStuck] = useState(false);
  const stickySentinelRef = useRef(null);
  const stickyWrapRef = useRef(null);
  const [stickyH, setStickyH] = useState(0); // dynamic sticky balandlik

  // carousel api
  const carouselApiRef = useRef(null);

  // section refs
  const sectionRefs = useRef([]);
  // sentinel
  const sentinelRef = useRef(null);

  // URL sync
  useEffect(() => {
    const newId = String(categories[activeIdx]?.id ?? "");
    if (!newId) return;
    const current = new URLSearchParams(window.location.search).get("category_id");
    if (current === newId) return;
    const url = new URL(window.location.href);
    url.searchParams.set("category_id", newId);
    router.replace(url.toString(), { scroll: false });
  }, [activeIdx, router, categories]);

  // user scrolled flag
  useEffect(() => {
    const onScroll = () => {
      if (!userScrolled && window.scrollY > 40) setUserScrolled(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [userScrolled]);

  // sticky sentinel
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

  // sticky height measure (offset’lar uchun)
  useLayoutEffect(() => {
    const measure = () => {
      if (stickyWrapRef.current) {
        setStickyH(stickyWrapRef.current.offsetHeight || 0);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // infinite scroll
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

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

  // scroll-spy (markazga yaqin section -> active)
  // rootMargin yuqorisiga stickyH + extra gap qo‘shdik
  useEffect(() => {
    if (!renderStack.length) return;

    let rAF = null;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top));

        if (visible[0]) {
          const idxAttr = visible[0].target.getAttribute("data-idx");
          const idx = idxAttr ? Number(idxAttr) : -1;
          if (idx >= 0 && idx !== activeIdx) {
            // scroll-spy update’ni rAF bilan “soft” qilamiz
            if (rAF) cancelAnimationFrame(rAF);
            rAF = requestAnimationFrame(() => setActiveIdx(idx));
          }
        }
      },
      {
        root: null,
        // title yopilmasligi uchun tepaga stickyH + HEADER_EXTRA_GAP offest
        rootMargin: `-${stickyH + HEADER_EXTRA_GAP}px 0px -60% 0px`,
        threshold: 0,
      }
    );

    renderStack.forEach((idx) => {
      const el = sectionRefs.current[idx];
      if (el) obs.observe(el);
    });

    return () => {
      if (rAF) cancelAnimationFrame(rAF);
      obs.disconnect();
    };
  }, [renderStack, activeIdx, stickyH]);

  // active o‘zgarsa — carouselni boshga olib kelamiz
  useEffect(() => {
    const api = carouselApiRef.current;
    if (api && typeof api.scrollTo === "function") {
      try {
        api.scrollTo(activeIdx, true);
      } catch {}
    }
  }, [activeIdx]);

  // sectionga smooth scroll (header offset bilan)
  const smoothScrollToIdx = (idx) => {
    const target = sectionRefs.current[idx];
    if (!target) return;

    const top = Math.max(0, target.offsetTop - stickyH - HEADER_EXTRA_GAP);
    window.scrollTo({ top, behavior: "smooth" });
  };

  // category bosilganda
  const onSelectCategory = (idx) => {
    // renderStackda yo‘q bo‘lsa — avval qo‘shamiz, keyin scroll
    setRenderStack((prev) => {
      if (!prev.includes(idx)) return [...prev, idx].sort((a, b) => a - b);
      return prev;
    });

    // active qilib qo‘yamiz (carouselni boshga tortish uchun)
    setActiveIdx(idx);

    // keyingi paintda scrolling (yangi section mount bo‘lishini kutish)
    requestAnimationFrame(() => {
      // delay juda kichik — jankni kamaytiradi
      setTimeout(() => smoothScrollToIdx(idx), 0);
    });

    setIsLoadingNext(false);
  };

  const { spot, table_id, table_num, service } = searchParamsData || {};

  return (
    <div className="space-y-6">
      {/* Sticky boshlanish sentinel */}
      <div ref={stickySentinelRef} className="h-px" />

      {/* === Sticky Category Bar (Yandex menu behavior) === */}
      <div
        ref={stickyWrapRef}
        className={cn(
          "md:w-11/12 mx-auto sticky top-0 z-30 w-full transition-colors",
          "backdrop-blur-sm",
          isStuck ? "bg-secondary shadow-sm" : "bg-transparent",
          "pt-2 pb-2" // tepaga ozroq margin/bo'shliq
        )}
      >
        <Carousel
          className="w-full"
          opts={{ align: "start", dragFree: false, loop: false, containScroll: "trimSnaps" }}
          setApi={(api) => {
            carouselApiRef.current = api;
          }}
        >
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
                  aria-current={idx === activeIdx ? "true" : "false"}
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

      {/* === Content sections (stack) === */}
      <div className="w-11/12 mx-auto space-y-10">
        {renderStack.map((catIdx) => {
          const cat = categories[catIdx];
          const items = productsByCategory[cat.id] || [];

          return (
            <section
              key={`section-${cat.id}`}
              data-idx={catIdx}
              ref={(el) => { sectionRefs.current[catIdx] = el; }}
              // dynamic scroll-margin-top — title yopilmasin
              style={{ scrollMarginTop: (stickyH || 0) + HEADER_EXTRA_GAP + 4 }}
              className="space-y-4"
            >
              <h2 className="text-base sm:text-lg font-bold">{cat.name}</h2>

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

      {/* Loading + infinite sentinel */}
      {renderStack[renderStack.length - 1] < categories.length - 1 && (
        <>
          {isLoadingNext && (
            <div className="w-full flex flex-col items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}
          <div ref={sentinelRef} className="w-full h-8" aria-label="infinite-scroll-sentinel" />
        </>
      )}
    </div>
  );
}
