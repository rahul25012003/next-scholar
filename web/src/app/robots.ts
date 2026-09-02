import type { MetadataRoute } from "next";

/**
 * The authenticated surfaces are not for search engines, and the sweep endpoint
 * is not for anyone without the secret.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/portal", "/console", "/ops", "/api/"],
    },
    sitemap: process.env.NEXT_PUBLIC_SITE_URL
      ? `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`
      : undefined,
  };
}
