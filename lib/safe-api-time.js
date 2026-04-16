import {
  buildNextFetchOptions,
  cacheDurations,
  getFetchCacheMode,
} from "./cache-config";

const DEFAULT_API_TIME = {
  opened_time: null,
  closed_time: null,
};

export async function getSafeApiTime(baseUrl) {
  if (!baseUrl) {
    return DEFAULT_API_TIME;
  }

  try {
    const nextOptions = buildNextFetchOptions(cacheDurations.apiTime);
    const response = await fetch(`${baseUrl}/get_time`, {
      cache: getFetchCacheMode(cacheDurations.apiTime),
      ...(nextOptions ? { next: nextOptions } : {}),
    });

    if (!response.ok) {
      return DEFAULT_API_TIME;
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return DEFAULT_API_TIME;
    }

    const data = await response.json();
    if (!data || typeof data !== "object") {
      return DEFAULT_API_TIME;
    }

    // Backend returns camelCase (openedTime/closedTime)
    // Normalize to snake_case for frontend compatibility
    return {
      opened_time: data.openedTime ?? data.opened_time ?? null,
      closed_time: data.closedTime ?? data.closed_time ?? null,
    };
  } catch (error) {
    console.error("Failed to fetch /get_time:", error);
    return DEFAULT_API_TIME;
  }
}
