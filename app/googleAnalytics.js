// components/GoogleAnalytics.js
"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const previousPath = useRef("");

  useEffect(() => {
    if (previousPath.current && window.gtag) {
      window.gtag("config", "G-PN4ZZXXGHP", {
        page_path: pathname,
      });
    }
    previousPath.current = pathname;
  }, [pathname]);

  return null;
}
