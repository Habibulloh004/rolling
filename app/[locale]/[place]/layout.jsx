import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Poppins } from "next/font/google";
import "../../globals.css";
import Header from "@/components/shared/header";
import Footer from "@/components/shared/footer";
import Script from "next/script";
import GoogleAnalytics from "@/app/googleAnalytics";
import { ApiService } from "@/service/api.services";
import NextTopLoader from "nextjs-toploader";
import Cookies from "js-cookie";
import { Toaster } from "sonner";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Rolling Sushi - Свежие суши и роллы в Ташкенте",
  description:
    "Rolling Sushi предлагает свежие суши, роллы и японскую кухню с доставкой и в ресторане. Узнайте о наших акциях и популярном меню!",
  keywords:
    "суши, роллы, доставка суши, японская кухня, Rolling Sushi, Ташкент, акции суши",
  alternates: {
    canonical: "https://rollingsushi.uz/",
  },
};
export default async function Layout({ children, params }) {
  const client = Cookies.get("client") || null;
  const [param, t] = await Promise.all([params, getTranslations("HomePage")]);

  // Validate the locale
  if (!routing.locales.includes(param.locale)) {
    notFound();
  }

  let spotData = [];
  if (param.place === "branch") {
    spotData = await ApiService.getPosterData("spots.getSpots");
  }

  // Retrieve messages for the specified locale
  const messages = await getMessages(param.locale);

  return (
    <html lang={param.locale}>
      <head>
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1.0, user-scalable=no"
        />
      </head>
      <body
        className={`${poppins.className} antialiased min-h-screen flex flex-col`}
      >
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-M3LDW3FG"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>

        {/* Google Analytics Script */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-PN4ZZXXGHP"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-PN4ZZXXGHP', {
              page_path: window.location.pathname,
            });
          `}
        </Script>

        {/* Google Tag Manager Script */}
        <Script id="gtm-init" strategy="afterInteractive">
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

        {/* Google Analytics Route Tracking */}
        <GoogleAnalytics />
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
          <Header param={param} locale={param.locale} spotData={spotData} />
          <main className="grow">{children}</main>
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
      </body>
    </html>
  );
}
