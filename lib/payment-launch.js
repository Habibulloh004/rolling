/**
 * Payment app launch utilities.
 *
 * KEY INSIGHT: Both Chrome (intent://) and Safari (Universal Links) need
 * direct user gesture context to open native apps. After an async API call
 * (await), user activation expires and programmatic redirects won't open apps.
 *
 * SOLUTION:
 * - Mobile: render a real <a> tag with the correct href. User taps it →
 *   app opens 100% reliably. getPaymentLinkHref() builds the right URL.
 * - Desktop: window.open works fine from useEffect, no user gesture needed
 *   for opening new tabs to HTTPS URLs.
 */

const CLICK_PACKAGE = "air.com.ssdsoftwaresolutions.clickuz";
const PAYME_PACKAGE = "uz.dida.payme";
const PAYME_DEEP_LINK_HOST = "checkout.paycom.uz";

const toPaymeDeepLink = (checkoutUrl) => {
  try {
    const parsed = new URL(checkoutUrl);
    if (!parsed.pathname || parsed.pathname === "/") return checkoutUrl;

    return `paycom://${PAYME_DEEP_LINK_HOST}${parsed.pathname}${parsed.search || ""}`;
  } catch {
    return checkoutUrl;
  }
};

const toAndroidIntentUrl = (checkoutUrl, packageName) => {
  try {
    const parsed = new URL(checkoutUrl);
    const pathWithQuery = `${parsed.pathname}${parsed.search || ""}`;
    return [
      `intent://${parsed.host}${pathWithQuery}#Intent`,
      `scheme=${parsed.protocol.replace(":", "")}`,
      `package=${packageName}`,
      `S.browser_fallback_url=${encodeURIComponent(checkoutUrl)}`,
      `end`,
    ].join(";");
  } catch {
    return checkoutUrl;
  }
};

const isMobileDevice = () => {
  if (typeof navigator === "undefined") return false;
  const userAgent = navigator.userAgent || "";
  return /android|iphone|ipad|ipod/i.test(userAgent);
};

const isAndroidDevice = () => {
  if (typeof navigator === "undefined") return false;
  return /android/i.test(navigator.userAgent || "");
};

export const canLaunchPaymentApp = () => isMobileDevice();

/**
 * Returns the URL to use as <a href="..."> for a payment link.
 *
 * Click on Android: intent:// URL — Click's App Links (my.click.uz) may not be
 *   verified, so we use an explicit Intent with the package name.
 *
 * Payme on mobile: use the native app deep link. The backend checkout URL is
 *   HTTPS (`https://checkout.payme.uz/...`), but the installed app opens
 *   reliably via `paycom://checkout.paycom.uz/...`.
 *
 * iOS Click: plain HTTPS URL. iOS Payme: deep link.
 */
export const getPaymentLinkHref = (provider, checkoutUrl) => {
  if (!checkoutUrl) return "";

  if (provider === "payme") {
    const deepLink = toPaymeDeepLink(checkoutUrl);
    if (isAndroidDevice()) {
      return toAndroidIntentUrl(deepLink, PAYME_PACKAGE);
    }
    if (isMobileDevice()) {
      return deepLink;
    }
    return checkoutUrl;
  }

  // Click on Android: needs Intent URL (App Links may not be verified)
  if (isAndroidDevice() && provider === "click") {
    return toAndroidIntentUrl(checkoutUrl, CLICK_PACKAGE);
  }

  // Click on iOS: HTTPS checkout page.
  // Desktop: opens in browser.
  return checkoutUrl;
};

/**
 * Programmatically open a payment URL. Only reliable for:
 * - Desktop (window.open for new tabs)
 * - Spot orders called directly from click handlers (user gesture still active)
 *
 * For mobile web orders (after async API call), use getPaymentLinkHref() + <a> tag instead.
 */
export const openPaymentUrl = (
  provider,
  checkoutUrl,
  { fallbackToCurrentTab = false } = {}
) => {
  if (!checkoutUrl) return;

  const isMobile = isMobileDevice();
  const launchUrl = isMobile ? getPaymentLinkHref(provider, checkoutUrl) : checkoutUrl;

  if (isMobile || fallbackToCurrentTab) {
    window.location.href = launchUrl;
  } else {
    window.open(checkoutUrl, "_blank", "noopener,noreferrer");
  }
};
