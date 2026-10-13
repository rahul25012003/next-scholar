import type { NextConfig } from "next";

/**
 * Sharing the development server through a Cloudflare quick tunnel serves it
 * from a random *.trycloudflare.com address. Next.js refuses its scripts, its
 * live reload and form actions to any origin it was not told about, so the
 * tunnel showed the page text with none of the interactive code. Development
 * only: production keeps the default same-origin check on form actions.
 */
const tunnelHosts = ["*.trycloudflare.com"];

const nextConfig: NextConfig = {
  allowedDevOrigins: tunnelHosts,
  ...(process.env.NODE_ENV === "development" && {
    experimental: { serverActions: { allowedOrigins: tunnelHosts } },
  }),
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
