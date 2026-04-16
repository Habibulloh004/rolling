import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

function readSeconds(name, fallback) {
  const parsedValue = Number.parseInt(process.env[name] ?? "", 10);
  return Number.isFinite(parsedValue) && parsedValue >= 0
    ? parsedValue
    : fallback;
}

function readBoolean(name, fallback) {
  const rawValue = String(process.env[name] ?? "").trim().toLowerCase();

  if (!rawValue) {
    return fallback;
  }

  if (["1", "true", "yes", "on"].includes(rawValue)) {
    return true;
  }

  if (["0", "false", "no", "off"].includes(rawValue)) {
    return false;
  }

  return fallback;
}

const dataCacheEnabled = readBoolean("NEXT_PUBLIC_ENABLE_DATA_CACHE", true);

export default withNextIntl({
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
    staleTimes: {
      dynamic: dataCacheEnabled
        ? readSeconds("NEXT_CACHE_STALE_DYNAMIC", 30)
        : 0,
      static: dataCacheEnabled
        ? readSeconds("NEXT_CACHE_STALE_STATIC", 180)
        : 0,
    },
  },
  images: {
    unoptimized: false,
    minimumCacheTTL: readSeconds("CACHE_IMAGE_MINIMUM_TTL", 604800),
    qualities: [72, 80],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [96, 128, 160, 192, 256, 320, 384, 512, 640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 192, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vm4983125.25ssd.had.wf",
        port: "5000",
      },
      {
        protocol: "https",
        hostname: "www.shutterstock.com",
      },
      {
        protocol: "https",
        hostname: "joinposter.com",
      },
      {
        protocol: "https",
        hostname: "rolling.app",
      },
      {
        protocol: "https",
        hostname: "rolling-202741958960.asia-south1.run.app",
      },
      {
        protocol: "https",
        hostname: "adminrolling1.uz",
      },
      {
        protocol: "https",
        hostname: "rollingadmin.uz",
        port: "5000",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5020",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
        ],
      },
      {
        source: "/manifest.webmanifest",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
          {
            key: "Content-Type",
            value: "application/manifest+json",
          },
        ],
      },
      {
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/icons/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/logoLottie.json",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/apple-touch-icon.png",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/favicon.ico",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/pwa-192x192.png",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/pwa-512x512.png",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/image",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0, must-revalidate",
          },
        ],
      },
    ];
  },

});

// import path from "path";
// import fs from "fs";
// import createNextIntlPlugin from "next-intl/plugin";
// import { generateSitemaps } from "./app/sitemap.js"; // Ensure the file exists and exports generateSitemaps
// import sitemap from "./app/sitemap.js"; // Ensure this import is accurate

// const withNextIntl = createNextIntlPlugin();

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   experimental: {
//     serverActions: {
//       bodySizeLimit: "50mb",
//     },
//     staleTimes: {
//       dynamic: 30,
//       static: 180,
//     },
//   },
//   webpack(config, { isServer }) {
//     config.module.rules.push({
//       test: /\.svg$/,
//       use: ["@svgr/webpack"], // Allows importing SVG files as React components
//     });
//     return config;
//   },
//   images: {
//     minimumCacheTTL: 3600,
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "vm4983125.25ssd.had.wf",
//         port: "5000",
//       },
//       {
//         protocol: "https",
//         hostname: "www.shutterstock.com",
//       },
//       {
//         protocol: "https",
//         hostname: "joinposter.com",
//       },
//     ],
//   },
//   async headers() {
//     return [
//       {
//         source: "/api/:path*",
//         headers: [
//           { key: "Access-Control-Allow-Credentials", value: "true" },
//           {
//             key: "Access-Control-Allow-Origin",
//             value: "https://rolling-sushi.uz", // Ensure this matches your deployment URL
//           },
//           {
//             key: "Access-Control-Allow-Methods",
//             value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
//           },
//           {
//             key: "Access-Control-Allow-Headers",
//             value:
//               "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
//           },
//           {
//             key: "Cache-Control",
//             value: "public, max-age=600, stale-while-revalidate=600", // 10 minutes
//           },
//         ],
//       },
//     ];
//   },
//   async generateStaticParams() {
//     try {
//       // Generate the sitemap data
//       const sitemapData = await generateSitemaps();

//       // Map through the sitemap data and ensure it resolves correctly
//       const urls = await Promise.all(
//         sitemapData.map(async ({ type, id }) => {
//           try {
//             const result = await sitemap({ type, id });
//             return result;
//           } catch (error) {
//             console.error(
//               `Error generating sitemap for type=${type} and id=${id}:`,
//               error
//             );
//             return []; // Prevent crashing if one entry fails
//           }
//         })
//       );

//       // Flatten the URLs array
//       const flatUrls = urls.flat();

//       // Generate the XML content for the sitemap
//       const sitemapXml = `
//         <?xml version="1.0" encoding="UTF-8"?>
//         <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
//           ${flatUrls
//             .map(
//               (urlObj) => `
//             <url>
//               <loc>${urlObj.url}</loc>
//               <lastmod>${urlObj.lastModified}</lastmod>
//               <changefreq>daily</changefreq>
//               <priority>0.8</priority>
//             </url>
//           `
//             )
//             .join("\n")}
//         </urlset>
//       `;

//       // Write the sitemap to the public directory
//       fs.writeFileSync(
//         path.join(process.cwd(), "public", "sitemap.xml"),
//         sitemapXml
//       );

//       return {};
//     } catch (error) {
//       console.error("Error generating sitemap:", error);
//       return {}; // Return an empty object if there's an error
//     }
//   },
// };

// export default withNextIntl(nextConfig);
