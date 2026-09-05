#!/usr/bin/env node
/**
 * Route smoke check.
 *
 * Fetches every public route against a running server and asserts the things a
 * browser would notice first: the page renders at all, it has exactly one h1,
 * every image declares an alt attribute, every table has a caption, no element
 * carries an inline pixel width wide enough to break a phone, and no button or
 * link is empty of accessible text. It also checks that the authenticated
 * surfaces redirect rather than rendering.
 *
 * It exists because it already paid for itself. A helper exported from a
 * "use client" module was being called by server components, which a dev server
 * hides by quietly falling back to the loading skeleton: the pages looked fine,
 * their real content never reached the HTML, and the h1 count is what caught
 * it. Run it against a production build, which is the state that ships.
 *
 *   npm run build && npm start &
 *   npm run smoke
 */

const BASE = process.env.SMOKE_BASE_URL ?? "http://localhost:3000";

/** Public pages, each expected to render a complete document. */
const PAGES = [
  "/",
  "/destinations",
  "/destinations/united-kingdom",
  "/destinations/germany",
  "/destinations/ireland",
  "/destinations/germany/cost-of-studying",
  "/destinations/germany/cost-of-living",
  "/destinations/germany/scholarships",
  "/destinations/united-kingdom/jobs",
  "/destinations/ireland/post-study-work",
  "/universities",
  "/universities?destination=germany&level=masters&sort=commission-asc",
  "/universities?zeroCommission=1",
  "/universities/rankings",
  "/universities/kit-karlsruhe",
  "/universities/kit-karlsruhe?tab=admissions",
  "/universities/kit-karlsruhe?tab=rankings",
  "/universities/kit-karlsruhe?tab=courses",
  "/universities/tu-munich/tum-msc-informatics",
  "/universities/university-of-manchester/manchester-msc-advanced-computer-science",
  "/masters-in-germany",
  "/masters-in-uk",
  "/masters-in-ireland",
  "/scholarships",
  "/scholarships?destination=germany",
  "/shortlist",
  "/tools",
  "/tools/requirements-check",
  "/tools/requirements-check?destination=germany",
  "/tools/cost-of-living",
  "/tools/german-grade-calculator",
  "/tools/ects-check",
  "/tools/ielts-band-calculator",
  "/tools/grade-converter",
  "/guides",
  "/guides?destination=germany",
  "/guides/the-dmat-is-coming",
  "/guides/average-grades-arrears-and-backlogs",
  "/guides/germany-is-not-free",
  "/guides/the-28-day-rule",
  "/guides/ireland-pays-before-the-visa",
  "/guides/what-a-consultant-cannot-do",
  "/process/consultation",
  "/process/outcome",
  "/our-numbers",
  "/services",
  "/services/profile-evaluation",
  "/open-ledger",
  "/zero-commission",
  "/anti-fraud-policy",
  "/book-consultation",
  "/privacy",
  "/terms",
  "/cookies",
  "/refund-policy",
  "/non-affiliation",
  "/search",
  "/search?q=blocked+account",
  "/login",
  "/signup",
];

/** Text responses, checked only for a status. */
const TEXT = ["/sitemap.xml", "/robots.txt"];

/** These must not render to a signed-out caller. */
const GUARDED = ["/portal", "/console", "/ops"];

const problems = [];
const lines = [];

async function fetchPage(path, redirect = "follow") {
  const response = await fetch(BASE + path, { redirect });
  const body = response.headers.get("content-type")?.includes("text")
    ? await response.text()
    : "";
  return { status: response.status, body, location: response.headers.get("location") };
}

for (const path of PAGES) {
  let result;
  try {
    result = await fetchPage(path);
  } catch (error) {
    problems.push(`${path}: request failed, ${error.message}`);
    continue;
  }

  const { status, body } = result;
  if (status !== 200) problems.push(`${path}: got ${status}, expected 200`);

  const h1s = body.match(/<h1[\s>]/g) ?? [];
  if (h1s.length !== 1) {
    problems.push(`${path}: ${h1s.length} h1 elements, expected exactly 1`);
  }

  const images = body.match(/<img\b[^>]*>/g) ?? [];
  if (images.some((tag) => !tag.includes("alt="))) {
    problems.push(`${path}: an img has no alt attribute`);
  }

  const tables = (body.match(/<table\b/g) ?? []).length;
  const captions = (body.match(/<caption\b/g) ?? []).length;
  if (tables > captions) {
    problems.push(`${path}: ${tables} tables but ${captions} captions`);
  }

  if (/style="[^"]*width:\s*\d{3,}px/.test(body)) {
    problems.push(`${path}: an inline pixel width over 100px`);
  }

  const empty = (body.match(/<(?:button|a)\b[^>]*>\s*<\/(?:button|a)>/g) ?? []).length;
  if (empty > 0) problems.push(`${path}: ${empty} empty interactive elements`);

  lines.push(`  ${status}  h1:${h1s.length}  ${path}`);
}

for (const path of TEXT) {
  const { status } = await fetchPage(path);
  if (status !== 200) problems.push(`${path}: got ${status}, expected 200`);
  lines.push(`  ${status}  text  ${path}`);
}

for (const path of GUARDED) {
  const { status, location } = await fetchPage(path, "manual");
  if (status !== 307 && status !== 302) {
    problems.push(`${path}: rendered to a signed-out caller with ${status}`);
  } else if (!location?.includes("/login")) {
    problems.push(`${path}: redirected somewhere other than the sign in page`);
  }
  lines.push(`  ${status}  guarded  ${path}`);
}

const missing = await fetchPage("/no-such-page");
if (missing.status !== 404) problems.push(`/no-such-page: got ${missing.status}, expected 404`);
lines.push(`  ${missing.status}  not found  /no-such-page`);

console.log(lines.join("\n"));
console.log();

if (problems.length > 0) {
  console.error(`${problems.length} problem${problems.length === 1 ? "" : "s"}:`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}

console.log(
  `${PAGES.length + TEXT.length + GUARDED.length + 1} routes checked. No problems found.`,
);
