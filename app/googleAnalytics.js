// components/GoogleTagManager.tsx
"use client"; // This ensures the script runs on the client side

import { useEffect } from "react";

export default function GoogleTagManager() {
  useEffect(() => {
    // Google Tag Manager script (same as your provided script)
    (function (w, d, s, l, i) {
      w[l] = w[l] || [];
      w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
      var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s),
        dl = l != "dataLayer" ? "&l=" + l : "";
      j.async = true;
      j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
      f.parentNode.insertBefore(j, f);
    })(window, document, "script", "dataLayer", "GTM-M3LDW3FG");

    // NoScript fallback (handled in HTML directly, see Step 2)
  }, []);

  return null; // This component doesn't render anything visible
}
