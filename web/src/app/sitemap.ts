import type { MetadataRoute } from "next";
import { lastReviewed } from "@/content/site";

/**
 * The five public pages. Nothing behind a login is listed, and the file is
 * empty until a domain exists rather than asserting one that does not.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const origin = process.env.NEXT_PUBLIC_SITE_URL;
  if (!origin) return [];

  const reviewed = new Date(lastReviewed);

  return [
    { url: origin, lastModified: reviewed, priority: 1 },
    { url: `${origin}/open-ledger`, lastModified: reviewed, priority: 0.9 },
    { url: `${origin}/zero-commission`, lastModified: reviewed, priority: 0.8 },
    { url: `${origin}/anti-fraud-policy`, lastModified: reviewed, priority: 0.7 },
    { url: `${origin}/book-consultation`, lastModified: reviewed, priority: 0.9 },
  ];
}
