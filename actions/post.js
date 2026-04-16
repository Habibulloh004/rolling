"use server";
import { url, production } from "@/lib/utils";
import { cookies } from "next/headers";

const jsonHeaders = { "Content-Type": "application/json" };
const orderBackendUrl =
  (process.env.NEXT_PUBLIC_ROLLING_BACK_URL || url || "").replace(/\/+$/, "");

const asNumber = (value, fallback = 0) => {
  const normalized =
    typeof value === "string" ? value.replace(/[^\d.-]/g, "") : value;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseProducts = (products) => {
  if (!products) return [];
  if (Array.isArray(products)) return products;
  if (typeof products === "string") {
    try {
      const parsed = JSON.parse(products);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

const safeText = (value) => {
  if (value == null) return null;
  const text = String(value).trim();
  return text.length > 0 ? text : null;
};

const formatTelegramAmount = (value) => {
  const normalized = Math.max(0, Math.round(asNumber(value, 0)));
  return `${new Intl.NumberFormat("ru-RU")
    .format(normalized)
    .replace(/\u00A0/g, " ")} сум`;
};

const buildTelegramMapLink = (lat, lon) => {
  const latitude = asNumber(lat, NaN);
  const longitude = asNumber(lon, NaN);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }
  return `https://yandex.com/maps/?pt=${longitude},${latitude}&z=16&l=map`;
};

const resolveTelegramPaymentDescription = (paymentMethodId) => {
  switch (String(paymentMethodId || "").trim()) {
    case "1":
      return "Наличные";
    case "2":
      return "Карта";
    case "3":
      return "Карта";
    case "4":
      return "Payme (Оплачено)";
    case "5":
      return "Click (Оплачено)";
    default:
      return "Не указан";
  }
};

const resolveTelegramOrderType = (serviceMode) => {
  const mode = asNumber(serviceMode, 3);
  if (mode === 2) return "Самовывоз";
  if (mode === 1) return "Заведения";
  return "Доставка";
};

const resolveTelegramAddress = (payload) =>
  safeText(payload?.address) ??
  safeText(payload?.deliveryAddress) ??
  "Не указан";

const buildWebTelegramOrderMessage = ({ payload, response }) => {
  const orderNumber =
    safeText(response?.order?.orderNumber) ??
    safeText(response?.response?.incoming_order_id) ??
    safeText(response?.response?.transaction_id) ??
    "Не указан";
  const branchName =
    safeText(response?.order?.branchName) ??
    safeText(payload?.branchName) ??
    "Не указан";
  const phone = safeText(payload?.phone) ?? "Не указан";
  const address = resolveTelegramAddress(payload);
  const paymentDescription = resolveTelegramPaymentDescription(payload?.paymentMethodId);
  const orderType = resolveTelegramOrderType(payload?.serviceMode);
  const orderAmount = Math.max(
    0,
    asNumber(payload?.subtotal, 0) + asNumber(payload?.deliveryPrice, 0) - asNumber(payload?.discount, 0)
  );
  const totalToPay = Math.max(0, asNumber(payload?.total, orderAmount));
  const bonuses = Math.max(0, asNumber(payload?.loyaltyPointsUsed, 0));
  const deliveryFee = Math.max(0, asNumber(payload?.deliveryPrice, 0));
  const mapLink =
    buildTelegramMapLink(payload?.deliveryLatitude, payload?.deliveryLongitude) ||
    "Не указан";
  const addressComment =
    safeText(payload?.deliveryAddressComment) ??
    safeText(payload?.deliveryInstructions) ??
    "Не указан";
  const ordersCompleted = Math.max(0, asNumber(payload?.userOrderCount, 0));
  const summary = [
    `Тип оплаты : ${paymentDescription}`,
    `Номер телефона : ${phone}`,
    "Тип заказа: Через веб-сайт",
  ].join("\n");

  const lines = [
    `📦 Новый заказ №${orderNumber}`,
    `🛒 Название филиал: ${branchName}`,
    `📞 Телефон: ${phone}`,
    `🏠 Адрес: ${address}`,
    `🔗 [Посмотреть на карте] ${mapLink}`,
    "🗺️ Расстояние: Не указан",
    `💵 Сумма заказа: ${formatTelegramAmount(orderAmount)}`,
    `💳 Метод оплаты: ${paymentDescription}`,
    `🎁 Бонусы: ${formatTelegramAmount(bonuses)}`,
    `💵 К оплате: ${formatTelegramAmount(totalToPay)}`,
    `🛍 Тип заказа: ${orderType}`,
    "📲 Источник: Веб-сайт",
    `🚚 Доставка: ${formatTelegramAmount(deliveryFee)}`,
    `✏️ Комментарий: ${summary}`,
    `📦 Количество заказов: ${ordersCompleted}`,
    `✏️ Комментарий к адресу: ${addressComment}`,
  ];

  if (safeText(payload?.promoCode)) {
    lines.splice(lines.length - 1, 0, `🏷 Промокод: ${payload.promoCode}`);
  }

  return lines.join("\n");
};

const sendTelegramBridgeMessage = async (message) => {
  if (!orderBackendUrl || !message) return;
  const endpoint = `${orderBackendUrl}/sendMessageToTelegram?message=${encodeURIComponent(
    message
  )}`;
  try {
    const response = await fetch(endpoint, { method: "GET", cache: "no-store" });
    if (!response.ok) {
      const body = await response.text();
      console.error(`sendTelegramBridgeMessage failed: ${response.status}`, body);
    }
  } catch (error) {
    console.error("sendTelegramBridgeMessage error", error);
  }
};

const shouldSendDirectWebTelegram = (payload = {}) => {
  const method = String(payload?.paymentMethodId || "").trim();
  const serviceMode = asNumber(payload?.serviceMode, 3);
  return (method === "1" || method === "2" || method === "3") && serviceMode !== 1;
};

const fetchTransactionStatus = async (transactionId) => {
  try {
    const response = await fetch(`${url}/api/transaction/${transactionId}`);
    const raw = await response.text();
    if (!response.ok) {
      return null;
    }
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

const resolveServiceMode = (data = {}) => {
  const directMode = asNumber(data?.serviceMode || data?.service_mode, 0);
  if ([1, 2, 3].includes(directMode)) {
    return directMode;
  }

  const type = String(data?.type || "").toLowerCase();
  if (type.includes("delivery")) return 3;
  if (type.includes("take_away") || type.includes("pickup")) return 2;
  return 1;
};

const mapPaymentMethodId = (data = {}) => {
  const direct = data?.paymentMethodId;
  if (direct === "1" || direct === "2") return direct;

  const method = String(data?.payment_method || data?.payment || "").toLowerCase();
  if (!method || method === "cash") return "1";
  return "2";
};

const mapProducts = (rawProducts = []) =>
  rawProducts
    .map((product) => {
      const productId = String(
        product?.productId ?? product?.product_id ?? product?.id ?? ""
      ).trim();
      if (!productId) return null;

      const count = Math.max(1, asNumber(product?.count ?? product?.amount, 1));
      const rawPrice = product?.price?.["1"] ?? product?.price;
      const normalizedPrice =
        rawPrice && Number(rawPrice) > 999 ? Number(rawPrice) / 100 : asNumber(rawPrice, 0);
      const totalPrice = asNumber(
        product?.totalPrice ?? product?.total_price,
        normalizedPrice * count
      );

      return {
        productId,
        name: String(product?.name ?? product?.product_name ?? `Product ${productId}`),
        count,
        modificatorId: product?.modificatorId ?? product?.modificator_id ?? null,
        modifiers: product?.modifiers ?? null,
        priceOverride: product?.priceOverride ?? product?.price_override ?? null,
        isGift: Boolean(product?.isGift ?? product?.is_gift ?? false),
        price: normalizedPrice,
        totalPrice,
        imageUrl: product?.imageUrl ?? product?.image_url ?? null,
      };
    })
    .filter(Boolean);

const mapPromotions = (data = {}) => {
  let source = Array.isArray(data?.promotions) ? data.promotions : data?.promotion;
  if (!Array.isArray(source) && typeof source === "string") {
    try {
      const parsed = JSON.parse(source);
      source = Array.isArray(parsed) ? parsed : null;
    } catch {
      source = null;
    }
  }
  if (!Array.isArray(source) || source.length === 0) {
    return null;
  }

  const mapped = source
    .map((promotion) => {
      const id = String(promotion?.id ?? "").trim();
      if (!id) return null;

      const involvedProducts = Array.isArray(
        promotion?.involvedProducts ?? promotion?.involved_products
      )
        ? promotion.involvedProducts ?? promotion.involved_products
        : [];
      const resultProducts = Array.isArray(
        promotion?.resultProducts ?? promotion?.result_products
      )
        ? promotion.resultProducts ?? promotion.result_products
        : [];

      return {
        id,
        involvedProducts: involvedProducts.map((item) => ({
          id: String(item?.id ?? ""),
          count: asNumber(item?.count, 1),
          modificationId: item?.modificationId ?? item?.modification_id ?? null,
        })),
        resultProducts: resultProducts.map((item) => ({
          id: String(item?.id ?? ""),
          count: asNumber(item?.count, 1),
          modificationId: item?.modificationId ?? item?.modification_id ?? null,
        })),
      };
    })
    .filter(Boolean);

  return mapped.length > 0 ? mapped : null;
};

const normalizeOrderPayload = (data = {}) => {
  const serviceMode = resolveServiceMode(data);
  const isDelivery = serviceMode === 3;
  const parsedProducts = mapProducts(parseProducts(data?.products));

  const [latFromClientAddress, lngFromClientAddress] = String(
    data?.client_address || ""
  )
    .split(",")
    .map((value) => asNumber(value, 0));

  const deliveryPrice = asNumber(data?.deliveryPrice ?? data?.delivery_price, 0);
  const total = asNumber(
    data?.total ?? data?.payed_sum / 100 ?? data?.all_price / 100,
    0
  );
  const subtotal =
    data?.subtotal != null
      ? asNumber(data?.subtotal, 0)
      : Math.max(
          0,
          asNumber(data?.all_price, 0) / 100 - (isDelivery ? deliveryPrice : 0)
        );
  const discount =
    data?.discount != null
      ? asNumber(data?.discount, 0)
      : Math.max(0, subtotal + (isDelivery ? deliveryPrice : 0) - total);

  const spotCandidate = String(
    data?.spotId ?? data?.spot_id ?? data?.branchId ?? data?.branch_id ?? "1"
  ).trim();
  const normalizedSpotId = !spotCandidate || spotCandidate === "0" ? "1" : spotCandidate;
  const branchName =
    safeText(data?.branchName) ??
    safeText(data?.branch_name) ??
    safeText(data?.spot_name);
  const branchAddress =
    safeText(data?.branchAddress) ??
    safeText(data?.branch_address) ??
    safeText(data?.spot_address);
  const branchPhone =
    safeText(data?.branchPhone) ??
    safeText(data?.branch_phone) ??
    safeText(data?.spot_phone);
  const firstName =
    safeText(data?.firstName) ??
    safeText(data?.first_name) ??
    safeText(data?.client_name) ??
    safeText(data?.name) ??
    safeText(data?.phone);
  const lastName = safeText(data?.lastName) ?? safeText(data?.last_name);
  const deliveryInstructions =
    safeText(data?.deliveryInstructions) ??
    safeText(data?.delivery_instructions) ??
    safeText(data?.address_comment);

  return {
    spotId: normalizedSpotId,
    phone: String(data?.phone ?? "").trim(),
    alternatePhone: data?.alternatePhone ?? data?.alternate_phone ?? null,
    firstName,
    lastName,
    address: isDelivery ? data?.address ?? null : null,
    comment: data?.comment ?? null,
    deliveryPrice: isDelivery ? deliveryPrice : 0,
    paymentMethodId: mapPaymentMethodId(data),
    products: parsedProducts,
    promotions: mapPromotions(data),
    serviceMode,
    deliveryLatitude:
      data?.deliveryLatitude ??
      data?.delivery_latitude ??
      (isDelivery ? latFromClientAddress || null : null),
    deliveryLongitude:
      data?.deliveryLongitude ??
      data?.delivery_longitude ??
      (isDelivery ? lngFromClientAddress || null : null),
    deliveryAddressComment: data?.deliveryAddressComment ?? data?.address_comment ?? null,
    loyaltyPointsUsed:
      data?.loyaltyPointsUsed != null
        ? asNumber(data?.loyaltyPointsUsed, 0)
        : data?.payed_bonus
          ? asNumber(data?.payed_bonus, 0) / 100
          : null,
    promoCode:
      data?.promoCode ??
      (typeof data?.promocode === "string" ? data?.promocode : null) ??
      (typeof data?.promocode?.name === "string"
        ? data.promocode.name.split("$")[1] ?? null
        : null),
    promoDiscountAmount: data?.promoDiscountAmount ?? null,
    promoDiscountPercentage:
      data?.promoDiscountPercentage ??
      (data?.discountPromocode ? asNumber(data?.discountPromocode, 0) : null),
    userId: data?.userId ?? data?.user_id ?? data?.client_id ?? null,
    userOrderCount: data?.userOrderCount ?? null,
    fcmToken: data?.fcmToken ?? null,
    language: data?.language ?? null,
    savedCardToken: data?.savedCardToken ?? null,
    scheduledDeliveryTime:
      data?.scheduledDeliveryTime ?? data?.scheduled_delivery_time ?? null,
    cutleryQuantity: data?.cutleryQuantity ?? data?.cutlery_quantity ?? null,
    napkinsQuantity: data?.napkinsQuantity ?? data?.napkins_quantity ?? null,
    deliveryInstructions,
    subtotal,
    discount,
    total,
    branchId: data?.branchId ?? data?.branch_id ?? data?.spotId ?? data?.spot_id ?? null,
    branchName,
    branchAddress,
    branchPhone,
  };
};

const resolveOnlinePaymentMethodId = (provider, fallbackPaymentMethodId) => {
  const normalizedProvider = String(provider || "").trim().toLowerCase();
  if (normalizedProvider === "payme") return "4";
  if (normalizedProvider === "click") return "5";
  return fallbackPaymentMethodId ?? null;
};

const buildOnlinePaymentOrderDetails = (payload = {}) => {
  const normalized = normalizeOrderPayload(payload?.orderDetails || {});
  const paymentMethodId = resolveOnlinePaymentMethodId(
    payload?.provider,
    normalized.paymentMethodId
  );

  return {
    spot_id: normalized.spotId,
    phone: normalized.phone,
    alternate_phone: normalized.alternatePhone,
    first_name: normalized.firstName,
    last_name: normalized.lastName,
    address: normalized.address,
    comment: normalized.comment,
    delivery_price: normalized.deliveryPrice,
    subtotal: normalized.subtotal,
    discount: normalized.discount,
    total: normalized.total,
    payment_method_id: paymentMethodId,
    service_mode: normalized.serviceMode,
    products: normalized.products.map((product) => ({
      product_id: product.productId,
      name: product.name,
      count: product.count,
      modificator_id: product.modificatorId,
      price_override: product.priceOverride,
      is_gift: product.isGift,
      price: product.price,
      total_price: product.totalPrice,
      image_url: product.imageUrl,
    })),
    promotions: normalized.promotions?.map((promotion) => ({
      id: promotion.id,
      involved_products: promotion.involvedProducts.map((product) => ({
        id: product.id,
        count: product.count,
        modification_id: product.modificationId,
      })),
      result_products: promotion.resultProducts.map((product) => ({
        id: product.id,
        count: product.count,
        modification_id: product.modificationId,
      })),
    })),
    delivery_latitude: normalized.deliveryLatitude,
    delivery_longitude: normalized.deliveryLongitude,
    delivery_address_comment:
      normalized.deliveryAddressComment || normalized.deliveryInstructions,
    loyalty_points_used: normalized.loyaltyPointsUsed,
    promo_code: normalized.promoCode,
    promo_discount_amount: normalized.promoDiscountAmount,
    promo_discount_percentage: normalized.promoDiscountPercentage,
    branch_id: normalized.branchId,
    branch_name: normalized.branchName,
    branch_address: normalized.branchAddress,
    branch_phone: normalized.branchPhone,
    fcm_token: normalized.fcmToken,
    language: normalized.language,
  };
};

const normalizeOnlinePaymentCheckoutPayload = (payload = {}) => ({
  amount: payload?.amount,
  userId: payload?.userId ?? null,
  url: payload?.url ?? null,
  orderDetails: buildOnlinePaymentOrderDetails(payload),
});

const createOrderViaRollingBack = async (data) => {
  const payload = normalizeOrderPayload(data);
  let res = null;
  try {
    const response = await fetch(`${orderBackendUrl}/api/posttoposter`, {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify(payload),
    });
    const raw = await response.text();
    if (!response.ok) {
      console.error(`createOrderViaRollingBack failed: ${response.status}`, raw);
      return null;
    }
    if (!raw) {
      return null;
    }
    try {
      res = JSON.parse(raw);
    } catch (error) {
      console.error("createOrderViaRollingBack non-JSON response", raw);
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }

  if (!res) return res;

  if (shouldSendDirectWebTelegram(payload)) {
    const telegramMessage = buildWebTelegramOrderMessage({
      payload,
      response: res,
    });
    await sendTelegramBridgeMessage(telegramMessage);
  }

  const orderNumber =
    res?.order?.orderNumber ??
    res?.response?.transaction_id ??
    res?.response?.incoming_order_id ??
    null;

  return {
    ...res,
    order_id: orderNumber,
  };
};

export async function createClient(data) {
  const res = fetch(`${url}/api/poster/clients`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => result)
    .catch((error) => console.error(error));
  return res;
}

export async function createIncomingOrder(data) {
  return createOrderViaRollingBack(data);
}

export async function createOrder(data) {
  return createOrderViaRollingBack(data);
}

export async function createOrderPoster(data) {
  return createOrderViaRollingBack(data);
}

export async function updateClient(data) {
  const cookieStore = await cookies();

  // Update client via Poster proxy
  const res = fetch(`${url}/api/poster/clients`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then(async (result) => {
      if (result.response) {
        // Fetch updated client data
        const clientRes = await fetch(
          `${url}/api/poster/clients/${result.response}`
        );
        const client = await clientRes.json();
        if (client) {
          const clientData =
            client?.data?.response ?? client?.response;
          const clientRecord = Array.isArray(clientData)
            ? clientData[0]
            : clientData;
          if (clientRecord) {
            const {
              addresses,
              prize_products,
              accumulation_products,
              ...cleanData
            } = clientRecord;
            cookieStore.set({
              name: "client",
              value: JSON.stringify(cleanData),
            });
          }
        }
        return result;
      }
    })
    .catch((error) => console.error(error));
  return res;
}

export async function saveCookie(cookie) {
  try {
    const cookieStore = await cookies();
    await cookieStore.set({
      name: "client",
      value: JSON.stringify(cookie),
      options: {
        maxAge: 7 * 24 * 60 * 60,
        httpOnly: true,
        secure: production,
      },
    });
    return "data";
  } catch (error) {
    console.error("Failed to save cookie:", error);
    throw error;
  }
}

export async function paymeCreate(data) {
  const res = fetch(`${url}/api/payme/checkout`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => result)
    .catch((error) => console.error(error));
  return res;
}

export async function paymeCheck(data) {
  // Check payment status via transaction endpoint
  const transactionId = data?.transactionId || data?.id || data?.order_id;
  if (transactionId) {
    return fetchTransactionStatus(transactionId);
  }
  // Fallback: post to payme pay endpoint for JSON-RPC check
  const res = fetch(`${url}/api/payme/pay`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => result)
    .catch((error) => console.error(error));
  return res;
}

export async function clickCheck(data) {
  // Check payment status via transaction endpoint
  const transactionId = data?.transactionId || data?.id || data?.order_id;
  if (transactionId) {
    return fetchTransactionStatus(transactionId);
  }
  // Fallback: post to click checkout for status check
  const res = fetch(`${url}/api/click/checkout`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => result)
    .catch((error) => console.error(error));
  return res;
}

export async function payCard(data) {
  const res = fetch(`${url}/api/plum/cards`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => result)
    .catch((error) => console.error(error));
  return res;
}

export async function checkCard(data) {
  const res = fetch(`${url}/api/plum/cards/confirm`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => result)
    .catch((error) => console.error(error));
  return res;
}

export async function PaymeCheckout(data) {
  try {
    const response = await fetch(`${url}/api/payme/checkout`, {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify(normalizeOnlinePaymentCheckoutPayload(data)),
    });
    return await response.json();
  } catch (error) {
    console.error("PaymeCheckout error:", error);
    return null;
  }
}

export async function ClickCheckout(data) {
  try {
    const response = await fetch(`${url}/api/click/checkout`, {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify(normalizeOnlinePaymentCheckoutPayload(data)),
    });
    return await response.json();
  } catch (error) {
    console.error("ClickCheckout error:", error);
    return null;
  }
}

export async function verifyPaymentTransaction(
  transactionId,
  maxAttempts = 6,
  delayMs = 3000
) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const status = await fetchTransactionStatus(transactionId);
    if (status) {
      const statusCode = Number(status.status ?? status.Status ?? -99);
      if (statusCode >= 2) {
        return { result: "paid", transaction: status };
      }
      if (statusCode < 0) {
        return { result: "cancelled", transaction: status };
      }
    }
    if (attempt < maxAttempts - 1) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  return { result: "pending", transaction: null };
}
