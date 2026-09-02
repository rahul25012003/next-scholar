# Feature detail specification

Field-level and interaction-level specification drawn from all three reference
sites, with our current state against each. This is the build sheet: the
backlog says what to do, this says what it contains and how it behaves.

Sources: idp.com (~25 pages), leapscholar.com and related domains (31 pages),
nxtstep-de.com (read from the shipped JS bundle, so exhaustive rather than
sampled). Date 2026-09-03.

---

## 1. German grade calculator

nxtstep-de ships a correct one. This is the complete specification, including
what to do better.

### 1.1 Their implementation

| Element | Detail |
|---|---|
| Inputs | Degree (free text, e.g. "B.Tech Computer Science"); University (free text, e.g. "Anna University"); Your CGPA or Percentage; Maximum Grade; Passing Grade |
| Formula | `german = 1 + 3 x ((max - obtained) / (max - pass))`, clamped to 1.0 to 4.0. The Modified Bavarian Formula, correctly implemented |
| Validation | Rejects non-numeric input; rejects `max <= pass` with "Maximum grade must be greater than the passing grade."; rejects out-of-range obtained values |
| Output | Grade to two decimals, plus a band |
| Bands | <= 1.5 Very Good (Sehr gut); <= 2.5 Good (Gut); <= 3.5 Satisfactory (Befriedigend); <= 4.0 Sufficient (Ausreichend); otherwise "Below passing threshold" |
| Disclaimer | "This calculator provides an estimate. Final evaluation depends on the respective German university or Uni-Assist." |
| Persistence | Client side only, nothing submitted or stored |

### 1.2 What ours should add

| # | Addition | Why |
|---|---|---|
| C1 | **Show the arithmetic**, not just the answer. Print the substituted formula with the student's own numbers | Our whole position is that a number is checkable. A calculator that shows its working is that position in miniature |
| C2 | **Name the source** of the formula and the band thresholds, with a verification date | Same discipline as every other figure we publish |
| C3 | **Keep it ungated.** No signup to see the result | LeapScholar withholds its cost calculator result behind a signup wall. Not doing that is a stated differentiator |
| C4 | Preset scales: 10-point CGPA, 4-point GPA, percentage, with the max and pass prefilled per scale | Removes the commonest input error |
| C5 | Common Indian defaults: max 10 / pass 4, max 100 / pass 40, max 4 / pass 2 | Our audience is Indian graduates |
| C6 | **State the limits plainly**: universities may apply their own conversion, some use a different formula, and uni-assist is the deciding authority | An estimate presented as a verdict is the failure mode |
| C7 | Copy-to-clipboard of the working, so a student can paste it into an application | Practical |
| C8 | Link the result to the requirements checklist, e.g. what a 2.3 opens and closes | Turns a number into a decision |

### 1.3 Related calculators to ship alongside

From LeapScholar, all open and unauthenticated: CGPA to percentage
(percentage = CGPA x 9.5), CGPA to marks, CGPA to GPA on a 4-point scale,
percentage to GPA on 4.0 / 5.0 / 10.0 scales, percentage to marks, SGPA to CGPA
across 1 to 12 semesters, and a GPA calculator. Plus an **IELTS band
calculator**: four section scores, averaged with equal weight, rounded to the
nearest half or whole band, with a 0 to 9 descriptor table.

---

## 2. Country-based university lists

Neither our site nor nxtstep-de names a single university. Both IDP and
LeapScholar do, and LeapScholar's per-institution data is the deeper of the two.

### 2.1 University list, card fields

| Field | IDP | LeapScholar | Ours to build |
|---|---|---|---|
| Institution name | Yes | Yes | Yes |
| Logo / crest | Yes | Yes | Yes |
| Country flag | Yes | Yes | Yes |
| Ranking | **Not on the card** | Yes | Yes, with the ranking body named |
| International student count | Sometimes | Yes | Where verified |
| Course count | No | Yes | Yes |
| Badge vocabulary | "English Courses available", "Instant Offer in Principle", "Scholarship", "Internship" | Intake open or closed | **"We earn nothing here" / commission band / verification status** |
| CTAs | "View all courses", "View details" | Similar | Same, plus "What we earn here" |

**List controls.** IDP: 1,380 institutions, 115 pages, filters for destination
and subject area, sort by Popularity (default, undefined), THE ranking, name
A to Z and Z to A. Our sort must never be an undefined "popularity"; every sort
option states what it orders by.

### 2.2 University profile, section by section

IDP's order: Overview, Study Options, Entry Requirements including accepted
English tests, Scholarships with deadlines and award types, Graduate Outcomes,
Accommodation, What's New as a live news feed, Upcoming Events, photo gallery.
Header carries THE rank, international student count, QS employability rank.

LeapScholar's is tabbed (Overview / Admissions / Rankings / Courses and Fees)
and carries more structured data:

| Block | Fields |
|---|---|
| Highlights | Established in; total students; total international students; student to faculty ratio; **acceptance rate**; accreditation; average study cost; average cost of living |
| Top courses | Carousel, first year tuition and duration per course, "See all courses" |
| Intakes | Named intakes with an **open or closed status flag** |
| Exam minimums | **Split undergraduate versus postgraduate**, across IELTS, TOEFL, Duolingo, PTE, GMAT, GRE, including "Not Required" as an explicit value |
| Rankings | **Four bodies across four years**: US News, QS, Webometrics, THE |
| Cost of living | Total, broken into housing, books, transport, personal, miscellaneous |
| Placements | Named recruiters |
| Student life | Club and research centre counts |
| Alumni | Notable names |
| FAQs | Per institution |

**Our additions**, none of which either has: commission and its verification
status per institution; whether the institution pays us nothing; a "last
verified" date on every figure; and a link from any figure to its source.

**Warning taken from LeapScholar.** Their Lehigh page shows "Avg. Study Cost
INR 0.50 L" in the highlights while the detail sections say 55.38 L, and shows
2025 intakes in September 2026. A catalogue is exactly where unsourced and
stale numbers enter. Every imported field needs a source and a date or it does
not ship.

### 2.3 Course list and course detail

Course card, from IDP: logo, course title, institution, location with flag,
study level, **annual fee marked "(Indicative)"**, duration, "Next intake:
Month Year" with an expandable list of further intake dates and campuses,
optional badges, two CTAs.

Course detail: name, institution, campus, qualification type, duration, tuition
with the year it applies to, next intake, English entry score, full description,
entry requirements stated specifically, English requirements, **a full intake
table with campus per intake**, rankings, recommended related courses.

Ours adds the commission row and a verification date. And where IDP renders
"The application deadline isn't available", ours states the absence with a
reason rather than a shrug.

### 2.4 Search and filter behaviour

IDP's filter set: course subject (searchable), study level (10 values), study
destination, institution (searchable), budget (dual slider), study mode (5
values), duration (3 bands), IELTS score (range slider). Left rail, explicit
Apply and Reset and Reset all. **Filters are not live.**

Two of their behaviours to avoid: changing the subject **resets the entire
search and all filters**, warned about in the UI but still hostile; and the
unfiltered budget slider maxes at USD 146,167,920, which is a data bug shipped
to production.

---

## 3. Country page, complete section list

Merging IDP's fifteen-section template and LeapScholar's fourteen. Our current
destination card covers roughly two of these.

| # | Section | IDP | Leap | Ours today |
|---|---|---|---|---|
| 1 | Hero with headline stats | Yes | Yes | Partial |
| 2 | Sub-page links: cost of studying, cost of living, scholarships, jobs, post-study work | No | **Yes** | No |
| 3 | Why study here | Yes | Yes | No |
| 4 | Education system explained | No | Yes | No |
| 5 | Top courses | Yes | Yes | No |
| 6 | **Top universities table with ranking** | Yes, 37 rows | Yes | No |
| 7 | **Intakes table with duration and deadlines** | Yes | Yes | Month names only |
| 8 | **Cost of studying by programme tier** | Yes | Yes | One band |
| 9 | **Cost of living, line-itemised** | Yes, 9 lines | Yes, 5 lines | No |
| 10 | Currency shown in local **and INR** | No | **Yes** | No |
| 11 | **Scholarships table** | Yes, 50 rows for Australia | Yes | No |
| 12 | **Visa requirements table**, with fee components | Yes | Yes, itemised | No |
| 13 | **Proof of funds as a figure** | Yes | Yes | No |
| 14 | **Work rights, concretely** | Yes | Yes | No |
| 15 | Post-study work, with duration and conditions | Yes | Yes | One line |
| 16 | Salary or ROI data | Some | Yes | No |
| 17 | Top student cities with rank | Yes | Yes | No |
| 18 | FAQ accordion | Yes | Yes | No |
| 19 | Related articles | Yes | Yes | No |
| 20 | Embedded upcoming events | Yes | No | No |
| 21 | **Commission and our fee for this route** | No | No | **Yes, and unique to us** |

---

## 4. Everything else, by site

### 4.1 IDP, remaining features not yet in the backlog

| Feature | Detail |
|---|---|
| Rankings explorer | THE: 354 universities, searchable by name, filterable by destination. Their QS page by contrast is static editorial with 12 rows |
| Related searches blocks | Subject x level x country permutations at the foot of every results page. Pure SEO surface |
| Blog taxonomy | Four filter axes: destination, topic (8 values), student essential service (6 values), journey stage. Plus read time and **both published and updated dates** |
| City and office pages | About 70 of them. Address, phone, email, opening hours, a named representative, service list, neighbourhoods served |
| Events | Card carries title, date range with time, city, **mode: physical, virtual or hybrid**, destination flags, study-level icons. Registration form takes name, email, area code from 240+ codes, mobile, nearest office from 70+, "How did you hear about us" from 10 options, and **three mandatory consent checkboxes** |
| Event filters | Only subject area and sort. With 157 events this is a weakness to beat, not copy |
| Cost calculator | Multi-step wizard: country, then city, then accommodation type (own apartment or share house), then location (city centre or suburbs), then housing, food, daily life, clothing |
| Important links strip | Six tools presented as equal peers on the homepage: course subjects, scholarships, eligibility checker, application support, app, cost calculator |
| Hero quick-entry chips | Five: Courses, Scholarships, Universities, Events, Guide me. The real IA shortcut past a large nav |
| Stat band | Four numbers under the hero, one of which is the word "FREE" used as a statistic |
| Student ambassadors | Named, photographed peers with field of study and a "Chat with me" CTA. Peer proof rather than staff proof |
| Personalisation interstitial | Inline mid-page: sign in to save preferences, or talk to a counsellor |
| Journey modelled three ways | A 6-stage nav spine, an 8-step operational guide, and 6 homepage service cards. Notable that they did not settle on one |
| Country switcher | About 35 country sites |

### 4.2 LeapScholar, remaining features not yet in the backlog

| Feature | Detail |
|---|---|
| Reviews page | **404 verified reviews**, paginated, filterable by country and category, sortable. Card: initials avatar, name, course and university, country flag, category tag, star rating, month and year, excerpt, "Read more". Plus embedded video stories |
| Counsellor cards | Named, with students counselled and years of experience |
| Newsroom | A separate product with three streams: student reviews, expert insights, trending news |
| Events | **Live registration counters** on cards. Named past speakers with affiliations |
| IELTS free mock | Full length, **explicitly no account needed**, instant band estimate for listening and reading, AI evaluation |
| IELTS micro-tests | 5 to 10 minute section tests: reading 8 questions in 5 minutes, cue card speaking 2 minutes, writing task 10 minutes |
| Paid course | INR 99, reduced from 399, with 100+ video lessons, 50+ mocks, trainer feedback in 0 to 2 days, three months access |
| Inline widgets on university pages | Check eligibility, chat with an expert, shortlist the best course, get IELTS mock tests, know your admission chances, plan your budget, internships |
| Progressive form | Visual country cards with flags first, low-commitment taps before any personal data, contact fields last |
| Sticky "Talk to a counsellor" | Persistent |
| Centre locator | City list, unusual for an edtech and deliberately countering "just another online consultant" |
| Refund policy | 30 day claim window, 7 day processing, explicit refundable and non-refundable lists, invalid refunds converted to credit |
| SOP resource | Downloadable PDF with two annotated samples and a six-section fillable outline. Notably **warns against using AI to generate the narrative** |
| Money proof points | INR 1,000 Cr+ disbursed, USD 200M raised, investors and media named |

### 4.3 nxtstep-de, remaining features not yet in the backlog

| Feature | Detail |
|---|---|
| Service presentation | 13 services as a flat array of icon cards, title plus one-line description, rendered identically on home and services. Only 2 of 13 deep-link anywhere |
| Process timeline | A 10-step strip: profile evaluation, university selection, grade evaluation, APS and dMAT, SOP/LOM/LOR, application, admission letter, visa, loan, fly |
| APS page | 6-step process, a separate 7-step checklist, **8 required documents**, **6 common mistakes** |
| dMAT page | Who must sit it, four exemption categories, two-module structure, format, fee, validity, scoring interpretation, **9 preparation tips** |
| Loan guidance | 5-step process, **4 lender categories** (public sector banks, private banks, NBFCs, international platforms), 5 borrowing tips, and an explicit "we are not a lender" disclaimer |
| Public vs private pages | Two dedicated pages, 5 advantages each, given equal nav weight |
| FAQ | Six, homepage accordion, including a flat "No" to "Do you guarantee admission or visa approval?" |
| Trust badge marquee | Six badges, auto-scrolling: Germany specialists, APS and dMAT guidance, public admissions, private admissions, transparent process, visa support |
| Values | Transparency, Specialisation, Realistic Matching, **No False Promises** |
| Reassurance section | "Average Grades? Arrears? Don't Give Up.", with the qualifier "We do not guarantee admission" |
| Legal | Five policies, all dated, including an explicit non-affiliation disclaimer naming APS India, DAAD and uni-assist |

---

## 5. UX, animation and design

### 5.1 Their patterns, and our verdict

| Pattern | Where | Verdict |
|---|---|---|
| Card hover lift: translate up 1 to 4px plus shadow and border tint | nxtstep-de, IDP | **Adopt.** We already lift destination cards; make it consistent everywhere |
| Staggered reveal on card grids, delay `index % 3 * 0.05` | nxtstep-de | **Adopt.** Ours staggers at 0.06 already; keep, and cap the stagger so long lists do not crawl |
| Auto-scrolling trust marquee | nxtstep-de | **Adopt cautiously**, once there is something true to put in it |
| Sticky nav condensing after 20px of scroll | nxtstep-de | **Adopt.** Ours is sticky but does not condense |
| Scroll to top on route change | nxtstep-de | **Adopt.** Ours relies on default behaviour |
| Themed 404 | nxtstep-de | Already done |
| Floating WhatsApp with a pre-filled message | all three | **Adopt** |
| Gold or accent eyebrow above the H1 | nxtstep-de | **Reject.** Eyebrow discipline is deliberate here |
| Second half of the H1 in an accent colour | nxtstep-de, IDP | Already done |
| Two hero CTAs, one solid and one glass outline | nxtstep-de | Already done |
| Emoji as a systematic tone device | LeapScholar | **Reject.** Wrong register |
| Repeating one CTA 2 to 5 times per page | IDP | **Reject** |
| Signup wall on a calculator result | LeapScholar | **Reject, and invert deliberately** |
| Filters that reset everything when one changes | IDP | **Reject.** Hostile, and they warn about it rather than fixing it |
| Live registration counters | LeapScholar | Adopt only when real |
| Tabbed university profile | LeapScholar | **Adopt** for the profile page |
| Table-of-contents jump list on long pages | IDP | **Adopt** for destination guides |
| FAQ accordion closing long pages | all three | **Adopt** |
| Read time and updated date on articles | IDP | **Adopt** |
| Fees always qualified as "(Indicative)" | IDP | **Adopt and go further**: qualifier plus verification date |

### 5.2 Our own UX and design work outstanding

| # | Item | Detail |
|---|---|---|
| D1 | Mobile verification of all 12 routes | Never done. Blocking |
| D2 | Reduced-motion audit | We honour `prefers-reduced-motion` in Lenis and Motion; never verified end to end |
| D3 | Focus states and keyboard traps | Focus ring is defined globally; tab order never walked |
| D4 | Loading and skeleton states | None exist |
| D5 | Error boundaries | None exist |
| D6 | Empty states for a new account | The portal says "No case record" to a fresh signup |
| D7 | Consistent card hover across all surfaces | Only destination cards lift today |
| D8 | Stagger cap on long lists | Reveals are per-item; a 40-row table would crawl |
| D9 | Photography for process, outcomes, policy, consultation | Text only today |
| D10 | Hero portrait matching the brief | Outstanding |
| D11 | Print styles for the Open Ledger and the quarterly report | A ledger people are meant to check should print |
| D12 | Table behaviour on mobile: the ledger and any future catalogue table | Wide tables scroll horizontally; never tested at width |
| D13 | Chart accessibility beyond the sr-only table | Keyboard and screen-reader review of the revenue chart |
| D14 | Consistent radius and shadow tokens across new surfaces | Documented; enforce as the catalogue is built |
| D15 | Nav growth plan | Four items today. IDP has five with mega-menus, Leap four plus standalone. Ours needs a plan before the catalogue lands |
