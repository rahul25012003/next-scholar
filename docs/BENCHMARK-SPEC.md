# Benchmark specification: IDP and LeapScholar, complete inventory

Everything both sites do, how they present countries, and what each implies for
Next Scholar. Nothing here is from memory: idp.com and idp.com/india were
fetched across ~25 pages, and leapscholar.com, leapfinance.com,
counselling.leapscholar.com, sem.leapscholar.com, their TCYonline LMS and the
Apple App Store listing across 31 pages. Pages that could not be fetched are
named as such rather than guessed at.

Date: 2026-09-03. Point-in-time observation.

---

## 1. Information architecture, side by side

### IDP, five top-level menus

| Menu | Sub-items, exact labels |
|---|---|
| Study abroad steps | Why study abroad? / Where and what to study? / How do I apply? / After receiving an offer / Prepare to depart / Arrive and thrive |
| Study destinations | Australia, Canada, Ireland, New Zealand, UK, USA, Malaysia |
| Find a course | Course advice / Courses with instant offer / Study abroad courses / Find a scholarship / Find a university / University Rankings THE / QS World University Rankings / Complete University Guide |
| IELTS | Book an IELTS test / What is IELTS? / IELTS Preparation |
| Student Essentials, subtitled "End to End Services" | Education loan / Money transfer / Health Insurance / Student banking / Accommodation / International SIM cards / Guardianship / Forex cards / ISIC |

Utility nav: Sign in, article search, Events, office finder, account dashboard,
and a country switcher listing about 35 country sites.

**Two URL namespaces**, which is the structurally important part: country-scoped
editorial at `/india/...` and a global product catalogue with no country prefix
at `/find-a-course/`, `/universities-and-colleges/{slug}/IID-XX-#####/`,
`/universities-and-colleges/{inst}/{course}/PRG-XX-########/`. The stable ids
reveal a normalised catalogue database behind localised content shells.

### LeapScholar, four menus plus standalone items

| Menu | Sub-items |
|---|---|
| Study Abroad | USA, UK, Canada, Ireland, Australia, Germany, France, New Zealand, Italy. Each country dropdown further carries TOP CITIES, TOP COURSES, TOP UNIVERSITIES |
| Exams | IELTS, DET, SAT, PTE, TOEFL, GRE, GMAT |
| Resources | Books per exam; LOR (blog, Masters, PhD); SOP (main, Masters, MBA, PhD); Counsellors |
| Standalone | Blogs, Leap Digest, Events, Newsroom, Sign in |

Deep SEO footer acting as a second IA: IELTS test centres by Indian city, LOR
and SOP resources, consultants by city, coaching centres, intake timelines,
practice test categories, an A to Z university index, CGPA calculators.

**Implication for us.** Our nav is four items and covers policy, not journey.
Both benchmarks organise around the student's stages and around a catalogue.
Neither is copyable today because we have no catalogue, but the journey spine is.

---

## 2. How each presents a country, in full

This is the section to copy structurally.

### 2.1 IDP country guide template

Verified on Australia and UK, which share a near-identical skeleton:

1. Intro with headline stats, e.g. "38 Top-Ranked Universities | 22,000 Courses | Up to 6 Years of PSW"
2. Why study in X
3. Top courses
4. **Top universities table**: number, institution, QS or THE rank. Australia ran 37 rows
5. **Intakes table**: intake, duration
6. **Cost of studying table** by programme tier. Australia: schools 7,800 to 30,000, undergraduate 25,000 to 40,000, postgraduate 28,000 to 45,000, PhD 30,000 to 60,000 AUD. UK: undergraduate 10,000 to 20,000, Master's 10,000 to 20,000, doctorate 15,000 to 24,000 GBP
7. **Scholarships table**. Australia carried a 50 row university by scholarship by year table
8. **Visa requirements table**: visa name, who it is for, when to apply, arrival
9. **Top student cities table** with rank
10. **Cost of living table**, nine expense lines, monthly or weekly
11. Job prospects and work rights, stated concretely: 48 hours per fortnight in Australia, 20 hours per week in term time in the UK
12. FAQ accordion, four to six
13. Related articles
14. Featured university cards
15. Australia additionally embeds a live upcoming-events table and a FastLane block

### 2.2 LeapScholar country page template

Verified on /study-in-usa, a 14 section long form:

1. Hero plus breadcrumb sub-pages: Cost of Studying, Cost of Living, Scholarships, Jobs, Post Study Work Visa
2. Why move
3. Education system
4. Major intakes: Fall, Spring, Summer
5. Popular courses
6. Universities with a QS ranking table
7. Cost, in both currencies: USD 35,000 to 85,000 per year, about INR 31.6 to 76.8 lakh
8. Visa: F-1, proof of funds USD 50,000 to 80,000, IELTS 6.0 to 7.0 or TOEFL 80 to 100, insurance USD 1,500 to 3,500 per year, **USD 185 visa fee plus USD 350 SEVIS**, 30 to 45 day processing
9. Work: OPT 12 months plus 24 STEM equals 36; salary bands by field
10. ROI framing: "recovery in 2 to 4 years"
11. Scholarships
12. Why choose LeapScholar
13. FAQs
14. Related content

### 2.3 What both do that we do not

- State the **visa fee and its components** as figures
- State **proof of funds** as a figure
- State **work rights** concretely
- Give **cost in both local currency and INR**
- Break **cost of living into line items**
- Carry an **intake table with deadlines**, not just intake month names
- Publish a **top universities table with rankings**
- Offer **sub-pages per country** (cost of studying, cost of living, scholarships, jobs, PSW) rather than one page
- Close with an **FAQ accordion**

Our destination cards carry: intakes, tuition band, post-study window,
commission, our fee, one planning note. That is roughly item 5 and 6 of a
fifteen item template, plus one thing neither of them has.

---

## 3. Complete feature inventory

### 3.1 Catalogue and search

| Feature | IDP | LeapScholar |
|---|---|---|
| Course search | 183,830 courses. Filters: subject, study level (10 values), destination (7 countries), institution, budget slider in USD, study mode (5 values), duration (3 bands), IELTS score slider. Apply and Reset buttons, filters are not live | Behind platform.leapscholar.com, **connection refused at fetch time**, not verified |
| Course card fields | Logo, title, institution, location with flag, level, annual fee marked "(Indicative)", duration, next intake with expandable further dates, badges for Scholarship, Internship, Instant Offer in Principle. CTAs "See if I qualify" and "View details" | Not verified |
| University finder | 1,380 institutions, 115 pages. Filters: destination, subject area. Sort: popularity (default, undefined), THE ranking, name A to Z and Z to A | A to Z index plus per-country top lists |
| University profile | Overview, study options, entry requirements including accepted English tests, scholarships with deadlines, graduate outcomes, accommodation, a live news feed, upcoming events, photo gallery. Header carries THE rank, international student count, QS employability rank | **Deeper**: established year, total students, international students, student faculty ratio, **acceptance rate**, accreditation, top courses carousel with first year fee and duration, intakes with open or closed status, exam minimums **split undergraduate versus postgraduate** across IELTS, TOEFL, Duolingo, PTE, GMAT, GRE, rankings across **four bodies over four years**, cost of living broken into housing, books, transport, personal, misc, placements with named recruiters, student life, notable alumni, FAQs |
| Course detail | Name, institution, campus, qualification type, duration, tuition with year, next intake, IELTS entry score, description, entry requirements, English requirements, full intake table with campus per intake, rankings, related courses | Fees and intakes with status |
| Scholarship finder | 5,100 plus scholarships across 370 partner institutions. Search box plus browse by study level and destination. Record fields: name, institution, destination, level, award type, deadline | "AI powered" matcher whose single entry input is "Do you have university admit?". Plus their own award, USD 250,000 annually |
| Comparison tool | **Neither has one** | **Neither has one** |

### 3.2 Tools and calculators

| Tool | IDP | LeapScholar |
|---|---|---|
| Cost of living calculator | Country, then city, then accommodation type (own apartment or share house), then location (city centre or suburbs), then housing, food, daily life, clothing. Multi-step wizard. Output screen not reachable by fetch | Six emoji-led steps: country, city, accommodation, eating preference, commute preference, "How often do you party in a week" 0 to 7. **Result withheld behind "Signup to view total cost"** |
| Eligibility | **FastLane**: select institution and course, create academic profile, submit, receive decision in minutes, apply with counsellor. Returns an "Offer in Principle" | "Check Admit Eligibility" is **three questions and a contact form that books a 60 minute call. No score is returned** |
| Grade converters | None | CGPA to percentage (times 9.5), CGPA to marks, CGPA to GPA, percentage to GPA on three scales, percentage to marks, SGPA to CGPA, GPA calculator |
| Exam score tool | IELTS self-assessment | **IELTS band calculator**: four section scores, averaged equally, rounded to nearest half band, with a 0 to 9 descriptor table |
| Rankings explorer | THE: 354 universities, searchable, filterable by destination. QS page is **static editorial only**, 12 rows | QS tables embedded in country and university pages |
| Loan calculator | **None.** Seven lenders named with zero rates | **None.** A static worked example only |

### 3.3 Services layer

| Service | IDP | LeapScholar |
|---|---|---|
| Education loan | Seven named lenders: Avanse, ICICI iSMART, Credila, SBI Securities, Union Bank, Poonawalla Fincorp, Avanse Global. IDP-exclusive perks named. **No rates, amounts, collateral terms, fees or EMI calculator published** | In-house LeapFinance: **no collateral required, rate from 8.49%**, 100% of tuition and living, tenures 7 to 15 years, worked example on USD 15,000 showing USD 50 for 36 months then USD 203.83. Offer estimate in 10 minutes, sanction in 3 days. **Max amount, co-signer policy and fee schedule not published** |
| Accommodation | Three aggregators: Uhomes, Amber, Casita. IDP runs no search, each gets an Enquire now button | No product. Blog content only |
| Money transfer | Flywire | Not found |
| Health insurance | Allianz, Bupa named | Not found |
| Banking, SIM, forex, guardianship, ISIC | All present as "Student Essentials" | Forex named in copy only, no product page |
| Visa support | Free, but **conditional on holding an offer from a partner institution**. Certify, translate and courier documents. Refers onward to authorised representatives. **A separate paid migration consultation at AUD 99 per 30 minutes is disclosed only in the Terms of Use** | Counsellor delivered: full pre-visa document audit, financial evidence organisation, **mock visa interviews**. Claims 98% success |
| SOP and LOR | Not a product | Downloadable PDF with two annotated samples and a six section fillable outline, plus 18 course-specific sub-pages. Notably **warns against using AI to generate the narrative** |
| Exam prep | Book an IELTS test off-platform. Free: self-assessment, 70 plus practice tests, masterclass, app, familiarisation test. Paid: Cambridge Prep, Macquarie 15 day course | **Their deepest vertical.** Free full mock, **no account needed**, instant band estimate for listening and reading, AI evaluation. Micro-tests of 5 to 10 minutes. Paid course at **INR 99, down from 399**, 100 plus video lessons, 50 plus mocks, trainer feedback, three months access. Separate TCYonline LMS and a second IELTS app |
| Events | 157 events, physical, virtual and hybrid, with registration forms carrying three mandatory consent checkboxes. **Filters are thin**: subject area and sort only | 500 plus events, 300k plus attendees, **live registration counters on cards**, named speakers with affiliations |

### 3.4 Content layer

| Item | IDP | LeapScholar |
|---|---|---|
| Blog | **878 articles**, 12 per page, 74 pages. Four filter axes: destination, topic (8 values), student essential service (6 values), journey stage. Sort by date. Cards carry **read time** and both published and updated dates | About 19 emoji-labelled categories. Cards carry read time. Titles aggressively SEO-optimised with future years and numbers |
| Newsroom | Not separate | **Leap Digest**, a separate product with three streams: student reviews, expert insights, trending news |
| City pages | About 70 Indian city pages with address, phone, email, hours, a named representative, service list, neighbourhoods | Consultants by city in the footer |
| Journey content | Six stage hubs, each with articles, FAQs and CTAs | Six named stages on a landing page |

### 3.5 Account, portal and app

| Item | IDP | LeapScholar |
|---|---|---|
| Web dashboard | Renders logged out. Exposes **shortlisting only**, with an empty state hinting at eligibility-sorted shortlists | Not publicly reachable |
| Sign in | Email and password, no SSO. Does not hard-gate: the strongest CTA on the sign-in page is still free counselling | Present |
| App | IDP Live: profile, search, **shortlist and compare**, FastLane, **real-time application progress tracker**. Explicitly does **not** describe document upload, chat, notifications, appointment booking, offer acceptance or payment | 4.6 stars from 934 ratings. **Chat with your counsellor, counsellor-provided shortlist, book 1 to 1 meeting, call counsellor, customer support.** The app is the product surface. Privacy disclosure: tracks across other apps, links phone, device id and usage to identity for advertising |
| Fragmentation | One app | **Three surfaces**: counselling app, separate IELTS prep app, separate TCYonline LMS. No unified portal verified |

### 3.6 Trust devices

| Device | IDP | LeapScholar |
|---|---|---|
| Headline stats | 137,000 students in two years, 55 plus years, 800 plus partners, 6,500 staff, 2,200 plus counsellors, 190 offices in 35 countries, 11,000 plus scholarships | 25K admits this year, 150,000 plus admits, 1.5L placed, 500,000 plus stories, 2M plus helped, INR 1,000 Cr plus loans disbursed, USD 200M raised |
| **Internal consistency** | **Poor.** 700 vs 800 partners, 30 plus vs 50 plus countries, 113,000 vs 137,000 students, 77 vs 70 India offices | **Worse.** Students given as 25K, 150K, 500K and 2M on different pages. Universities as 80, 750, 1,000 and 1,500. Ratings as 4.6, 4.7 and 4.8 |
| Reviews | 4.8 on Google, referenced not embedded | **404 verified reviews**, paginated, filterable by country and category, with video stories |
| People | Student ambassadors, named and photographed, with "Chat with me". No counsellor profiles | Named counsellors with student counts and years of experience. Named instructors with credentials |
| Institutional | ASX listed, investor centre, IELTS co-ownership, employer awards | Investors named: Peak XV, Owl Ventures, Harvard Management Company. Media logos. Funding rounds disclosed |
| Physical | 10 branch cities in every footer, office finder | 20 plus India offices plus Singapore and Dubai |

### 3.7 Commercial transparency, the decisive comparison

| | IDP | LeapScholar | Next Scholar |
|---|---|---|---|
| Commission from universities disclosed | **Nowhere.** Checked About, Terms, Disclaimer, consultants page | **Nowhere.** Their own FAQ asks "Is Leap Scholar free?" and answers with unfilled placeholder text | Published per relationship with source, evidence, date and verifier |
| Catalogue scoped to paying partners, unstated | Yes | Yes | Zero-commission page names routes we earn nothing from |
| Ranking or sort basis disclosed | No. Default sort is "Popularity", undefined. FastLane institutions get badges and a nav slot with no sponsored labelling | No. Human "profile-based allocation" | Matching states a reason per entry and flags every assumption |
| Referral remuneration disclosed | No, across seven lenders, three accommodation partners, Flywire, Allianz | No | None taken yet; the ledger schema is ready |
| Prices published | One, buried in Terms: AUD 99 migration consultation | IELTS course at INR 99. The 4-week course price is not published | Every fee on the destination cards |
| Result gating | Calculator open | **Cost calculator withholds the answer behind a signup wall** | Nothing gated |

---

## 4. UI and UX patterns worth taking

| Pattern | Where | Take it? |
|---|---|---|
| Hero: one photo, short headline, number-led subhead, **one** primary CTA | Both | Already done |
| **Quick-entry chips under the hero** (Courses, Scholarships, Universities, Events, Guide me) | IDP | Yes, once there is something to link to |
| Stat band under the hero | Both | Already done, with honest figures |
| Four-card service grid phrased as **outcomes not product names** | LeapScholar | Yes |
| **Progressive multi-step forms**: visual country cards first, contact details last | LeapScholar | Yes, for the consultation intake |
| Live urgency: event cards with rolling registration counts | LeapScholar | Only when real |
| Left-rail filters with an explicit Apply button | IDP | Yes, with the catalogue |
| Badge vocabulary on cards | IDP | Yes: our badge is the commission status |
| Fees always qualified as "(Indicative)" | IDP | Yes, and we go further with a verification date |
| Read time and **updated date** on articles | IDP | Yes |
| FAQ accordion closing every long page | Both | Yes |
| Table-of-contents jump list on long pages | IDP | Yes |
| Emoji as a systematic tone device | LeapScholar | No. Wrong register for this brand |
| Persistent WhatsApp button | Both | Yes, India-appropriate |
| Signup wall on a calculator result | LeapScholar | **No. Deliberately invert it** |
| Repeating one CTA 2 to 5 times per page | IDP | No |

---

## 5. Their own defects, recorded so we do not copy them

- IDP `/study-abroad-subjects/` throws a server-side `ReferenceError: location is not defined` and renders no listing
- IDP course finder budget slider maxes at USD 146,167,920
- IDP nav links to `/india/find-a-scholarships/` while the page inside links to `/find-a-scholarship/`
- IDP course pages render "The application deadline isn't available"
- LeapScholar university page shows "Avg. Study Cost INR 0.50 L" in the highlights while the detail sections say 55.38 L, and shows 2025 intakes in September 2026
- LeapScholar's counselling FAQ answers "Is Leap Scholar free?" with placeholder text
- Both contradict their own headline statistics across pages

The last two are the opening. A competitor whose numbers disagree with
themselves cannot credibly attack a competitor whose numbers carry a source and
a date.
