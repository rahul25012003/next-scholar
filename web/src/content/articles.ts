/**
 * The content hub.
 *
 * Four filter axes, because a study abroad reader arrives with one of four
 * questions and a single "category" field answers only one of them: which
 * country, which subject, which part of our service, and where in the journey
 * they are. Both benchmarks tag by topic alone and their archives are
 * unnavigable as a result.
 *
 * Read time is computed rather than typed, and the updated date is required, so
 * neither can drift from the article it describes.
 */

export type Destination = "germany" | "united-kingdom" | "ireland" | "all";
export type Topic =
  | "Money"
  | "Visa"
  | "Admissions"
  | "Language"
  | "Living there"
  | "Choosing";
export type ServiceAxis =
  | "Profile evaluation"
  | "Consultation"
  | "Shortlist"
  | "Documents"
  | "Applications"
  | "Finance"
  | "Visa file"
  | "Pre departure";
export type JourneyStage =
  | "Deciding whether to go"
  | "Choosing where"
  | "Applying"
  | "After an offer"
  | "Before you fly";

export type Article = {
  slug: string;
  title: string;
  /** The claim the piece actually makes, not a teaser. */
  standfirst: string;
  destination: Destination;
  topics: Topic[];
  service: ServiceAxis;
  stage: JourneyStage;
  publishedOn: string;
  updatedOn: string;
  /** Paragraphs and headings. Kept as data so read time can be computed. */
  body: ({ h: string } | { p: string } | { list: string[] } | { note: string })[];
};

export const articles: Article[] = [
  {
    slug: "average-grades-arrears-and-backlogs",
    title: "Average grades, arrears and backlogs: what is actually still open to you",
    standfirst:
      "The most common question we get is asked apologetically, and it should not be. A 6.2 CGPA with three cleared backlogs closes some doors and leaves a surprising number open. Here is which, and how to stop making it worse.",
    destination: "all",
    topics: ["Admissions", "Choosing"],
    service: "Profile evaluation",
    stage: "Deciding whether to go",
    publishedOn: "2026-09-03",
    updatedOn: "2026-09-03",
    body: [
      {
        p: "Most people asking this question have already been told, by a consultant with a commission at stake, either that it is fine or that they need to pay for a foundation year. Both answers are sales positions. The real answer is more specific and more useful.",
      },
      { h: "What a backlog actually is, to a university" },
      {
        p: "A backlog is a subject you failed and later cleared. Universities that ask about them are asking two separate things: how many, and whether they are cleared. An uncleared backlog at the point of application is a different conversation entirely, because your degree is not complete.",
      },
      {
        p: "Most UK universities publish a maximum number of backlogs they will consider, and the numbers are less brutal than the internet suggests. Somewhere between five and fifteen is common. A few state no limit and read the transcript. Almost all of them mean cleared backlogs, and almost all of them will discover them anyway when the transcripts arrive.",
      },
      {
        note: "This is one of the few places where an honest count improves your outcome. A university that would have accepted eight backlogs is not the same as a university that discovers eight after issuing an offer. The second one withdraws it, and by then the deposit is usually gone.",
      },
      { h: "Where an average grade closes a door, and where it does not" },
      {
        p: "A UK taught Master's typically asks for the equivalent of an upper second class honours degree, which for Indian applicants is commonly stated as 60 to 70 per cent depending on the institution and its own recognition list for your university. Below that, the Russell Group tier closes and a substantial number of other universities do not. Ireland's published thresholds are often lower, commonly around 55 per cent.",
      },
      {
        p: "Germany is the interesting case, because a German Master's admission is decided less on the overall grade than on the arithmetic of your transcript: total credits, core subject credits, mathematics credits, and the named prerequisites in the programme's module handbook. A 6.5 CGPA with the right credit distribution can be admitted where an 8.0 without it is not. That is not reassurance, it is how the system works, and it is checkable before you pay an application fee.",
      },
      { h: "What actually helps, in order" },
      {
        list: [
          "Clear everything before you apply. An uncleared backlog is the one version of this problem that is genuinely hard.",
          "Get the language score up. It is the fastest improvement available to you, it is entirely within your control, and a 7.0 in place of a 6.0 moves you into a different tier of offers.",
          "Count your credits against a specific programme's handbook rather than guessing. On the German route this is the whole ballgame, and our ECTS check does the subtraction for free.",
          "Two years of relevant work experience shifts the answer at a real number of institutions, and several state so explicitly.",
          "Write the statement of purpose yourself and explain the arrears in one paragraph, factually, without a story. An unexplained pattern invites the reader's own explanation, which is always worse than yours.",
        ],
      },
      { h: "What does not help" },
      {
        p: "Paying someone to make the transcript look different. It is detected, it is permanent, and it is the fastest way to end your chances in every country at once rather than one. We decline that work and we end the engagement if we are asked for it.",
      },
      {
        p: "Applying to twenty universities hoping one is careless. Application fees add up, and a programme that admits you against its published threshold usually did so because something else in your file argued for it. Nine considered applications beat twenty hopeful ones.",
      },
    ],
  },

  {
    slug: "germany-is-not-free",
    title: "Germany is not free, and one federal state is the reason",
    standfirst:
      "We published \"no tuition fee\" on our own site until early September 2026. It was wrong for Baden-Wurttemberg, where non-EU students pay EUR 1,500 a semester, and the universities in that state are exactly the ones an Indian engineering applicant shortlists first.",
    destination: "germany",
    topics: ["Money", "Choosing"],
    service: "Shortlist",
    stage: "Choosing where",
    publishedOn: "2026-09-03",
    updatedOn: "2026-09-03",
    body: [
      {
        p: "The sentence everyone repeats is that German public universities charge no tuition. For fifteen of the sixteen federal states that is true. Baden-Wurttemberg has charged non-EU students EUR 1,500 per semester since the 2017/18 winter semester, which is EUR 3,000 a year and EUR 6,000 across a four semester Master's.",
      },
      {
        p: "The universities in that state include Stuttgart, Karlsruhe, Heidelberg, Freiburg, Tubingen, Konstanz and Mannheim. If you are applying for mechanical or automotive engineering from Bengaluru, at least two of those are probably on your list already.",
      },
      {
        note: "This is a correction to something we published ourselves. It is on this page rather than quietly edited out of the destination page, because a site that corrects itself silently is not obviously different from one that never noticed.",
      },
      { h: "The other two things people miss" },
      {
        p: "The semester contribution. Every student at every German public university pays one, typically EUR 100 to EUR 400 a semester. It is not a tuition fee: it funds the student union and administration, and at most universities it includes a regional public transport ticket that is worth more than the contribution.",
      },
      {
        p: "And Bavaria. TUM introduced tuition fees for non-EU students from the 2024/25 winter semester, under a state law permitting it. The amount is set per programme. We have not read every programme's fee page since the change, so our catalogue prints no figure for TUM rather than a plausible one.",
      },
      { h: "What it does not change" },
      {
        p: "EUR 6,000 across a Master's is real money and it is still, by a distance, the cheapest tuition of any destination we cover. A UK taught Master's at GBP 30,000 for one year costs roughly six times that. The point is not that Germany is expensive. The point is that a plan built on a figure of zero is a plan with a EUR 6,000 hole in it, discovered at the worst possible moment.",
      },
      {
        p: "It also does not change what we earn, which on any German public university is nothing at all. That is why our advisory fee on that route is higher than on the others, and why it is the one commission figure on this site published as confirmed.",
      },
    ],
  },

  {
    slug: "the-28-day-rule",
    title: "The UK 28 day rule, and the money mistake that refuses good applications",
    standfirst:
      "Most UK financial refusals happen to applicants who have the money. They show the maintenance figure and not the tuition balance on the CAS, or they move money during the 28 days. Both are avoidable and neither is obvious.",
    destination: "united-kingdom",
    topics: ["Money", "Visa"],
    service: "Visa file",
    stage: "After an offer",
    publishedOn: "2026-09-03",
    updatedOn: "2026-09-03",
    body: [
      {
        p: "A UK Student visa asks you to evidence two figures that stack, and it asks you to hold them still for a fixed period. Get either half wrong and the application is refused with the money sitting in the account.",
      },
      { h: "The two figures" },
      {
        p: "Maintenance is GBP 1,529 a month for a course in London and GBP 1,171 outside it, for up to nine months. That is GBP 13,761 or GBP 10,539 at the maximum.",
      },
      {
        p: "On top of that, the tuition still shown as unpaid on your CAS. If your fee is GBP 30,000 and your CAS records a GBP 5,000 deposit as paid, you evidence GBP 25,000 of tuition plus the maintenance figure. Treating maintenance as the whole requirement is the single most common financial refusal on this route.",
      },
      { h: "The 28 days" },
      {
        p: "The balance must not fall below the required total on any day of a 28 consecutive day period, and the closing balance must be dated within 31 days of the date you apply. One transfer out on day nineteen restarts the whole clock.",
      },
      {
        list: [
          "Fund the account first, in one movement, and then leave it entirely alone.",
          "Work backwards from your intended application date: 28 days of stillness, plus the CAS in hand, plus the TB certificate.",
          "If the money is a parent's, you need the birth certificate linking you and a signed letter of consent. A joint account still needs the relationship evidenced.",
          "Some account types are not accepted at all, including certain investment and pension products. Check before you move anything into one.",
        ],
      },
      { h: "The figure nobody counts" },
      {
        p: "The Immigration Health Surcharge is GBP 776 per year of the visa, paid in full during the online application. It is not part of the maintenance calculation and it is not part of the visa fee. It is a real cash outflow at the tightest moment of the plan, and a twelve month course with the standard post-course grant is charged for longer than twelve months.",
      },
      {
        note: "None of this is complicated. All of it is sequential, and the sequence is the part that catches people: the CAS waits on the deposit, the application waits on the CAS, and the 28 days have to have already happened by the time you apply.",
      },
    ],
  },

  {
    slug: "the-dmat-is-coming",
    title: "The dMAT arrives with the summer 2027 intake, and it probably applies to you",
    standfirst:
      "A new mandatory test from APS India, for Indian Bachelor's holders applying to a German Master's in engineering, commerce, business, finance or economics. EUR 150, separate from the APS fee, and one exemption turns on a date in June 2026.",
    destination: "germany",
    topics: ["Admissions", "Visa"],
    service: "Documents",
    stage: "Applying",
    publishedOn: "2026-09-03",
    updatedOn: "2026-09-03",
    body: [
      {
        p: "APS India is introducing a Digital Master Test. From the summer semester 2027 intake it is required of Indian Bachelor's degree holders applying for a Master's in Engineering, Commerce, Business, Finance or Economics. It costs EUR 150 on top of the APS fee.",
      },
      {
        p: "If you are reading this site, that description is probably you. Our stated audience is engineering and commerce graduates from Bengaluru applying for a German Master's, which is very close to a description of the population this triggers.",
      },
      { h: "What it is, and what it is not" },
      {
        p: "It is a standardised test producing a score report that universities read alongside your transcript. It is not pass or fail, and there is no threshold below which you are excluded. It is a comparability instrument: German admissions offices assess applicants from dozens of grading systems, and this gives them one common number.",
      },
      {
        p: "It does not replace APS. You still need the APS certificate, and the dMAT sits alongside it as a second fee and a second scheduling problem.",
      },
      { h: "The exemptions, including the one with a date on it" },
      {
        list: [
          "You already hold a Master's degree.",
          "You are applying to a subject outside the listed groups.",
          "Your Bachelor's is from outside India.",
          "You are applying for a Bachelor's rather than a Master's.",
          "You registered with, or submitted documents to, APS India before 29 June 2026. This is the transitional exemption and it is the one worth knowing your position on.",
        ],
      },
      {
        note: "If your timeline is anywhere near that June 2026 date, establish which side of it you fall on before you plan around it. Starting APS earlier has always been good advice on this route. It now has a specific, dated consequence attached to it.",
      },
      { h: "What to do about it" },
      {
        p: "Budget EUR 150 and a test cycle into the timeline. Then go back to the thing that actually decides German Master's admission, which is the credit arithmetic on your transcript: total, core subject, mathematics, and the named prerequisites in the programme's module handbook. The dMAT is a new hoop. The credits are still the gate.",
      },
    ],
  },

  {
    slug: "ireland-pays-before-the-visa",
    title: "Ireland asks for the money before the visa, which changes the whole plan",
    standfirst:
      "EUR 6,000 of tuition paid and receipted, EUR 10,000 evidenced across six months of statements, and a medical policy at a stated cover level. All three before you apply, and the tuition is cash out rather than a balance to display.",
    destination: "ireland",
    topics: ["Money", "Visa"],
    service: "Finance",
    stage: "After an offer",
    publishedOn: "2026-09-03",
    updatedOn: "2026-09-03",
    body: [
      {
        p: "Every destination asks you to evidence money. Ireland is the one that asks you to spend it first, and that difference reorders the whole timeline.",
      },
      { h: "The three requirements" },
      {
        list: [
          "EUR 10,000 available for the first year, evidenced across six consecutive monthly statements. The history is read, not just the closing balance.",
          "EUR 6,000 of tuition paid to the institution and receipted before you apply, or the full fee where it is lower. This is a transfer, not a display.",
          "Private medical insurance covering at least EUR 25,000 for accident and EUR 25,000 for disease, in force from your arrival. Irish public healthcare is charged, which is why this is a visa requirement rather than an optional extra.",
        ],
      },
      { h: "The question to ask before you transfer" },
      {
        p: "Get the institution's refund position for a visa refusal in writing, before the money moves. A generous policy and a silent one look identical until you need one, and by then you have paid.",
      },
      { h: "The six months are read as a history" },
      {
        p: "A lump sum that appears three weeks before the application needs an explained and evidenced source. Without one it is the most commonly cited financial refusal ground on this route, and it is cited against applicants whose money is entirely legitimate. Family funds are fine; undocumented family funds arriving late are not.",
      },
      { h: "And the correction we owe you" },
      {
        p: "We previously published Ireland's post-study window as a flat 24 months. It is not. A Level 9 or higher graduate gets 12 months of Stamp 1G, renewable once for a further 12, so 24 at most rather than 24 up front. A Level 8 honours bachelor graduate gets 12 months with no renewal at all.",
      },
      {
        note: "If you are comparing a Level 8 and a Level 9 offer, that is a twelve month difference in your post-study permission and it belongs in the comparison next to the fee. The NFQ level of the programme is a fact you can ask the admissions office for in one email.",
      },
    ],
  },

  {
    slug: "what-a-consultant-cannot-do",
    title: "What a consultant cannot do for you, and why some of them say otherwise",
    standfirst:
      "Nobody can expedite APS, obtain a visa appointment that is not publicly available, influence an admission decision or guarantee a visa. An offer to do any of those is either a lie about the offer or a plan to falsify something.",
    destination: "all",
    topics: ["Choosing", "Admissions"],
    service: "Consultation",
    stage: "Deciding whether to go",
    publishedOn: "2026-09-03",
    updatedOn: "2026-09-03",
    body: [
      {
        p: "This industry's worst practices are not exotic. They are a small number of specific claims, repeated confidently, that a student has no easy way to check. Here they are, with what is actually true.",
      },
      { h: "\"We can guarantee admission\"" },
      {
        p: "Nobody can. Admission is decided by the university against criteria it publishes, and no agent has a channel into that decision. What an agent can do is submit an application to a university with low enough standards that the outcome is close to certain, and describe that as a guarantee. That is a different thing and it is worth knowing which one is on offer.",
      },
      { h: "\"We can get you a visa appointment\"" },
      {
        p: "Appointment slots at the German missions in India are published and booked through the mission's own system. Nobody has privileged access to them. This claim is worth challenging directly, because the honest answer to \"how?\" is usually silence.",
      },
      { h: "\"We can expedite your APS\"" },
      {
        p: "APS India processes applications in its own time. An agent cannot shorten it. What genuinely shortens it is submitting a complete file with consistent names across every document and every semester transcript included, which is free advice and is on our Germany guide.",
      },
      { h: "\"Our university partnerships mean better outcomes\"" },
      {
        p: "A partnership means the university pays that agent a commission. It does not mean your application is read differently. It does mean the shortlist you are given may be scoped to institutions that pay, which is the specific problem this business exists to correct: we publish what we earn on every university we recommend, including the ones that pay us nothing.",
      },
      { h: "What a good consultant actually does" },
      {
        list: [
          "Tells you not to go, when that is the honest answer, and does it before taking a fee for anything else.",
          "Knows the sequence: which step blocks which, and where a two week delay costs an intake.",
          "Reads your transcript against a specific programme's requirements rather than against a country.",
          "Verifies documents against originals and refuses, in writing, to alter one.",
          "Publishes what it earns, so you can weigh the advice knowing what is behind it.",
        ],
      },
      {
        note: "You can check most of that before paying anyone. Ask what they earn on the universities they are about to recommend. The answer, and how readily it arrives, tells you most of what you need to know.",
      },
    ],
  },
];

/** Read time, computed from the body so it cannot drift from the article. */
export function readMinutes(article: Article): number {
  const words = article.body.reduce((total, block) => {
    const text =
      "p" in block ? block.p : "h" in block ? block.h : "note" in block ? block.note : block.list.join(" ");
    return total + text.split(/\s+/).length;
  }, article.standfirst.split(/\s+/).length);
  return Math.max(1, Math.round(words / 220));
}

export function articleFor(slug: string): Article | null {
  return articles.find((article) => article.slug === slug) ?? null;
}

/** The four axes, each with its values and a count, for the filter rail. */
export function taxonomy() {
  const count = <T,>(pick: (article: Article) => T[]): { value: T; count: number }[] => {
    const map = new Map<T, number>();
    for (const article of articles) {
      for (const value of pick(article)) map.set(value, (map.get(value) ?? 0) + 1);
    }
    return [...map.entries()].map(([value, n]) => ({ value, count: n }));
  };

  return {
    destination: count((article) => [article.destination]),
    topic: count((article) => article.topics),
    service: count((article) => [article.service]),
    stage: count((article) => [article.stage]),
  };
}

export const destinationLabel: Record<Destination, string> = {
  germany: "Germany",
  "united-kingdom": "United Kingdom",
  ireland: "Ireland",
  all: "All destinations",
};
