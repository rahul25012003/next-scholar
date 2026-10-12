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
    title: "Average grades, arrears and backlogs: what is still open to you",
    standfirst:
      "We get this question more than any other, usually with an apology. No apology is needed. A 6.2 CGPA with three cleared backlogs closes some doors and leaves more open than you might expect. Here is which, and how to avoid making it worse.",
    destination: "all",
    topics: ["Admissions", "Choosing"],
    service: "Profile evaluation",
    stage: "Deciding whether to go",
    publishedOn: "2026-09-03",
    updatedOn: "2026-09-03",
    body: [
      {
        p: "Most people who ask have already heard one of two answers from a consultant with a commission at stake: that it is fine, or that they need to pay for a foundation year. Both are sales pitches. The real answer is more specific and more useful.",
      },
      { h: "What a backlog means to a university" },
      {
        p: "A backlog is a subject you failed and later cleared. Universities that ask about backlogs want to know two things:",
      },
      {
        list: [
          "How many you have.",
          "Whether they are cleared. An uncleared backlog when you apply is a different matter, because your degree is not yet complete.",
        ],
      },
      {
        p: "Most UK universities publish the maximum number of backlogs they will consider, and the limits are less harsh than the internet suggests.",
      },
      {
        list: [
          "A limit somewhere between five and fifteen is common.",
          "A few set no limit and read the transcript instead.",
          "Almost all of them mean cleared backlogs.",
          "Almost all of them will find your backlogs anyway when your transcripts arrive.",
        ],
      },
      {
        note: "Here an honest count helps you. Eight backlogs declared up front can be accepted, but eight discovered after an offer get it withdrawn, and by then your deposit is usually gone.",
      },
      { h: "Where an average grade closes a door, and where it does not" },
      {
        list: [
          "UK: a taught Master's usually asks for the equivalent of an upper second class honours degree. For Indian applicants this is commonly stated as 60 to 70 per cent, depending on the university and where your university sits on its own recognition list.",
          "Below that, Russell Group universities close, but a large number of other UK universities do not.",
          "Ireland: published thresholds are often lower, commonly around 55 per cent.",
        ],
      },
      {
        p: "Germany works differently. Admission to a German Master's depends less on your overall grade than on the credits in your transcript:",
      },
      {
        list: [
          "Total credits.",
          "Core subject credits.",
          "Mathematics credits.",
          "The named prerequisites in the programme's module handbook.",
        ],
      },
      {
        p: "So a 6.5 CGPA with the right credits can be admitted where an 8.0 without them is not. That is not reassurance, just how the system works, and you can check it before you pay an application fee.",
      },
      { h: "What helps, in order" },
      {
        list: [
          "Clear every backlog before you apply. An uncleared backlog is the one version of this problem that is genuinely hard.",
          "Raise your language score. It is the fastest improvement you can make, it is fully in your control, and a 7.0 instead of a 6.0 moves you into a different tier of offers.",
          "Count your credits against one programme's handbook instead of guessing. For Germany this is what decides it, and our ECTS check does the maths for free.",
          "Two years of relevant work experience changes the answer at a fair number of universities, and several say so openly.",
          "Write the statement of purpose yourself. Explain the arrears in one factual paragraph, with no story. If you leave a pattern unexplained, the reader will supply their own reason, and it will be worse than yours.",
        ],
      },
      { h: "What does not help" },
      { p: "Paying someone to change your transcript." },
      {
        list: [
          "It gets detected.",
          "It is permanent.",
          "It ends your chances in every country at once, not just one.",
          "We refuse this work, and we end the engagement if we are asked for it.",
        ],
      },
      { p: "Applying to twenty universities and hoping one is careless." },
      {
        list: [
          "Application fees add up.",
          "A programme that admits you below its published threshold usually does so because something else in your file argued for it.",
          "Nine well-chosen applications beat twenty hopeful ones.",
        ],
      },
    ],
  },

  {
    slug: "germany-is-not-free",
    title: "Germany is not quite free: two exceptions, and one fee everyone pays",
    standfirst:
      "Our own site said \"no tuition fee\" until early September 2026. That was wrong for Baden-Wurttemberg, where non-EU students pay EUR 1,500 a semester, and that state's universities are the ones an Indian engineering applicant shortlists first.",
    destination: "germany",
    topics: ["Money", "Choosing"],
    service: "Shortlist",
    stage: "Choosing where",
    publishedOn: "2026-09-03",
    updatedOn: "2026-09-03",
    body: [
      {
        p: "Everyone says German public universities charge no tuition. That is true across most of the country, with two exceptions.",
      },
      {
        p: "Baden-Wurttemberg is the exception. Since the 2017/18 winter semester it has charged non-EU students:",
      },
      {
        list: [
          "EUR 1,500 per semester.",
          "EUR 3,000 a year.",
          "EUR 6,000 across a four semester Master's.",
        ],
      },
      {
        p: "Universities in that state include Stuttgart, Karlsruhe, Heidelberg, Freiburg, Tubingen, Konstanz and Mannheim. If you are applying for mechanical or automotive engineering from Bengaluru, at least two of them are probably on your list already.",
      },
      {
        note: "This corrects something we published ourselves. We say so here, rather than quietly editing the destination page, because a site that corrects itself silently looks no different from one that never noticed.",
      },
      { h: "The other two things people miss" },
      {
        p: "First, the semester contribution, which every student at every German public university pays:",
      },
      {
        list: [
          "It is typically EUR 100 to EUR 400 a semester.",
          "It is not a tuition fee. It funds the student union and administration.",
          "At most universities it includes a regional public transport ticket worth more than the contribution.",
        ],
      },
      { p: "Second, Bavaria:" },
      {
        list: [
          "TUM introduced tuition fees for non-EU students from the 2024/25 winter semester, under a state law that allows it.",
          "The amount is set per programme.",
          "We have not read every programme's fee page since the change, so our catalogue shows no figure for TUM rather than a guess.",
        ],
      },
      { h: "What it does not change" },
      {
        list: [
          "EUR 6,000 across a Master's is real money, but it is still by far the cheapest tuition of any destination we cover.",
          "A UK taught Master's at GBP 30,000 for one year costs roughly six times that.",
        ],
      },
      {
        p: "The point is not that Germany is expensive. It is that a plan built on zero tuition has a EUR 6,000 hole in it, and you find it at the worst possible moment.",
      },
    ],
  },

  {
    slug: "the-28-day-rule",
    title: "The UK 28 day rule, and the money mistake that gets good applications refused",
    standfirst:
      "Most UK visa refusals over money happen to applicants who have the money. They show the maintenance figure but not the tuition balance on their CAS, or they move money during the 28 days. Both mistakes are avoidable, and neither is obvious.",
    destination: "united-kingdom",
    topics: ["Money", "Visa"],
    service: "Visa file",
    stage: "After an offer",
    publishedOn: "2026-09-03",
    updatedOn: "2026-09-03",
    body: [
      {
        p: "A UK Student visa asks you to show two amounts added together, and to keep them untouched for a fixed period. Get either part wrong and you are refused, even with the money in your account.",
      },
      { h: "The two figures" },
      {
        list: [
          "Maintenance (living costs): GBP 1,529 a month for a course in London, or GBP 1,171 outside London, for up to nine months. At the maximum that is GBP 13,761 or GBP 10,539.",
          "Plus the tuition your CAS still shows as unpaid. If your fee is GBP 30,000 and your CAS records a GBP 5,000 deposit as paid, you show GBP 25,000 of tuition on top of maintenance.",
        ],
      },
      {
        p: "Treating maintenance as the whole requirement is the single most common financial refusal on this route.",
      },
      { h: "The 28 days" },
      {
        list: [
          "Your balance must not fall below the required total on any day of a 28 consecutive day period.",
          "The closing balance must be dated within 31 days of the date you apply.",
          "One transfer out on day nineteen restarts the whole clock.",
        ],
      },
      { h: "How to plan for it" },
      {
        list: [
          "Put the money in first, in one transfer, then leave the account alone.",
          "Plan backwards from the date you want to apply: 28 untouched days, your CAS in hand, and your TB certificate.",
          "If the money is a parent's, you need the birth certificate that links you and a signed letter of consent. A joint account still needs the relationship proved.",
          "Some account types are not accepted at all, including certain investment and pension products. Check before you move money into one.",
        ],
      },
      { h: "The figure nobody counts" },
      {
        p: "The Immigration Health Surcharge is GBP 776 per year of the visa.",
      },
      {
        list: [
          "You pay it in full during the online application.",
          "It is not part of the maintenance figure, and it is not part of the visa fee.",
          "It is real cash going out at the tightest point of the plan.",
          "A twelve month course is charged for more than twelve months, because the standard visa grant runs past the end of the course.",
        ],
      },
      {
        note: "None of this is complicated, but the order catches people out: the CAS waits on the deposit, the application waits on the CAS, and the 28 days must already be complete when you apply.",
      },
    ],
  },

  {
    slug: "the-dmat-is-coming",
    title: "The dMAT arrives with the summer 2027 intake, and it probably applies to you",
    standfirst:
      "A new required test from APS India for Indian Bachelor's holders applying for a German Master's in engineering, commerce, business, finance or economics. It costs EUR 150 on top of the APS fee, and one exemption depends on a date in June 2026.",
    destination: "germany",
    topics: ["Admissions", "Visa"],
    service: "Documents",
    stage: "Applying",
    publishedOn: "2026-09-03",
    updatedOn: "2026-09-03",
    body: [
      { p: "APS India is introducing a Digital Master Test (dMAT)." },
      {
        list: [
          "It starts with the summer semester 2027 intake.",
          "It is required of Indian Bachelor's degree holders applying for a Master's in Engineering, Commerce, Business, Finance or Economics.",
          "It costs EUR 150, on top of the APS fee.",
        ],
      },
      {
        p: "If you are reading this site, that probably describes you. This site is written for engineering and commerce graduates from Bengaluru applying for a German Master's, which is very close to the group this test covers.",
      },
      { h: "What it is, and what it is not" },
      {
        list: [
          "It is a standardised test. You get a score report, which universities read alongside your transcript.",
          "It is not pass or fail. There is no cut-off score that rules you out.",
          "Its purpose is comparison. German admissions offices assess applicants from dozens of grading systems, and this gives them one common number.",
          "It does not replace APS. You still need the APS certificate, and the dMAT adds a second fee and a second test to schedule.",
        ],
      },
      { h: "Who is exempt" },
      { p: "You do not need the dMAT if:" },
      {
        list: [
          "You already hold a Master's degree.",
          "You are applying to a subject outside the listed groups.",
          "Your Bachelor's is from outside India.",
          "You registered with, or submitted documents to, APS India before 29 June 2026. This is the transitional exemption, and the one worth checking your position on.",
        ],
      },
      {
        note: "If your timeline is anywhere near 29 June 2026, find out which side of that date you fall on before you plan around it. Starting APS early was always good advice on this route, and now it has a specific, dated consequence.",
      },
      { h: "What to do about it" },
      {
        list: [
          "Add EUR 150 and one test cycle to your budget and timeline.",
          "Then go back to what really decides German Master's admission: the credits on your transcript. That means total credits, core subject credits, mathematics credits, and the named prerequisites in the programme's module handbook.",
        ],
      },
      { p: "The dMAT is a new hoop. The credits are still the gate." },
    ],
  },

  {
    slug: "ireland-pays-before-the-visa",
    title: "Ireland asks for the money before the visa, which changes the whole plan",
    standfirst:
      "Before you apply, you need EUR 6,000 of tuition paid with a receipt, EUR 10,000 shown across six months of statements, and medical insurance at a set level of cover. The tuition must actually be paid, not just shown in your account.",
    destination: "ireland",
    topics: ["Money", "Visa"],
    service: "Finance",
    stage: "After an offer",
    publishedOn: "2026-09-03",
    updatedOn: "2026-09-03",
    body: [
      {
        p: "Every destination asks you to prove you have money. Ireland is the one that asks you to spend it first, and that changes the order of the whole timeline.",
      },
      { h: "The three requirements" },
      {
        list: [
          "EUR 10,000 available for the first year, shown across six consecutive monthly statements. The history is read, not just the closing balance.",
          "EUR 6,000 of tuition, or the full fee if it is lower, paid to the institution with a receipt before you apply. This money must be sent, not just shown.",
          "Private medical insurance covering at least EUR 25,000 for accident and EUR 25,000 for disease, valid from your arrival. You pay for Irish public healthcare, which is why this is a visa requirement and not an optional extra.",
        ],
      },
      { h: "The question to ask before you transfer" },
      {
        p: "Before the money moves, get the institution's refund policy for a visa refusal in writing. A generous policy and one that says nothing look the same until you need it, and by then you have paid.",
      },
      { h: "The six months are read as a history" },
      {
        p: "A lump sum that appears three weeks before you apply needs a source you can explain and prove.",
      },
      {
        list: [
          "Without that, it is the most commonly cited financial reason for refusal on this route.",
          "It is cited against applicants whose money is entirely legitimate.",
          "Family money is fine. Family money that arrives late with no documents is not.",
        ],
      },
      { h: "A correction we owe you" },
      {
        p: "We previously published Ireland's post-study period as a flat 24 months. That was wrong.",
      },
      {
        list: [
          "Level 9 or higher graduates get 12 months of Stamp 1G, renewable once for a further 12. That is 24 months at most, not 24 up front.",
          "Level 8 honours bachelor graduates get 12 months, with no renewal at all.",
        ],
      },
      {
        note: "Check the NFQ level of each programme you are comparing: Level 8 and Level 9 differ by twelve months of post-study permission, and that belongs next to the fee. You can ask the admissions office for the level in one email.",
      },
    ],
  },

  {
    slug: "what-a-consultant-cannot-do",
    title: "What a consultant cannot do for you, and why some say they can",
    standfirst:
      "Nobody can speed up APS, get a visa appointment that is not open to the public, influence an admission decision or guarantee a visa. Anyone offering one of these is either lying about it or planning to falsify something.",
    destination: "all",
    topics: ["Choosing", "Admissions"],
    service: "Consultation",
    stage: "Deciding whether to go",
    publishedOn: "2026-09-03",
    updatedOn: "2026-09-03",
    body: [
      {
        p: "The worst practices in this industry are not elaborate. They are a few specific claims, made confidently, that a student has no easy way to check. Here they are, with what is actually true.",
      },
      { h: "\"We can guarantee admission\"" },
      {
        p: "Nobody can. The university decides, against criteria it publishes, and no agent has a way into that decision.",
      },
      {
        p: "What an agent can do is apply to a university with standards low enough that an offer is almost certain, and call that a guarantee. That is a different thing, and it is worth knowing which one you are being offered.",
      },
      { h: "\"We can get you a visa appointment\"" },
      {
        p: "Appointment slots at the German missions in India are published and booked through the mission's own system. Nobody has special access to them.",
      },
      {
        p: "If someone makes this claim, ask them how. The honest answer is usually silence.",
      },
      { h: "\"We can speed up your APS\"" },
      {
        p: "APS India works through applications at its own pace, and no agent can shorten that. What does help is a complete file:",
      },
      {
        list: [
          "The same name, spelt the same way, on every document.",
          "Every semester transcript included.",
        ],
      },
      { p: "That advice is free, and it is in our Germany guide." },
      { h: "\"Our university partnerships mean better outcomes\"" },
      { p: "A partnership means the university pays that agent a commission." },
      {
        list: [
          "It does not mean your application is read differently.",
          "It does mean the shortlist you are given may be limited to universities that pay.",
          "That is the problem this business exists to fix: we publish what we earn on every university we recommend, including the ones that pay us nothing.",
        ],
      },
      { h: "What a good consultant does" },
      {
        list: [
          "Tells you not to go when that is the honest answer, and does so before charging you for anything else.",
          "Knows the order of steps: which one holds up which, and where a two week delay costs you an intake.",
          "Checks your transcript against one programme's requirements, not a whole country's.",
          "Checks documents against the originals, and refuses, in writing, to alter any.",
        ],
      },
      {
        note: "You can check most of this before you pay anyone. Ask what they earn on the universities they are about to recommend: the answer, and how readily it comes, tells you most of what you need to know.",
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
