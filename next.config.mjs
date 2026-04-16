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
    ];
  },

});
