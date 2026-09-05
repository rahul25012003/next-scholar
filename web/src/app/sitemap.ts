import type { MetadataRoute } from "next";
import { lastReviewed } from "@/content/site";
import { guides } from "@/content/guides";
import { legalDocuments } from "@/content/legal";
import { catalogueScope, programmes, universities } from "@/content/catalogue";
import { articles } from "@/content/articles";
import { scholarshipScope } from "@/content/scholarships";
import { stages } from "@/content/process";

const destinationTopics = [
  "cost-of-studying",
  "cost-of-living",
  "scholarships",
  "jobs",
  "post-study-work",
];

/**
 * Every public page, built from the same modules that render them, so a new
 * destination guide or a new policy cannot exist without appearing here.
 * Nothing behind a login is listed, and the file stays empty until a domain
 * exists rather than asserting one that does not.
 */
const tools = [
  "requirements-check",
  "cost-of-living",
  "german-grade-calculator",
  "ects-check",
  "ielts-band-calculator",
  "grade-converter",
  "english-tests",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = process.env.NEXT_PUBLIC_SITE_URL;
  if (!origin) return [];

  const reviewed = new Date(lastReviewed);
  const at = (path: string, priority: number, lastModified = reviewed) => ({
    url: `${origin}${path}`,
    lastModified,
    priority,
  });

  return [
    { url: origin, lastModified: reviewed, priority: 1 },
    at("/open-ledger", 0.9),
    at("/book-consultation", 0.9),
    at("/destinations", 0.9),
    ...guides.map((guide) =>
      at(`/destinations/${guide.slug}`, 0.9, new Date(guide.verification.statedOn)),
    ),
    ...guides.flatMap((guide) =>
      destinationTopics.map((topic) =>
        at(`/destinations/${guide.slug}/${topic}`, 0.6, new Date(guide.verification.statedOn)),
      ),
    ),
    at("/universities", 0.9, new Date(catalogueScope.statedOn)),
    at("/universities/rankings", 0.6, new Date(catalogueScope.statedOn)),
    at("/masters-in-germany", 0.7, new Date(catalogueScope.statedOn)),
    at("/masters-in-uk", 0.7, new Date(catalogueScope.statedOn)),
    at("/masters-in-ireland", 0.7, new Date(catalogueScope.statedOn)),
    ...universities.map((university) =>
      at(`/universities/${university.slug}`, 0.7, new Date(catalogueScope.statedOn)),
    ),
    ...programmes.map((programme) =>
      at(
        `/universities/${programme.universitySlug}/${programme.slug}`,
        0.6,
        new Date(catalogueScope.statedOn),
      ),
    ),
    at("/scholarships", 0.7, new Date(scholarshipScope.statedOn)),
    ...stages.map((stage) => at(`/process/${stage.key}`, 0.5)),
    at("/our-numbers", 0.9),
    at("/services", 0.9),
    at("/services/profile-evaluation", 0.7),
    at("/guides", 0.8),
    ...articles.map((article) => at(`/guides/${article.slug}`, 0.7, new Date(article.updatedOn))),
    at("/tools", 0.8),
    ...tools.map((tool) => at(`/tools/${tool}`, 0.8)),
    at("/reviews", 0.5),
    at("/counsellors", 0.5),
    at("/events", 0.5),
    at("/zero-commission", 0.8),
    at("/anti-fraud-policy", 0.7),
    ...legalDocuments.map((doc) =>
      at(`/${doc.slug}`, 0.5, new Date(doc.lastUpdated)),
    ),
  ];
}
