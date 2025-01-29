export default function robots() {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "/*/branch/" },
      { userAgent: "*", disallow: "*/cart/" },
      { userAgent: "*", disallow: "*/login/" },
      { userAgent: "*", disallow: "*/checkout/" },
      { userAgent: "*", disallow: "/cart" },
      { userAgent: "*", disallow: "/login" },
    ],
    sitemap: "https://rolling.uz/sitemap.xml",
  };
}
