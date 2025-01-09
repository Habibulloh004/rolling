export default function sitemap() {
  const baseUrl = "https://rolling.uz";
  const languages = ["ru", "en", "uz"];
  const staticPaths = ["web/about-us", "web/news", "web/saved", "web/reviews", "web/create-review", "web/create-vacansy"];

  return staticPaths.map((path) => {
    const alternates = {};
    languages.forEach((lang) => {
      alternates[lang] = `${baseUrl}/${lang}/${path}`;
    });

    return {
      url: `${baseUrl}/uz/${path}`, // Default language (e.g., Uzbek)
      lastModified: new Date(),
      alternates: {
        languages: alternates,
      },
    };
  });
}
