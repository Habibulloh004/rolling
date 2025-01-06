import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // dynamicIO: true,
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
    ],
  },
};

export default withNextIntl(nextConfig);
