import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

export default withNextIntl({
  experimental: {
    runtime: "edge", // Ensure Edge runtime compatibility
  },
  images: {
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
    ],
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
