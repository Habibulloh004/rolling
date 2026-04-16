import { clientCachePolicy } from "./cache-config";

const REQUEST_CACHE_STORAGE_PREFIX = "client-request-cache:";
const memoryRequestCache = new Map();
const pendingRequestMap = new Map();

function isClientCacheEnabled() {
  return clientCachePolicy.enabled;
}

function toStorageKey(cacheKey) {
  return `${REQUEST_CACHE_STORAGE_PREFIX}${cacheKey}`;
}

function normalizeEnvelope(parsedValue) {
  if (
    parsedValue &&
    typeof parsedValue === "object" &&
    Object.prototype.hasOwnProperty.call(parsedValue, "payload")
  ) {
    return {
      payload: parsedValue.payload,
      updatedAt: Number(parsedValue.updatedAt) || Date.now(),
    };
  }

  return {
    payload: parsedValue,
    updatedAt: Date.now(),
  };
}

function readSessionEnvelope(cacheKey) {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.sessionStorage.getItem(toStorageKey(cacheKey));
  if (!rawValue) {
    return null;
  }

  try {
    return normalizeEnvelope(JSON.parse(rawValue));
  } catch {
    window.sessionStorage.removeItem(toStorageKey(cacheKey));
    return null;
  }
}

function writeSessionEnvelope(cacheKey, envelope) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.sessionStorage.setItem(
      toStorageKey(cacheKey),
      JSON.stringify(envelope)
    );
  } catch {}
}

function readEnvelope(cacheKey) {
  if (!isClientCacheEnabled()) {
    return null;
  }

  const fromMemory = memoryRequestCache.get(cacheKey);
  if (fromMemory) {
    return fromMemory;
  }

  const fromSession = readSessionEnvelope(cacheKey);
  if (fromSession) {
    memoryRequestCache.set(cacheKey, fromSession);
    return fromSession;
  }

  return null;
}

function writeEnvelope(cacheKey, payload) {
  if (!isClientCacheEnabled()) {
    return payload;
  }

  const envelope = {
    payload,
    updatedAt: Date.now(),
  };

  memoryRequestCache.set(cacheKey, envelope);
  writeSessionEnvelope(cacheKey, envelope);

  return payload;
}

function isSamePayload(left, right) {
  try {
    return JSON.stringify(left) === JSON.stringify(right);
  } catch {
    return false;
  }
}

async function fetchJson(url, requestInit) {
  const fetchOptions = { ...(requestInit || {}) };

  if (typeof fetchOptions.cache === "undefined") {
    fetchOptions.cache = "no-store";
  }

  const response = await fetch(url, fetchOptions);
  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }

  return response.json();
}

async function executeNetworkRequest({
  cacheKey,
  url,
  requestInit,
  previousPayload,
  onRevalidate,
  validatePayload,
}) {
  const pendingRequest = pendingRequestMap.get(cacheKey);
  if (pendingRequest) {
    return pendingRequest.then((nextPayload) => {
      if (
        typeof onRevalidate === "function" &&
        !isSamePayload(previousPayload, nextPayload)
      ) {
        onRevalidate(nextPayload);
      }

      return nextPayload;
    });
  }

  const requestPromise = fetchJson(url, requestInit)
    .then((nextPayload) => {
      if (
        typeof validatePayload === "function" &&
        !validatePayload(nextPayload)
      ) {
        throw new Error("Invalid payload shape");
      }

      writeEnvelope(cacheKey, nextPayload);

      if (
        typeof onRevalidate === "function" &&
        !isSamePayload(previousPayload, nextPayload)
      ) {
        onRevalidate(nextPayload);
      }

      return nextPayload;
    })
    .finally(() => {
      pendingRequestMap.delete(cacheKey);
    });

  pendingRequestMap.set(cacheKey, requestPromise);
  return requestPromise;
}

function shouldClearCacheKey(cacheKey, prefixes) {
  if (!Array.isArray(prefixes) || prefixes.length === 0) {
    return true;
  }

  return prefixes.some(
    (prefix) => cacheKey === prefix || cacheKey.startsWith(`${prefix}:`)
  );
}

export async function loadCachedJson({
  cacheKey,
  url,
  requestInit,
  onRevalidate,
  validatePayload,
  forceNetwork = false,
}) {
  if (!cacheKey || !url) {
    throw new Error("cacheKey and url are required");
  }

  const cachedEnvelope = readEnvelope(cacheKey);
  const cachedPayload = cachedEnvelope?.payload;

  if (!forceNetwork && typeof cachedPayload !== "undefined") {
    if (isClientCacheEnabled() && clientCachePolicy.backgroundRevalidate) {
      executeNetworkRequest({
        cacheKey,
        url,
        requestInit,
        previousPayload: cachedPayload,
        onRevalidate,
        validatePayload,
      }).catch(() => {});
    }

    return cachedPayload;
  }

  try {
    return await executeNetworkRequest({
      cacheKey,
      url,
      requestInit,
      previousPayload: cachedPayload,
      onRevalidate,
      validatePayload,
    });
  } catch (error) {
    if (typeof cachedPayload !== "undefined") {
      return cachedPayload;
    }
    throw error;
  }
}

export function primeCachedJson(cacheKey, payload) {
  if (!cacheKey || typeof payload === "undefined") {
    return;
  }

  writeEnvelope(cacheKey, payload);
}

export function invalidateClientRequestCaches(prefixes = []) {
  const memoryKeys = Array.from(memoryRequestCache.keys());
  memoryKeys.forEach((cacheKey) => {
    if (shouldClearCacheKey(cacheKey, prefixes)) {
      memoryRequestCache.delete(cacheKey);
      pendingRequestMap.delete(cacheKey);
    }
  });

  if (typeof window === "undefined") {
    return;
  }

  try {
    const keysToRemove = [];
    for (let index = 0; index < window.sessionStorage.length; index += 1) {
      const storageKey = window.sessionStorage.key(index);
      if (!storageKey || !storageKey.startsWith(REQUEST_CACHE_STORAGE_PREFIX)) {
        continue;
      }

      const cacheKey = storageKey.slice(REQUEST_CACHE_STORAGE_PREFIX.length);
      if (shouldClearCacheKey(cacheKey, prefixes)) {
        keysToRemove.push(storageKey);
      }
    }

    keysToRemove.forEach((storageKey) =>
      window.sessionStorage.removeItem(storageKey)
    );
  } catch {}
}
