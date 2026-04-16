import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://joinposter.com" />
        <link rel="dns-prefetch" href="https://joinposter.com" />
        <link rel="preconnect" href="https://rolling.app" />
        <link rel="dns-prefetch" href="https://rolling.app" />
        <link rel="preconnect" href="https://mc.yandex.ru" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
