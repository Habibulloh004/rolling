"use client";

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Loader2 } from "lucide-react";
import { cn, formatText, posterUrl } from "@/lib/utils";
import {
  getCategoryBrowserState,
  getCachedCategoryProducts,
  invalidateCategoryBrowserCaches,
  loadCategoryProducts,
  saveCategoryBrowserState,
  warmCategoryProducts,
} from "@/lib/client-category-cache";
import CustomImage from "@/components/shared/customImage";
import Card from "@/components/shared/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useSearchParams } from "next/navigation";

const TRIGGER_COOLDOWN_MS = 250;
const HEADER_EXTRA_GAP = 12;
const RENDER_AHEAD_COUNT = 2;
const WARM_AHEAD_COUNT = 1;
const CLIENT_CATEGORY_CACHE_ENABLED = ["1", "true", "yes", "on"].includes(
  String(process.env.NEXT_PUBLIC_ENABLE_CLIENT_SESSION_CACHE ?? "false")
    .toLowerCase()
    .trim()
);

export default function CategoryBrowser({
  categories,
  locale,
  path,
}) {
  const searchParams = useSearchParams();
  const requestedCategoryId = Number(searchParams.get("category_id") || 0);
  const hasRequestedCategory = requestedCategoryId > 0;
  const renderAheadCount = CLIENT_CATEGORY_CACHE_ENABLED ? RENDER_AHEAD_COUNT : 0;
  const warmAheadCount = CLIENT_CATEGORY_CACHE_ENABLED ? WARM_AHEAD_COUNT : 0;

  const initialCategoryId = useMemo(() => {
    if (requestedCategoryId && categories.some((c) => c.id === requestedCategoryId)) {
      return requestedCategoryId;
    }

    return categories[0]?.id || 0;
  }, [categories, requestedCategoryId]);

  const [activeIdx, setActiveIdx] = useState(
    Math.max(0, categories.findIndex((c) => c.id === initialCategoryId))
  );
  const [renderStartIdx, setRenderStartIdx] = useState(0);
  const [renderStack, setRenderStack] = useState(() => {
    if (hasRequestedCategory) {
      // Render from 0 to the clicked category so user can scroll up
      return Array.from({ length: activeIdx + 1 }, (_, i) => i);
    }
    // From start: show first 2 categories
    const end = Math.min(activeIdx + 1, categories.length - 1);
    return Array.from({ length: end + 1 }, (_, i) => i);
  });
  const [productsByCategory, setProductsByCategory] = useState({});
  const loadingCategoryIdsRef = useRef({});
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  const [userScrolled, setUserScrolled] = useState(false);
  const [isStuck, setIsStuck] = useState(false);
  const [stickyH, setStickyH] = useState(0);
  const [refreshToken, setRefreshToken] = useState(0);
  const [carouselApi, setCarouselApi] = useState(null);

  const stickyHRef = useRef(0);
  const activeIdxRef = useRef(activeIdx);
  const warmTimeoutRef = useRef(null);
  const lastTriggerRef = useRef(0);
  const stickySentinelRef = useRef(null);
  const stickyWrapRef = useRef(null);
  const carouselApiRef = useRef(null);
  const sectionRefs = useRef([]);
  const sentinelRef = useRef(null);
  const restoredBrowserStateRef = useRef(false);
  const restoredCategoryIdRef = useRef(0);
  const lastCarouselTargetRef = useRef(-1);
  const pendingScrollIdxRef = useRef(null);
  const pendingScrollBehaviorRef = useRef("smooth");
  const manualScrollTargetRef = useRef(null);
  const manualScrollReleaseRef = useRef(null);
  const initialRequestedScrollDoneRef = useRef(false);
  const lastRequestedCategoryIdRef = useRef(requestedCategoryId);
  const correctionTimeoutsRef = useRef([]);
  const initialProductLoadDoneRef = useRef(false);
  const productsByCategoryRef = useRef({});

  const buildRenderStack = (lastIdx, startIdx = renderStartIdx) => {
    const safeLastIdx = Math.min(
      Math.max(Number.isInteger(lastIdx) ? lastIdx : -1, -1),
      categories.length - 1
    );
    const safeStartIdx = Math.max(
      0,
      Math.min(Number.isInteger(startIdx) ? startIdx : 0, safeLastIdx)
    );

    if (safeLastIdx < 0) {
      return [];
    }

    return Array.from(
      { length: safeLastIdx - safeStartIdx + 1 },
      (_, idx) => safeStartIdx + idx
    );
  };

  const getPriorityCategoryIds = () => {
    const candidateIndexes = Array.from(
      new Set([
        activeIdx - 1,
        activeIdx,
        activeIdx + 1,
        activeIdx + 2,
      ])
    ).filter((idx) => idx >= 0 && idx < categories.length);

    return candidateIndexes
      .map((idx) => categories[idx]?.id)
      .filter(Boolean);
  };

  const syncCategoryIndexes = (candidateIdxs, options = {}) => {
    if (!categories.length) {
      return;
    }

    const maxCategoryIdx = categories.length - 1;
    const validIdxs = Array.from(
      new Set(
        candidateIdxs
          .filter((idx) => Number.isInteger(idx))
          .map((idx) => Math.min(Math.max(idx, 0), maxCategoryIdx))
      )
    ).filter((idx) => categories[idx]);
    const candidateLastIdx = validIdxs.length ? Math.max(...validIdxs) : -1;
    const requestedStartIdx =
      typeof options.startIdx === "number" && options.startIdx >= 0
        ? options.startIdx
        : options.replace
          ? validIdxs[0] ?? renderStartIdx
          : renderStartIdx;

    const nextStartIdx = Math.min(
      Math.max(requestedStartIdx, 0),
      Math.max(categories.length - 1, 0)
    );

    if (nextStartIdx !== renderStartIdx) {
      setRenderStartIdx(nextStartIdx);
    }

    setRenderStack((prev) => {
      const previousLastIdx = options.replace
        ? nextStartIdx - 1
        : prev[prev.length - 1] ?? nextStartIdx - 1;
      const nextLastIdx = Math.max(previousLastIdx, candidateLastIdx);
      const nextIndexes = buildRenderStack(nextLastIdx, nextStartIdx);

      return nextIndexes.length === prev.length &&
        nextIndexes.every((idx, index) => idx === prev[index])
        ? prev
        : nextIndexes;
    });
  };

  useEffect(() => {
    if (lastRequestedCategoryIdRef.current === requestedCategoryId) {
      return;
    }

    lastRequestedCategoryIdRef.current = requestedCategoryId;
    initialRequestedScrollDoneRef.current = false;
    pendingScrollIdxRef.current = null;
    pendingScrollBehaviorRef.current = "smooth";
    manualScrollTargetRef.current = null;
    correctionTimeoutsRef.current.forEach((timeoutId) => {
      window.clearTimeout(timeoutId);
    });
    correctionTimeoutsRef.current = [];
  }, [requestedCategoryId]);

  useEffect(() => {
    return () => {
      if (manualScrollReleaseRef.current) {
        window.clearTimeout(manualScrollReleaseRef.current);
      }
      if (warmTimeoutRef.current) {
        window.clearTimeout(warmTimeoutRef.current);
      }
      if (animatedScrollRef.current) {
        cancelAnimationFrame(animatedScrollRef.current);
      }
      correctionTimeoutsRef.current.forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });
      correctionTimeoutsRef.current = [];
    };
  }, []);

  useEffect(() => {
    const onCacheRevalidate = (event) => {
      const resources = event?.detail?.resources || [];
      if (!Array.isArray(resources)) {
        return;
      }

      if (
        resources.includes("categories") ||
        resources.includes("products") ||
        resources.includes("promotions")
      ) {
        invalidateCategoryBrowserCaches();
        setProductsByCategory({});
        loadingCategoryIdsRef.current = {};
        setRefreshToken((prev) => prev + 1);
      }
    };

    window.addEventListener("rolling:cache-revalidate", onCacheRevalidate);
    return () =>
      window.removeEventListener("rolling:cache-revalidate", onCacheRevalidate);
  }, []);

  useEffect(() => {
    // On refresh token change (cache revalidation), reset and reload
    if (refreshToken > 0) {
      setProductsByCategory({});
      productsByCategoryRef.current = {};
    }
  }, [refreshToken]);

  useEffect(() => {
    productsByCategoryRef.current = productsByCategory;
  }, [productsByCategory]);

  useEffect(() => {
    activeIdxRef.current = activeIdx;
  }, [activeIdx]);

  useLayoutEffect(() => {
    stickyHRef.current = stickyH;
  }, [stickyH]);

  useEffect(() => {
    if (restoredBrowserStateRef.current) {
      return;
    }

    restoredBrowserStateRef.current = true;

    const savedState = getCategoryBrowserState(locale, path?.place);
    if (!savedState) {
      return;
    }

    // If the URL has a category_id that differs from the saved active category,
    // it's a fresh navigation from main page — skip restore.
    if (
      hasRequestedCategory &&
      Number(savedState.activeCategoryId) !== requestedCategoryId
    ) {
      return;
    }

    const savedRenderStack = (savedState.renderCategoryIds || [])
      .map((categoryId) =>
        categories.findIndex((category) => category.id === Number(categoryId))
      )
      .filter((idx) => idx >= 0);

    if (savedRenderStack.length) {
      const savedStartIdx = Math.min(...savedRenderStack);
      setRenderStartIdx(savedStartIdx);
      syncCategoryIndexes(savedRenderStack, { startIdx: savedStartIdx });

      const restoredProducts = {};
      savedRenderStack.forEach((idx) => {
        const categoryId = categories[idx]?.id;
        const cachedProducts = getCachedCategoryProducts(locale, categoryId);
        if (cachedProducts) {
          restoredProducts[categoryId] = cachedProducts;
        }
      });

      if (Object.keys(restoredProducts).length) {
        setProductsByCategory((prev) => ({
          ...restoredProducts,
          ...prev,
        }));
      }
    }

    const restoredCategoryId = Number(savedState.activeCategoryId || 0);
    if (!restoredCategoryId) {
      return;
    }

    const restoredIdx = categories.findIndex(
      (category) => category.id === restoredCategoryId
    );

    if (restoredIdx >= 0) {
      restoredCategoryIdRef.current = restoredCategoryId;
      setActiveIdx(restoredIdx);
      pendingScrollIdxRef.current = restoredIdx;
      pendingScrollBehaviorRef.current = "auto";
      initialRequestedScrollDoneRef.current = true;
    }
  }, [categories, hasRequestedCategory, locale, path?.place, requestedCategoryId]);

  useEffect(() => {
    if (restoredCategoryIdRef.current) {
      const restoredIdx = categories.findIndex(
        (category) => category.id === restoredCategoryIdRef.current
      );

      if (restoredIdx >= 0) {
        setActiveIdx(restoredIdx);
        setRenderStack((prev) => {
          if (prev.includes(restoredIdx)) {
            return prev;
          }

          return [...prev, restoredIdx].sort((a, b) => a - b);
        });
        return;
      }
    }

    const nextActiveIdx = Math.max(
      0,
      categories.findIndex((category) => category.id === initialCategoryId)
    );

    setActiveIdx(nextActiveIdx);
    if (hasRequestedCategory) {
      setRenderStartIdx(0);
      syncCategoryIndexes([nextActiveIdx + renderAheadCount], {
        replace: true,
        startIdx: 0,
      });
      return;
    }

    setRenderStartIdx(0);
    setRenderStack((prev) => {
      const nextIndexes = buildRenderStack(
        Math.max(prev[prev.length - 1] ?? -1, nextActiveIdx),
        0
      );
      if (
        nextIndexes.length === prev.length &&
        nextIndexes.every((idx, index) => idx === prev[index])
      ) {
        return prev;
      }

      return nextIndexes;
    });
  }, [
    categories,
    hasRequestedCategory,
    initialCategoryId,
    renderAheadCount,
    requestedCategoryId,
  ]);

  useEffect(() => {
    syncCategoryIndexes([activeIdx + renderAheadCount]);
  }, [activeIdx, categories.length, renderAheadCount]);

  useEffect(() => {
    if (!hasRequestedCategory || initialRequestedScrollDoneRef.current) {
      return;
    }

    const targetIdx = Math.max(
      0,
      categories.findIndex((category) => category.id === initialCategoryId)
    );
    const requiredLastIdx = Math.min(
      categories.length - 1,
      targetIdx + renderAheadCount
    );
    const currentLastIdx = renderStack[renderStack.length - 1] ?? -1;
    const hasExpandedStack =
      renderStack[0] === 0 && currentLastIdx >= requiredLastIdx;

    if (!hasExpandedStack) {
      return;
    }

    // Skip programmatic scroll for the first category — page naturally starts at top
    if (targetIdx > 0) {
      pendingScrollIdxRef.current = targetIdx;
      pendingScrollBehaviorRef.current = "auto";
      manualScrollTargetRef.current = targetIdx;
    }
    initialRequestedScrollDoneRef.current = true;
  }, [
    categories,
    hasRequestedCategory,
    initialCategoryId,
    renderAheadCount,
    renderStack,
  ]);

  useEffect(() => {
    const nextId = String(categories[activeIdx]?.id ?? "");
    if (!nextId) {
      return;
    }

    const currentId = new URLSearchParams(window.location.search).get(
      "category_id"
    );
    if (currentId === nextId) {
      return;
    }

    const url = new URL(window.location.href);
    url.searchParams.set("category_id", nextId);
    window.history.replaceState(window.history.state, "", url.toString());
  }, [activeIdx, categories]);

  useEffect(() => {
    if (userScrolled) return;

    // Check immediately — browser may have restored scroll on back-navigation
    if (window.scrollY > 40) {
      setUserScrolled(true);
      return;
    }

    const onScroll = () => {
      if (window.scrollY > 40) {
        setUserScrolled(true);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [userScrolled]);

  useEffect(() => {
    const sentinel = stickySentinelRef.current;
    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsStuck(!entry.isIntersecting),
      { root: null, threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

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

  const getVisibleHeaderHeight = () => {
    const header = document.querySelector("header");
    if (!header) {
      return 0;
    }

    const rect = header.getBoundingClientRect();
    const visibleTop = Math.max(rect.top, 0);
    const visibleBottom = Math.max(Math.min(rect.bottom, window.innerHeight), 0);
    return Math.max(0, visibleBottom - visibleTop);
  };

  const animatedScrollRef = useRef(null);

  const scrollToIdx = useCallback((idx, behavior = "smooth") => {
    const target = sectionRefs.current[idx];
    if (!target) {
      return;
    }

    const targetTop = window.scrollY + target.getBoundingClientRect().top;
    const offset = getVisibleHeaderHeight() + stickyHRef.current + HEADER_EXTRA_GAP;
    const top = Math.max(0, targetTop - offset);

    // For "auto" behavior (corrections, initial nav), use instant scroll
    if (behavior === "auto") {
      window.scrollTo({ top, behavior: "auto" });
      return;
    }

    // Cancel any ongoing animated scroll
    if (animatedScrollRef.current) {
      cancelAnimationFrame(animatedScrollRef.current);
      animatedScrollRef.current = null;
    }

    // Custom smooth scroll with controlled speed
    const start = window.scrollY;
    const distance = top - start;
    if (Math.abs(distance) < 4) return;

    // Duration scales with distance: min 400ms, max 1200ms
    const duration = Math.min(1200, Math.max(400, Math.abs(distance) * 0.4));
    const startTime = performance.now();

    const easeInOutCubic = (t) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeInOutCubic(progress);

      window.scrollTo({ top: start + distance * easedProgress, behavior: "auto" });

      if (progress < 1) {
        animatedScrollRef.current = requestAnimationFrame(step);
      } else {
        animatedScrollRef.current = null;
      }
    };

    animatedScrollRef.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || !userScrolled) {
            return;
          }

          const now = Date.now();
          if (now - lastTriggerRef.current < TRIGGER_COOLDOWN_MS) {
            return;
          }
          lastTriggerRef.current = now;

          const lastIdx = renderStack[renderStack.length - 1];
          if (lastIdx < categories.length - 1 && !isLoadingNext) {
            setIsLoadingNext(true);
            syncCategoryIndexes([lastIdx + 1]);
            setIsLoadingNext(false);
          }
        });
      },
      {
        root: null,
        rootMargin: "400px",
        threshold: 0,
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [categories.length, isLoadingNext, renderStack, userScrolled]);

  useEffect(() => {
    if (!renderStack.length) {
      return;
    }

    let animationFrame = null;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              Math.abs(a.boundingClientRect.top) -
              Math.abs(b.boundingClientRect.top)
          );

        if (!visible[0]) {
          return;
        }

        const idx = Number(visible[0].target.getAttribute("data-idx"));
        if (Number.isNaN(idx) || idx === activeIdxRef.current) {
          return;
        }

        const manualTargetIdx = manualScrollTargetRef.current;
        if (manualTargetIdx != null && manualTargetIdx !== idx) {
          return;
        }

        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }

        animationFrame = requestAnimationFrame(() => {
          setActiveIdx(idx);
          if (manualScrollTargetRef.current === idx) {
            manualScrollTargetRef.current = null;
            if (manualScrollReleaseRef.current) {
              window.clearTimeout(manualScrollReleaseRef.current);
              manualScrollReleaseRef.current = null;
            }
          }
        });
      },
      {
        root: null,
        rootMargin: `-${stickyH + HEADER_EXTRA_GAP}px 0px -60% 0px`,
        threshold: 0,
      }
    );

    renderStack.forEach((idx) => {
      const section = sectionRefs.current[idx];
      if (section) {
        observer.observe(section);
      }
    });

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      observer.disconnect();
    };
  }, [renderStack, stickyH]);

  useEffect(() => {
    const api = carouselApiRef.current;
    if (!api || typeof api.scrollTo !== "function") {
      return;
    }

    const visibleSlides =
      typeof api.slidesInView === "function" ? api.slidesInView() : [];

    if (visibleSlides.includes(activeIdx)) {
      lastCarouselTargetRef.current = activeIdx;
      return;
    }

    if (lastCarouselTargetRef.current === activeIdx) {
      return;
    }

    lastCarouselTargetRef.current = activeIdx;

    try {
      requestAnimationFrame(() => {
        carouselApiRef.current?.scrollTo(activeIdx, false);
      });
    } catch {}
  }, [activeIdx, carouselApi]);

  useEffect(() => {
    const pendingIdx = pendingScrollIdxRef.current;
    if (pendingIdx == null) {
      return;
    }

    const target = sectionRefs.current[pendingIdx];
    if (!target) {
      // Section not rendered yet — poll until it appears (max ~2s)
      let attempts = 0;
      const pollId = window.setInterval(() => {
        attempts++;
        const el = sectionRefs.current[pendingIdx];
        if (el) {
          window.clearInterval(pollId);
          pendingScrollIdxRef.current = null;
          scrollToIdx(pendingIdx, pendingScrollBehaviorRef.current || "auto");
        } else if (attempts > 20) {
          window.clearInterval(pollId);
          pendingScrollIdxRef.current = null;
        }
      }, 100);
      correctionTimeoutsRef.current.push(pollId);
      return;
    }

    correctionTimeoutsRef.current.forEach((timeoutId) => {
      window.clearTimeout(timeoutId);
    });
    correctionTimeoutsRef.current = [];

    const behavior = pendingScrollBehaviorRef.current || "smooth";
    pendingScrollIdxRef.current = null;
    requestAnimationFrame(() => {
      scrollToIdx(pendingIdx, behavior);

      if (behavior === "smooth") {
        // User-click: correct after animation completes
        const correctionDelays = [500, 1000, 1500];
        correctionDelays.forEach((delayMs) => {
          const timeoutId = window.setTimeout(() => {
            scrollToIdx(pendingIdx, "auto");
          }, delayMs);
          correctionTimeoutsRef.current.push(timeoutId);
        });
      } else if (pendingIdx > 0) {
        // Initial nav to non-first category: correct after products load
        // and cause layout shifts in nearby sections
        const correctionDelays = [400, 1000, 2000];
        correctionDelays.forEach((delayMs) => {
          const timeoutId = window.setTimeout(() => {
            scrollToIdx(pendingIdx, "auto");
          }, delayMs);
          correctionTimeoutsRef.current.push(timeoutId);
        });
      }

      if (manualScrollTargetRef.current === pendingIdx) {
        if (manualScrollReleaseRef.current) {
          window.clearTimeout(manualScrollReleaseRef.current);
        }
        manualScrollReleaseRef.current = window.setTimeout(() => {
          if (manualScrollTargetRef.current === pendingIdx) {
            manualScrollTargetRef.current = null;
          }
          manualScrollReleaseRef.current = null;
        }, 2000);
      }
    });
  }, [activeIdx, renderStack, stickyH, scrollToIdx]);

  useEffect(() => {
    const renderCategoryIds = renderStack
      .map((idx) => categories[idx]?.id)
      .filter(Boolean);

    saveCategoryBrowserState(locale, path?.place, {
      activeCategoryId: categories[activeIdx]?.id || initialCategoryId || 0,
      renderCategoryIds,
    });
  }, [activeIdx, categories, initialCategoryId, locale, path?.place, renderStack]);

  useEffect(() => {
    // Load products for the active category and neighbors.
    // On initial navigation to a non-first category, only load the target
    // and below to prevent sections above from growing and pushing the
    // target category out of the viewport.
    const isInitialNavLoad =
      hasRequestedCategory && !initialProductLoadDoneRef.current && activeIdx > 0;
    if (isInitialNavLoad) {
      initialProductLoadDoneRef.current = true;
    }
    const neighborIdxs = isInitialNavLoad
      ? [activeIdx, activeIdx + 1, activeIdx + 2]
      : [activeIdx - 2, activeIdx - 1, activeIdx, activeIdx + 1, activeIdx + 2];
    const candidateCategoryIds = Array.from(new Set(neighborIdxs))
      .filter((idx) => idx >= 0 && idx < categories.length)
      .map((idx) => categories[idx]?.id)
      .filter(Boolean);

    const missingCategoryIds = candidateCategoryIds.filter((categoryId) => {
      if (!categoryId || loadingCategoryIdsRef.current[categoryId]) {
        return false;
      }

      return true;
    });

    const currentProducts = productsByCategoryRef.current;
    const cachedToSet = {};
    const toLoad = [];

    for (const categoryId of missingCategoryIds) {
      if (currentProducts[categoryId]) {
        continue;
      }

      const cachedProducts = getCachedCategoryProducts(locale, categoryId);
      if (cachedProducts) {
        cachedToSet[categoryId] = cachedProducts;
        loadCategoryProducts(locale, categoryId, {
          onUpdate: (freshProducts) => {
            setProductsByCategory((prev) => ({
              ...prev,
              [categoryId]: freshProducts,
            }));
          },
        }).catch(() => {});
      } else {
        toLoad.push(categoryId);
      }
    }

    if (Object.keys(cachedToSet).length) {
      setProductsByCategory((prev) => ({
        ...prev,
        ...cachedToSet,
      }));
    }

    if (!toLoad.length) return;

    let cancelled = false;

    toLoad.forEach((categoryId) => {
      loadingCategoryIdsRef.current[categoryId] = true;

      loadCategoryProducts(locale, categoryId)
        .then((products) => {
          if (cancelled) return;
          setProductsByCategory((prev) => ({
            ...prev,
            [categoryId]: products,
          }));
        })
        .catch(() => {
          if (cancelled) return;
          setProductsByCategory((prev) => ({
            ...prev,
            [categoryId]: [],
          }));
        })
        .finally(() => {
          loadingCategoryIdsRef.current[categoryId] = false;
        });
    });

    return () => {
      cancelled = true;
    };
  }, [activeIdx, categories, locale, refreshToken]);

  useEffect(() => {
    const targetCategoryId = categories[activeIdx]?.id;
    if (!targetCategoryId || loadingCategoryIdsRef.current[targetCategoryId]) {
      return;
    }

    const targetProducts = productsByCategoryRef.current[targetCategoryId];
    if (Array.isArray(targetProducts) && targetProducts.length > 0) {
      return;
    }

    let cancelled = false;
    loadingCategoryIdsRef.current[targetCategoryId] = true;

    loadCategoryProducts(locale, targetCategoryId)
      .then((products) => {
        if (cancelled) return;
        setProductsByCategory((prev) => ({
          ...prev,
          [targetCategoryId]: products,
        }));
      })
      .catch(() => {
        if (cancelled) return;
        setProductsByCategory((prev) => ({
          ...prev,
          [targetCategoryId]: prev[targetCategoryId] || [],
        }));
      })
      .finally(() => {
        loadingCategoryIdsRef.current[targetCategoryId] = false;
      });

    return () => {
      cancelled = true;
    };
  }, [activeIdx, categories, locale]);

  useEffect(() => {
    if (!CLIENT_CATEGORY_CACHE_ENABLED || warmAheadCount <= 0) {
      return;
    }

    const candidateIdxs = Array.from(
      { length: warmAheadCount },
      (_, offset) => activeIdx + offset + 1
    ).filter((idx) => idx < categories.length);
    if (!candidateIdxs.length) {
      return;
    }

    const nextCategoryIds = candidateIdxs
      .map((idx) => categories[idx]?.id)
      .filter(
        (categoryId) =>
          categoryId &&
          !productsByCategoryRef.current[categoryId] &&
          !loadingCategoryIdsRef.current[categoryId]
    );

    if (!nextCategoryIds.length) {
      return;
    }

    let cancelled = false;

    nextCategoryIds.forEach((categoryId) => {
      loadingCategoryIdsRef.current[categoryId] = true;

      warmCategoryProducts(locale, categoryId, {
        onUpdate: (freshProducts) => {
          if (cancelled || !freshProducts.length) return;
          setProductsByCategory((p) => ({
            ...p,
            [categoryId]: freshProducts,
          }));
        },
      })
        .then((products) => {
          if (cancelled) return;
          setProductsByCategory((p) => ({
            ...p,
            [categoryId]: products,
          }));
        })
        .catch(() => {
          if (cancelled) return;
          setProductsByCategory((p) => ({
            ...p,
            [categoryId]: [],
          }));
        })
        .finally(() => {
          loadingCategoryIdsRef.current[categoryId] = false;
        });
    });

    return () => {
      cancelled = true;
    };
  }, [activeIdx, categories, locale, warmAheadCount]);

  const onSelectCategory = (idx) => {
    pendingScrollIdxRef.current = idx;
    pendingScrollBehaviorRef.current = "smooth";
    manualScrollTargetRef.current = idx;

    syncCategoryIndexes([idx + renderAheadCount]);
    setActiveIdx(idx);

    setIsLoadingNext(false);
  };

  const carouselOpts = useMemo(() => ({
    align: "start",
    dragFree: false,
    loop: false,
    containScroll: "trimSnaps",
  }), []);

  const handleSetCarouselApi = useCallback((api) => {
    carouselApiRef.current = api;
    setCarouselApi(api);
  }, []);

  const spot = searchParams.get("spot") || "";
  const table_id = searchParams.get("table_id") || "";
  const table_num = searchParams.get("table_num") || "";
  const service = searchParams.get("service") || "";

  return (
    <div className="space-y-6">
      <div ref={stickySentinelRef} className="h-px" />

      <div
        ref={stickyWrapRef}
        className={cn(
          "md:w-11/12 mx-auto sticky top-0 z-30 w-full transition-colors",
          "backdrop-blur-sm",
          isStuck ? "bg-secondary shadow-sm" : "bg-transparent",
          "pt-2 pb-2"
        )}
      >
        <Carousel
          className="w-full"
          opts={carouselOpts}
          setApi={handleSetCarouselApi}
        >
          <CarouselContent className="-ml-2">
            {categories.map((category, idx) => (
              <CarouselItem
                key={category.id}
                className="basis-[22%] sm:basis-[15%] md:basis-[12%] xl:basis-[8%] pl-2"
              >
                <button
                  onClick={() => onSelectCategory(idx)}
                  onMouseEnter={() => {
                    if (CLIENT_CATEGORY_CACHE_ENABLED) {
                      if (warmTimeoutRef.current) window.clearTimeout(warmTimeoutRef.current);
                      warmTimeoutRef.current = window.setTimeout(() => {
                        warmCategoryProducts(locale, category.id);
                      }, 150);
                    }
                  }}
                  onTouchStart={() => {
                    if (CLIENT_CATEGORY_CACHE_ENABLED) {
                      warmCategoryProducts(locale, category.id);
                    }
                  }}
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
                      src={
                        category.photo ? `${posterUrl}${category.photo}` : "/empty.jpg"
                      }
                      alt={category.name}
                      className="w-full h-full object-cover"
                      sizes="(max-width: 640px) 22vw, (max-width: 1280px) 12vw, 8vw"
                    />
                  </div>
                  <div className="line-clamp-1 text-center text-xs md:text-sm font-semibold">
                    {category.name}
                  </div>
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      <div className="w-11/12 mx-auto space-y-10">
        {renderStack.map((catIdx) => {
          const category = categories[catIdx];
          const items = productsByCategory[category.id] || [];
          const isCategoryLoading = items.length === 0;

          return (
            <section
              key={`section-${category.id}`}
              data-idx={catIdx}
              ref={(element) => {
                sectionRefs.current[catIdx] = element;
              }}
              style={{ scrollMarginTop: (stickyH || 0) + HEADER_EXTRA_GAP + 4 }}
              className="space-y-4"
            >
              <h2 className="text-base sm:text-lg font-bold">{category.name}</h2>

              <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-5">
                {items.map((item, index) => {
                  const linkNameProduct = formatText(item.linkNameProduct);
                  const linkNameCategory = formatText(item.linkNameCategory);

                  return (
                    <Card
                      key={`${category.id}-${item.product_id}-${index}`}
                      defaultHref={
                        path?.place !== "branch"
                          ? `/${locale}/${path.place}/category/${item?.menu_category_id}-${linkNameCategory}/product/${item?.product_id}-${linkNameProduct}`
                          : `/${locale}/${path.place}/category/${item?.menu_category_id}-${linkNameCategory}/product/${item?.product_id}-${linkNameProduct}?spot=${spot}&table_id=${table_id}&table_num=${table_num}&service=${service}`
                      }
                      locale={locale}
                      item={item}
                      localizedDesc={item.localizedDesc}
                      localizedName={item.localizedName}
                      photo={item.photo_origin || item.photo}
                      price={item.price["1"] / 100}
                    />
                  );
                })}
                {isCategoryLoading &&
                  Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={`skeleton-${category.id}-${i}`}
                      className="w-full bg-white rounded-md p-2 space-y-2 animate-pulse"
                    >
                      <div className="w-full aspect-square rounded-sm bg-gray-200" />
                      <div className="space-y-2">
                        <div className="h-3 w-3/4 rounded bg-gray-200" />
                        <div className="h-2.5 w-1/2 rounded bg-gray-200" />
                        <div className="h-3 w-1/3 rounded bg-gray-200" />
                      </div>
                      <div className="flex justify-end">
                        <div className="h-8 w-16 rounded-md bg-gray-200" />
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          );
        })}
      </div>

      {renderStack[renderStack.length - 1] < categories.length - 1 && (
        <>
          {isLoadingNext && (
            <div className="w-full flex flex-col items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin" />
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
