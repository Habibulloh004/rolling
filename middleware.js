import { NextResponse } from "next/server";

export default function middleware(req) {
  const { pathname } = req.nextUrl;
  const defaultLocale = "uz"; // Set your default locale here

  // Redirect root `/` to `/${defaultLocale}/web`
  if (pathname === "/" || pathname == "/ru" || pathname == "/en" || pathname == "/uz") {
    return NextResponse.redirect(new URL(`/${defaultLocale}/web`, req.url));
  }

  // Match locale-specific paths
  // const localeMatch = pathname.match(/^\/(uz|ru|en)(\/.*)?/);

  // if (localeMatch) {
  //   const locale = localeMatch[1]; // Extract locale (e.g., uz, ru, en)
  //   const subpath = localeMatch[2] || ""; // Extract subpath after locale

  //   // Allow access to /branch and /web
  //   if (subpath === "/branch" || subpath === "/web") {
  //     return NextResponse.next();
  //   }
    
  //   // Redirect any other paths under /<locale>/* to /<locale>/web
  //   return NextResponse.redirect(new URL(`/${locale}/web`, req.url));
  // }
  return NextResponse.next();

  // Fallback: Redirect to default locale's /web
  // return NextResponse.redirect(new URL(`/${defaultLocale}/web`, req.url));
}

export const config = {
  matcher: ["/", "/(uz|ru|en)/:path*"], // Match root `/` and all locale-specific paths
};
