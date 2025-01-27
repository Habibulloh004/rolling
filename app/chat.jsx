"use client";
import { tawkToApiKey, tawkToUrl } from "@/lib/utils";
import { useEffect } from "react";

const Chat = () => {
  useEffect(() => {
    const Tawk_API = tawkToApiKey || {};
    const Tawk_LoadStart = new Date();

    const s1 = document.createElement("script");
    s1.async = true;
    s1.src = tawkToUrl;
    s1.charset = "UTF-8";
    s1.setAttribute("crossorigin", "*");
    const s0 = document.getElementsByTagName("script")[0];
    s0.parentNode.insertBefore(s1, s0);

    return () => {
      // Cleanup script if necessary
      const embeddedScript = document.querySelector(`script[src=${tawkToUrl}]`);
      if (embeddedScript) {
        embeddedScript.remove();
      }
    };
  }, []);

  return null;
};

export default Chat;
