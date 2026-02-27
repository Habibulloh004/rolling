const DEFAULT_API_TIME = {
  opened_time: null,
  closed_time: null,
};

export async function getSafeApiTime(baseUrl) {
  if (!baseUrl) {
    return DEFAULT_API_TIME;
  }

  try {
    const response = await fetch(`${baseUrl}/get_time`, {
      cache: "no-store",
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

    return {
      opened_time: data.opened_time ?? null,
      closed_time: data.closed_time ?? null,
    };
  } catch (error) {
    console.error("Failed to fetch /get_time:", error);
    return DEFAULT_API_TIME;
  }
}

