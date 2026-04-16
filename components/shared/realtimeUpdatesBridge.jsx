"use client";

import { useEffect, useMemo, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

const CACHE_EVENT_NAME = "rolling:cache-revalidate";
const ORDER_EVENT_NAME = "rolling:order-update";
const HEARTBEAT_INTERVAL_MS = 25000;
const HEARTBEAT_TIMEOUT_MS = 10000;
const RECONNECT_DELAY_MS = 2000;
const RESOURCE_REVALIDATION_COOLDOWN_MS = 10000;

function normalizeResource(value = "") {
  const normalized = String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  switch (normalized) {
    case "category":
    case "categories":
      return "categories";
    case "product":
    case "products":
    case "dish":
      return "products";
    case "promotion":
    case "promotions":
    case "promotionprize":
      return "promotions";
    case "client":
    case "clients":
    case "clientbonus":
    case "clientpayedsum":
      return "clients";
    case "clientgroup":
    case "clientgroups":
    case "clientsgroup":
      return "clientGroups";
    case "spot":
    case "spots":
      return "spots";
    case "employee":
    case "employees":
      return "employees";
    case "banner":
    case "banners":
      return "banners";
    case "branch":
    case "branches":
    case "branchconfig":
    case "branchconfiguration":
    case "branchconfigurations":
      return "branches";
    case "notification":
    case "notifications":
      return "notifications";
    case "transaction":
    case "transactions":
      return "transactions";
    case "order":
    case "orders":
      return "orders";
    default:
      return "";
  }
}

function toWsUrl(baseUrl, wsPath) {
  if (!baseUrl) {
    return null;
  }

  try {
    const parsed = new URL(baseUrl);
    parsed.hash = "";
    parsed.search = "";

    if (parsed.pathname.endsWith("/api")) {
      parsed.pathname = parsed.pathname.replace(/\/api$/, "");
    }

    parsed.pathname = wsPath;
    parsed.protocol = parsed.protocol === "https:" ? "wss:" : "ws:";
    return parsed.toString();
  } catch {
    return null;
  }
}

function collectResourcesFromPosterMessage(data) {
  if (!data || typeof data !== "object") {
    return [];
  }

  if (data.type === "revalidate" && data.resource) {
    const resource = normalizeResource(data.resource);
    return resource ? [resource] : [];
  }

  if (data.type === "cache_invalidated" && Array.isArray(data.invalidatedTypes)) {
    return data.invalidatedTypes.map(normalizeResource).filter(Boolean);
  }

  if (typeof data.object === "string") {
    const resource = normalizeResource(data.object);
    return resource ? [resource] : [];
  }

  return [];
}

function shouldRefreshForResources(resources) {
  const refreshable = new Set([
    "transactions",
    "orders",
  ]);

  return resources.some((resource) => refreshable.has(resource));
}

function shouldNotifyClientResources(resources) {
  const clientNotifiable = new Set([
    "transactions",
    "orders",
  ]);

  return resources.some((resource) => clientNotifiable.has(resource));
}

async function decodeSocketText(data) {
  if (typeof data === "string") {
    return data;
  }

  if (data instanceof Blob) {
    try {
      return await data.text();
    } catch {
      return "";
    }
  }

  return "";
}

function createHeartbeatController(getSocket) {
  let pingTimer = null;
  let pongTimeoutTimer = null;
  let awaitingPong = false;

  const clearPongTimeout = () => {
    if (pongTimeoutTimer) {
      window.clearTimeout(pongTimeoutTimer);
      pongTimeoutTimer = null;
    }
  };

  const markAlive = () => {
    awaitingPong = false;
    clearPongTimeout();
  };

  const stop = () => {
    if (pingTimer) {
      window.clearInterval(pingTimer);
      pingTimer = null;
    }
    markAlive();
  };

  const closeStaleSocket = () => {
    const socket = getSocket();
    if (socket?.readyState === WebSocket.OPEN) {
      socket.close();
    }
  };

  const sendPing = () => {
    const socket = getSocket();
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      return;
    }

    if (awaitingPong) {
      closeStaleSocket();
      return;
    }

    awaitingPong = true;
    clearPongTimeout();
    pongTimeoutTimer = window.setTimeout(closeStaleSocket, HEARTBEAT_TIMEOUT_MS);
    try {
      socket.send("ping");
    } catch {
      closeStaleSocket();
    }
  };

  const start = () => {
    stop();
    sendPing();
    pingTimer = window.setInterval(sendPing, HEARTBEAT_INTERVAL_MS);
  };

  return {
    markAlive,
    start,
    stop,
  };
}

export default function RealtimeUpdatesBridge() {
  const router = useRouter();
  const pathname = usePathname();

  const baseUrl = useMemo(
    () =>
      process.env.NEXT_PUBLIC_ROLLING_BACK_URL ||
      process.env.NEXT_PUBLIC_URL ||
      (typeof window !== "undefined" ? window.location.origin : ""),
    []
  );

  const refreshTimerRef = useRef(null);
  const revalidateTimerRef = useRef(null);
  const pendingResourcesRef = useRef(new Set());
  const lastProcessedResourcesRef = useRef(new Map());

  useEffect(() => {
    let disposed = false;
    let reconnectTimer = null;
    let socket = null;

    const wsUrl = toWsUrl(baseUrl, "/ws/poster-updates");
    if (!wsUrl) {
      return undefined;
    }

    const heartbeat = createHeartbeatController(() => socket);

    const flushRevalidation = () => {
      const resources = Array.from(pendingResourcesRef.current);
      pendingResourcesRef.current.clear();
      if (!resources.length) {
        return;
      }

      if (shouldNotifyClientResources(resources)) {
        window.dispatchEvent(
          new CustomEvent(CACHE_EVENT_NAME, {
            detail: { resources, timestamp: Date.now() },
          })
        );
      }

      if (shouldRefreshForResources(resources)) {
        if (refreshTimerRef.current) {
          window.clearTimeout(refreshTimerRef.current);
        }
        refreshTimerRef.current = window.setTimeout(() => {
          router.refresh();
        }, 150);
      }
    };

    const queueRefresh = (resources) => {
      const now = Date.now();
      const nextResources = resources.filter((resource) => {
        const lastProcessedAt =
          lastProcessedResourcesRef.current.get(resource) || 0;

        if (now - lastProcessedAt < RESOURCE_REVALIDATION_COOLDOWN_MS) {
          return false;
        }

        lastProcessedResourcesRef.current.set(resource, now);
        return true;
      });

      if (!nextResources.length) {
        return;
      }

      nextResources.forEach((resource) =>
        pendingResourcesRef.current.add(resource)
      );

      if (revalidateTimerRef.current) {
        window.clearTimeout(revalidateTimerRef.current);
      }
      revalidateTimerRef.current = window.setTimeout(flushRevalidation, 350);
    };

    const connect = () => {
      if (disposed) {
        return;
      }

      socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        heartbeat.start();
      };

      socket.onmessage = async (event) => {
        const text = await decodeSocketText(event.data);

        if (!text) {
          return;
        }

        const normalizedText = text.trim().toLowerCase();

        heartbeat.markAlive();

        if (normalizedText === "pong") {
          return;
        }

        try {
          const data = JSON.parse(text);
          const resources = collectResourcesFromPosterMessage(data);
          if (resources.length > 0) {
            queueRefresh(resources);
          }
        } catch {}
      };

      socket.onclose = () => {
        heartbeat.stop();
        if (disposed) {
          return;
        }
        reconnectTimer = window.setTimeout(connect, RECONNECT_DELAY_MS);
      };

      socket.onerror = () => {
        socket?.close();
      };
    };

    connect();

    return () => {
      disposed = true;
      if (reconnectTimer) {
        window.clearTimeout(reconnectTimer);
      }
      heartbeat.stop();
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [baseUrl, router]);

  useEffect(() => {
    let disposed = false;
    let reconnectTimer = null;
    let socket = null;

    const wsUrl = toWsUrl(baseUrl, "/ws/orders");
    if (!wsUrl) {
      return undefined;
    }

    const heartbeat = createHeartbeatController(() => socket);

    const connect = () => {
      if (disposed) {
        return;
      }

      socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        heartbeat.start();
      };

      socket.onmessage = async (event) => {
        const text = await decodeSocketText(event.data);

        if (!text) {
          return;
        }

        const normalizedText = text.trim().toLowerCase();

        heartbeat.markAlive();

        if (normalizedText === "pong") {
          return;
        }

        try {
          const data = JSON.parse(text);
          if (data?.type !== "orderUpdate" || !data?.payload?.order) {
            return;
          }

          window.dispatchEvent(
            new CustomEvent(ORDER_EVENT_NAME, {
              detail: {
                order: data.payload.order,
                timestamp: Date.now(),
              },
            })
          );

          if (
            pathname?.includes("/order/") ||
            pathname?.includes("/orderpay/") ||
            pathname?.includes("/confirmed/")
          ) {
            if (refreshTimerRef.current) {
              window.clearTimeout(refreshTimerRef.current);
            }
            refreshTimerRef.current = window.setTimeout(() => {
              router.refresh();
            }, 200);
          }
        } catch {}
      };

      socket.onclose = () => {
        heartbeat.stop();
        if (disposed) {
          return;
        }
        reconnectTimer = window.setTimeout(connect, RECONNECT_DELAY_MS);
      };

      socket.onerror = () => {
        socket?.close();
      };
    };

    connect();

    return () => {
      disposed = true;
      if (reconnectTimer) {
        window.clearTimeout(reconnectTimer);
      }
      heartbeat.stop();
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [baseUrl, pathname, router]);

  useEffect(
    () => () => {
      if (refreshTimerRef.current) {
        window.clearTimeout(refreshTimerRef.current);
      }
      if (revalidateTimerRef.current) {
        window.clearTimeout(revalidateTimerRef.current);
      }
    },
    []
  );

  return null;
}
