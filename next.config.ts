import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    return [
      {
        source: "/crafts/:slug",
        destination: "/crafts/:slug/index.html",
      },
      {
        source: "/crafts/:slug/",
        destination: "/crafts/:slug/index.html",
      },
    ];
  },
};

export default nextConfig;
