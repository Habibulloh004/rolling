import { NextResponse } from "next/server";
import { url as defaultBackendUrl } from "@/lib/utils";

const normalizeBaseUrl = (value) => String(value || "").replace(/\/+$/, "");

const backendBaseUrls = [
  normalizeBaseUrl(process.env.NEXT_PUBLIC_ROLLING_BACK_URL),
  normalizeBaseUrl(process.env.NEXT_PUBLIC_URL),
  normalizeBaseUrl(defaultBackendUrl),
].filter(Boolean);

export const dynamic = "force-dynamic";

async function proxyPoster(request, pathSegments) {
  const normalizedPath = Array.isArray(pathSegments)
    ? pathSegments.filter(Boolean).join("/")
    : "";
  const query = request.nextUrl.search || "";
  const currentOrigin = request.nextUrl.origin.replace(/\/+$/, "");

  for (const baseUrl of backendBaseUrls) {
    if (baseUrl === currentOrigin) {
      continue;
    }
    const targetUrl = `${baseUrl}/api/poster/${normalizedPath}${query}`;
    try {
      const response = await fetch(targetUrl, {
        method: request.method,
        headers: {
          "Content-Type": request.headers.get("content-type") || "application/json",
        },
        body:
          request.method === "GET" || request.method === "HEAD"
            ? undefined
            : await request.text(),
        cache: "no-store",
      });
      if (!response.ok) {
        continue;
      }

      const raw = await response.text();
      return new NextResponse(raw, {
        status: response.status,
        headers: {
          "Content-Type":
            response.headers.get("content-type") || "application/json; charset=utf-8",
          "Cache-Control": "no-store, max-age=0",
        },
      });
    } catch {
      continue;
    }
  }

  return NextResponse.json(
    { error: "Poster proxy unavailable" },
    { status: 502, headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}

export async function GET(request, context) {
  const params = await context.params;
  return proxyPoster(request, params?.path);
}

export async function POST(request, context) {
  const params = await context.params;
  return proxyPoster(request, params?.path);
}
