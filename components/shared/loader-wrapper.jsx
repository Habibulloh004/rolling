"use client";
import { useState, useEffect } from "react";
import Loading from "./loader";

export default function LoaderWrapper({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Показываем экран загрузки в течение 3 секунд
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer); // Очистка таймера при размонтировании
  }, []);

  return isLoading ? <Loading /> : children;
}
