import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Poppins } from "next/font/google";
import "../../globals.css";
import Header from "@/components/shared/header";
import Footer from "@/components/shared/footer";
import { ApiService } from "@/service/api.services";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";
import Script from "next/script";
import LoaderWrapper from "@/components/shared/loader-wrapper";
import GoogleTagManager from "@/app/googleAnalytics";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title:
    "Rolling Sushi – Доставка суши и роллов в Ташкенте | Бесплатная доставка | Бонусы до 10%",
  description:
    "🚀 Rolling Sushi – это не просто доставка, а вкус, который запоминается! 🍣 Бесплатная доставка по акции, доставка за 40 минут или ролл в подарок, всегда свежие роллы. 🎁 Бонусная система с кешбэком до 10% – копите и оплачивайте любимые блюда! Закажите прямо сейчас – rolling.uz!",
  keywords:
    "суши, роллы, доставка суши, японская кухня, Rolling Sushi, Ташкент, акции суши",
  alternates: {
    canonical: "https://rollingsushi.uz/uz/web",
    ru: "https://rollingsushi.uz/ru/web",
    en: "https://rollingsushi.uz/en/web",
  },
};

export default async function Layout({ children, params }) {
  const [param, categoriesData, productsData, timeData] = await Promise.all([
    params,
    ApiService.getPosterData("menu.getCategories", "", 86400),
    ApiService.getPosterData("menu.getProducts", "", 7200),
    fetch(`${process.env.NEXT_PUBLIC_URL_RENDER}/get_time`),
  ]);

  // Validate the locale
  if (!routing.locales.includes(param.locale)) {
    notFound();
  }

  const timeDataRes = await timeData?.json();

  let spotData = [];
  if (param.place === "branch") {
    spotData = await ApiService.getPosterData("spots.getSpots", "", 604800);
  }

  // Retrieve messages for the specified locale
  const messages = await getMessages(param.locale);
  return (
    <html lang={param.locale} suppressHydrationWarning>
      <head>
        <meta name="yandex-verification" content="2eb6c0631cdd4d80" />
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <link
          rel="shortcut icon"
          href="../../favicon.ico"
          type="image/x-icon"
        />
        <link
          rel="shortcut icon"
          href="/assets/favicon.ico"
          type="image/x-icon"
        />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </head>
      <body
        className={`${poppins.className} antialiased min-h-screen flex flex-col`}
      >
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
          <Header
            categories={categoriesData?.response}
            products={productsData?.response}
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
        {/* Google Analytics Script */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-M3LDW3FG"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
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

        {/* Google Tag Manager Script */}
        {/* <Script id="gtm-init" strategy="afterInteractive">
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
        </Script> */}

        <GoogleTagManager />
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
      </body>
    </html>
  );
}
