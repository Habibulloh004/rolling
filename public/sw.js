const VERSION = "v11";
const STATIC_CACHE = `rolling-static-${VERSION}`;
const ASSET_CACHE = `rolling-assets-${VERSION}`;

// Minimal shell for offline fallback
const APP_SHELL = [
  "/offline.html",
  "/favicon.ico",
  "/apple-touch-icon.png",
  "/pwa-192x192.png",
  "/pwa-512x512.png",
  "/manifest.webmanifest",
];

const DEV_HOSTS = new Set(["localhost", "127.0.0.1"]);

const PUBLIC_ASSET_PATHS = [
  "/assets/",
  "/icons/",
  "/logoLottie.json",
  "/empty.jpg",
];

// ─── Helpers ────────────────────────────────────────────────

function isDevHost(hostname) {
  return DEV_HOSTS.has(hostname);
}

function isSameOrigin(url) {
  return url.origin === self.location.origin;
}

// Hashed Next.js bundles — immutable, safe to cache forever
function isFrameworkAsset(url) {
  return (
    isSameOrigin(url) &&
    !isDevHost(url.hostname) &&
    url.pathname.startsWith("/_next/static/")
  );
}

// Public static files (icons, lottie, fonts, etc.)
function isPublicAsset(url) {
  if (!isSameOrigin(url) || isDevHost(url.hostname)) return false;
  return PUBLIC_ASSET_PATHS.some((p) => url.pathname.startsWith(p));
}

// Static font/css files outside /_next/static/
function isStaticFile(url) {
  if (!isSameOrigin(url) || isDevHost(url.hostname)) return false;
  return /\.(?:woff2?|ttf|otf|eot)$/i.test(url.pathname);
}

// ─── Strategies ─────────────────────────────────────────────

// Cache-first: for immutable hashed assets
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok) {
    cache.put(request, response.clone());
  }
  return response;
}

// Network-first: for navigation — always try fresh, fall back to offline page
async function networkFirstNavigation(request) {
  try {
    return await fetch(request);
  } catch {
    const fallback = await caches.match("/offline.html");
    return (
      fallback ||
      new Response("Offline", {
        status: 503,
        headers: { "Content-Type": "text/plain" },
      })
    );
  }
}

// ─── Lifecycle ──────────────────────────────────────────────

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  const knownCaches = new Set([STATIC_CACHE, ASSET_CACHE]);
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => (knownCaches.has(key) ? null : caches.delete(key)))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ─── Fetch ──────────────────────────────────────────────────

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (!url.protocol.startsWith("http")) return;

  // ── Never intercept ──
  // API / data / RSC / image optimization — always go to network
  if (
    isSameOrigin(url) &&
    (url.pathname.startsWith("/api/") ||
      url.pathname.startsWith("/_next/image") ||
      url.pathname.startsWith("/_next/data/") ||
      url.searchParams.has("_rsc"))
  ) {
    return;
  }

  // ── Navigation (HTML pages) ──
  // Network-first: always fetch fresh HTML from server.
  // Only use cache as offline fallback — never serve stale pages.
  if (request.mode === "navigate") {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  // ── Immutable framework assets (/_next/static/**) ──
  // Hashed filenames — cache forever
  if (isFrameworkAsset(url)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // ── Public static assets (icons, fonts, lottie) ──
  if (isPublicAsset(url) || isStaticFile(url)) {
    event.respondWith(cacheFirst(request, ASSET_CACHE));
    return;
  }

  // Everything else — let the browser handle normally (no caching)
});
