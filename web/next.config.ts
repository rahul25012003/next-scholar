import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pages that were removed or moved, kept as permanent redirects so old
  // links and bookmarks still land somewhere useful.
  async redirects() {
    return [
      { source: "/zero-commission", destination: "/open-ledger", permanent: true },
      { source: "/guides", destination: "/blog", permanent: true },
      { source: "/guides/:slug", destination: "/blog/:slug", permanent: true },
    ];
  },
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
