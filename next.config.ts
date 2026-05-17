import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.scdn.co", // Spotify CDN for album/artist images
      },
      {
        protocol: "https",
        hostname: "mosaic.scdn.co",
      },
      {
        protocol: "https",
        hostname: "lineup-images.scdn.co",
      },
      {
        protocol: "https",
        hostname: "thisis-images.spotifycdn.com",
      },
    ],
  },
  // Enable React strict mode for catching bugs early
  reactStrictMode: true,
};

export default nextConfig;
