import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Country flags. Public domain flag artwork, served as static PNG.
      { protocol: "https", hostname: "flagcdn.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
