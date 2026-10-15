import type { NextConfig } from "next";
import { marketingMediaManifest } from "./src/lib/marketingMedia";

const mediaHosts = [...new Set(marketingMediaManifest.map(({ url }) => new URL(url).hostname))];
if (mediaHosts.length !== 1 || mediaHosts[0] !== "kisawtnsjrjeautf.public.blob.vercel-storage.com") {
  throw new Error("Marketing media must use the dedicated Expense Budget Tracker Blob store.");
}

const nextConfig: NextConfig = {
  trailingSlash: true,
  outputFileTracingExcludes: {
    "/*": ["public/blog/**/*", "src/content/**/*"],
  },
  images: {
    formats: ["image/webp", "image/avif"],
    remotePatterns: mediaHosts.map((hostname) => ({
      protocol: "https" as const,
      hostname,
      port: "",
      pathname: "/marketing/*",
      search: "",
    })),
    unoptimized: false,
  },
  reactStrictMode: true,
  poweredByHeader: false,
  env: {
    SITE_URL: "https://expense-budget-tracker.com/",
    SITE_NAME: "Expense Budget Tracker",
    APP_URL: "https://app.expense-budget-tracker.com",
    AUTH_URL: "https://auth.expense-budget-tracker.com",
  },
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },
  async headers() {
    const headers = [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=86400, stale-while-revalidate=604800",
          },
          {
            key: "Vary",
            value: "Accept",
          },
        ],
      },
      {
        source: "/:directory(blog|home)/:image(.*\\.(?:png|jpe?g|webp|avif|gif|tiff?))",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
          { key: "x-vercel-enable-rewrite-caching", value: "1" },
          { key: "Vercel-CDN-Cache-Control", value: "public, max-age=86400" },
        ],
      },
    ];

    if (process.env.VERCEL_ENV !== "production") {
      headers.push({
        source: "/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex",
          },
        ],
      });
    }

    return headers;
  },
  async rewrites() {
    return marketingMediaManifest.map(({ publicPath, url }) => ({
      source: publicPath.replaceAll(".", "\\."),
      destination: url,
    }));
  },
};

export default nextConfig;
