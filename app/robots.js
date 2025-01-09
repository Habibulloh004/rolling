export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      allow: "/*",
      disallow: "*/cart/",
      disallow: "*/checkout/",
    },
    sitemap: "https://rolling.uz/sitemap.xml",
  };
}
