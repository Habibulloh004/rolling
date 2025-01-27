export default function robots() {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "/*/branch/" },
      { userAgent: "*", disallow: "*/cart/" },
      { userAgent: "*", disallow: "*/checkout/" },
    ],
    sitemap: "https://rolling.uz/sitemap.xml",
  };
}
