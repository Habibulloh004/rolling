"use client";

import {
  ClickCheckout,
  createIncomingOrder,
  createOrder,
  createOrderPoster,
  PaymeCheckout,
  updateClient,
  verifyPaymentTransaction,
} from "@/actions/post";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCreatedAt, formatNumber, url as defaultBackendUrl } from "@/lib/utils";
import { ApiService } from "@/service/api.services";
import { useClientStore, useOrderStore, useProductStore, useStore } from "@/store";
import { ChevronRight, Ticket } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "use-intl";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import PromoCodeDialog from "./PromocodeComponent";
import { getLocalizedProduct } from "@/lib/utils";
import {
  calculateDistanceKm,
  getBranchBySpotId,
  getBranchDisplayAddress,
  getBranchDisplayName,
  getBranchPhone,
  isBranchAvailableForOrdering,
  normalizeBranchConfigs,
  selectNearestBranch,
} from "@/lib/branch-config";
import { openPaymentUrl } from "@/lib/payment-launch";

const DEFAULT_DELIVERY_PRICE = 15000;

const DiscountBadge = ({ auth }) => {
  return (
    <div className="bg-primary rounded-xl w-[150px] h-[100px] flex flex-col justify-between items-center relative py-[5px]">
      <div>
        <p className="font-bold text-white">
          {auth?.client_groups_discount == "10"
            ? "GOLD"
            : auth?.client_groups_discount == "5"
              ? "SILVER"
              : auth?.client_groups_discount == "3"
                ? "BRONZE"
                : "GOLD"}
        </p>
        <p className="font-bold text-center text-white">
          {auth?.client_groups_discount}%
        </p>
      </div>
      <Image
        src={`${auth?.client_groups_discount == "10"
          ? "/assets/Gold.png"
          : auth?.client_groups_discount == "5"
            ? "/assets/Silver.png"
            : auth?.client_groups_discount == "3"
              ? "/assets/Bronze.png"
              : "/assets/Gold.png"
          }`}
        loading="eager"
        alt="gold"
        width={150}
        height={100}
        className="absolute top-0"
      />
      <p className="font-bold text-center text-[6px] text-white">
        ROLLINGSUSHI
      </p>
    </div>
  );
};

// Main Order Component
const Order = ({
  promotions,
  spotDataFilial,
  auth,
  searchParamsData,
  locale,
  place,
  productsData,
  categoriesData,
}) => {
  const all = useTranslations("All");
  const promocodeT = useTranslations("Order.Promocode");
  const total = useTranslations("Cart.Total");
  const { activeTab, isDisabled, setIsDisabled } = useStore();
  const { client } = useClientStore();
  const [isLoading, setIsLoading] = useState(false);
  const [bonus, setBonus] = useState(0);
  const [activeBonus, setActiveBonus] = useState(false);
  const {
    orderData,
    setOrderData,
    totalSum,
    resetOrder,
    paymentData,
    setPaymentData,
    setSelectCard,
    pendingOnlinePayment,
    setPendingOnlinePayment,
    clearPendingOnlinePayment,
  } = useOrderStore();
  const { products, setProductsData } = useProductStore();
  const {
    spot: spotIdSpot,
    table_id,
    table_num,
    service,
    confirm,
  } = searchParamsData;
  const router = useRouter();
  const paymentText = useTranslations("Cart.Payment");
  const resolvedAuth = client?.client_id ? client : auth;
  const isAuthorized = Boolean(resolvedAuth?.client_id);
  const [isSuccess, setIsSuccess] = useState(false);
  const [branchConfigs, setBranchConfigs] = useState([]);
  const [posterSpots, setPosterSpots] = useState([]);
  const branchApiUrl = (
    process.env.NEXT_PUBLIC_ROLLING_BACK_URL ||
    process.env.NEXT_PUBLIC_URL ||
    defaultBackendUrl ||
    "https://adminrolling1.uz"
  ).replace(/\/+$/, "");
  const backendBases = useMemo(
    () =>
      ["", branchApiUrl].filter(
        (base, index, list) => list.indexOf(base) === index
      ),
    [branchApiUrl]
  );
  const originalProductsSum = products?.reduce((sum, product) => {
    if (product?.promocode) return sum;
    return sum + (Number(product?.price?.["1"] || 0) / 100) * Number(product?.count || 0);
  }, 0);
  const promoDiscountAmount =
    orderData?.discountPromocode > 0
      ? Math.max(Number(originalProductsSum) - Number(totalSum), 0)
      : orderData?.promocodePrice > 0
        ? Number(orderData?.promocodePrice)
        : 0;
  const payableTotal =
    Number(totalSum) -
    Number(orderData?.pay_bonus || 0) +
    (activeTab == "delivery" ? Number(orderData?.delivery_price || 0) : 0) -
    (orderData?.promocodePrice > 0 ? Number(orderData?.promocodePrice) : 0);

  const fetchBranchConfigs = useCallback(async () => {
    for (const base of backendBases) {
      try {
        const res = await fetch(`${base}/api/branches`, { cache: "no-store" });
        if (!res.ok) continue;
        const data = await res.json();
        const normalized = normalizeBranchConfigs(data);
        const parsed = Array.isArray(normalized) ? normalized : [];
        setBranchConfigs(parsed);
        return parsed;
      } catch {
        continue;
      }
    }
    setBranchConfigs([]);
    return [];
  }, [backendBases]);

  const fetchPosterSpots = useCallback(async () => {
    for (const base of backendBases) {
      try {
        const response = await fetch(`${base}/api/poster/spots`, {
          cache: "no-store",
        });
        if (!response.ok) continue;
        const raw = await response.json();
        const normalized = Array.isArray(raw?.data?.response)
          ? raw.data.response
          : Array.isArray(raw?.response)
            ? raw.response
            : Array.isArray(raw)
              ? raw
              : [];
        setPosterSpots(normalized);
        return normalized;
      } catch {
        continue;
      }
    }
    setPosterSpots([]);
    return [];
  }, [backendBases]);

  const resolveNearestPosterSpot = useCallback(
    (spots) => {
      if (!Array.isArray(spots) || spots.length === 0) return null;

      const lat = Number(orderData?.lat || 0);
      const lng = Number(orderData?.lng || 0);
      if (!lat || !lng) return spots[0] || null;

      const sorted = spots
        .map((spot) => ({
          spot,
          distance: calculateDistanceKm(lat, lng, spot?.lat, spot?.lng),
        }))
        .filter((item) => Number.isFinite(item.distance))
        .sort((a, b) => a.distance - b.distance);

      return sorted[0]?.spot || spots[0] || null;
    },
    [orderData?.lat, orderData?.lng]
  );

  const resolveDeliveryBranchFromConfigs = useCallback(
    (configs) => {
      if (!Array.isArray(configs) || configs.length === 0) return null;
      const lat = Number(orderData?.lat || 0);
      const lng = Number(orderData?.lng || 0);
      if (!lat || !lng) {
        return (
          configs.find((item) => isBranchAvailableForOrdering(item)) ||
          configs[0] ||
          null
        );
      }

      return selectNearestBranch(configs, lat, lng, { preferOpen: true });
    },
    [orderData?.lat, orderData?.lng]
  );

  const resolveDeliveryBranch = useCallback(() => {
    return resolveDeliveryBranchFromConfigs(branchConfigs);
  }, [branchConfigs, resolveDeliveryBranchFromConfigs]);

  const resolveDeliveryFee = useCallback(
    (branchConfig) => {
      const branchFee = Number(branchConfig?.delivery?.fee);
      return Number.isFinite(branchFee) ? branchFee : DEFAULT_DELIVERY_PRICE;
    },
    []
  );

  const resolveCurrentBranchConfig = useCallback(() => {
    if (!Array.isArray(branchConfigs) || branchConfigs.length === 0) return null;

    if (spotIdSpot) {
      return getBranchBySpotId(branchConfigs, spotIdSpot);
    }

    if (activeTab === "pickup") {
      return getBranchBySpotId(branchConfigs, orderData?.spot_id);
    }

    if (activeTab === "delivery") {
      return resolveDeliveryBranch();
    }

    return null;
  }, [activeTab, branchConfigs, orderData?.spot_id, resolveDeliveryBranch, spotIdSpot]);

  const handleSetBonus = () => {
    setOrderData({ ...orderData, pay_bonus: Number(bonus) });
    setBonus(0);
    setActiveBonus(false);
  };
  const handleRemoveBonus = () => {
    setOrderData({ ...orderData, pay_bonus: Number(0) });
    setBonus(0);
    setActiveBonus(false);
  };

  useEffect(() => {
    let cancelled = false;

    const loadBranchConfigsAndSpots = async () => {
      const normalized = await fetchBranchConfigs();
      if (cancelled) return;
      if (!Array.isArray(normalized)) {
        setBranchConfigs([]);
      }
      await fetchPosterSpots();
    };

    loadBranchConfigsAndSpots();
    return () => {
      cancelled = true;
    };
  }, [fetchBranchConfigs, fetchPosterSpots]);

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

  const resetOrderAndCart = () => {
    setOrderData(emptyOrderState);
    setSelectCard(null);
    setPaymentData(null);
    setProductsData([]);
  };

  const isOrderingClosedByBranchConfig = useCallback(
    (selectedBranchConfig = null) => {
      if (!Array.isArray(branchConfigs) || branchConfigs.length === 0) {
        return false;
      }

      const hasAnyOpenBranch = branchConfigs.some((branch) =>
        isBranchAvailableForOrdering(branch)
      );
      if (!hasAnyOpenBranch) {
        return true;
      }

      if (activeTab === "delivery") {
        const deliveryBranch =
          selectedBranchConfig || resolveDeliveryBranch() || branchConfigs[0];
        return !isBranchAvailableForOrdering(deliveryBranch);
      }

      if (spotIdSpot) {
        const spotBranch =
          selectedBranchConfig || getBranchBySpotId(branchConfigs, spotIdSpot);
        return !spotBranch || !isBranchAvailableForOrdering(spotBranch);
      }

      if (activeTab === "pickup" && !Number(orderData?.spot_id || 0)) {
        return false;
      }

      const targetBranch = selectedBranchConfig || resolveCurrentBranchConfig();
      if (!targetBranch) return false;
      return !isBranchAvailableForOrdering(targetBranch);
    },
    [
      activeTab,
      branchConfigs,
      orderData?.spot_id,
      resolveCurrentBranchConfig,
      resolveDeliveryBranch,
      spotIdSpot,
    ]
  );

  useEffect(() => {
    const updateAvailability = () => {
      const selectedBranchConfig = resolveCurrentBranchConfig();
      const isClosed = isOrderingClosedByBranchConfig(selectedBranchConfig);
      setIsDisabled(isClosed);
    };

    updateAvailability();
    const timer = setInterval(updateAvailability, 30_000);
    return () => clearInterval(timer);
  }, [isOrderingClosedByBranchConfig, resolveCurrentBranchConfig, setIsDisabled]);

  useEffect(() => {
    const hasBranchConfigs = Array.isArray(branchConfigs) && branchConfigs.length > 0;
    if (!hasBranchConfigs && activeTab !== "delivery") return;

    const selectedBranchConfig = hasBranchConfigs
      ? resolveCurrentBranchConfig()
      : null;
    if (!selectedBranchConfig && activeTab !== "delivery") return;
    const fallbackDeliverySpot =
      activeTab === "delivery" && !selectedBranchConfig
        ? resolveNearestPosterSpot(posterSpots)
        : null;

    const next = { ...orderData };
    let changed = false;

    const nextSpotId = Number(
      selectedBranchConfig?.spotId ||
        fallbackDeliverySpot?.spot_id ||
        orderData?.spot_id ||
        0
    );
    if (nextSpotId && Number(orderData?.spot_id || 0) !== nextSpotId) {
      next.spot_id = nextSpotId;
      changed = true;
    }

    const localizedName =
      getBranchDisplayName(selectedBranchConfig, locale) ||
      String(fallbackDeliverySpot?.name || "").trim();
    const localizedAddress =
      getBranchDisplayAddress(selectedBranchConfig, locale) ||
      String(fallbackDeliverySpot?.address || "").trim();
    const branchPhone =
      getBranchPhone(selectedBranchConfig) ||
      String(fallbackDeliverySpot?.phone || "").trim();

    if (localizedName && orderData?.spot_name !== localizedName) {
      next.spot_name = localizedName;
      changed = true;
    }
    if (localizedAddress && orderData?.spot_address !== localizedAddress) {
      next.spot_address = localizedAddress;
      changed = true;
    }
    if (branchPhone && orderData?.spot_phone !== branchPhone) {
      next.spot_phone = branchPhone;
      changed = true;
    }

    const expectedDeliveryFee =
      activeTab === "delivery"
        ? resolveDeliveryFee(selectedBranchConfig)
        : 0;
    if (Number(orderData?.delivery_price || 0) !== Number(expectedDeliveryFee || 0)) {
      next.delivery_price = Number(expectedDeliveryFee || 0);
      changed = true;
    }

    if (changed) {
      setOrderData(next);
    }
  }, [
    activeTab,
    branchConfigs,
    locale,
    orderData,
    posterSpots,
    resolveDeliveryFee,
    resolveCurrentBranchConfig,
    resolveNearestPosterSpot,
    setOrderData,
  ]);

  const handleSubmit = async () => {
    const runtimeBranchConfigs =
      Array.isArray(branchConfigs) && branchConfigs.length > 0
        ? branchConfigs
        : await fetchBranchConfigs();

    const selectedBranchConfig =
      activeTab === "delivery"
        ? resolveDeliveryBranchFromConfigs(runtimeBranchConfigs)
        : resolveCurrentBranchConfig();
    const runtimePosterSpots =
      Array.isArray(posterSpots) && posterSpots.length > 0
        ? posterSpots
        : await fetchPosterSpots();
    const nearestPosterSpot =
      activeTab === "delivery"
        ? resolveNearestPosterSpot(runtimePosterSpots)
        : null;

    if (isOrderingClosedByBranchConfig(selectedBranchConfig)) {
      toast.error(total("note"));
      return;
    }
    if (products.length == 0) {
      toast.error(all("products_empty"));
      return;
    }
    if (!isAuthorized) {
      toast.error(all("no_auth"));
      return;
    }

    if (activeTab == "pickup" && orderData?.spot_id == 0) {
      toast.error(all("spot_empty"));
      return;
    }

    if (
      activeTab == "delivery" &&
      (!orderData?.lat || orderData?.lat == 0) &&
      (!orderData?.lng || orderData?.lng == 0)
    ) {
      toast.error(all("location_empty"));
      return;
    }
    if (
      orderData?.payment_method == "card" &&
      !paymentData &&
      !paymentData?.payment_id
    ) {
      toast.error(paymentText("you_not_pay"));
      return null;
    }
    if (!orderData?.payment_method || orderData?.payment_method == "") {
      toast.error(paymentText("you_not_select"));
      return null;
    }

    let orderList = localStorage.getItem("orderList")
      ? JSON.parse(localStorage.getItem("orderList"))
      : [];

    try {
      const {
        spot_id,
        spot_name,
        phone,
        payment_method,
        delivery_price,
        lng,
        lat,
        pay_bonus,
        comment,
        address,
        address_comment,
        promocode,
      } = orderData;
      setIsLoading(true);
      const effectiveBranchConfig =
        selectedBranchConfig ||
        getBranchBySpotId(
          runtimeBranchConfigs,
          spotIdSpot || (activeTab === "pickup" ? spot_id : null)
        );
      const effectiveSpotId = Number(
        spotIdSpot ||
          effectiveBranchConfig?.spotId ||
          nearestPosterSpot?.spot_id ||
          spot_id ||
          1
      );
      const effectiveDeliveryPrice =
        activeTab === "delivery"
          ? Number(
              effectiveBranchConfig
                ? resolveDeliveryFee(effectiveBranchConfig)
                : Number(delivery_price || DEFAULT_DELIVERY_PRICE)
            )
          : 0;
      const filterProductsAbdugani = products?.map((p) => {
        const productName =
          p?.product_name ||
          p?.name ||
          getLocalizedProduct(p?.product_production_description, locale, "name") ||
          `Product ${p?.product_id}`;
        return {
          product_id: +p.product_id,
          amount: +p.count,
          product_name: productName,
          name: productName,
          price: Number(p?.price?.["1"] || 0) / 100,
        };
      });
      const filterProductsSpot = products
        ?.filter((pr) => !pr?.promocode)
        ?.map((p) => {
          const productName =
            p?.product_name ||
            p?.name ||
            getLocalizedProduct(p?.product_production_description, locale, "name") ||
            `Product ${p?.product_id}`;
          return {
            product_id: +p.product_id,
            count: +p.count,
            product_name: productName,
            name: productName,
            price: Number(p?.price?.["1"] || 0) / 100,
          };
        });

      let commentSpot;
      if (!spotIdSpot) {
        commentSpot = comment ? `${comment}, ` : "";
      }
      switch (payment_method) {
        case "card":
          commentSpot = `${commentSpot ?? ""}Тип оплаты : по карте`;
          break;
        case "click":
          commentSpot = `${commentSpot ?? ""}Тип оплаты : через click`;
          break;
        case "payme":
          commentSpot = `${commentSpot ?? ""}Тип оплаты : через payme`;
          break;
        case "uzum":
          commentSpot = `${commentSpot ?? ""}Тип оплаты : через uzum`;
          break;
        default:
          commentSpot = `${commentSpot ?? ""}Тип оплаты : наличными`;
      }
      if (paymentData && paymentData?.transactionId) {
        commentSpot = `${commentSpot}\nТранзакцияID: ${paymentData?.transactionId}`;
      }
      if (promocode) {
        commentSpot = `${commentSpot}\nПромокод:${promocode?.name?.split("$")[1]
          }`;
      }
      if (orderData?.promocodePrice > 0) {
        commentSpot = `${commentSpot}\nПромокодSum: ${orderData?.promocodePrice?.toLocaleString()}`;
      }
      if (orderData?.discountPromocode > 0) {
        commentSpot = `${commentSpot}\nСкидка: ${orderData?.discountPromocode}%`;
      }

      if (spotIdSpot) {
        commentSpot = `${commentSpot ? commentSpot : ""
          }\nНомер стола : ${table_num} \nТип услуги : ${service == "self" ? "самообслуживание" : "официант"
          }`;
      }
      commentSpot = `${commentSpot}\nТип заказа: Через веб-сайт`;
      commentSpot = `${commentSpot}\nИсточник: Веб-сайт`;

      let filterPromocode = null;
      if (promocode && promocode?.params?.result_type == 1) {
        filterPromocode = [
          {
            type: 1,
            id: +promocode?.promotion_id,
            involved_products: promocode?.params?.bonus_products?.map((prd) => {
              return {
                id: +prd?.id,
                count: +promocode?.params?.bonus_products_pcs,
              };
            }),
          },
        ];
      } else {
        console.log({ products });
        const isCategoryMatch = (condition, product) => {
          if (String(product?.menu_category_id) === String(condition?.id)) {
            return true;
          }
          const targetCategory = categoriesData?.find(
            (cat) => String(cat?.category_id) === String(condition?.id)
          );
          if (!targetCategory) return false;
          return (
            String(product?.menu_category_id) ===
            String(targetCategory?.menu_category_id)
          );
        };

        const isConditionMatched = (condition, product) => {
          if (!condition?.active) return false;
          if (condition?.type == 0) return true;

          // Some Poster setups use legacy type mapping, so we support both.
          if (condition?.type == 1 || condition?.type == 2) {
            const productMatch =
              String(condition?.id) === String(product?.product_id);
            const categoryMatch = isCategoryMatch(condition, product);
            return productMatch || categoryMatch;
          }

          return false;
        };

        const findProductPromotion = products?.filter((pr) => {
          const conditions = orderData?.promocode?.params?.conditions || [];
          if (promocode?.params?.result_type != 3) return false;
          return conditions?.some((condition) =>
            isConditionMatched(condition, pr)
          );
        });
        console.log({ findProductPromotion });
        filterPromocode = [
          {
            type: 2,
            id: +promocode?.promotion_id,
            involved_products: findProductPromotion?.map((prd) => {
              return {
                id: +prd?.product_id,
                count: +prd?.count,
              };
            }),
          },
        ];
      }
      console.log(filterPromocode);

      let totalAmount = Number(totalSum) - (pay_bonus ? Number(pay_bonus) : 0);

      if (activeTab == "delivery") {
        totalAmount += effectiveDeliveryPrice;
      }

      if (orderData?.promocodePrice > 0) {
        totalAmount -= Number(orderData?.promocodePrice);
      }

      if (service == "waiter") {
        totalAmount = Number(totalAmount + (totalAmount * 10) / 100);
      }
      const normalizedPhone =
        (phone && String(phone).trim()) ||
        (resolvedAuth?.phone_number ? `+${resolvedAuth?.phone_number}` : "") ||
        "";
      const branchName =
        getBranchDisplayName(effectiveBranchConfig, locale) ||
        (nearestPosterSpot?.name && String(nearestPosterSpot?.name).trim()) ||
        (spot_name && String(spot_name).trim()) ||
        (spotDataFilial?.response?.name && String(spotDataFilial?.response?.name).trim()) ||
        "";
      const branchAddress =
        getBranchDisplayAddress(effectiveBranchConfig, locale) ||
        (nearestPosterSpot?.address && String(nearestPosterSpot?.address).trim()) ||
        (orderData?.spot_address && String(orderData?.spot_address).trim()) ||
        (spotDataFilial?.response?.address &&
          String(spotDataFilial?.response?.address).trim()) ||
        "";
      const branchPhone =
        getBranchPhone(effectiveBranchConfig) ||
        (nearestPosterSpot?.phone && String(nearestPosterSpot?.phone).trim()) ||
        (orderData?.spot_phone && String(orderData?.spot_phone).trim()) ||
        (spotDataFilial?.response?.phone &&
          String(spotDataFilial?.response?.phone).trim()) ||
        "";
      const firstName =
        resolvedAuth?.firstname ||
        resolvedAuth?.first_name ||
        resolvedAuth?.client_name ||
        resolvedAuth?.name ||
        "";
      const lastName = resolvedAuth?.lastname || resolvedAuth?.last_name || "";
      const promoCodeValue =
        promocode?.name && String(promocode?.name).includes("$")
          ? String(promocode?.name).split("$")[1]
          : null;
      const promoDiscountAmount =
        orderData?.promocodePrice > 0 ? Number(orderData?.promocodePrice) : null;
      const promoDiscountPercentage =
        orderData?.discountPromocode > 0 ? Number(orderData?.discountPromocode) : null;
      const normalizedPromotions = promocode ? filterPromocode : null;

      let deliveryData = {
        address_comment,
        address,
        all_price: Number((+totalSum + +effectiveDeliveryPrice) * 100),
        delivery_price: Number(effectiveDeliveryPrice || 0),
        delivery_latitude: Number(lat || 0) || null,
        delivery_longitude: Number(lng || 0) || null,
        client_address: `${lat || 0},${lng || 0}`,
        client_id: resolvedAuth?.client_id ? resolvedAuth.client_id : "25562",
        comment: commentSpot,
        created_at: formatCreatedAt(),
        payed_bonus: pay_bonus ? Number(pay_bonus) * 100 : 0,
        payed_sum: Number(Math.round(totalAmount)) * 100,
        payment: payment_method == "cash" ? "cash" : "creditCard",
        phone: normalizedPhone,
        first_name: firstName,
        last_name: lastName,
        language: locale,
        products: JSON.stringify(filterProductsAbdugani),
        promotion: normalizedPromotions,
        promotions: normalizedPromotions,
        spot_id: effectiveSpotId,
        spot_name: branchName,
        spot_address: branchAddress,
        spot_phone: branchPhone,
        branch_id: String(effectiveSpotId),
        branch_latitude:
          effectiveBranchConfig?.location?.latitude != null
            ? Number(effectiveBranchConfig.location.latitude)
            : nearestPosterSpot?.lat != null
              ? Number(nearestPosterSpot.lat)
            : null,
        branch_longitude:
          effectiveBranchConfig?.location?.longitude != null
            ? Number(effectiveBranchConfig.location.longitude)
            : nearestPosterSpot?.lng != null
              ? Number(nearestPosterSpot.lng)
            : null,
        promoCode: promoCodeValue,
        promoDiscountAmount,
        promoDiscountPercentage,
        status: "",
        type: "delivery",
        promocode: promoCodeValue,
      };

      let pickupData = {
        address_comment: "no",
        all_price: Number(totalSum * 100),
        client_address: `41.316421,69.247890`,
        client_id: resolvedAuth?.client_id ? resolvedAuth?.client_id : "25562",
        comment: commentSpot,
        created_at: formatCreatedAt(),
        payed_bonus: pay_bonus ? Number(pay_bonus) * 100 : 0,
        payed_sum: Number(Math.round(totalAmount)) * 100,
        payment: payment_method == "cash" ? "cash" : "creditCard",
        phone: normalizedPhone,
        first_name: firstName,
        last_name: lastName,
        language: locale,
        products: JSON.stringify(filterProductsAbdugani),
        promotion: normalizedPromotions,
        promotions: normalizedPromotions,
        spot_id: effectiveSpotId,
        spot_name: branchName,
        spot_address: branchAddress,
        spot_phone: branchPhone,
        branch_id: String(effectiveSpotId),
        promoCode: promoCodeValue,
        promoDiscountAmount,
        promoDiscountPercentage,
        status: "",
        type: `take_away ${branchName || spot_name}`,
        promocode: promoCodeValue,
      };

      let spotData = {
        phone: normalizedPhone,
        first_name: firstName,
        last_name: lastName,
        spot_name: branchName,
        spot_address: branchAddress,
        spot_phone: branchPhone,
        branch_id: String(effectiveSpotId),
        language: locale,
        products: filterProductsSpot,
        service_mode: spotIdSpot ? 1 : 2,
        spot_id: effectiveSpotId,
        comment: commentSpot,
        promotion: normalizedPromotions,
        promotions: normalizedPromotions,
        promoCode: promoCodeValue,
        promoDiscountAmount,
        promoDiscountPercentage,
      };

      if (address && !spotIdSpot) {
        spotData.address = address;
      }

      console.log({ deliveryData });
      console.log({ pickupData });
      console.log({ spotData });
      console.log(orderData);
      console.log("Spot data", JSON.stringify(spotData));

      let commentClient;
      let clinetGroupId;

      if (resolvedAuth?.client_id) {
        const commentC = resolvedAuth?.comment
          ? JSON.parse(resolvedAuth?.comment)
          : null;
        if (Number(commentC?.length) > 0) {
          commentClient = {
            password: commentC?.password,
            length: Number(commentC?.length) + 1,
          };
        } else {
          commentClient = {
            password: commentC?.password,
            length: 1,
          };
        }
        if (commentClient.length < 4) {
          clinetGroupId = 5;
        } else if (commentC.length >= 4 && commentC?.length < 9) {
          clinetGroupId = 3;
        } else if (commentC.length >= 9) {
          clinetGroupId = 4;
        }
      }
      if (payment_method == "payme" || payment_method == "click") {
        // Determine order details and service mode based on context
        let orderDetails, serviceMode, draftOrder;
        if (spotIdSpot) {
          orderDetails = {
            ...spotData,
            service,
            spot_name: spotDataFilial?.response?.name,
          };
          serviceMode = 1;
          draftOrder = { ...spotData };
        } else if (activeTab == "pickup") {
          orderDetails = pickupData;
          serviceMode = 2;
          draftOrder = { ...pickupData };
        } else {
          orderDetails = deliveryData;
          serviceMode = 3;
          draftOrder = { ...deliveryData };
        }

        // Build checkout payload
        const baseUrl = `https://rolling.uz/${locale}/${place}`;
        const returnUrl = spotIdSpot
          ? `${baseUrl}/cart?spot=${spotIdSpot}&table_id=${table_id}&table_num=${table_num}&service=${service}&confirm=true`
          : `${baseUrl}/confirmedpay`;

        const dataPay = {
          orderDetails: {
            ...orderDetails,
            service_mode: serviceMode,
          },
          amount: Math.round(totalAmount),
          status: payment_method === "payme" ? 0 : 1,
          provider: payment_method,
          url: returnUrl,
        };
        if (resolvedAuth?.client_id) {
          dataPay.userId = resolvedAuth.client_id;
        }

        // Call the appropriate checkout endpoint
        const res =
          payment_method === "payme"
            ? await PaymeCheckout(dataPay)
            : await ClickCheckout(dataPay);

        console.log({ res });

        if (res?.url) {
          const transactionId = String(res.order_id || res.orderId || "");

          // Store pending payment state — DO NOT clear cart yet
          setPendingOnlinePayment({
            provider: payment_method,
            transactionId,
            amount: totalAmount,
            orderId: transactionId,
            createdAt: Date.now(),
            checkoutUrl: res.url,
          });

          // Save order to localStorage for later retrieval
          orderList.push({
            ...draftOrder,
            order_id: transactionId,
            payment_type: payment_method,
            type: spotIdSpot ? "spot" : activeTab === "pickup" ? "take_away" : "delivery",
            status: "pending",
            created_at: new Date().toISOString(),
            all_price: Math.round(totalAmount * 100),
            payed_sum: Math.round(totalAmount * 100),
          });
          localStorage.setItem("orderList", JSON.stringify(orderList));

          // Fire analytics
          window.dataLayer?.push({
            event: "purchase",
            ecommerce: {
              transaction_id: transactionId,
              value: totalAmount,
              currency: "UZS",
              items: orderDetails?.products || spotData?.products,
            },
          });

          if (spotIdSpot) {
            // Spot order: open payment directly (still in user gesture context)
            openPaymentUrl(payment_method, res.url, {
              fallbackToCurrentTab: true,
            });
          } else {
            // Web order: navigate to confirmedpay page.
            // Desktop: auto-opens payment in new tab.
            // Mobile: shows a "Pay" button the user taps to open the app
            //         (intent:// and Universal Links require a real <a> tap).
            router.push(
              `/${locale}/${place}/confirmedpay/${transactionId}?autostart=1&provider=${payment_method}`
            );
          }

          // Update client loyalty if authenticated
          if (resolvedAuth?.client_id) {
            await updateClient({
              client_id: resolvedAuth?.client_id,
              comment: JSON.stringify(commentClient),
              client_groups_id_client: clinetGroupId,
            });
          }
        } else {
          toast.error(all("order_error") || "Payment initialization failed");
        }
      } else {
        if (spotIdSpot) {
          const res = await createIncomingOrder(spotData);
          console.log(res);

          if (res?.response) {
            const transactionId = String(
              res?.order_id ||
                res?.response?.incoming_order_id ||
                res?.response?.transaction_id ||
                ""
            );

            const nowOrder = {
              ...spotData,
              order_id: transactionId,
              payment_type: payment_method,
              type: "spot",
              status: "pending",
              created_at: new Date().toISOString(),
              all_price: Math.round(totalAmount * 100),
              payed_sum: Math.round(totalAmount * 100),
              response: res?.response || res,
            };

            orderList.push(nowOrder);
            localStorage.setItem("orderList", JSON.stringify(orderList));
            resetOrderAndCart();
            toast.success(all("order_created"));
            setIsSuccess(true);
            window.dataLayer?.push({
              event: "purchase",
              ecommerce: {
                transaction_id: transactionId,
                value: totalAmount,
                currency: "UZS",
                items: spotData?.products,
              },
            });
          }
        } else {
          if (activeTab == "pickup") {
            const res = await createOrder(pickupData);
            console.log({ res });
            if (res?.order_id) {
              const nowOrder = {
                ...pickupData,
                order_id: res.order_id,
                payment_type: payment_method,
              };
              orderList.push(nowOrder);
              localStorage.setItem("orderList", JSON.stringify(orderList));
              resetOrderAndCart();
              if (resolvedAuth?.client_id) {
                await updateClient({
                  client_id: resolvedAuth?.client_id,
                  comment: JSON.stringify(commentClient),
                  client_groups_id_client: clinetGroupId,
                });
              }
              window.dataLayer?.push({
                event: "purchase",
                ecommerce: {
                  transaction_id: res?.order_id,
                  value: totalAmount,
                  currency: "UZS",
                  items: spotData?.products,
                },
              });
              toast.success(all("order_created"));
              router.push(`/${locale}/${place}/confirmed/${res?.order_id}`);
            }
          } else if (activeTab == "delivery") {
            const res = await createOrder(deliveryData);
            if (res?.order_id) {
              const nowOrder = {
                ...deliveryData,
                order_id: res.order_id,
                payment_type: payment_method,
              };
              orderList.push(nowOrder);
              localStorage.setItem("orderList", JSON.stringify(orderList));
              resetOrderAndCart();
              toast.success(all("order_created"));
              router.push(`/${locale}/${place}/confirmed/${res?.order_id}`);
              window.dataLayer?.push({
                event: "purchase",
                ecommerce: {
                  transaction_id: res?.order_id,
                  value: totalAmount,
                  currency: "UZS",
                  items: spotData?.products,
                },
              });
              if (resolvedAuth?.client_id) {
                await updateClient({
                  client_id: resolvedAuth?.client_id,
                  comment: JSON.stringify(commentClient),
                  client_groups_id_client: clinetGroupId,
                });
              }
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRederect = () => {
    setIsSuccess(false);
    router.push(
      `/${locale}/${place}?spot=${spotIdSpot}&table_id=${table_id}&table_num=${table_num}&service=${service}`
    );
  };

  useEffect(() => {
    if (paymentData && paymentData?.success && paymentData?.transactionId) {
      handleSubmit();
    }
  }, [paymentData?.success]);

  useEffect(() => {
    if (orderData?.pay_bonus > totalSum) {
      handleRemoveBonus();
    }
  }, [totalSum]);

  useEffect(() => {
    if (confirm && pendingOnlinePayment?.transactionId) {
      // Spot order returned from payment provider — verify transaction
      const verifySpotPayment = async () => {
        setIsLoading(true);
        try {
          const { result } = await verifyPaymentTransaction(
            pendingOnlinePayment.transactionId
          );
          if (result === "paid") {
            clearPendingOnlinePayment();
            resetOrderAndCart();
            toast.success(all("order_created"));
            setIsSuccess(true);
          } else if (result === "cancelled") {
            clearPendingOnlinePayment();
            toast.error(all("payment_cancelled") || "Payment was cancelled");
          } else {
            toast.warning(
              all("payment_pending") ||
                "Payment is still being processed. Please wait."
            );
          }
        } finally {
          setIsLoading(false);
        }
      };
      verifySpotPayment();
    } else if (confirm) {
      toast.warning(
        all("payment_pending") ||
          "Payment is still being processed. Please check again."
      );
    }
  }, []);

  console.log(orderData);

  return (
    <div className="w-full flex flex-col lg:pt-6 gap-5">
      <div className="max-lg:hidden flex flex-col gap-y-4">
        <div className="w-full grid grid-cols-[minmax(0,1fr)_260px] gap-3 items-center">
          <p className="font-medium textSmall3 leading-5 text-[#2E2E2E] text-start md:text-end">
            {service == "self" ? total("total") : total("products_sum")}{" "}
          </p>
          <p className="font-normal textNormal2 leading-7 text-[#2E2E2E] text-right">
            {formatNumber(originalProductsSum)} {all("sum")}
          </p>
        </div>
        {orderData?.promocodePrice > 0 && (
          <div className="w-full grid grid-cols-[minmax(0,1fr)_260px] gap-3 items-center">
            <p className="font-medium textSmall3 leading-5 text-[#2E2E2E] text-start md:text-end">
              {promocodeT("titleDialog")}
            </p>
            <p className="text-primary font-normal textNormal2 leading-7 text-[#2E2E2E] text-right">
              -{formatNumber(orderData?.promocodePrice)} {all("sum")}
            </p>
          </div>
        )}
        {orderData?.discountPromocode > 0 && (
          <div className="w-full grid grid-cols-[minmax(0,1fr)_260px] gap-3 items-center">
            <p className="font-medium textSmall3 leading-5 text-[#2E2E2E] text-start md:text-end">
              {promocodeT("titleDialog")}
            </p>
            <p className="text-primary font-normal textNormal2 leading-7 text-[#2E2E2E] text-right whitespace-nowrap">
              {formatNumber(orderData?.discountPromocode)}% {all("disc")} · -{formatNumber(promoDiscountAmount)} {all("sum")}
            </p>
          </div>
        )}
        {activeTab === "delivery" && (
          <div className="w-full grid grid-cols-[minmax(0,1fr)_260px] gap-3 items-center">
            <p className="font-medium textSmall3 leading-5 text-[#2E2E2E] text-start md:text-end">
              {total("delivery")}
            </p>
            <p className="font-normal textNormal2 leading-7 text-[#2E2E2E] text-right">
              {formatNumber(orderData?.delivery_price)} {all("sum")}
            </p>
          </div>
        )}
        {activeTab !== "spot" && (
          <div className="w-full grid grid-cols-[minmax(0,1fr)_260px] gap-3 items-center">
            <p className="font-medium textSmall3 leading-5 text-[#2E2E2E] text-start md:text-end">
              {total("bonus")}
            </p>
            <p className="font-normal textNormal2 leading-7 text-[#2E2E2E] text-right">
              {formatNumber(Number(orderData?.pay_bonus))} {all("sum")}
            </p>
          </div>
        )}
        {activeTab !== "spot" && (
          <div className="w-full grid grid-cols-[minmax(0,1fr)_260px] gap-3 items-center">
            <p className="font-medium textSmall3 leading-5 text-[#2E2E2E] text-start md:text-end">
              {total("total")}
            </p>
            <p className="font-normal textNormal3 leading-7 text-[#2E2E2E] text-right">
              {formatNumber(payableTotal)}{" "}
              {all("sum")}
            </p>
          </div>
        )}
        {activeTab == "spot" && service == "waiter" && (
          <div className="w-full flex justify-between">
            <p className="font-medium textSmall3 leading-5 text-[#2E2E2E] text-start md:text-end">
              {all("waiter")}
            </p>
            <p className="font-normal textNormal2 leading-7 text-[#2E2E2E]">
              10%
            </p>
          </div>
        )}
        {activeTab == "spot" && service == "waiter" && (
          <div className="w-full flex justify-between">
            <p className="font-medium textSmall3 leading-5 text-[#2E2E2E] text-start md:text-end">
              {total("total")}
            </p>
            <p className="font-normal textNormal3 leading-7 text-[#2E2E2E]">
              {formatNumber(Number(totalSum + (totalSum * 10) / 100))}
              {all("sum")}
            </p>
          </div>
        )}
      </div>
      <div className="space-y-2 md:space-y-4">
        <PromoCodeDialog
          locale={locale}
          categoriesData={categoriesData}
          auth={auth}
          promotions={promotions?.response}
          productsData={productsData}
        />
        {activeTab !== "spot" && (
          <>
            <Button
              aria-label={`sign in`}
              disabled={paymentData && paymentData?.payment_id}
              onClick={() => {
                if (isAuthorized) {
                  setActiveBonus(true);
                } else {
                  toast.error(
                    <div className="w-full h-full flex justify-start items-center">
                      <h1 className="w-full">{all("no_auth")} </h1>
                      <Link
                        href={`/${locale}/${place}/login`}
                        className="min-w-[80px] flex justify-center items-center h-full bg-black text-white rounded-md px-3 py-2"
                      >
                        {all("sign_in")}
                      </Link>
                    </div>
                  );
                }
              }}
              className="bg-[#F5F5F5] w-full h-10 md:h-12 flex justify-center items-center gap-1 border-[1px] rounded-xl"
            >
              <Image
                src={"/assets/gift.webp"}
                alt="gift"
                width={100}
                height={100}
                className="w-7 md:w-9 h-7 md:h-8"
              />
              <p className="font-medium text-sm sm:text-md leading-5 text-[#2E2E2E]">
                {total("bonus_pay")}
              </p>
              <p className="text-[#2E2E2E]">
                <ChevronRight />
              </p>
            </Button>
            {activeBonus && isAuthorized && (
              <div className="flex-col w-full p-5 border-[1px] shadow-md rounded-xl mt-3">
                <div className="w-full flex justify-between gap-2">
                  <div className="flex flex-col items-center gap-4">
                    <p className="text-[#373737] textNormal2">
                      {total("have_bonus")}
                    </p>
                    <p className="textSmall5">
                      {formatNumber(Number(resolvedAuth?.bonus / 100))} {all("sum")}
                    </p>
                  </div>
                  <DiscountBadge auth={resolvedAuth} />
                </div>
                <div className="mt-[7px]">
                  <p className="text-[#373737] pb-1 font-medium">
                    {all("choose")} {all("sum")}
                  </p>
                  <Input
                    onChange={(e) => {
                      let value = e.target.value;

                      value = value.replace(/[^0-9]/g, "");

                      const maxBonus = Math.min(
                        Number(resolvedAuth?.bonus || 0) / 100,
                        totalSum
                      );
                      value = Math.min(Number(value), maxBonus);

                      setBonus(value);
                    }}
                    value={formatNumber(Number(bonus))}
                    type="text"
                    placeholder={`45 000 ${all("sum")}`}
                    className="outline-none border-[2px] bg-transparent p-2 md:p-3 focus-visible:ring-0 focus:border-primary w-full text-[12px] md:text-sm rounded-md"
                  />
                </div>
                <div className="w-full flex justify-around items-center pt-7 gap-2 textSmall2">
                  <Button
                    aria-label={`confirm`}
                    onClick={handleSetBonus}
                    className="w-full hover:bg-primary md:py-2 md:h-12"
                  >
                    {all("confirm")}
                  </Button>
                  <Button
                    aria-label={`cancel`}
                    onClick={() => setActiveBonus(false)}
                    className="w-full border text-[#004032] shadow-none bg-transparent hover:bg-transparent md:py-2 md:h-12"
                  >
                    {all("cancel")}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
        {orderData?.payment_method != "card" && (
          <Button
            aria-label={`loading`}
            disabled={isLoading || isDisabled}
            // disabled={isLoading}
            onClick={handleSubmit}
            className="mb-3 w-full h-12 flex justify-center items-center gap-1 border-[1px] rounded-xl hover:bg-primary md:mt-5 font-medium text-sm md:text-md"
          >
            {isLoading ? (
              <div>
                <div className="flex items-center gap-4">
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className="w-6 h-6 text-gray-300 animate-spin dark:text-gray-600 fill-gray-700"
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
                    <span className="text-black sr-only">{all("loading")}</span>
                  </div>
                  {all("loading")}
                </div>
              </div>
            ) : (
              <div>{total("submit")}</div>
            )}
          </Button>
        )}
        {isDisabled && (
          <div className="w-full p-5 border-[1px] border-[#979797] rounded-xl mt-3">
            <p
              className="font-medium"
              dangerouslySetInnerHTML={{ __html: total("note") }}
            />
          </div>
        )}
      </div>
      <AlertDialog open={isSuccess}>
        <AlertDialogTrigger className="hidden">Open</AlertDialogTrigger>
        <AlertDialogContent className="w-11/12 mx-auto rounded-md">
          <AlertDialogHeader>
            <AlertDialogTitle>{all("order_created")}</AlertDialogTitle>
            <AlertDialogDescription>
              {all("additional_info")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleRederect}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Order;
