import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(req) {
  const { pathname } = req.nextUrl;
  const defaultLocale = "uz"; // Set your default locale here

  // Apply `next-intl/middleware`
  const intlResponse = intlMiddleware(req);
  if (intlResponse) {
    return intlResponse;
  }

  // Redirect root `/` or `/uz`, `/ru`, `/en` to `/${defaultLocale}/web`
  if (
    pathname === "/" ||
    pathname === "/uz" ||
    pathname === "/ru" ||
    pathname === "/en"
  ) {
    return NextResponse.redirect(new URL(`/${defaultLocale}/web`, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/(uz|ru|en)/:path*"], // Match root `/` and all locale-specific paths
};
