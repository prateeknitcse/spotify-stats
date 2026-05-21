import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.scdn.co" },
      { protocol: "https", hostname: "mosaic.scdn.co" },
      { protocol: "https", hostname: "lineup-images.scdn.co" },
      { protocol: "https", hostname: "thisis-images.spotifycdn.com" },
      { protocol: "https", hostname: "*.scdn.co" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  reactStrictMode: true,
  // Compress responses
  compress: true,
  // Power header removal (minor security)
  poweredByHeader: false,
  // Strict mode for production logging
  logging: {
    fetches: { fullUrl: process.env.NODE_ENV === "development" },
  },
};

export default nextConfig;
