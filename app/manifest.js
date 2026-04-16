export default function manifest() {
  return {
    name: "Rolling Sushi",
    short_name: "Rolling",
    description:
      "Rolling Sushi delivery web app with cached banners, menu assets, and installable PWA support.",
    start_url: "/uz/web",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#5b8a69",
    icons: [
      {
        src: "/pwa-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/pwa-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
  };
}
