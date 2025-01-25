import sitemap, { generateSitemaps } from "@/app/sitemap";

function generateSitemapXml(urls) {
  const urlset = urls
    .map((urlObj) => {
      return `
        <url>
          <loc>${urlObj.url}</loc>
          <lastmod>${urlObj.lastModified}</lastmod>
          <changefreq>daily</changefreq>
          <priority>0.8</priority>
        </url>
      `;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urlset}
  </urlset>`;
}

export async function GET() {
  try {
    const sitemapData = await generateSitemaps();

    if (!Array.isArray(sitemapData) || sitemapData.length === 0) {
      console.error("No data available for sitemap generation.");
      return new Response("Error: No data available for sitemap generation", {
        status: 500,
      });
    }

    const urls = await Promise.all(
      sitemapData.map(async ({ type, id }) => {
        if (!type) {
          console.warn("Missing 'type' in one of the sitemapData elements.");
          return [];
        }
        const result = await sitemap({ type, id });
        return result;
      })
    );

    const flatUrls = urls.flat().filter((urlObj) => urlObj && urlObj.url);

    if (!flatUrls.length) {
      console.error("No valid URLs available for sitemap generation.");
      return new Response("Error: No valid URLs available for sitemap", {
        status: 500,
      });
    }

    const sitemapXml = generateSitemapXml(flatUrls);

    return new Response(sitemapXml, {
      headers: {
        "Content-Type": "application/xml",
      },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return new Response("Error generating sitemap", {
      status: 500,
    });
  }
}
