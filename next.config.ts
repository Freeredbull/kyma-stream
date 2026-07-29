import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.b-cdn.net" },
      { protocol: "https", hostname: "**.bunnycdn.com" },
      { protocol: "https", hostname: "image.mux.com" },
    ],
  },
};

export default nextConfig;
