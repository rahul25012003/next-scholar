import { destinations, policyDesk } from "@/content/destinations";
import { guides } from "@/content/guides";
import { universities } from "@/content/catalogue";
import { legalDocuments } from "@/content/legal";
import { requirementSets } from "@/content/requirements";
import { STATUS_LABEL, SOURCE_LABEL } from "@/content/types";

/**
 * Every number this site publishes, in one list.
 *
 * The important property is that this file computes the list rather than
 * maintaining it. It walks the same content modules the pages render from, so a
 * figure cannot be added to the site without appearing here, and a figure
 * cannot be quietly removed from here while still being published.
 *
 * A hand-maintained "our sources" page is a promise. This one is a consequence,
 * and the test suite asserts the count matches what the modules actually hold.
 */

export type PublishedFigure = {
  id: string;
  /** Which surface a reader would have seen it on. */
  surface: string;
  label: string;
  value: string;
  /** The body that publishes or sets it. */
  source: string;
  /** The date it entered the repository. Never null. */
  statedOn: string;
  /** Named person who re-checked it at source. Null on all of them today. */
  checkedBy: string | null;
  /** For commission figures, the verification state the type system tracks. */
  status?: string;
  /** Where to see it in context. */
  href: string;
};

export type FigureGroup = {
  id: string;
  title: string;
  blurb: string;
  figures: PublishedFigure[];
};

function commissionFigures(): PublishedFigure[] {
  return destinations.map((row) => ({
    id: `commission-${row.slug}`,
    surface: "Destinations, Open Ledger, and every catalogue row",
    label: `What we earn: ${row.country}${row.route ? `, ${row.route}` : ""}`,
    value: row.commission.display,
    source: SOURCE_LABEL[row.commission.source],
    statedOn: "2026-09-02",
    checkedBy: null,
    status: STATUS_LABEL[row.commission.status],
    href: "/open-ledger",
  }));
}

function clientFeeFigures(): PublishedFigure[] {
  return destinations.map((row) => ({
    id: `fee-${row.slug}`,
    surface: "Destinations",
    label: `What you pay us: ${row.country}${row.route ? `, ${row.route}` : ""}`,
    value: row.clientFee,
    source: "Our own published price. The one figure here that is entirely ours to set.",
    statedOn: "2026-09-02",
    checkedBy: null,
    href: "/#destinations",
  }));
}

function guideFigures(): PublishedFigure[] {
  return guides.flatMap((guide) => {
    const rows = [
      ...guide.tuition.map((figure, index) => ({ figure, section: "tuition", index })),
      ...guide.funds.map((figure, index) => ({ figure, section: "funds", index })),
      ...guide.visaFees.map((figure, index) => ({ figure, section: "fees", index })),
    ];

    return rows.map(({ figure, section, index }) => ({
      id: `guide-${guide.slug}-${section}-${index}`,
      surface: `${guide.country} guide`,
      label: `${guide.country}: ${figure.label}`,
      value: figure.value,
      source: figure.source,
      statedOn: guide.verification.statedOn,
      checkedBy: guide.verification.checkedBy,
      href: `/destinations/${guide.slug}#${section}`,
    }));
  });
}

function intakeFigures(): PublishedFigure[] {
  return guides.flatMap((guide) =>
    guide.intakes.map((intake) => ({
      id: `intake-${guide.slug}-${intake.name}`,
      surface: `${guide.country} guide`,
      label: `${guide.country}: ${intake.name} application deadline`,
      value: intake.applicationDeadline,
      source: intake.source,
      statedOn: intake.statusAsOf,
      checkedBy: guide.verification.checkedBy,
      status: `Intake ${intake.status.replace(/-/g, " ")}`,
      href: `/destinations/${guide.slug}#intakes`,
    })),
  );
}

function livingCostFigures(): PublishedFigure[] {
  return guides.flatMap((guide) =>
    guide.living.cities.map((city) => {
      const monthly = city.lines
        .filter((line) => !line.optional)
        .reduce((total, line) => total + Math.round((line.low + line.high) / 2), 0);
      return {
        id: `living-${guide.slug}-${city.slug}`,
        surface: "Cost of living calculator",
        label: `${city.name}: mid-range monthly living cost`,
        value: `${guide.living.symbol}${monthly.toLocaleString("en-GB")} a month`,
        source: guide.living.source,
        statedOn: guide.verification.statedOn,
        checkedBy: guide.verification.checkedBy,
        href: `/tools/cost-of-living?destination=${guide.slug}`,
      };
    }),
  );
}

function catalogueFigures(): PublishedFigure[] {
  return universities.flatMap((university) =>
    university.programmes
      .filter((programme) => programme.feePerYear.state === "stated")
      .map((programme) => {
        const fee = programme.feePerYear;
        const symbol = programme.currency === "GBP" ? "£" : "€";
        return {
          id: `catalogue-${programme.slug}`,
          surface: "Catalogue",
          label: `${university.name}: ${programme.name} tuition`,
          value:
            fee.state === "stated"
              ? fee.value === 0
                ? "No tuition fee"
                : `${symbol}${fee.value.toLocaleString("en-GB")} a year`
              : "",
          source: fee.state === "stated" ? fee.source : "",
          statedOn: fee.state === "stated" ? fee.statedOn : "",
          checkedBy: null,
          href: `/universities/${university.slug}/${programme.slug}`,
        };
      }),
  );
}

function conversionFigures(): PublishedFigure[] {
  return [
    {
      id: "conversion-bavarian",
      surface: "German grade calculator",
      label: "Modified Bavarian Formula",
      value: "N = 1 + 3 × (Nmax − Nd) ÷ (Nmax − Nmin), clamped to 1.0 and 4.0",
      source: "Kultusministerkonferenz, as applied by uni-assist and most universities",
      statedOn: "2026-09-03",
      checkedBy: null,
      href: "/tools/german-grade-calculator",
    },
    {
      id: "conversion-cgpa",
      surface: "Grade converters",
      label: "CGPA to percentage factor",
      value: "× 9.5",
      source: "CBSE conversion convention, adopted by many Indian universities. Not a national standard.",
      statedOn: "2026-09-03",
      checkedBy: null,
      href: "/tools/grade-converter",
    },
    {
      id: "conversion-ielts",
      surface: "IELTS band calculator",
      label: "IELTS overall band rounding",
      value: "Mean of four sections, to the nearest half band, with .25 and .75 rounding up",
      source: "IELTS published band score calculation rules",
      statedOn: "2026-09-03",
      checkedBy: null,
      href: "/tools/ielts-band-calculator",
    },
    {
      id: "conversion-eur",
      surface: "Every rupee figure on the site",
      label: "Euro to rupee reference rate",
      value: "₹101 to the euro",
      source: "Recorded by hand. No exchange rate service is connected to this site.",
      statedOn: "2026-09-03",
      checkedBy: null,
      href: "/tools/cost-of-living",
    },
    {
      id: "conversion-gbp",
      surface: "Every rupee figure on the site",
      label: "Pound to rupee reference rate",
      value: "₹118 to the pound",
      source: "Recorded by hand. No exchange rate service is connected to this site.",
      statedOn: "2026-09-03",
      checkedBy: null,
      href: "/tools/cost-of-living",
    },
  ];
}

function policyFigures(): PublishedFigure[] {
  return [
    ...policyDesk.map((note, index) => ({
      id: `policy-${index}`,
      surface: "Policy desk",
      label: note.title,
      value: note.effectiveFrom ? `Effective from ${note.effectiveFrom}` : "Standing rule",
      source: note.source,
      statedOn: "2026-09-03",
      checkedBy: null,
      status: "Not yet re-verified for this quarter",
      href: `/destinations/${note.guideSlug}`,
    })),
    ...requirementSets.map((set) => ({
      id: `requirements-${set.destination}-${set.route}`,
      surface: "Completeness check, on every case",
      label: `Requirement list: ${set.destination}, ${set.route}`,
      value: `${set.documents.length} documents, ${set.steps.length} steps`,
      source: set.sources.join(", "),
      statedOn: set.statedOn,
      checkedBy: set.curatedBy,
      href: "/anti-fraud-policy",
    })),
    ...legalDocuments.map((doc) => ({
      id: `legal-${doc.slug}`,
      surface: "Legal",
      label: doc.title,
      value: `${doc.sections.length} sections, ${doc.openItems.length} open items`,
      source: "Written by us. Not reviewed by a lawyer.",
      statedOn: doc.lastUpdated,
      checkedBy: doc.reviewedBy,
      status: doc.reviewState === "reviewed" ? "Reviewed" : "Published as a draft",
      href: `/${doc.slug}`,
    })),
  ];
}

export function figureGroups(): FigureGroup[] {
  return [
    {
      id: "commission",
      title: "What we earn, and what you pay",
      blurb:
        "The figures the rest of the industry does not publish. Each carries one of seven verification states, and only two of them permit an exact figure to be printed as confirmed.",
      figures: [...commissionFigures(), ...clientFeeFigures()],
    },
    {
      id: "money",
      title: "Money: tuition, thresholds and fees",
      blurb:
        "Every figure a budget is built on. The visa funding thresholds are statutory minimums rather than living cost estimates, and the two are not interchangeable.",
      figures: guideFigures(),
    },
    {
      id: "living",
      title: "Cost of living",
      blurb:
        "Mid-range monthly totals, from the line items behind the calculator. Excludes the optional lines, which is why a calculator run can be higher.",
      figures: livingCostFigures(),
    },
    {
      id: "dates",
      title: "Dates and deadlines",
      blurb:
        "Dates, not month names. Each carries the day its status was last established, because an intake marked open six months ago is not evidence it is open now.",
      figures: intakeFigures(),
    },
    {
      id: "catalogue",
      title: "Catalogue tuition",
      blurb:
        "Only the courses where a fee has actually been written down. Courses whose fee we have not read do not appear here, and they say so on their own pages.",
      figures: catalogueFigures(),
    },
    {
      id: "conversions",
      title: "Conversions and formulas",
      blurb:
        "Every arithmetic convention the tools apply, named. None of these is a law, and each calculator says which one it used.",
      figures: conversionFigures(),
    },
    {
      id: "policy",
      title: "Policy, requirements and legal",
      blurb:
        "The rules the platform checks against, and the documents that govern the service.",
      figures: policyFigures(),
    },
  ];
}

export function figureCount(): { total: number; checked: number; groups: number } {
  const groups = figureGroups();
  const all = groups.flatMap((group) => group.figures);
  return {
    total: all.length,
    checked: all.filter((figure) => figure.checkedBy !== null).length,
    groups: groups.length,
  };
}
