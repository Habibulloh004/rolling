"use server";
import { url, production } from "@/lib/utils";
import { cookies } from "next/headers";

const normalizeBaseUrl = (value) => String(value || "").replace(/\/+$/, "");

const apiBaseUrls = [
  normalizeBaseUrl(process.env.NEXT_PUBLIC_ROLLING_BACK_URL),
  normalizeBaseUrl(process.env.NEXT_PUBLIC_URL),
  normalizeBaseUrl(url),
].filter(Boolean);

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchJsonWithFallback(path, options = {}) {
  let lastError = null;

  for (const baseUrl of apiBaseUrls) {
    const requestUrl = `${baseUrl}${path}`;
    for (let attempt = 1; attempt <= 2; attempt += 1) {
      try {
        const response = await fetch(requestUrl, options);
        const raw = await response.text();
        if (!response.ok) {
          if (response.status === 404) {
            return null;
          }
          lastError = new Error(
            `HTTP ${response.status} for ${path}: ${raw.slice(0, 120)}`
          );
          break;
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
        lastError = error;
        if (attempt === 1) {
          await delay(250);
        }
      }
    }
  }

  if (String(path || "").includes("/api/transaction/")) {
    return null;
  }

  throw lastError || new Error(`Request failed: ${path}`);
}

function normalizeUzbekPhone(digits) {
  if (!digits) return null;
  // Strip leading "38" Poster prefix if present (e.g., 38998XXXXXXXXX → 998XXXXXXXXX)
  if (digits.startsWith("38998") && digits.length >= 14) {
    digits = digits.slice(2);
  }
  // Strip leading "00" international prefix
  if (digits.startsWith("00998")) {
    digits = digits.slice(2);
  }
  // Strip leading "0" (e.g., 0998... → 998...)
  if (digits.startsWith("0998") && digits.length === 13) {
    digits = digits.slice(1);
  }
  // If 9 digits without country code, prepend 998
  if (digits.length === 9 && !digits.startsWith("998")) {
    digits = "998" + digits;
  }
  return digits || null;
}

function getCookiePhone(clientPayload) {
  if (!clientPayload) return null;
  try {
    const parsed = JSON.parse(clientPayload);
    const rawPhone = parsed?.phone_number || parsed?.phone || null;
    if (!rawPhone) return null;
    const digits = String(rawPhone).replace(/[^\d]/g, "");
    return normalizeUzbekPhone(digits);
  } catch {
    return null;
  }
}

function mapBackendStatusToLegacy(status, serviceMode = 0, order = null) {
  const numericStatus = Number(status);
  const normalizedServiceMode = Number(serviceMode || 0);
  const processingStatus = Number(
    order?.processing_status ?? order?.processingStatus ?? NaN
  );
  const history = Array.isArray(order?.history) ? order.history : [];

  if (normalizedServiceMode === 1) {
    const hasCloseEvent = history.some(
      (entry) => String(entry?.type_history || "").toLowerCase() === "close"
    );
    const hasCancelEvent = history.some((entry) => {
      const eventType = String(entry?.type_history || "").toLowerCase();
      const eventValue = String(entry?.value || "").trim();
      return eventType === "changeorderstatus" && eventValue === "4";
    });

    if (hasCancelEvent) return "cancel";
    if (hasCloseEvent) return "finished";

    if (numericStatus === 4) return "cancel";
    if (numericStatus === 2) return "finished";

    if (Number.isFinite(processingStatus)) {
      if (processingStatus === 10 || processingStatus === 0) return "pending";
      if (processingStatus === 20 || processingStatus === 1) return "accept";
      if (
        processingStatus === 30 ||
        processingStatus === 40 ||
        processingStatus === 2 ||
        processingStatus === 3 ||
        processingStatus === 4
      ) {
        return "cooking";
      }
      if (processingStatus >= 50) return "finished";
    }
  }

  const normalized = String(status || "")
    .toLowerCase()
    .replace(/[\s_-]+/g, "");
  switch (normalized) {
    case "awaitingpayment":
    case "pending":
    case "new":
      return "pending";
    case "accepted":
    case "accept":
    case "confirmed":
      return "accept";
    case "preparing":
    case "cooking":
    case "inprogress":
      return "cooking";
    case "ontheway":
    case "indelivery":
    case "courier":
    case "delivery":
      return "delivery";
    case "delivered":
    case "completed":
    case "done":
    case "taken":
    case "closed":
    case "finished":
      return "finished";
    case "cancelled":
    case "canceled":
    case "rejected":
      return "cancel";
    default:
      break;
  }

  if (Number.isFinite(numericStatus) && normalizedServiceMode !== 1) {
    if (numericStatus === 0) return "pending";
    if (numericStatus === 1) return "accept";
    if (numericStatus === 2) return "finished";
    if (numericStatus === 3) return "cooking";
    if (numericStatus === 4) return "cancel";
    if (numericStatus === 7) return "delivery";
  }

  return "";
}

function resolveLegacyPaymentType(order = {}) {
  const paymentMethodId = String(
    order?.paymentMethodId ??
      order?.payment_method_id ??
      order?.PaymentMethodId ??
      ""
  )
    .trim()
    .toLowerCase();
  const paymentTransactionId = String(
    order?.paymentTransactionId ??
      order?.payment_transaction_id ??
      order?.PaymentTransactionId ??
      ""
  ).trim();

  if (paymentMethodId === "1") return "cash";
  if (paymentMethodId === "4") return "payme";
  if (paymentMethodId === "5") return "click";
  if (paymentMethodId === "2" || paymentMethodId === "3") return "cash";

  const paymentMethodNormalized = String(
    order?.paymentMethod ?? order?.payment_method ?? order?.PaymentMethod ?? ""
  )
    .toLowerCase()
    .trim();

  if (
    paymentMethodNormalized === "cash" ||
    paymentMethodNormalized === "nalichnie" ||
    paymentMethodNormalized === "nalichnye"
  ) {
    return "cash";
  }
  if (paymentMethodNormalized === "payme") return "payme";
  if (paymentMethodNormalized === "click") return "click";
  if (paymentMethodNormalized === "card" || paymentMethodNormalized === "creditcard") {
    // Legacy backend orders may contain "card" text even for cash flows.
    // If there is no payment transaction id, treat it as cash.
    return paymentTransactionId ? "card" : "cash";
  }

  return paymentTransactionId ? "card" : "cash";
}

function mapBackendOrderToLegacy(order) {
  if (!order || typeof order !== "object") return null;
  const toNumber = (value) => {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : null;
  };
  const toMinorFromMajor = (value) => {
    const numeric = toNumber(value);
    return numeric == null ? null : Math.round(numeric * 100);
  };
  const toMinorRaw = (value) => {
    const numeric = toNumber(value);
    return numeric == null ? null : Math.round(numeric);
  };
  const pickMinor = (...candidates) => {
    for (const candidate of candidates) {
      if (candidate != null && Number.isFinite(candidate) && candidate > 0) {
        return Math.max(0, candidate);
      }
    }
    return 0;
  };

  const items = Array.isArray(order?.items) ? order.items : [];
  const products = items.map((item) => ({
    product_id: Number(item?.menuItemId) || 0,
    amount: Number(item?.quantity) || 0,
    name: String(item?.name || ""),
    image_url: String(item?.imageUrl || ""),
    unit_price: Number(item?.price || 0),
    total_price: Number(item?.totalPrice || 0),
    is_bonus: Boolean(item?.isBonus),
  }));

  const subtotalMinor = pickMinor(
    toMinorFromMajor(order?.subtotal),
    toMinorRaw(order?.subtotal_price),
    toMinorRaw(order?.subtotalPrice)
  );
  const deliveryMinor = pickMinor(
    toMinorFromMajor(order?.deliveryFee),
    toMinorFromMajor(order?.delivery_price),
    toMinorRaw(order?.delivery_fee)
  );
  const totalMinor = pickMinor(
    toMinorFromMajor(order?.total),
    toMinorRaw(order?.total_price),
    toMinorRaw(order?.payed_sum),
    toMinorRaw(order?.sum)
  );
  const allPriceMinor = pickMinor(
    toMinorRaw(order?.all_price),
    subtotalMinor + deliveryMinor > 0 ? subtotalMinor + deliveryMinor : null,
    totalMinor
  );
  const discountMinor = pickMinor(
    toMinorFromMajor(order?.discount),
    toMinorRaw(order?.discount_price)
  );
  const loyaltySpentMinor = pickMinor(
    toMinorFromMajor(order?.loyaltyPointsSpent),
    toMinorRaw(order?.payed_bonus)
  );
  const serviceMode = Number(order?.serviceMode || 0);
  const lat = Number(order?.deliveryLatitude || 0);
  const lng = Number(order?.deliveryLongitude || 0);
  const paymentType = resolveLegacyPaymentType(order);
  const normalizeOrderToken = (value) => {
    const token = String(value || "").trim();
    if (!token) return "";
    return token.startsWith("#") ? token.slice(1) : token;
  };
  const displayOrderId =
    normalizeOrderToken(order?.posterTransactionId) ||
    normalizeOrderToken(order?.PosterTransactionId) ||
    normalizeOrderToken(order?.posterIncomingOrderId) ||
    normalizeOrderToken(order?.PosterIncomingOrderId) ||
    normalizeOrderToken(order?.incoming_order_id) ||
    normalizeOrderToken(order?.incomingOrderId) ||
    normalizeOrderToken(order?.linkedOrderNumber) ||
    normalizeOrderToken(order?.LinkedOrderNumber) ||
    normalizeOrderToken(order?.orderNumber) ||
    normalizeOrderToken(order?.OrderNumber) ||
    normalizeOrderToken(order?.order_id) ||
    normalizeOrderToken(order?.OrderId) ||
    normalizeOrderToken(order?.id) ||
    normalizeOrderToken(order?.Id) ||
    "";

  return {
    id: order?.id || order?.Id,
    order_id: String(displayOrderId),
    display_order_id: String(displayOrderId),
    posterIncomingOrderId:
      order?.posterIncomingOrderId ||
      order?.PosterIncomingOrderId ||
      order?.incoming_order_id ||
      order?.incomingOrderId ||
      null,
    posterTransactionId:
      order?.posterTransactionId || order?.PosterTransactionId || null,
    orderNumber:
      order?.orderNumber ||
      order?.OrderNumber ||
      order?.linkedOrderNumber ||
      order?.LinkedOrderNumber ||
      null,
    products: JSON.stringify(products),
    all_price: allPriceMinor,
    payed_sum: totalMinor || allPriceMinor,
    payed_bonus: loyaltySpentMinor,
    subtotal_price: subtotalMinor || allPriceMinor,
    discount_price: discountMinor,
    total_price: totalMinor || allPriceMinor,
    payment: paymentType === "cash" ? "cash" : paymentType,
    payment_type: paymentType,
    created_at:
      order?.createdAt ||
      order?.date ||
      order?.date_close_date ||
      order?.date_start_new ||
      order?.date_start ||
      "",
    comment: order?.comment || "",
    status: mapBackendStatusToLegacy(order?.status, serviceMode, order),
    type:
      serviceMode === 3
        ? "delivery"
        : serviceMode === 2
          ? "take_away"
          : "spot",
    spot_id: Number(order?.posterSpotId || order?.branch?.id || 0),
    branch_name: order?.branch?.name || "",
    branch_address: order?.branch?.address || "",
    branch_phone: order?.branch?.phone || "",
    client_address: `${lat || 0},${lng || 0}`,
    address_comment: order?.deliveryAddressComment || "",
    delivery_fee: deliveryMinor / 100,
  };
}

async function fetchOrdersByPhoneVariant(phoneDigits) {
  try {
    const result = await fetchJsonWithFallback(
      `/api/client/orders?phone=${encodeURIComponent(phoneDigits)}&limit=200`
    );
    const orders = Array.isArray(result?.orders) ? result.orders : [];
    return orders.map(mapBackendOrderToLegacy).filter(Boolean);
  } catch {
    return [];
  }
}

async function fetchClientOrdersByPhone(phone) {
  if (!phone) return [];
  try {
    const digits = phone.replace(/[^\d]/g, "");
    const normalized = normalizeUzbekPhone(digits) || digits;

    // Use +998 format — the backend query checks both o.Phone == normalizedDigits
    // AND o.Phone == rawInput, so "+998..." matches orders stored as both
    // "998..." (via normalizedPhone) and "+998..." (via raw phone param).
    const phoneWithPlus = "+" + normalized;
    const orders = await fetchOrdersByPhoneVariant(phoneWithPlus);
    return orders;
  } catch (error) {
    console.error("Failed to fetch client orders", error);
    return [];
  }
}

export async function sendSmsToUser(code, phone) {
  const normalizedPhone = phone ?? code;
  try {
    return await fetchJsonWithFallback("/api/sms/login/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: normalizedPhone }),
    });
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function verifySmsCode(phone, code) {
  try {
    return await fetchJsonWithFallback("/api/sms/login/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, code }),
    });
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getCategories() {
  try {
    const result = await fetchJsonWithFallback("/api/poster/categories");
    return result?.data?.response ?? result?.response;
  } catch (error) {
    console.error(error);
    return null;
  }
}

const normalizeLookupOrderToken = (value) =>
  String(value || "")
    .trim()
    .replace(/^#/, "");

const normalizeLookupOrderStatus = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[\s_-]+/g, "");

const getLookupOrderCreatedAtValue = (order) => {
  const createdAt =
    order?.created_at ||
    order?.createdAt ||
    order?.date ||
    order?.date_close_date ||
    order?.date_start_new ||
    order?.date_start ||
    0;
  const value = new Date(createdAt).getTime();
  return Number.isFinite(value) ? value : 0;
};

const getLookupOrderPriorityScore = (order) => {
  const normalizedStatus = normalizeLookupOrderStatus(
    order?.status || order?.order_status || order?.orderStatus
  );
  if (["cancel", "cancelled", "canceled", "rejected"].includes(normalizedStatus)) {
    return 3;
  }
  if (["finished", "delivered", "completed", "done", "taken", "closed"].includes(normalizedStatus)) {
    return 2;
  }
  if (normalizedStatus) {
    return 1;
  }
  return 0;
};

const selectPreferredLookupOrder = (current, candidate) => {
  if (!current) return candidate;

  const currentScore = getLookupOrderPriorityScore(current);
  const candidateScore = getLookupOrderPriorityScore(candidate);
  if (candidateScore !== currentScore) {
    return candidateScore > currentScore ? candidate : current;
  }

  const currentDate = getLookupOrderCreatedAtValue(current);
  const candidateDate = getLookupOrderCreatedAtValue(candidate);
  if (candidateDate !== currentDate) {
    return candidateDate > currentDate ? candidate : current;
  }

  const currentId = String(current?.id || current?.Id || "");
  const candidateId = String(candidate?.id || candidate?.Id || "");
  return candidateId > currentId ? candidate : current;
};

export async function getOrder(id) {
  const cookieStore = await cookies();
  const phone = getCookiePhone(cookieStore.get("client")?.value);

  if (phone) {
    const backendOrders = await fetchClientOrdersByPhone(phone);
    const normalizedId = normalizeLookupOrderToken(id);
    const matches = backendOrders.filter((order) => {
      const candidateId = normalizeLookupOrderToken(order?.order_id);
      const candidateDisplayId = normalizeLookupOrderToken(order?.display_order_id);
      const candidateRawId = normalizeLookupOrderToken(order?.id);
      const candidatePosterTxId = normalizeLookupOrderToken(order?.posterTransactionId);
      const candidateIncomingId = normalizeLookupOrderToken(order?.posterIncomingOrderId);
      const candidateOrderNumber = normalizeLookupOrderToken(order?.orderNumber);
      return (
        candidateId === normalizedId ||
        candidateDisplayId === normalizedId ||
        candidateRawId === normalizedId ||
        candidatePosterTxId === normalizedId ||
        candidateIncomingId === normalizedId ||
        candidateOrderNumber === normalizedId
      );
    });
    if (matches.length > 0) {
      return matches.reduce(selectPreferredLookupOrder, null);
    }
  }

  try {
    const transaction = await fetchJsonWithFallback(`/api/transaction/${id}`);
    const candidate =
      transaction?.orderDetails && typeof transaction.orderDetails === "object"
        ? transaction.orderDetails
        : transaction;
    return candidate && typeof candidate === "object" ? candidate : null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getOrderRender(id) {
  try {
    const transaction = await fetchJsonWithFallback(`/api/transaction/${id}`);
    if (!transaction || typeof transaction !== "object") return null;

    return {
      ...transaction,
      order_id:
        transaction?.PosterTransactionId ||
        transaction?.posterTransactionId ||
        transaction?.LinkedOrderNumber ||
        transaction?.linkedOrderNumber ||
        transaction?.OrderNumber ||
        transaction?.orderNumber ||
        transaction?.PosterIncomingOrderId ||
        transaction?.posterIncomingOrderId ||
        transaction?.order_id ||
        transaction?.OrderId ||
        null,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getAllOrders() {
  const cookieStore = await cookies();
  const phone = getCookiePhone(cookieStore.get("client")?.value);
  if (!phone) {
    return { orders: [] };
  }

  const orders = await fetchClientOrdersByPhone(phone);
  return { orders };
}

export async function refreshOrderStatuses(orderIds = []) {
  if (!Array.isArray(orderIds) || orderIds.length === 0) return [];
  try {
    const result = await fetchJsonWithFallback("/api/client/orders/statuses/batch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderIds: orderIds.slice(0, 100) }),
    });
    return Array.isArray(result?.statuses) ? result.statuses : [];
  } catch {
    return [];
  }
}

export async function cancelClientOrder(payload = {}) {
  try {
    return await fetchJsonWithFallback("/api/client/orders/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getClientGroup() {
  try {
    const result = await fetchJsonWithFallback("/api/poster/client-groups");
    return result?.data?.response ?? result?.response;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getClient(id) {
  const cookieStore = await cookies();

  try {
    const result = await fetchJsonWithFallback(`/api/poster/clients/${id}`);
    const clientData = result?.data?.response ?? result?.response;
    await cookieStore.set({
      name: "client",
      value: JSON.stringify(clientData),
      options: {
        maxAge: 7 * 24 * 60 * 60,
        httpOnly: true,
        secure: production,
      },
    });
    return clientData;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getClientData(id) {
  try {
    const result = await fetchJsonWithFallback(`/api/poster/clients/${id}`);
    return result?.data?.response ?? result?.response;
  } catch (error) {
    console.log(error, "error");
    return null;
  }
}

export async function getSpotsData() {
  try {
    const result = await fetchJsonWithFallback("/api/poster/spots");
    return result?.data?.response ?? result?.response;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getClients({ params }) {
  const queryString = params ? `?${params.replace(/^&/, "")}` : "";
  try {
    const result = await fetchJsonWithFallback(`/api/poster/clients${queryString}`);
    return result?.data?.response ?? result?.response;
  } catch (error) {
    console.error(error);
    return null;
  }
}
