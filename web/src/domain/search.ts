import { guides } from "@/content/guides";
import { articles, readMinutes } from "@/content/articles";
import { programmes, universities } from "@/content/catalogue";
import { legalDocuments } from "@/content/legal";
import { services } from "@/content/services";
import { destinations } from "@/content/destinations";
import { scholarships } from "@/content/scholarships";

/**
 * Site search.
 *
 * A plain scan over the content modules, scored by where the match landed. At
 * this size an index would be a dependency, a build step and a second source of
 * truth for a few hundred records, and the scan takes under a millisecond.
 *
 * ponytail: linear scan over every record on each query. Fine to several
 * thousand records; build an index when the catalogue outgrows a page of
 * results, not before.
 *
 * The one rule it inherits from the rest of the platform: a result that carries
 * a commission figure carries it in the result, so a catalogue row found
 * through search discloses what a catalogue row found through browsing does.
 */

export type SearchKind =
  | "Destination guide"
  | "Course"
  | "University"
  | "Written guide"
  | "Tool"
  | "Policy"
  | "Service"
  | "Scholarship"
  | "Page";

export type SearchResult = {
  kind: SearchKind;
  title: string;
  detail: string;
  href: string;
  /** Printed on the result where the record has one. */
  commission?: string;
  /** Read time, for an article. */
  minutes?: number;
  score: number;
};

type Record_ = {
  kind: SearchKind;
  title: string;
  detail: string;
  href: string;
  /** Weighted lower than the title, so a body match does not outrank a name. */
  body: string;
  commission?: string;
  minutes?: number;
};

/** Static pages that are not generated from a content module. */
const pages: Record_[] = [
  {
    kind: "Page",
    title: "Open Ledger",
    detail: "Every commission we earn, per university relationship, with its verification state.",
    href: "/open-ledger",
    body: "commission ledger verification disputed permission published transparency what we earn",
  },
  {
    kind: "Page",
    title: "Our numbers, one source",
    detail: "Every figure on this site, its source, and the date it was written down.",
    href: "/our-numbers",
    body: "sources verification figures dates checked audit provenance",
  },
  {
    kind: "Page",
    title: "Zero commission list",
    detail: "The universities that pay us nothing, and why we still recommend them.",
    href: "/zero-commission",
    body: "zero commission german public universities free pays nothing",
  },
  {
    kind: "Page",
    title: "Anti fraud and document integrity",
    detail: "What we will not do to a document, enforced in code rather than in policy.",
    href: "/anti-fraud-policy",
    body: "fraud documents forgery editing verification ghostwriting statement of purpose dpdp data protection",
  },
  {
    kind: "Page",
    title: "Book a consultation",
    detail: "Forty five minutes and a written assessment within 24 hours.",
    href: "/book-consultation",
    body: "consultation booking intake questions price assessment",
  },
  {
    kind: "Page",
    title: "Your shortlist",
    detail: "Saved courses compared side by side, including what we earn on each.",
    href: "/shortlist",
    body: "shortlist saved compare comparison courses",
  },
  {
    kind: "Page",
    title: "Rankings",
    detail: "Every published ranking for each institution, alphabetical, never averaged.",
    href: "/universities/rankings",
    body: "rankings qs times higher world university rank table top universities",
  },
  {
    kind: "Page",
    title: "Masters in Germany",
    detail: "The catalogue, filtered to Germany.",
    href: "/masters-in-germany",
    body: "masters in germany courses catalogue",
  },
  {
    kind: "Page",
    title: "Masters in the UK",
    detail: "The catalogue, filtered to the United Kingdom.",
    href: "/masters-in-uk",
    body: "masters in uk united kingdom courses catalogue",
  },
  {
    kind: "Page",
    title: "Masters in Ireland",
    detail: "The catalogue, filtered to Ireland.",
    href: "/masters-in-ireland",
    body: "masters in ireland courses catalogue",
  },
  {
    kind: "Page",
    title: "Reviews",
    detail: "Checked against the case record by a named person before publication, refusals included.",
    href: "/reviews",
    body: "reviews testimonials outcomes verified checked",
  },
  {
    kind: "Page",
    title: "Counsellors",
    detail: "A credential checked against the issuing body, not a job title.",
    href: "/counsellors",
    body: "counsellors staff team credentials",
  },
  {
    kind: "Page",
    title: "Events and webinars",
    detail: "Nothing invented while nothing is scheduled.",
    href: "/events",
    body: "events webinars sessions register registration",
  },
];

const tools: Record_[] = [
  {
    kind: "Tool",
    title: "Requirements checklist",
    detail: "Met, not met, or cannot tell, against every published requirement. No score.",
    href: "/tools/requirements-check",
    body: "eligibility requirements checklist met admission predictor probability chance",
  },
  {
    kind: "Tool",
    title: "Cost of living calculator",
    detail: "Line by line, editable, with every range attributed to its source.",
    href: "/tools/cost-of-living",
    body: "cost of living rent groceries budget monthly munich berlin london dublin expenses",
  },
  {
    kind: "Tool",
    title: "German grade calculator",
    detail: "The Modified Bavarian Formula, with the arithmetic on your own numbers.",
    href: "/tools/german-grade-calculator",
    body: "german grade conversion bavarian formula cgpa percentage 1.0 4.0 sehr gut",
  },
  {
    kind: "Tool",
    title: "ECTS credit check",
    detail: "Total, core subject and mathematics credits against a programme's requirements.",
    href: "/tools/ects-check",
    body: "ects credits mathematics prerequisites module handbook german masters admission",
  },
  {
    kind: "Tool",
    title: "IELTS band calculator",
    detail: "Four sections to an overall band, plus the per-section condition check.",
    href: "/tools/ielts-band-calculator",
    body: "ielts band score rounding overall section listening reading writing speaking",
  },
  {
    kind: "Tool",
    title: "Grade converters",
    detail: "Eight conversions between CGPA, percentage, marks and GPA.",
    href: "/tools/grade-converter",
    body: "cgpa percentage gpa marks sgpa conversion 9.5 convert",
  },
  {
    kind: "Tool",
    title: "English test comparison",
    detail: "IELTS, TOEFL iBT, PTE Academic and Duolingo, side by side, no score converted between them.",
    href: "/tools/english-tests",
    body: "ielts toefl pte duolingo english test selt ukvi secure english language test scale sections",
  },
];

function corpus(): Record_[] {
  const records: Record_[] = [...pages, ...tools];

  for (const guide of guides) {
    const rows = destinations.filter((row) =>
      guide.routes.some((route) => route.destinationSlug === row.slug),
    );
    records.push({
      kind: "Destination guide",
      title: `Studying in ${guide.country}`,
      detail: guide.headline,
      href: `/destinations/${guide.slug}`,
      commission: rows.map((row) => row.commission.display).join(" / "),
      body: [
        guide.lede,
        ...guide.tuition.map((figure) => `${figure.label} ${figure.value} ${figure.qualifier}`),
        ...guide.funds.map((figure) => `${figure.label} ${figure.value} ${figure.qualifier}`),
        ...guide.visaFees.map((figure) => `${figure.label} ${figure.value}`),
        ...guide.academic.map((item) => `${item.title} ${item.body}`),
        ...guide.language.map((item) => `${item.name} ${item.accepted}`),
        ...guide.pitfalls.map((item) => `${item.title} ${item.body}`),
        ...guide.faqs.map((item) => `${item.q} ${item.a}`),
      ].join(" "),
    });
  }

  for (const university of universities) {
    records.push({
      kind: "University",
      title: university.name,
      detail: `${university.city}. ${university.summary}`,
      href: `/universities/${university.slug}`,
      commission: university.commission.display,
      body: [
        university.summary,
        university.city,
        university.route,
        university.tuitionNote.state === "stated" ? university.tuitionNote.value : "",
        ...university.rankings.map((ranking) => `${ranking.body} ${ranking.rank}`),
      ].join(" "),
    });
  }

  for (const programme of programmes) {
    const fee =
      programme.feePerYear.state === "stated"
        ? programme.feePerYear.value === 0
          ? "No tuition fee"
          : `${programme.currency === "GBP" ? "£" : "€"}${programme.feePerYear.value.toLocaleString("en-GB")} a year`
        : "Fee not published here";
    records.push({
      kind: "Course",
      title: programme.name,
      detail: `${programme.university.name}, ${programme.university.city}. ${fee}.`,
      href: `/universities/${programme.university.slug}/${programme.slug}`,
      commission: programme.university.commission.display,
      body: [
        programme.university.name,
        programme.campus,
        programme.languageOfInstruction,
        ...programme.disciplines,
        programme.entryRequirement.state === "stated" ? programme.entryRequirement.value : "",
      ].join(" "),
    });
  }

  for (const article of articles) {
    records.push({
      kind: "Written guide",
      title: article.title,
      detail: article.standfirst,
      href: `/guides/${article.slug}`,
      minutes: readMinutes(article),
      body: [
        article.standfirst,
        ...article.topics,
        article.stage,
        article.service,
        ...article.body.map((block) =>
          "p" in block
            ? block.p
            : "h" in block
              ? block.h
              : "note" in block
                ? block.note
                : block.list.join(" "),
        ),
      ].join(" "),
    });
  }

  for (const doc of legalDocuments) {
    records.push({
      kind: "Policy",
      title: doc.title,
      detail: doc.lede,
      href: `/${doc.slug}`,
      body: [doc.lede, ...doc.sections.map((section) => section.heading)].join(" "),
    });
  }

  for (const scholarship of scholarships) {
    records.push({
      kind: "Scholarship",
      title: scholarship.name,
      detail: `${scholarship.funder}. ${
        scholarship.coverage.state === "stated" ? scholarship.coverage.value : scholarship.coverage.reason
      }`,
      href: `/scholarships?destination=${scholarship.destination}`,
      body: [scholarship.funder, scholarship.eligibility, scholarship.awardType].join(" "),
    });
  }

  for (const service of services) {
    records.push({
      kind: "Service",
      title: service.name,
      detail: service.summary,
      href: `/services#${service.slug}`,
      body: [service.summary, ...service.includes, ...service.excludes].join(" "),
    });
  }

  return records;
}

const RECORDS = corpus();

/**
 * Scores a record against the query terms.
 *
 * A title match outranks a detail match, which outranks a body match, and a
 * record matching every term outranks one matching some. That is the whole
 * model: there is no relevance tuning, no click signal and no personalisation,
 * because each of those would be a place to quietly promote a result on a site
 * that also publishes what it earns from each one.
 */
function score(record: Record_, terms: string[]): number {
  const title = record.title.toLowerCase();
  const detail = record.detail.toLowerCase();
  const body = record.body.toLowerCase();

  let total = 0;
  let matched = 0;

  for (const term of terms) {
    let hit = 0;
    if (title.includes(term)) hit += 10;
    if (detail.includes(term)) hit += 4;
    if (body.includes(term)) hit += 1;
    if (hit > 0) matched += 1;
    total += hit;
  }

  // Every term matched is worth more than one term matched loudly.
  if (matched === terms.length && terms.length > 1) total += 8;
  return matched === 0 ? 0 : total;
}

export function search(query: string, limit = 40): SearchResult[] {
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .map((term) => term.trim())
    .filter((term) => term.length > 1);

  if (terms.length === 0) return [];

  return RECORDS.map((record) => ({
    kind: record.kind,
    title: record.title,
    detail: record.detail,
    href: record.href,
    commission: record.commission,
    minutes: record.minutes,
    score: score(record, terms),
  }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, limit);
}

/** What the corpus covers, so an empty result can say what was searched. */
export function corpusSummary(): { kind: SearchKind; count: number }[] {
  const counts = new Map<SearchKind, number>();
  for (const record of RECORDS) {
    counts.set(record.kind, (counts.get(record.kind) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([kind, count]) => ({ kind, count }))
    .sort((a, b) => b.count - a.count);
}
