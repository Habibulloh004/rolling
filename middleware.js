import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(req) {
  const { pathname } = req.nextUrl;

  const defaultLocale = "uz"; // Default locale
  const defaultPlace = "web"; // Default place

  const cookies = req.cookies;
  const paymentData = cookies.get("paymentData");

  // Parse paymentData cookie
  if (paymentData?.value) {
    try {
      const parsedPaymentData = JSON.parse(paymentData?.value);
      const locale = pathname.split("/")[1] || defaultLocale;

      // Check if the current pathname matches the desired cart URL
      let isRederectBool = false;

      let cartPath = `/${locale}/${parsedPaymentData?.place}/cart`;
      let cartPathAdd = `/${locale}/${parsedPaymentData?.place}/profile/address/add`;
      if (pathname == cartPath || pathname == cartPathAdd) {
        isRederectBool = false;
      } else {
        isRederectBool = true;
      }
      let cartPathCheck = `/${locale}/${parsedPaymentData?.place}/cart`;
      if (parsedPaymentData?.place == "branch") {
        cartPath = `/${locale}/${parsedPaymentData?.place}/cart?spot=${parsedPaymentData?.spot}&table_id=${parsedPaymentData?.table_id}&table_num=${parsedPaymentData?.table_num}&service=${parsedPaymentData?.service}`;
      }
      if (parsedPaymentData?.payment_id && isRederectBool) {
        return NextResponse.redirect(new URL(cartPath, req.url));
      }
    } catch (error) {
      console.error("Payment data parsing error:", error);
    }
  }

  // Handle locale-only paths (e.g., `/uz`, `/ru`, `/en`)
  const matchLocaleOnly = /^\/(uz|ru|en)$/;
  if (matchLocaleOnly.test(pathname)) {
    const locale = pathname.slice(1) || defaultLocale;
    return NextResponse.redirect(
      new URL(`/${locale}/${defaultPlace}`, req.url)
    );
  }

  // Pass request through intlMiddleware
  const intlResponse = intlMiddleware(req);
  if (intlResponse) {
    return intlResponse;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/(uz|ru|en)/:path*",
    "/(uz|ru|en)/register",
    "/(uz|ru|en)/login",
  ],
};
