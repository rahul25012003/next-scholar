import type { MetadataRoute } from "next";
import { site } from "@/content/site";

/**
 * The honest version of "mobile app" (6.05 in the backlog) available without
 * a native codebase, a store listing, or a second team: a web app manifest,
 * so the site installs to a home screen and opens without browser chrome.
 * Every route it opens to is the same one this manifest's own site serves;
 * nothing here is a placeholder for a native app that does not exist.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0e2a5e",
    icons: [
      { src: "/icon-192", sizes: "192x192", type: "image/png" },
      { src: "/icon-512", sizes: "512x512", type: "image/png" },
    ],
  };
}
