import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // dynamicIO: true,
    serverActions: {
      bodySizeLimit: "50mb",
    },
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
  images: {
    minimumCacheTTL: 3600,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vm4983125.25ssd.had.wf",
        port: "5000",
        pathname: "/banner/get_banner/**",
      },
      {
        protocol: "https",
        hostname: "www.shutterstock.com",
      },
      {
        protocol: "https",
        hostname: "joinposter.com",
        pathname: "/upload/**",
      },
      {
        protocol: "https",
        hostname: "joinposter.comundefined",
        pathname: "/upload/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          {
            key: "Access-Control-Allow-Origin",
            value: "https://rolling-sushi.uz",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=600, stale-while-revalidate=600", // 10 daqiqa soat
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
