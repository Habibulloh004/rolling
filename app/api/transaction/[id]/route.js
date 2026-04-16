import { NextResponse } from "next/server";
import { url as defaultBackendUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

const normalizeBaseUrl = (value) => String(value || "").replace(/\/+$/, "");

const backendBaseUrls = [
  normalizeBaseUrl(process.env.NEXT_PUBLIC_ROLLING_BACK_URL),
  normalizeBaseUrl(process.env.NEXT_PUBLIC_URL),
  normalizeBaseUrl(defaultBackendUrl),
].filter(Boolean);

async function fetchTransactionById(id) {
  const normalizedId = String(id || "").trim();
  if (!normalizedId) {
    return { status: 400, payload: { error: "Transaction id is required" } };
  }

  for (const baseUrl of backendBaseUrls) {
    const requestUrl = `${baseUrl}/api/transaction/${encodeURIComponent(
      normalizedId
    )}`;

    try {
      const response = await fetch(requestUrl, { cache: "no-store" });
      if (response.status === 404) {
        continue;
      }

      const text = await response.text();
      if (!response.ok) {
        continue;
      }

      try {
        return { status: 200, payload: JSON.parse(text) };
      } catch {
        continue;
      }
    } catch {}
  }

  return { status: 404, payload: { error: "Transaction not found" } };
}

export async function GET(_request, { params }) {
  const resolvedParams = await params;
  const { status, payload } = await fetchTransactionById(resolvedParams?.id);
  return NextResponse.json(payload, {
    status,
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
