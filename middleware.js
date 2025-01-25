import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(req) {
  const { pathname } = req.nextUrl;
  const defaultLocale = "uz"; // Default locale
  const defaultPlace = "web"; // Default place

  // Match root or locale-only paths and redirect to default `/web`
  const matchLocaleOnly = /^\/(uz|ru|en)$/;
  if (matchLocaleOnly.test(pathname)) {
    const locale = pathname.slice(1) || defaultLocale;
    return NextResponse.redirect(
      new URL(`/${locale}/${defaultPlace}`, req.url)
    );
  }

  // Apply `intlMiddleware` for other requests
  const intlResponse = intlMiddleware(req);
  if (intlResponse) {
    return intlResponse;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/(uz|ru|en)/:path*", "!/_next/static/*", "!/_next/data/*"],
};

// export const config = {
//   matcher: ["/", "/(uz|ru|en)/:path*","/(uz|ru|en)/register","/(uz|ru|en)/login"], // Match root `/`, locales, and paths
// };

// import createMiddleware from "next-intl/middleware";
// import { routing } from "./i18n/routing";
// import { NextResponse } from "next/server";

// const intlMiddleware = createMiddleware(routing);

// export default function middleware(req) {
//   const { pathname } = req.nextUrl;
//   const defaultLocale = "uz"; // Set your default locale here

//   // Apply `next-intl/middleware`
//   const intlResponse = intlMiddleware(req);
//   if (intlResponse) {
//     const url = new URL(req.url);
//     const localeMatch = pathname.match(/^\/(uz|ru|en)(\/|$)/);

//     if (localeMatch) {
//       // Extract the locale and append `/web`
//       const locale = localeMatch[1];
//       url.pathname = `/${locale}/web`;
//       return NextResponse.redirect(url);
//     }
//     return intlResponse;
//   }

//   // Redirect root `/` or `/uz`, `/ru`, `/en` to `/${defaultLocale}/web`
//   if (
//     pathname === "/" ||
//     pathname === "/uz" ||
//     pathname === "/ru" ||
//     pathname === "/en"
//   ) {
//     return NextResponse.redirect(new URL(`/${defaultLocale}/web`, req.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/", "/(uz|ru|en)/:path*"], // Match root `/` and all locale-specific paths
// };
