import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Poppins } from "next/font/google";
import Header from "@/components/shared/header";
import Footer from "@/components/shared/footer";
import { ApiService } from "@/service/api.services";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";
import Script from "next/script";
import { getSafeApiTime } from "@/lib/safe-api-time";
import PwaRegister from "@/components/shared/pwa-register";
import RealtimeUpdatesBridge from "@/components/shared/realtimeUpdatesBridge";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title:
    "Rolling Sushi – Доставка суши и роллов в Ташкенте | Бесплатная доставка | Бонусы до 10%",
  description:
    "🚀 Rolling Sushi – это не просто доставка, а вкус, который запоминается! 🍣 Платная доставка, но если опоздаем — она бесплатная! Гарантированная доставка за 45 минут, всегда свежие роллы. 🎁 Бонусная система с кешбэком до 10% – копите и оплачивайте любимые блюда! Закажите прямо сейчас – rolling.uz! (https://rolling.uz/)",

  keywords:
    "суши, роллы, доставка суши, японская кухня, Rolling Sushi, Ташкент, акции суши",
  alternates: {
    canonical: "https://rollingsushi.uz/uz/web",
    ru: "https://rollingsushi.uz/ru/web",
    en: "https://rollingsushi.uz/en/web",
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/pwa-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/pwa-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Rolling Sushi",
  },
};

export const viewport = {
  themeColor: "#5b8a69",
};

export async function generateStaticParams() {
  return ["uz", "ru", "en"].flatMap((locale) =>
    ["web", "branch"].map((place) => ({ locale, place }))
  );
}

export default async function Layout({ children, params }) {
  const [param, timeDataRes] = await Promise.all([
    params,
    getSafeApiTime(process.env.NEXT_PUBLIC_URL),
  ]);

  // Validate the locale
  if (!routing.locales.includes(param.locale)) {
    notFound();
  }

  let spotData = [];
  if (param.place === "branch") {
    spotData = await ApiService.getPosterData("spots.getSpots", "");
  }

  // Retrieve messages for the specified locale
  const messages = await getMessages(param.locale);

  return (
    <div className={`${poppins.className} antialiased min-h-screen flex flex-col`}>
        <PwaRegister />
        <Script id="gtm-script" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){
              w[l]=w[l]||[];
              w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
              var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),
                  dl=l!='dataLayer'?'&l='+l:'';
              j.async=true;
              j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
              f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-M3LDW3FG');
          `}
        </Script>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-M3LDW3FG"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <NextTopLoader
          color="hsl(138, 21%, 33%)"
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #5b8a69,0 0 5px #5b8a69"
          template='<div class="bar" role="bar"><div class="peg"></div></div> 
  <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
          zIndex={999999999}
          showAtBottom={false}
        />
        <NextIntlClientProvider locale={param.locale} messages={messages}>
          <RealtimeUpdatesBridge />
          <Header
            param={param}
            locale={param.locale}
            spotData={spotData}
            apiTime={timeDataRes}
          />
          <main className="grow">
            {/* <LoaderWrapper> */}
            {children}
            {/* </LoaderWrapper> */}
          </main>
          <Toaster
            position="bottom-right"
            toastOptions={{
              classNames: {
                error: "bg-red-500 text-white",
                success: "bg-white text-primary",
                warning: "bg-yellow-400 text-white",
                info: "bg-blue-400",
              },
            }}
          />
          <Footer params={param} />
        </NextIntlClientProvider>
        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/99650561"
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>

        {/* <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-PN4ZZXXGHP', {
              page_path: window.location.pathname,
            });
          `}
        </Script> */}

        <Script id="yandex-metrika-init" strategy="afterInteractive">
          {`
    (function(m,e,t,r,i,k,a){
      m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
      m[i].l=1*new Date();
      for (var j = 0; j < document.scripts.length; j++) {
        if (document.scripts[j].src === r) { return; }
      }
      k=e.createElement(t),a=e.getElementsByTagName(t)[0];
      k.async=1;k.src=r;a.parentNode.insertBefore(k,a);
    })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

    ym(99650561, "init", {
      clickmap:true,
      trackLinks:true,
      accurateTrackBounce:true,
      webvisor:true
    });
  `}
        </Script> 

        <Script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              url: `https://rollingsushi.uz/${param.locale}/web/`,
              name: "Rolling Sushi",
              mainEntity: [
                {
                  "@type": "SiteNavigationElement",
                  name: "Категории",
                  url: `https://rollingsushi.uz/${param.locale}/web/category`,
                },
                {
                  "@type": "SiteNavigationElement",
                  name: "Популярные и Новинки",
                  url: `https://rollingsushi.uz/${param.locale}/web/new-popular`,
                },
                {
                  "@type": "SiteNavigationElement",
                  name: "О нас",
                  url: `https://rollingsushi.uz/${param.locale}/web/about-us`,
                },
              ],
            }),
          }}
        />
    </div>
  );
}
