"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useTranslations } from "use-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatNumber, getLocalizedProduct } from "@/lib/utils";
import { cancelClientOrder, getAllOrders, refreshOrderStatuses } from "@/actions";

/* ── helpers ── */

const normalizeOrderIdToken = (value) => {
  const token = String(value || "").trim();
  if (!token) return "";
  return token.startsWith("#") ? token.slice(1) : token;
};

const isObjectIdLike = (value) => /^[a-f0-9]{24}$/i.test(String(value || "").trim());
const isUuidLike = (value) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    String(value || "").trim()
  );
const isNumericOrderId = (value) => /^\d+$/.test(String(value || "").trim());
const isTechnicalOrderId = (value) => isObjectIdLike(value) || isUuidLike(value);

const resolveDisplayOrderId = (item) => {
  const candidates = [
    item?.display_order_id,
    item?.posterTransactionId,
    item?.PosterTransactionId,
    item?.poster_transaction_id,
    item?.orderNumber,
    item?.OrderNumber,
    item?.linkedOrderNumber,
    item?.LinkedOrderNumber,
    item?.posterIncomingOrderId,
    item?.PosterIncomingOrderId,
    item?.poster_incoming_order_id,
    item?.incoming_order_id,
    item?.incomingOrderId,
    item?.order_number,
    item?.order_id,
    item?.OrderId,
    item?.id,
    item?.Id,
  ]
    .map(normalizeOrderIdToken)
    .filter(Boolean);

  const numericId = candidates.find((c) => isNumericOrderId(c));
  if (numericId) return numericId;

  const readableId = candidates.find((c) => !isTechnicalOrderId(c));
  return readableId || "";
};

const toMinorSafe = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const resolveMinorAmount = (item) => {
  const candidates = [
    item?.all_price,
    item?.total_price,
    item?.payed_sum,
    item?.sum,
    item?.subtotal_price,
  ]
    .map(toMinorSafe)
    .filter((v) => v != null && v > 0);
  return candidates[0] || 0;
};

const formatOrderDateTime = (value, locale) => {
  const localeMap = { uz: "uz-UZ", ru: "ru-RU", en: "en-US" };
  const targetLocale = localeMap[String(locale || "uz").toLowerCase()] || "uz-UZ";

  const normalizeDate = (raw) => {
    if (raw == null) return null;
    if (typeof raw === "number" && Number.isFinite(raw)) return new Date(raw);
    const text = String(raw).trim();
    if (!text) return null;
    if (/^\d{11,16}$/.test(text)) {
      const millis = Number(text);
      if (Number.isFinite(millis)) return new Date(millis);
    }
    const parsed = new Date(text);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const date = normalizeDate(value);
  if (!date) return String(value || "-");

  return new Intl.DateTimeFormat(targetLocale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
};

const readLocalOrders = () => {
  try {
    const parsed = localStorage.getItem("orderList")
      ? JSON.parse(localStorage.getItem("orderList"))
      : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const getOrderIdentityTokens = (item) => {
  const candidates = [
    item?.display_order_id,
    item?.posterTransactionId,
    item?.PosterTransactionId,
    item?.poster_transaction_id,
    item?.transactionId,
    item?.transaction_id,
    item?.orderNumber,
    item?.OrderNumber,
    item?.linkedOrderNumber,
    item?.LinkedOrderNumber,
    item?.posterIncomingOrderId,
    item?.PosterIncomingOrderId,
    item?.poster_incoming_order_id,
    item?.incoming_order_id,
    item?.incomingOrderId,
    item?.order_id,
    item?.OrderId,
    item?.id,
    item?.Id,
  ]
    .map(normalizeOrderIdToken)
    .filter(Boolean);

  return Array.from(new Set(candidates));
};

const parseOrderProducts = (order) => {
  if (typeof order?.products === "string") {
    try {
      const parsed = JSON.parse(order.products || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  if (Array.isArray(order?.products)) return order.products;
  if (Array.isArray(order?.items)) return order.items;
  return [];
};

/* ── status helpers (like iOS OrderFilter) ── */

const TERMINAL_STATUSES = ["cancel", "cancelled", "canceled", "rejected"];
const FINISHED_STATUSES = ["finished", "delivered", "completed", "done", "taken", "closed"];

const getNormalizedStatus = (status) =>
  String(status || "")
    .toLowerCase()
    .replace(/[\s_-]+/g, "");

const isActiveOrder = (status) => {
  const n = getNormalizedStatus(status);
  return !TERMINAL_STATUSES.includes(n) && !FINISHED_STATUSES.includes(n);
};

const isFinishedOrder = (status) => FINISHED_STATUSES.includes(getNormalizedStatus(status));
const isCancelledOrder = (status) => TERMINAL_STATUSES.includes(getNormalizedStatus(status));
const isPendingOrder = (status) =>
  ["pending", "awaitingpayment"].includes(getNormalizedStatus(status));

const getOrderCreatedAtValue = (order) => {
  const value = new Date(order?.created_at || 0).getTime();
  return Number.isFinite(value) ? value : 0;
};

const getOrderPriorityScore = (order) => {
  const status = getNormalizedStatus(order?.status);
  if (isCancelledOrder(status)) return 3;
  if (isFinishedOrder(status)) return 2;
  if (isActiveOrder(status)) return 1;
  return 0;
};

const selectPreferredOrder = (current, candidate) => {
  if (!current) return candidate;

  const currentScore = getOrderPriorityScore(current);
  const candidateScore = getOrderPriorityScore(candidate);
  if (candidateScore !== currentScore) {
    return candidateScore > currentScore ? candidate : current;
  }

  const currentDate = getOrderCreatedAtValue(current);
  const candidateDate = getOrderCreatedAtValue(candidate);
  if (candidateDate !== currentDate) {
    return candidateDate > currentDate ? candidate : current;
  }

  const currentId = String(current?.id || "");
  const candidateId = String(candidate?.id || "");
  return candidateId > currentId ? candidate : current;
};

/* ── merge (like iOS syncMissingOrdersFromBackend) ── */

const mergeOrders = (backendOrders = [], localOrders = []) => {
  const backendList = Array.isArray(backendOrders) ? backendOrders : [];
  const localList = Array.isArray(localOrders) ? localOrders : [];
  const deduped = [];
  const tokenToIndex = new Map();

  const appendIfUnique = (item) => {
    const tokens = getOrderIdentityTokens(item);
    const existingToken = tokens.find((token) => tokenToIndex.has(token));
    if (existingToken !== undefined) return false;

    const index = deduped.push(item) - 1;
    tokens.forEach((token) => tokenToIndex.set(token, index));
    return true;
  };

  backendList.forEach((item) => appendIfUnique(item));
  localList.forEach((item) => appendIfUnique(item));

  return deduped;
};

/* ── filter tabs (like iOS OrderFilter) ── */
const FILTER_ALL = "all";
const FILTER_ACTIVE = "active";
const FILTER_COMPLETED = "completed";
const FILTER_CANCELLED = "cancelled";

/* ── polling interval (like iOS 30s) ── */
const POLL_INTERVAL_MS = 30_000;

/* ── component ── */

export default function OrderDataComponent({
  locale,
  path,
  backendOrders = [],
  productsData = [],
}) {
  const orderText = useTranslations("Order");
  const orderTextItem = useTranslations("Cart.Payment");
  const statusData = useTranslations("Order.OrderStatus");
  const all = useTranslations("All");
  const [orderData, setOrderData] = useState([]);
  const [activeFilter, setActiveFilter] = useState(FILTER_ALL);
  const [cancellingId, setCancellingId] = useState("");
  const pollTimerRef = useRef(null);
  const isMountedRef = useRef(true);
  const latestOrderDataRef = useRef([]);
  const isSyncInFlightRef = useRef(false);
  const lastSyncAtRef = useRef(0);

  const productsById = useMemo(() => {
    const map = new Map();
    (Array.isArray(productsData) ? productsData : []).forEach((product) => {
      const id = String(product?.product_id ?? "").trim();
      if (id) map.set(id, product);
    });
    return map;
  }, [productsData]);

  /* ── initial merge (server data + localStorage) ── */
  useEffect(() => {
    setOrderData(mergeOrders(backendOrders, readLocalOrders()));
  }, [backendOrders]);

  useEffect(() => {
    latestOrderDataRef.current = Array.isArray(orderData) ? orderData : [];
  }, [orderData]);

  /* ── periodic polling like iOS (every 30s when page is visible) ── */
  const syncFromBackend = useCallback(async () => {
    if (!isMountedRef.current) return;
    if (isSyncInFlightRef.current) return;
    if (Date.now() - lastSyncAtRef.current < 1500) return;

    isSyncInFlightRef.current = true;
    try {
      // Step 1: fetch full orders (like iOS syncMissingOrdersFromBackend)
      const freshData = await getAllOrders();
      const freshOrders = freshData?.orders || [];

      if (!isMountedRef.current) return;

      const mergedOrders = mergeOrders(freshOrders, latestOrderDataRef.current);
      setOrderData(mergedOrders);

      // Step 2: batch status sync for active orders (like iOS performOrderStatusSync)
      const activeOrderIds = mergedOrders
        .filter((o) => isActiveOrder(o?.status))
        .map((o) => o?.id)
        .filter(Boolean)
        .slice(0, 100);

      if (activeOrderIds.length === 0) return;

      const statuses = await refreshOrderStatuses(activeOrderIds);
      if (!isMountedRef.current || !Array.isArray(statuses) || statuses.length === 0) return;

      const statusMap = new Map();
      statuses.forEach((statusItem) => {
        if (statusItem?.id) statusMap.set(statusItem.id, statusItem);
      });

      setOrderData((current) =>
        current.map((order) => {
          const update = statusMap.get(order?.id);
          if (!update) return order;

          const newStatus = getNormalizedStatus(update.status);
          const currentStatus = getNormalizedStatus(order?.status);
          if (newStatus === currentStatus) return order;

          return {
            ...order,
            status: update.status || order.status,
            display_order_id: update.orderNumber || order.display_order_id,
            order_id: update.orderNumber || order.order_id,
            posterIncomingOrderId:
              update.posterIncomingOrderId || order.posterIncomingOrderId,
            posterTransactionId:
              update.posterTransactionId || order.posterTransactionId,
          };
        })
      );
    } catch (error) {
      console.error("Order sync failed", error);
    } finally {
      lastSyncAtRef.current = Date.now();
      isSyncInFlightRef.current = false;
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;

    const startPolling = () => {
      stopPolling();
      pollTimerRef.current = setInterval(() => {
        if (document.visibilityState === "visible") {
          syncFromBackend();
        }
      }, POLL_INTERVAL_MS);
    };

    const stopPolling = () => {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        syncFromBackend();
        startPolling();
      } else {
        stopPolling();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    startPolling();

    return () => {
      isMountedRef.current = false;
      stopPolling();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [syncFromBackend]);

  const visibleOrders = useMemo(() => {
    const deduped = new Map();

    (Array.isArray(orderData) ? orderData : []).forEach((item) => {
      const displayId = resolveDisplayOrderId(item);
      if (!displayId || isTechnicalOrderId(displayId)) return;

      const existing = deduped.get(displayId);
      deduped.set(displayId, selectPreferredOrder(existing, item));
    });

    return Array.from(deduped.values());
  }, [orderData]);

  /* ── derived: filtered & sorted orders ── */
  const sortedOrders = useMemo(() => {
    if (!Array.isArray(visibleOrders)) return [];

    let filtered = visibleOrders;
    if (activeFilter === FILTER_ACTIVE) {
      filtered = visibleOrders.filter((o) => isActiveOrder(o?.status));
    } else if (activeFilter === FILTER_COMPLETED) {
      filtered = visibleOrders.filter((o) => isFinishedOrder(o?.status));
    } else if (activeFilter === FILTER_CANCELLED) {
      filtered = visibleOrders.filter((o) => isCancelledOrder(o?.status));
    }

    return [...filtered].sort((a, b) => {
      const dateA = new Date(a?.created_at || 0).getTime();
      const dateB = new Date(b?.created_at || 0).getTime();
      if (Number.isFinite(dateA) && Number.isFinite(dateB) && dateA !== dateB) {
        return dateB - dateA;
      }
      const idA = Number(resolveDisplayOrderId(a) || 0);
      const idB = Number(resolveDisplayOrderId(b) || 0);
      return idB - idA;
    });
  }, [visibleOrders, activeFilter]);

  /* ── display helpers ── */
  const countProducts = (item) => {
    try {
      const products =
        typeof item?.products === "string"
          ? JSON.parse(item.products)
          : Array.isArray(item?.products)
            ? item.products
            : [];
      return products.reduce(
        (sum, p) => sum + Number(p?.amount || p?.count || 0),
        0
      );
    } catch {
      return 0;
    }
  };

  const getProductsPreview = (item) => {
    try {
      const products = parseOrderProducts(item);
      const itemDisplayId = resolveDisplayOrderId(item);
      const localFallbackOrder = readLocalOrders().find((order) => {
        const localDisplayId = resolveDisplayOrderId(order);
        return (
          String(localDisplayId || "") === String(itemDisplayId || "") ||
          String(order?.order_id || "") === String(itemDisplayId || "")
        );
      });
      const localProducts = parseOrderProducts(localFallbackOrder);
      const names = products
        .map((product) => {
          const productId = String(product?.product_id ?? product?.menuItemId ?? "");
          const localProduct = localProducts.find(
            (lp) =>
              String(lp?.product_id ?? lp?.menuItemId ?? "") === productId
          );
          const catalogProduct = productsById.get(productId);
          const localizedName =
            getLocalizedProduct(catalogProduct?.product_production_description, locale, "name") ||
            getLocalizedProduct(localProduct?.product_production_description, locale, "name") ||
            getLocalizedProduct(product?.product_production_description, locale, "name");
          return String(
            localizedName ||
              localProduct?.name ||
              localProduct?.backend_name ||
              catalogProduct?.product_name ||
              product?.name ||
              product?.backend_name ||
              ""
          ).trim();
        })
        .filter(Boolean)
        .slice(0, 2);
      if (names.length === 0) return "-";
      return names.join(", ");
    } catch {
      return "-";
    }
  };

  const getStatusMeta = (status, type) => {
    const normalized = getNormalizedStatus(status);
    const normalizedType = String(type || "").toLowerCase();
    const isTakeaway =
      normalizedType.includes("take_away") || normalizedType.includes("pickup");

    if (["pending", "awaitingpayment"].includes(normalized)) {
      return { label: orderText("OrderStatus.pending"), className: "text-amber-600" };
    }
    if (["accept", "accepted", "confirmed"].includes(normalized)) {
      return { label: orderText("OrderStatus.confirmed"), className: "text-primary" };
    }
    if (TERMINAL_STATUSES.includes(normalized)) {
      return { label: orderText("OrderStatus.cancelled"), className: "text-red-600" };
    }
    if (FINISHED_STATUSES.includes(normalized)) {
      return {
        label: isTakeaway
          ? orderText("OrderStatus.taken")
          : orderText("OrderStatus.finished"),
        className: "text-emerald-600",
      };
    }
    if (["delivery", "ontheway", "indelivery", "courier"].includes(normalized)) {
      return {
        label: isTakeaway
          ? orderText("OrderStatus.ready-pickup")
          : orderText("OrderStatus.in-deliver"),
        className: "text-amber-600",
      };
    }
    if (["cooking", "preparing", "prepared", "inprogress"].includes(normalized)) {
      return { label: orderText("OrderStatus.cooking"), className: "text-orange-600" };
    }
    return { label: orderText("OrderStatus.confirmed"), className: "text-primary" };
  };

  const getOrderTypeLabel = (type) => {
    const normalized = String(type || "").toLowerCase();
    if (normalized.includes("delivery")) return orderText("Item.status_delivery");
    if (normalized.includes("take_away") || normalized.includes("pickup")) {
      return orderText("Item.status_pickup");
    }
    return orderText("Item.status_spot");
  };

  const getDisplayOrderId = (item) => resolveDisplayOrderId(item);

  const handleCancelOrder = async (item) => {
    const displayOrderId = getDisplayOrderId(item);
    if (!displayOrderId || !isPendingOrder(item?.status) || cancellingId) return;

    setCancellingId(displayOrderId);
    try {
      const payload = {
        orderId: item?.id || undefined,
        orderNumber: displayOrderId || undefined,
        posterIncomingOrderId:
          item?.posterIncomingOrderId ||
          item?.poster_incoming_order_id ||
          item?.incoming_order_id ||
          undefined,
        posterTransactionId:
          item?.posterTransactionId || item?.poster_transaction_id || undefined,
      };

      const response = await cancelClientOrder(payload);
      if (response) {
        setOrderData((prev) =>
          prev.map((row) => {
            const same =
              getDisplayOrderId(row) === displayOrderId ||
              String(row?.id || "") === String(item?.id || "");
            return same ? { ...row, status: "cancelled" } : row;
          })
        );
      }
    } finally {
      setCancellingId("");
    }
  };

  /* ── filter tab counts ── */
  const filterCounts = useMemo(() => {
    const counts = { all: 0, active: 0, completed: 0, cancelled: 0 };
    visibleOrders.forEach((o) => {
      counts.all++;
      if (isActiveOrder(o?.status)) counts.active++;
      else if (isFinishedOrder(o?.status)) counts.completed++;
      else if (isCancelledOrder(o?.status)) counts.cancelled++;
    });
    return counts;
  }, [visibleOrders]);

  const filterTabs = [
    { key: FILTER_ALL, label: orderText("filter_all"), count: filterCounts.all },
    { key: FILTER_ACTIVE, label: orderText("filter_active"), count: filterCounts.active },
    { key: FILTER_COMPLETED, label: orderText("filter_completed"), count: filterCounts.completed },
    { key: FILTER_CANCELLED, label: orderText("filter_cancelled"), count: filterCounts.cancelled },
  ];

  /* ── order card renderer ── */
  const renderOrderCard = (item, i, isMobile = false) => {
    const productsCount = countProducts(item);
    const productsPreview = getProductsPreview(item);
    const statusMeta = getStatusMeta(item?.status, item?.type);
    const orderTypeLabel = getOrderTypeLabel(item?.type);
    const displayOrderId = getDisplayOrderId(item);
    const amountMinor = resolveMinorAmount(item);
    const displayDate = formatOrderDateTime(item?.created_at, locale);
    const canCancel = isPendingOrder(item?.status);
    const isCancelling = cancellingId === displayOrderId;
    const isCancelledWithOnlinePayment =
      isCancelledOrder(item?.status) &&
      (item?.payment_type === "click" || item?.payment_type === "payme");

    const cardContent = (
      <>
        <div className="flex flex-col gap-y-3">
          <div className="w-full flex justify-between gap-2">
            <p className={`${isMobile ? "text-[15px] lg:text-lg" : "textSmall4"} font-semibold text-thin`}>
              {orderText("order_title")} № {displayOrderId}
            </p>
            <p className={`${isMobile ? "text-[13px] lg:text-lg" : "textSmall3"} font-semibold ${statusMeta.className}`}>
              {statusMeta.label}
            </p>
          </div>
          {isCancelledWithOnlinePayment && (
            <div className="flex items-start gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-2">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-4 w-4 flex-shrink-0 text-amber-500 mt-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p className="text-[11px] text-amber-800 leading-4">
                {statusData("refund_notice")}
              </p>
            </div>
          )}
          <p className="textSmall3 text-[#A098AE]">{orderTypeLabel}</p>
          <p className="textSmall2 text-[#A098AE]">
            {item?.branch_name || item?.spot_name || "-"}
          </p>
          <p className="textSmall2 text-[#A098AE]">
            {item?.branch_address || item?.spot_address || item?.deliveryAddress || "-"}
          </p>
          <p className={`${isMobile ? "text-[13px] lg:text-2xl" : "textNormal4"} font-bold text-thin`}>
            {formatNumber(amountMinor / 100)} {all("sum")}
          </p>
          <p className="w-full textSmall3 text-thin flex justify-between">
            <strong>{orderText("product_title")}: </strong>
            <span>{productsCount}</span>
          </p>
          <p className="textSmall2 text-[#A098AE]">{productsPreview}</p>
          <div className={`w-full ${isMobile ? "" : "hidden lg:flex"} flex justify-between textSmall1 pt-[14px]`}>
            {orderText("payment_method")} :{" "}
            <p className="textSmall3 text-thin">
              {item?.payment_type == "cash"
                ? orderTextItem("cash")
                : item?.payment_type == "payme"
                  ? "Payme"
                  : item?.payment_type == "click"
                    ? "Click"
                    : orderTextItem("card")}
            </p>
          </div>
          <p className={`${isMobile ? "text-[13px] lg:text-lg" : "textSmall2"} font-normal text-[#A098AE]`}>
            {displayDate}
          </p>
        </div>
        <div className={`${isMobile ? "mt-2" : ""} flex flex-col gap-2`}>
          <Link
            href={`/${locale}/${path.place}/${
              item?.payment_type == "payme" || item?.payment_type == "click"
                ? "orderpay"
                : "order"
            }/${displayOrderId}`}
          >
            <Button
              aria-label="ordata show"
              className={`w-full ${isMobile ? "h-8" : ""} hover:bg-primary text-[13px] text-white`}
            >
              {orderText("show_order")}
            </Button>
          </Link>
          {canCancel && (
            <Button
              aria-label="ordata cancel"
              type="button"
              disabled={isCancelling}
              onClick={() => handleCancelOrder(item)}
              className={`w-full ${isMobile ? "h-8" : ""} bg-red-500 hover:bg-red-600 text-[13px] text-white disabled:opacity-70`}
            >
              {all("cancel")}
            </Button>
          )}
        </div>
      </>
    );

    return cardContent;
  };

  return (
    <div className="w-full">
      {/* ── Filter tabs (like iOS: Barchasi / Faol / Yakunlangan / Bekor qilingan) ── */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveFilter(tab.key)}
            className={`px-4 py-2 rounded-full text-[13px] font-medium transition-colors ${
              activeFilter === tab.key
                ? "bg-primary text-white"
                : "bg-background text-thin hover:bg-primary/10"
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`ml-1.5 text-[11px] ${activeFilter === tab.key ? "text-white/70" : "text-[#A098AE]"}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Desktop grid ── */}
      <div className="hidden lg:grid md:grid-cols-3 w-full gap-6">
        {sortedOrders?.length > 0 ? (
          sortedOrders.map((item, i) => (
            <div
              className="w-full rounded-2xl bg-background p-5 flex flex-col justify-between gap-4"
              key={item?.id || i}
            >
              {renderOrderCard(item, i, false)}
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-8 text-[#A098AE]">
            {all("order_empty")}
          </div>
        )}
      </div>

      {/* ── Mobile carousel ── */}
      <Carousel
        opts={{ align: "start" }}
        className="w-full mt-[29px] flex gap-5 lg:hidden"
      >
        <CarouselContent>
          {sortedOrders?.map((item, i) => (
            <CarouselItem key={item?.id || i} className="basis-auto">
              <div className="bg-white rounded-2xl p-5 flex flex-col justify-between w-[300px]">
                {renderOrderCard(item, i, true)}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
