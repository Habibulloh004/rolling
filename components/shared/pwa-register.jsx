"use client";

import { useEffect } from "react";
import { invalidateCategoryBrowserCaches } from "@/lib/client-category-cache";
import { invalidateClientRequestCaches } from "@/lib/client-request-cache";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1"]);
const CLIENT_SIDE_CACHE_ENABLED =
  String(process.env.NEXT_PUBLIC_ENABLE_CLIENT_SESSION_CACHE ?? "false").toLowerCase() !==
  "false";

async function clearClientDataCaches() {
  invalidateCategoryBrowserCaches();
  invalidateClientRequestCaches([
    "poster:header-search",
    "poster:popular-products",
  ]);

  if (typeof window === "undefined" || !("caches" in window)) {
    return;
  }

  try {
    const keys = await window.caches.keys();
    await Promise.all(
      keys.map((key) => {
        if (
          key.startsWith("rolling-api-") ||
          key.startsWith("rolling-images-") ||
          key.startsWith("rolling-fonts-")
        ) {
          return window.caches.delete(key);
        }
        return Promise.resolve();
      })
    );
  } catch {}
}

function checkCacheVersion() {
  if (typeof document === "undefined") return;
  try {
    const match = document.cookie.match(/(?:^|;\s*)cache_version=(\d+)/);
    if (!match) return;
    const serverVersion = match[1];
    const clientVersion = sessionStorage.getItem("__cache_version");
    if (clientVersion !== serverVersion) {
      sessionStorage.setItem("__cache_version", serverVersion);
      clearClientDataCaches();
    }
  } catch {}
}

export default function PwaRegister() {
  useEffect(() => {
    checkCacheVersion();

    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister().catch(() => {});
        });
      });
      clearClientDataCaches().catch(() => {});
      return;
    }

    const isLocalhost = LOCAL_HOSTS.has(window.location.hostname);
    if (!window.isSecureContext && !isLocalhost) {
      return;
    }

    let cancelled = false;

    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });

        if (!cancelled) {
          if (!CLIENT_SIDE_CACHE_ENABLED) {
            clearClientDataCaches().catch(() => {});
          }

          registration.update().catch(() => {});
        }
      } catch (error) {
        console.error("Service worker registration failed", error);
      }
    };

    if (document.readyState === "complete") {
      registerServiceWorker();
      return () => {
        cancelled = true;
      };
    }

    window.addEventListener("load", registerServiceWorker, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", registerServiceWorker);
    };
  }, []);

  return null;
}
