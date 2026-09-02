import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Country flags. Public domain flag artwork, served as static PNG.
      { protocol: "https", hostname: "flagcdn.com", pathname: "/**" },
      // Photography. Each image is picked by loading it and looking at it, not
      // by trusting a keyword, and every one is credited in content/photos.ts.
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
