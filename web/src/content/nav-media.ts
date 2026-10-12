import { photos, type Photo } from "@/content/photos";

/**
 * What each navigation menu shows beside its links: a sentence saying what the
 * section holds, a lead photograph, and a photograph per link. A link with no
 * photograph of its own keeps the lead one.
 *
 * Kept apart from `nav` in site.ts so that file stays free of image imports.
 * Keyed by the group's label and the link's href. No photograph is used for
 * two links: `lead` is always one of the group's own. They are decoration,
 * never a claim about a client, and the menu renders them with an empty alt
 * for that reason.
 */
export type NavMedia = {
  blurb: string;
  lead: Photo;
  byHref: Record<string, Photo>;
};

const { menu } = photos;

export const navMedia: Record<string, NavMedia> = {
  Destinations: {
    blurb:
      "Three countries, each covered end to end: tuition, the visa file, the deadlines and what goes wrong.",
    lead: menu.worldMap,
    byHref: {
      "/destinations/united-kingdom": menu.london,
      "/destinations/germany": menu.berlin,
      "/destinations/ireland": menu.dublin,
      "/destinations": menu.worldMap,
    },
  },
  Courses: {
    blurb:
      "Forty-five universities and fifty-two Master's courses across our three destinations.",
    lead: menu.readingRoom,
    byHref: {
      "/universities": menu.readingRoom,
      "/masters-in-germany": menu.heidelberg,
      "/masters-in-uk": menu.oxford,
      "/masters-in-ireland": menu.oldLibrary,
      "/universities/rankings": menu.lectureHall,
      "/scholarships": menu.graduation,
      "/shortlist": menu.notebook,
    },
  },
  "Free tools": {
    blurb:
      "Calculators and checks that run in your browser. None is behind a form, and each one shows its working.",
    lead: menu.paperwork,
    byHref: {
      "/tools/requirements-check": menu.paperwork,
      "/tools/cost-of-living": menu.euros,
      "/tools/german-grade-calculator": menu.answerSheet,
      "/tools/ects-check": menu.books,
      "/tools/ielts-band-calculator": menu.headphones,
      "/tools/grade-converter": menu.calculator,
    },
  },
  "What we publish": {
    blurb:
      "Where each figure comes from, what we earn on each route, and our blog.",
    lead: menu.ledger,
    byHref: {
      "/open-ledger": menu.ledger,
      "/our-numbers": menu.charts,
      "/blog": menu.shelves,
      "/services": menu.meeting,
    },
  },
  Policies: {
    blurb:
      "The rules we hold ourselves to, written down, including the gaps we have not closed yet.",
    lead: menu.signing,
    byHref: {},
  },
};
