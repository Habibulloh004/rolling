"use client";

import { getOrder, getOrderRender } from "@/actions";
import { verifyPaymentTransaction } from "@/actions/post";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  formatNumber,
  getLocalizedProduct,
  posterUrl,
  translateTextSpot,
  translateTextSpotAddress,
} from "@/lib/utils";
import { useOrderStore, useProductStore } from "@/store";
import {
  canLaunchPaymentApp,
  getPaymentLinkHref,
  openPaymentUrl,
} from "@/lib/payment-launch";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "use-intl";
const loadConfetti = () => import("canvas-confetti").then((m) => m.default);

export default function OrderItemComponent({
  spotsData,
  promotions,
  productsData,
  locale,
  param,
}) {
  const orderText = useTranslations("Order.Item");
  const promotionT = useTranslations("Order.Promocode");
  const all = useTranslations("All");
  const total = useTranslations("Cart.Total");
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    pendingOnlinePayment,
    clearPendingOnlinePayment,
    setOrderData: setOrderDataStore,
    setPaymentData,
    setSelectCard,
    setTotalSum,
  } = useOrderStore();
  const { setProductsData } = useProductStore();
  const normalizeIdentifier = useCallback((value) => {
    return String(value ?? "")
      .trim()
      .replace(/^#/, "");
  }, []);
  const extractCanonicalOrderId = useCallback(
    (payload) => {
      if (!payload || typeof payload !== "object") return null;
      const isObjectIdLike = (value) => /^[a-f0-9]{24}$/i.test(String(value || "").trim());
      const candidates = [
        payload?.linkedOrderNumber,
        payload?.LinkedOrderNumber,
        payload?.orderNumber,
        payload?.OrderNumber,
        payload?.posterIncomingOrderId,
        payload?.PosterIncomingOrderId,
        payload?.order_id,
        payload?.orderId,
        payload?.OrderId,
        payload?.posterTransactionId,
        payload?.PosterTransactionId,
      ];
      let fallbackObjectId = null;
      for (const candidate of candidates) {
        const normalized = normalizeIdentifier(candidate);
        if (!normalized) continue;
        if (!isObjectIdLike(normalized)) return normalized;
        if (!fallbackObjectId) fallbackObjectId = normalized;
      }
      return fallbackObjectId;
    },
    [normalizeIdentifier]
  );
  const transactionParam = searchParams.get("transaction_param");
  const merchantTransId = searchParams.get("merchant_trans_id");
  const transactionIdQuery = searchParams.get("transaction_id");
  const transactionIdCamelQuery = searchParams.get("transactionId");
  const idQuery = searchParams.get("id");
  const txQuery = searchParams.get("tx");
  const verificationTransactionIds = useMemo(() => {
    const transactionIdCandidates = [
      normalizeIdentifier(param?.id),
      normalizeIdentifier(transactionParam),
      normalizeIdentifier(merchantTransId),
      normalizeIdentifier(transactionIdQuery),
      normalizeIdentifier(transactionIdCamelQuery),
      normalizeIdentifier(idQuery),
      normalizeIdentifier(txQuery),
      normalizeIdentifier(pendingOnlinePayment?.transactionId),
    ].filter(Boolean);
    return Array.from(new Set(transactionIdCandidates));
  }, [
    idQuery,
    merchantTransId,
    normalizeIdentifier,
    param?.id,
    pendingOnlinePayment?.transactionId,
    transactionIdCamelQuery,
    transactionIdQuery,
    transactionParam,
    txQuery,
  ]);
  const primaryTransactionId =
    verificationTransactionIds[0] || normalizeIdentifier(param?.id);
  const orderIdFromQuery =
    normalizeIdentifier(searchParams.get("order_id")) ||
    normalizeIdentifier(searchParams.get("orderId"));
  const hasAutostartParam = searchParams.get("autostart") === "1";
  const isPaymentAppLaunchSupported = canLaunchPaymentApp();
  const [orderData, setOrderData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [payError, setPayError] = useState(true);
  const [promotionData, setPromotionData] = useState();
  const [resolvedOrderId, setResolvedOrderId] = useState(orderIdFromQuery || null);
  const displayOrderId =
    resolvedOrderId || orderIdFromQuery || normalizeIdentifier(param?.id);
  const [paymentStatus, setPaymentStatus] = useState("checking"); // "checking" | "paid" | "pending" | "cancelled"
  const [isVerifying, setIsVerifying] = useState(false);
  const [isOpeningPayment, setIsOpeningPayment] = useState(false);
  const [deferVerification, setDeferVerification] = useState(hasAutostartParam);
  const hasAutoOpenAttemptedRef = useRef(false);
  const hasClearedCartAfterPaidRef = useRef(false);
  const hasSuccessCelebratedRef = useRef(false);
  const hasVerifiedPaymentRef = useRef(false);
  const clearCartAfterPaid = useCallback(() => {
    if (hasClearedCartAfterPaidRef.current) return;
    hasClearedCartAfterPaidRef.current = true;

    const emptyOrderState = {
      spot_id: 0,
      spot_name: "",
      phone: "",
      products: [],
      payment_method: "",
      total: 0,
      delivery_price: 0,
      lng: 0,
      lat: 0,
      client: null,
      pay_cash: null,
      pay_card: null,
      pay_click: null,
      pay_payme: null,
      pay_uzum: null,
      pay_bonus: null,
      promocode: null,
      comment: "",
      address: "",
      client_addresses_id: null,
    };

    setOrderDataStore(emptyOrderState);
    setPaymentData(null);
    setSelectCard(null);
    setTotalSum(0);
    setProductsData([]);

    localStorage.removeItem("products");
    localStorage.removeItem("orderData");
    localStorage.removeItem("paymentData");
    localStorage.removeItem("selectCard");
    localStorage.removeItem("totalSum");
  }, [setOrderDataStore, setPaymentData, setProductsData, setSelectCard, setTotalSum]);
  const handleCancelAndGoBack = useCallback(() => {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.push(`/${locale}/${param?.place}/cart`);
  }, [locale, param?.place, router]);
  const localized = {
    verifyingTitle:
      locale === "ru"
        ? "Проверяем оплату"
        : locale === "uz"
          ? "To'lov tekshirilmoqda"
          : "Verifying payment",
    verifyingDescription:
      locale === "ru"
        ? "Подождите, подтверждаем статус оплаты."
        : locale === "uz"
          ? "Kutib turing, to'lov holatini tasdiqlayapmiz."
          : "Please wait while we confirm your payment status.",
    cancelledTitle:
      locale === "ru"
        ? "Оплата была отменена"
        : locale === "uz"
          ? "To'lov bekor qilindi"
          : "Payment was cancelled",
    cancelledDescription:
      locale === "ru"
        ? "Оплата не завершена. Товары остались в корзине."
        : locale === "uz"
          ? "To'lov yakunlanmadi. Mahsulotlar savatda saqlanib qoldi."
          : "Your payment was not completed. Cart items are preserved.",
    pendingTitle:
      locale === "ru"
        ? "Оплата в ожидании"
        : locale === "uz"
          ? "To'lov kutilmoqda"
          : "Payment pending",
    pendingDescription:
      locale === "ru"
        ? "Оплата еще обрабатывается. Повторите проверку через несколько секунд."
        : locale === "uz"
          ? "To'lov hali qayta ishlanmoqda. Bir necha soniyadan keyin qayta tekshiring."
          : "Payment is still processing. Check again in a few seconds.",
    continuePayment:
      locale === "ru"
        ? "Продолжить оплату"
        : locale === "uz"
          ? "To'lovni davom ettirish"
          : "Continue payment",
    checkAgain:
      locale === "ru"
        ? "Проверить снова"
        : locale === "uz"
          ? "Qayta tekshirish"
          : "Check again",
    backToCart:
      locale === "ru"
        ? "Вернуться в корзину"
        : locale === "uz"
          ? "Savatga qaytish"
          : "Return to cart",
    menuButton:
      locale === "ru"
        ? "Вернуться в меню"
        : locale === "uz"
          ? "Menyuga qaytish"
          : "Back to menu",
    cancelAndBack:
      locale === "ru"
        ? "Отмена и назад"
        : locale === "uz"
          ? "Bekor qilish va ortga"
          : "Cancel and go back",
    unsupportedTitle:
      locale === "ru"
        ? "Автооткрытие недоступно на этом устройстве"
        : locale === "uz"
          ? "Bu qurilmada avtomatik ochish mavjud emas"
          : "Auto-open is not available on this device",
    unsupportedDescription:
      locale === "ru"
        ? "Откройте эту ссылку на телефоне с установленным Payme или Click."
        : locale === "uz"
          ? "Bu havolani Payme yoki Click o'rnatilgan telefonda oching."
          : "Open this link on a phone with Payme or Click installed.",
  };
  const getLocalOrder = (orderId) => {
    try {
      const list = JSON.parse(localStorage.getItem("orderList") || "[]");
      return list.find((item) => String(item?.order_id) === String(orderId)) || null;
    } catch {
      return null;
    }
  };
  const syncLocalOrderIdentifier = useCallback(
    (canonicalOrderId, transactionIds = []) => {
      const normalizedCanonical = normalizeIdentifier(canonicalOrderId);
      if (!normalizedCanonical) return;

      try {
        const list = JSON.parse(localStorage.getItem("orderList") || "[]");
        if (!Array.isArray(list) || list.length === 0) return;

        const normalizedTxIds = Array.from(
          new Set(transactionIds.map((id) => normalizeIdentifier(id)).filter(Boolean))
        );
        if (normalizedTxIds.length === 0) return;

        const isObjectIdLike = (value) => /^[a-f0-9]{24}$/i.test(String(value || "").trim());
        let changed = false;

        const nextList = list.map((item) => {
          const tokens = [
            item?.order_id,
            item?.id,
            item?.transactionId,
            item?.transaction_id,
            item?.posterTransactionId,
            item?.poster_transaction_id,
          ]
            .map((token) => normalizeIdentifier(token))
            .filter(Boolean);
          const matched = tokens.some((token) => normalizedTxIds.includes(token));
          if (!matched) return item;

          changed = true;

          const currentOrderNumber = normalizeIdentifier(item?.orderNumber);
          const currentLinkedOrderNumber = normalizeIdentifier(item?.linkedOrderNumber);
          const currentPosterIncomingOrderId = normalizeIdentifier(
            item?.posterIncomingOrderId
          );
          const currentId = normalizeIdentifier(item?.id);

          return {
            ...item,
            order_id: normalizedCanonical,
            display_order_id: normalizedCanonical,
            orderNumber:
              !currentOrderNumber || isObjectIdLike(currentOrderNumber)
                ? normalizedCanonical
                : item?.orderNumber,
            linkedOrderNumber:
              !currentLinkedOrderNumber || isObjectIdLike(currentLinkedOrderNumber)
                ? normalizedCanonical
                : item?.linkedOrderNumber,
            posterIncomingOrderId:
              !currentPosterIncomingOrderId || isObjectIdLike(currentPosterIncomingOrderId)
                ? normalizedCanonical
                : item?.posterIncomingOrderId,
            transactionId: item?.transactionId || normalizedTxIds[0],
            transaction_id: item?.transaction_id || normalizedTxIds[0],
            posterTransactionId: item?.posterTransactionId || normalizedTxIds[0],
            poster_transaction_id: item?.poster_transaction_id || normalizedTxIds[0],
            id: !currentId || isObjectIdLike(currentId) ? normalizedCanonical : item?.id,
          };
        });

        if (changed) {
          localStorage.setItem("orderList", JSON.stringify(nextList));
        }
      } catch {
      }
    },
    [normalizeIdentifier]
  );

  const activePendingPayment =
    pendingOnlinePayment?.transactionId &&
    verificationTransactionIds.includes(
      normalizeIdentifier(pendingOnlinePayment.transactionId)
    )
      ? pendingOnlinePayment
      : null;

  const openPendingPaymentApp = useCallback(
    ({ auto = false } = {}) => {
      if (!activePendingPayment?.checkoutUrl) return;
      if (auto && hasAutoOpenAttemptedRef.current) return;

      if (auto) {
        hasAutoOpenAttemptedRef.current = true;
      }

      setIsOpeningPayment(true);
      window.setTimeout(() => {
        openPaymentUrl(
          activePendingPayment.provider,
          activePendingPayment.checkoutUrl
        );
      }, 150);
    },
    [activePendingPayment]
  );

  const handleSuccess = async () => {
    if (hasSuccessCelebratedRef.current) return;
    hasSuccessCelebratedRef.current = true;

    const confetti = await loadConfetti();
    const duration = 2 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  const fetchAddress = useCallback(async () => {
    setIsLoading(true);

    try {
      let orderPay = null;
      for (const transactionId of verificationTransactionIds) {
        const result = await getOrderRender(transactionId);
        if (result && typeof result === "object") {
          orderPay = result;
          break;
        }
      }

      const candidateOrderId =
        extractCanonicalOrderId(orderPay) ||
        orderIdFromQuery ||
        resolvedOrderId ||
        normalizeIdentifier(param?.id);
      let order = await getOrder(candidateOrderId);
      if ((!order || typeof order !== "object") && orderIdFromQuery) {
        order = await getOrder(orderIdFromQuery);
      }
      if (
        (!order || typeof order !== "object") &&
        paymentStatus === "paid"
      ) {
        order = getLocalOrder(candidateOrderId) || getLocalOrder(param?.id);
      }

      if (order && typeof order === "object") {
        const canonicalOrderId = extractCanonicalOrderId(order) || candidateOrderId;
        if (canonicalOrderId) {
          setResolvedOrderId(canonicalOrderId);
          syncLocalOrderIdentifier(canonicalOrderId, verificationTransactionIds);
        }
        const match = order?.comment?.match(/Промокод:\s*(\S+)/);
        if (match) {
          const promoCode = match[1];
          const promo = promotions?.response?.find((prm) => {
            const promoFind = prm?.name?.split("$")[1].toLowerCase().trim();
            return promoFind === promoCode.toLowerCase();
          });
          setPromotionData(promo);
        }
        setPayError(false);
        const products =
          typeof order?.products === "string"
            ? JSON.parse(order.products || "[]")
            : Array.isArray(order?.products)
              ? order.products
              : [];
        handleSuccess();
        const orderedProducts = products
          .map((orderItem) => {
            const product = productsData?.find(
              (prod) => prod.product_id == orderItem.product_id
            );
            if (product) {
              return {
                ...product,
                count: orderItem.amount,
                unit_price: Number(orderItem?.unit_price || 0),
              };
            }
            return {
              product_id: orderItem?.product_id || 0,
              count: Number(orderItem?.amount || 0),
              name: String(orderItem?.name || ""),
              backend_name: String(orderItem?.name || ""),
              product_production_description: `*** *** *** ${String(orderItem?.name || "")} *** ${String(orderItem?.name || "")} *** ${String(orderItem?.name || "")}`,
              photo_origin: "",
              price: {
                1: Math.round(Number(orderItem?.unit_price || 0) * 100),
              },
              unit_price: Number(orderItem?.unit_price || 0),
            };
          })
          .filter(Boolean);

        const location = String(order?.client_address || "0,0").split(",");
        let resolvedAddress = order?.address || order?.deliveryAddress || "";
        if (location.length >= 2 && Number(location[0]) && Number(location[1])) {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${String(
              location[0]
            )}&lon=${String(location[1])}&format=json&accept-language=${locale}`
          );
          const addressRes = await res.json();
          resolvedAddress = String(addressRes?.display_name || resolvedAddress);
        }

        if (order?.spot_id != 0) {
          const spot = spotsData?.find((s) => s.spot_id == order?.spot_id);
          setOrderData({
            ...order,
            address: resolvedAddress,
            products: orderedProducts,
            spotData: spot,
          });
        } else {
          setOrderData({
            ...order,
            address: resolvedAddress,
            products: orderedProducts,
          });
        }
      } else {
        setPayError(true);
        setOrderData(null);
      }
    } catch (error) {
      setPayError(true);
      setOrderData(null);
    } finally {
      setIsLoading(false);
    }
  }, [
    extractCanonicalOrderId,
    locale,
    normalizeIdentifier,
    orderIdFromQuery,
    param?.id,
    paymentStatus,
    productsData,
    promotions?.response,
    resolvedOrderId,
    syncLocalOrderIdentifier,
    spotsData,
    verificationTransactionIds,
  ]);

  // Verify payment transaction on mount
  const verifyPayment = useCallback(async () => {
    if (verificationTransactionIds.length === 0) return;

    setIsVerifying(true);
    setPaymentStatus("checking");
    try {
      let paidResult = null;
      let cancelledResult = null;

      for (const transactionId of verificationTransactionIds) {
        const result = await verifyPaymentTransaction(transactionId, 6, 3000);
        const canonicalFromTransaction = extractCanonicalOrderId(
          result?.transaction
        );

        if (canonicalFromTransaction) {
          paidResult = { transactionId, response: result };
          break;
        }

        if (result?.result === "paid") {
          paidResult = { transactionId, response: result };
          break;
        }
        if (result?.result === "cancelled" && !cancelledResult) {
          cancelledResult = { transactionId, response: result };
        }
      }

      if (paidResult) {
        setPaymentStatus("paid");
        clearCartAfterPaid();
        clearPendingOnlinePayment();

        const transactionSnapshot =
          paidResult?.response?.transaction && typeof paidResult.response.transaction === "object"
            ? paidResult.response.transaction
            : await getOrderRender(paidResult.transactionId);
        const canonicalOrderId =
          extractCanonicalOrderId(transactionSnapshot) || orderIdFromQuery;

        if (canonicalOrderId) {
          setResolvedOrderId(canonicalOrderId);
          syncLocalOrderIdentifier(canonicalOrderId, [
            paidResult.transactionId,
            ...verificationTransactionIds,
          ]);
          router.replace(
            `/${locale}/${param?.place}/confirmed/${canonicalOrderId}?transaction_id=${paidResult.transactionId}`
          );
          return;
        }

        fetchAddress();
      } else if (cancelledResult) {
        setPaymentStatus("cancelled");
        if (
          pendingOnlinePayment?.transactionId &&
          normalizeIdentifier(pendingOnlinePayment.transactionId) ===
            normalizeIdentifier(cancelledResult.transactionId)
        ) {
          clearPendingOnlinePayment();
        }
      } else {
        setPaymentStatus("pending");
        setOrderData(null);
        setPayError(true);
      }
    } catch (error) {
      setPaymentStatus("pending");
      setOrderData(null);
      setPayError(true);
    } finally {
      setIsVerifying(false);
    }
  }, [
    clearCartAfterPaid,
    clearPendingOnlinePayment,
    extractCanonicalOrderId,
    fetchAddress,
    locale,
    normalizeIdentifier,
    orderIdFromQuery,
    param?.place,
    pendingOnlinePayment?.transactionId,
    router,
    syncLocalOrderIdentifier,
    verificationTransactionIds,
  ]);

  useEffect(() => {
    if (deferVerification) {
      return;
    }

    if (hasVerifiedPaymentRef.current) {
      return;
    }

    hasVerifiedPaymentRef.current = true;
    verifyPayment();
  }, [deferVerification, verifyPayment]);

  useEffect(() => {
    hasVerifiedPaymentRef.current = false;
  }, [verificationTransactionIds]);

  useEffect(() => {
    if (!hasAutostartParam) {
      setDeferVerification(false);
      return;
    }

    setPaymentStatus("pending");
    setIsOpeningPayment(true);

    if (isPaymentAppLaunchSupported) {
      // Mobile: show the tap-to-pay button, defer verification until user taps
      // Verification starts after a short delay to give user time to tap
      const releaseTimer = window.setTimeout(() => {
        setDeferVerification(false);
      }, 5000);
      return () => window.clearTimeout(releaseTimer);
    }

    // Desktop: auto-open payment in new tab, defer verification briefly
    const releaseTimer = window.setTimeout(() => {
      setDeferVerification(false);
    }, 2500);

    return () => {
      window.clearTimeout(releaseTimer);
    };
  }, [hasAutostartParam, isPaymentAppLaunchSupported]);

  useEffect(() => {
    if (paymentStatus === "paid") {
      fetchAddress();
    }
  }, [fetchAddress, paymentStatus]);

  useEffect(() => {
    if (paymentStatus !== "pending") {
      setIsOpeningPayment(false);
      return;
    }

    // Mobile: don't auto-open — the <a> tag button handles app launch via user tap
    if (isPaymentAppLaunchSupported) {
      return;
    }

    // Desktop: auto-open payment in new tab via window.open
    if (!activePendingPayment?.checkoutUrl) {
      if (!hasAutostartParam) {
        setIsOpeningPayment(false);
      }
      return;
    }

    openPendingPaymentApp({ auto: true });
  }, [
    activePendingPayment?.checkoutUrl,
    hasAutostartParam,
    isPaymentAppLaunchSupported,
    openPendingPaymentApp,
    paymentStatus,
  ]);

  useEffect(() => {
    const normalizeId = (value) =>
      String(value ?? "")
        .trim()
        .replace(/^#/, "")
        .toLowerCase();

    const onOrderUpdate = (event) => {
      const payloadOrder = event?.detail?.order;
      if (!payloadOrder) {
        return;
      }

      const targetId = normalizeId(param?.id);
      const incomingIds = [
        payloadOrder?.id,
        payloadOrder?.orderNumber,
        payloadOrder?.order_id,
      ]
        .map(normalizeId)
        .filter(Boolean);

      if (incomingIds.includes(targetId)) {
        fetchAddress();
      }
    };

    window.addEventListener("rolling:order-update", onOrderUpdate);
    return () =>
      window.removeEventListener("rolling:order-update", onOrderUpdate);
  }, [fetchAddress, param?.id]);

  // Show verifying state
  if (isVerifying && paymentStatus === "checking") {
    return (
      <div className="w-full lg:w-11/12 mx-auto flex flex-col items-center justify-center gap-4 mt-10">
        <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-5 rounded-lg shadow-sm w-full text-center">
          <h2 className="text-xl font-semibold">{localized.verifyingTitle}</h2>
          <p className="mt-2">{localized.verifyingDescription}</p>
        </div>
        <div className="flex items-center gap-2">
          <svg
            aria-hidden="true"
            className="w-6 h-6 text-gray-300 animate-spin fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        </div>
        <Button
          onClick={handleCancelAndGoBack}
          className="w-full lg:h-12 rounded-xl bg-[#F5F5F5] hover:bg-[#F5F5F5] text-[#004032]"
        >
          {localized.cancelAndBack}
        </Button>
      </div>
    );
  }

  // Show cancelled state
  if (paymentStatus === "cancelled" && !isVerifying) {
    return (
      <div className="w-full lg:w-11/12 mx-auto flex flex-col items-center justify-center gap-4 mt-10">
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-5 rounded-lg shadow-sm w-full text-center">
          <h2 className="text-xl font-semibold">{localized.cancelledTitle}</h2>
          <p className="mt-2">{localized.cancelledDescription}</p>
        </div>
        <Link href={`/${locale}/${param?.place}/cart`}>
          <Button
            aria-label="return to cart"
            className="lg:h-12 rounded-xl bg-[#43674E] hover:bg-[#43674E]"
          >
            {localized.backToCart}
          </Button>
        </Link>
        <Link href={`/${locale}/${param?.place}`}>
          <Button
            aria-label="order menu"
            className="w-full lg:h-12 rounded-xl bg-[#F5F5F5] hover:bg-[#F5F5F5] text-[#004032]"
          >
            {localized.menuButton}
          </Button>
        </Link>
      </div>
    );
  }

  if (
    paymentStatus === "pending" &&
    isOpeningPayment &&
    activePendingPayment?.checkoutUrl &&
    isPaymentAppLaunchSupported
  ) {
    // Mobile: show a real <a> tag that the user taps to open the payment app.
    // intent:// URLs (Android) and Universal Links (iOS) only work reliably
    // from direct user taps on <a> tags, NOT from JavaScript redirects.
    const paymentHref = getPaymentLinkHref(
      activePendingPayment.provider,
      activePendingPayment.checkoutUrl
    );
    const providerName =
      activePendingPayment.provider === "payme" ? "Payme" : "Click";
    return (
      <div className="w-full lg:w-11/12 mx-auto flex flex-col items-center justify-center gap-4 mt-10">
        <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-5 rounded-lg shadow-sm w-full text-center">
          <h2 className="text-xl font-semibold">
            {locale === "ru"
              ? "Оплатите заказ"
              : locale === "uz"
                ? "Buyurtmani to'lang"
                : "Pay for your order"}
          </h2>
          <p className="mt-2">
            {locale === "ru"
              ? `Нажмите кнопку ниже, чтобы открыть ${providerName}`
              : locale === "uz"
                ? `${providerName} ilovasini ochish uchun quyidagi tugmani bosing`
                : `Tap the button below to open ${providerName}`}
          </p>
        </div>
        <a
          href={paymentHref}
          className="inline-flex items-center justify-center w-full lg:w-auto px-8 lg:h-12 h-12 rounded-xl bg-[#43674E] hover:bg-[#3a5a44] text-white font-semibold text-base transition-colors"
        >
          {locale === "ru"
            ? `Оплатить через ${providerName}`
            : locale === "uz"
              ? `${providerName} orqali to'lash`
              : `Pay with ${providerName}`}
        </a>
        <Button
          onClick={() => setIsOpeningPayment(false)}
          className="w-full lg:h-12 rounded-xl bg-[#F5F5F5] hover:bg-[#F5F5F5] text-[#004032]"
        >
          {locale === "ru"
            ? "Показать проверку оплаты"
            : locale === "uz"
              ? "To'lov tekshiruviga qaytish"
              : "Back to payment check"}
        </Button>
        <Button
          onClick={handleCancelAndGoBack}
          className="w-full lg:h-12 rounded-xl bg-[#F5F5F5] hover:bg-[#F5F5F5] text-[#004032]"
        >
          {localized.cancelAndBack}
        </Button>
      </div>
    );
  }

  if (paymentStatus === "pending" && isOpeningPayment) {
    // Desktop: auto-opening payment in new tab
    return (
      <div className="w-full lg:w-11/12 mx-auto flex flex-col items-center justify-center gap-4 mt-10">
        <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-5 rounded-lg shadow-sm w-full text-center">
          <h2 className="text-xl font-semibold">
            {locale === "ru"
              ? "Открываем страницу оплаты"
              : locale === "uz"
                ? "To'lov sahifasi ochilmoqda"
                : "Opening payment page"}
          </h2>
          <p className="mt-2">
            {locale === "ru"
              ? "Подождите, открываем страницу оплаты в новой вкладке."
              : locale === "uz"
                ? "Kutib turing, yangi oynada to'lov sahifasi ochilmoqda."
                : "Please wait, opening payment page in a new tab."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <svg
            aria-hidden="true"
            className="w-6 h-6 text-gray-300 animate-spin fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        </div>
        <Button
          onClick={() => setIsOpeningPayment(false)}
          className="w-full lg:h-12 rounded-xl bg-[#F5F5F5] hover:bg-[#F5F5F5] text-[#004032]"
        >
          {locale === "ru"
            ? "Показать проверку оплаты"
            : locale === "uz"
              ? "To'lov tekshiruviga qaytish"
              : "Back to payment check"}
        </Button>
        <Button
          onClick={handleCancelAndGoBack}
          className="w-full lg:h-12 rounded-xl bg-[#F5F5F5] hover:bg-[#F5F5F5] text-[#004032]"
        >
          {localized.cancelAndBack}
        </Button>
      </div>
    );
  }

  if (
    paymentStatus === "pending" &&
    hasAutostartParam &&
    !isPaymentAppLaunchSupported &&
    !isVerifying
  ) {
    return (
      <div className="w-full lg:w-11/12 mx-auto flex flex-col items-center justify-center gap-4 mt-10">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-5 rounded-lg shadow-sm w-full text-center">
          <h2 className="text-xl font-semibold">{localized.unsupportedTitle}</h2>
          <p className="mt-2">{localized.unsupportedDescription}</p>
        </div>
        <Link href={`/${locale}/${param?.place}/cart`}>
          <Button
            aria-label="return to cart"
            className="w-full lg:h-12 rounded-xl bg-[#F5F5F5] hover:bg-[#F5F5F5] text-[#004032]"
          >
            {localized.backToCart}
          </Button>
        </Link>
        <Link href={`/${locale}/${param?.place}`}>
          <Button
            aria-label="order menu"
            className="w-full lg:h-12 rounded-xl bg-[#43674E] hover:bg-[#43674E]"
          >
            {localized.menuButton}
          </Button>
        </Link>
      </div>
    );
  }

  // Show pending state
  if (paymentStatus === "pending" && !isVerifying) {
    return (
      <div className="w-full lg:w-11/12 mx-auto flex flex-col items-center justify-center gap-4 mt-10">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-5 rounded-lg shadow-sm w-full text-center">
          <h2 className="text-xl font-semibold">{localized.pendingTitle}</h2>
          <p className="mt-2">{localized.pendingDescription}</p>
        </div>
        {activePendingPayment?.checkoutUrl ? (
          isPaymentAppLaunchSupported ? (
            <a
              href={getPaymentLinkHref(
                activePendingPayment.provider,
                activePendingPayment.checkoutUrl
              )}
              className="inline-flex items-center justify-center px-8 lg:h-12 h-12 rounded-xl bg-[#43674E] hover:bg-[#3a5a44] text-white font-semibold text-base transition-colors"
            >
              {localized.continuePayment}
            </a>
          ) : (
            <Button
              onClick={() => openPendingPaymentApp()}
              className="lg:h-12 rounded-xl bg-[#43674E] hover:bg-[#43674E]"
            >
              {localized.continuePayment}
            </Button>
          )
        ) : null}
        <Button
          onClick={() => verifyPayment()}
          disabled={isVerifying}
          className="lg:h-12 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white"
        >
          {localized.checkAgain}
        </Button>
        <Button
          onClick={handleCancelAndGoBack}
          className="w-full lg:h-12 rounded-xl bg-[#F5F5F5] hover:bg-[#F5F5F5] text-[#004032]"
        >
          {localized.cancelAndBack}
        </Button>
        <Link href={`/${locale}/${param?.place}/cart`}>
          <Button
            aria-label="return to cart"
            className="w-full lg:h-12 rounded-xl bg-[#F5F5F5] hover:bg-[#F5F5F5] text-[#004032]"
          >
            {localized.backToCart}
          </Button>
        </Link>
        <Link href={`/${locale}/${param?.place}`}>
          <Button
            aria-label="order menu"
            className="w-full lg:h-12 rounded-xl bg-[#43674E] hover:bg-[#43674E]"
          >
            {localized.menuButton}
          </Button>
        </Link>
      </div>
    );
  }

  if (paymentStatus === "paid" && payError && !isLoading) {
    return (
      <div className="w-full lg:w-11/12 mx-auto flex flex-col items-center justify-center gap-4 mt-10">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-5 rounded-lg shadow-sm w-full text-center">
          <h2 className="text-xl font-semibold">⚠️ {orderText("waiting")} </h2>
          <p className="mt-2">{orderText("waiting_order")}</p>
        </div>
        <Button
          onClick={() => window.location.reload()}
          className="lg:h-12 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white"
        >
          {localized.checkAgain}
        </Button>
        <Link href={`/${locale}/${param?.place}`}>
          <Button
            aria-label={`order menu`}
            className="w-full lg:h-12 rounded-xl bg-[#43674E] hover:bg-[#43674E]"
          >
            {localized.menuButton}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-11/12 mx-auto flex flex-col lg:grid grid-cols-2 gap-5 lg:gap-20 mt-4 lg:mt-10">
      <div className="w-full lg:max-w-md space-y-3">
        <h1 className="font-bold textNormal3 text-black text-start">
          {isLoading ? (
            <Skeleton className="w-1/2 h-6" />
          ) : (
            orderText("my_order")
          )}
        </h1>
        <div className="overflow-y-scroll flex flex-col max-h-[500px] w-full py-4 simple-scrollbar space-y-4 pr-2">
          {isLoading
            ? Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex gap-2 md:gap-4">
                  <Skeleton className="aspect-square w-20 h-20 rounded-md" />
                  <div className="flex flex-col justify-between w-full">
                    <Skeleton className="w-full h-4" />
                    <Skeleton className="w-3/4 h-4" />
                  </div>
                </div>
              ))
            : orderData?.products
                ?.slice()
                ?.reverse()
                ?.map((item) => {
                  const localizedNameValue = getLocalizedProduct(
                    item.product_production_description,
                    locale,
                    "name"
                  );
                  const localizedName =
                    localizedNameValue ||
                    item?.name ||
                    item?.backend_name ||
                    "Product";
                  let activePromocode = false;
                  let resultPromo = null;
                  promotionData?.params?.conditions?.forEach((condition) => {
                    if (condition?.type == 2) {
                      const findProductsData = orderData?.products?.find(
                        (prd) => prd?.product_id == condition.id
                      );
                      console.log({ findProductsData });

                      const allSummaProducts =
                        (findProductsData?.price["1"] / 100) *
                        findProductsData?.count;
                      console.log({
                        condition: condition?.sum / 100,
                        allSummaProducts,
                      });
                      if (
                        promotionData?.params?.discount_value > 0 &&
                        promotionData?.params?.result_type == 3 &&
                        allSummaProducts >= condition?.sum / 100 &&
                        findProductsData?.product_id == item?.product_id
                      ) {
                        activePromocode = true;
                        resultPromo = {
                          ...promotionData,
                          params: {
                            ...promotionData.params,
                            conditions: promotionData?.params?.conditions?.map(
                              (cond) => {
                                if (cond?.id == condition?.id) {
                                  return {
                                    ...cond,
                                    active: true,
                                  };
                                }
                                return cond;
                              }
                            ),
                          },
                        };
                      }
                    }
                  });
                  return (
                    <div
                      key={item.product_id}
                      className="flex gap-2 md:gap-4 mr-4"
                    >
                      <Image
                        src={
                          item?.photo_origin
                            ? `${posterUrl}${item.photo_origin}`
                            : "/empty.jpg"
                        }
                        alt="product"
                        width={100}
                        height={100}
                        className="border max-sm:w-20 max-sm:h-20 h-20 object-cover aspect-square rounded-md col-span-2 row-span-2"
                      />
                      <div className="w-full flex flex-col justify-between min-h-16 md:min-h-20 gap-2 md:gap-4 relative">
                        <p className="font-semibold textSmall3">
                          {localizedName}
                        </p>
                        <div className="flex justify-between">
                          <p>{item?.count}x</p>
                          {activePromocode && resultPromo ? (
                            <div className="flex justify-end  flex-col font-semibold textSmall2 leading-5">
                              <h1>
                                {" "}
                                {item?.price["1"]
                                  ? `${formatNumber(
                                      (item.price["1"] / 100) *
                                        (1 -
                                          Number(
                                            resultPromo?.params?.discount_value
                                          ) /
                                            100)
                                    )} ${all("sum")}`
                                  : "Price not available"}
                              </h1>
                              <p className="text-xs text-gray-500 line-through">
                                {" "}
                                {item?.price["1"]
                                  ? `${formatNumber(
                                      item.price["1"] / 100
                                    )} ${all("sum")}`
                                  : "Price not available"}
                              </p>
                            </div>
                          ) : (
                            <p className="font-semibold textSmall2 leading-5">
                              {item?.price?.["1"]
                                ? `${formatNumber(item.price["1"] / 100)} ${all(
                                    "sum"
                                  )}`
                                : Number(item?.unit_price || 0) > 0
                                  ? `${formatNumber(
                                      Number(item.unit_price)
                                    )} ${all("sum")}`
                                : "Price not available"}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
        </div>
      </div>
      <div className="w-full relative space-y-3">
        <h1 className="font-bold textNormal2 text-black text-start">
          {isLoading ? (
            <Skeleton className="w-1/2 h-6" />
          ) : orderData?.type?.includes("delivery") ? (
            orderText("status_delivery")
          ) : orderData?.type?.includes("take_away") ? (
            orderText("status_pickup")
          ) : (
            orderData?.type?.includes("spot") && orderText("status_spot")
          )}
        </h1>
        <div className="flex items-center gap-2">
          {isLoading ? (
            <div className="flex flex-col w-full justify-between gap-2">
              <div
                className={`w-full flex flex-col justify-start items-start gap-2 max-sm:p-1 max-sm:rounded-md max-sm:border-2`}
              >
                <div className="w-full flex items-start gap-2">
                  <Skeleton className="w-[20] sm:w-[24] h-[20px] sm:h-[24px] rounded-md" />
                  <Skeleton className="w-10/12 h-[20] sm:h-[20] rounded-md" />
                </div>
                <Skeleton className="w-10/12 h-[20] sm:h-[20] rounded-md" />
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-2 textSmall3 font-bold">
                  <Image
                    src={"/assets/Location.svg"}
                    alt="location"
                    width={100}
                    height={100}
                    className="w-6 h-6 md:w-8 md:h-8"
                  />
                  {orderData?.type?.includes("take_away") ? (
                    <div>
                      <p className="font-semibold textSmall3">
                        {translateTextSpot(
                          orderData?.spotData?.spot_name ||
                            orderData?.spotData?.name ||
                            orderData?.branch_name,
                          locale
                        )}
                      </p>
                      <p className="text-thin font-[500] textSmall2 mt-2">
                        {translateTextSpotAddress(
                          orderData?.spotData?.spot_adress ||
                            orderData?.spotData?.address ||
                            orderData?.branch_address,
                          locale
                        )}
                      </p>
                    </div>
                  ) : (
                    <p className="font-semibold textSmall3">
                      {orderData?.address}
                    </p>
                  )}
                </div>
                {orderData?.address_comment && (
                  <>
                    {orderData?.address_comment != "no" && (
                      <p className="text-thin font-[500] textSmall2 mt-2">
                        {orderData?.address_comment}
                      </p>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </div>
        <div className="flex flex-col gap-y-4">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="w-full h-6" />
              <Skeleton className="w-full h-6" />
            </div>
          ) : (
            <>
              <div className="w-full flex justify-between">
                <p className="font-medium textNormal2 leading-5 text-[#2E2E2E]">
                  {total("products_sum")}
                </p>
                <p className="font-normal textNormal2 text-[#2E2E2E]">
                  {formatNumber(
                    Number(orderData?.all_price || 0) / 100 -
                      (orderData?.type?.includes("delivery")
                        ? Number(
                            orderData?.delivery_fee ||
                              orderData?.deliveryPrice ||
                              0
                          )
                        : 0)
                  )}{" "}
                  {all("sum")}
                </p>
              </div>
              {promotionData && (
                <div className="w-full flex justify-between">
                  <p className="font-medium textNormal2 leading-5 text-[#2E2E2E]">
                    {promotionT("titleDialog")}
                  </p>
                  {promotionData?.params?.result_type == 3 && (
                    <p className="font-normal text-primary textNormal2 text-[#2E2E2E]">
                      {formatNumber(promotionData?.params?.discount_value)}%{" "}
                      {all("disc")}
                    </p>
                  )}
                  {promotionData?.params?.result_type == 2 && (
                    <p className="text-primary font-normal textNormal2 text-[#2E2E2E]">
                      -
                      {formatNumber(
                        promotionData?.params?.discount_value / 100
                      )}{" "}
                      {all("sum")}
                    </p>
                  )}
                  {promotionData?.params?.result_type == 1 && (
                    <p className="text-primary font-normal textNormal2 text-[#2E2E2E]">
                      {promotionData?.name?.split("$")[1]}
                    </p>
                  )}
                </div>
              )}
              {orderData?.payed_bonus != 0 && orderData?.payed_bonus && (
                <div className="w-full flex justify-between">
                  <p className="font-medium textNormal2 leading-5 text-[#2E2E2E]">
                    {total("bonus")}
                  </p>
                  <p className="font-normal textNormal2 text-[#2E2E2E]">
                    {formatNumber(Number(orderData?.payed_bonus || 0) / 100)} {all("sum")}
                  </p>
                </div>
              )}
              {orderData?.type?.includes("delivery") && (
                <div className="w-full flex justify-between">
                  <p className="font-medium textNormal2 leading-5 text-[#2E2E2E]">
                    {total("delivery")}
                  </p>
                  <p className="font-normal textNormal2 text-[#2E2E2E]">
                    {formatNumber(
                      Number(
                        orderData?.delivery_fee || orderData?.deliveryPrice || 0
                      )
                    )}{" "}
                    {all("sum")}
                  </p>
                </div>
              )}
              <div className="border-b-[1px] border-[#DBDBDB]" />
              <div className="flex items-center justify-between">
                <p className="font-medium textNormal3 text-[#2E2E2E]">
                  {total("total")}
                </p>
                <p className="font-medium textNormal3 text-[#2E2E2E]">
                  {formatNumber(Number(orderData?.payed_sum || 0) / 100)} {all("sum")}
                </p>
              </div>
            </>
          )}
        </div>
        <div className="w-full">
          <>
            <Link href={`/${locale}/${param?.place}`}>
              <Button
                aria-label={`order menu`}
                className="w-full lg:h-12 rounded-xl bg-[#43674E] hover:bg-[#43674E]"
              >
                {orderText("menu_btn")}
              </Button>
            </Link>
            <Link
              href={`/${locale}/${param?.place}/orderpay/${displayOrderId}?transaction_id=${primaryTransactionId}`}
            >
              <Button
                aria-label={`order open`}
                className="w-full lg:h-12 rounded-xl bg-[#F5F5F5] hover:bg-[#F5F5F5] text-[#004032] mt-[11px]"
              >
                {orderText("open_btn")}
              </Button>
            </Link>
            <Link href={`/${locale}/${param?.place}/create-review`}>
              <Button
                aria-label={`order add`}
                className="w-full lg:h-12 rounded-xl bg-[#F5F5F5] hover:bg-[#F5F5F5] text-[#004032] mt-[11px]"
              >
                {orderText("add_comment")}
              </Button>
            </Link>
          </>
        </div>
      </div>
    </div>
  );
}
