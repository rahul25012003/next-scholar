# Next Scholar: audit, gap analysis and phased roadmap

Blueprint for the next development stage. Nothing here proposes removing or
replacing what already works: every item is additive, or repairs something
already identified as incomplete.

Date: 2026-09-03
Current state: 7 commits, 107 source files, ~13,500 lines, 197 tests, lint and
build clean, 12 routes.

Benchmarks: **idp.com** (~25 pages fetched) and **leapscholar.com** plus
leapfinance.com and their app-store listings (31 pages fetched). Both studies
recorded which pages could not be reached rather than guessing. Everything
attributed to them below is a point-in-time observation from those fetches.

---

## 0. The strategic finding that shapes every phase

The two benchmarks are far ahead of us on **catalogue, tooling and content**.
They are behind us on exactly one thing, and it happens to be the thing this
business is built on.

| | IDP | LeapScholar | Next Scholar |
|---|---|---|---|
| Commission disclosed to students | **Nowhere.** Checked About, Terms, Disclaimer, consultants page | **Nowhere.** Their FAQ literally asks "Is Leap Scholar free?" and answers with unfilled placeholder text | Published per relationship, with source, evidence, date and verifier |
| Own statistics internally consistent | No: 700 / 800 partner universities, 30+ / 50+ countries, 113k / 137k students, on different pages | No: 25K / 150K / 500K / 2M students; 80 / 750 / 1,000 / 1,500 universities | One source per figure, or an empty state |
| Non-partner institutions | Absent from the catalogue with no notice that the catalogue is a partner list | Same | Zero-commission page names routes we earn nothing from and tells you to apply without us |
| Ranking/sort basis | University finder defaults to "Popularity", undefined. No sponsored labelling despite FastLane institutions getting badges and a nav slot | Human counsellor "profile-based allocation" | Matching states its reason per entry and flags every assumption |
| Referral arrangements | 7 named lenders with "IDP Discounted" perks, 3 accommodation partners, Flywire, Allianz. No rates, no fees, no disclosure of remuneration | LeapFinance in-house (8.49%+), user reviews mention a 2% processing fee; not company-disclosed | No such products yet, and the ledger schema is ready for them |
| Result gating | Cost calculator flow is open | **Cost calculator withholds the answer behind "Signup to view total cost"** after six questions | Nothing gated |

**The strategic conclusion.** Do not try to out-catalogue IDP; they have 183,830
courses and 55 years of partner relationships. Build the same *categories* of
capability they have, and make each one carry the disclosure they omit. A course
search where every row shows what we earn is a product neither of them can copy
without repricing their whole business.

The second conclusion is defensive: their statistics contradict each other badly.
Our discipline of one-source-per-figure is a real asset. Protect it as the
catalogue grows, because a catalogue is where fabricated numbers usually enter.

---

## 1. Existing errors and bugs

Tests, lint, type-check and build are all clean, and no functional defect is
currently known. What follows are correctness risks and unverified areas, which
is a different and more honest claim than "no bugs".

| # | Item | Severity | Detail |
|---|---|---|---|
| 1.1 | **All writes are lost on restart** | High | Cases, consents, communications, extractions, notifications, users and the audit trail are module-level arrays. A server restart discards every note, verification and account. Acceptable for the current stage, fatal the moment anyone relies on it. |
| 1.2 | **Audit trail is not durable** | High | `domain/audit.ts` is in memory. Section 17 of the source guide promises a traceable answer when a figure is disputed; that promise does not survive a deploy. |
| 1.3 | **Notification `deliveryStatus` never advances** | Medium | `sent`, `delivered`, `failed`, `retried` are declared and unreachable. Nothing sends, so every row stays `queued` forever. Honest on the dashboard, but the state machine is decorative until a provider exists. |
| 1.4 | **No error boundary or loading UI anywhere** | Medium | No `error.tsx`, no `global-error.tsx`, no `loading.tsx` on any route. A thrown error in a server component shows the framework default; every navigation shows nothing until the server responds. |
| 1.5 | **Mobile layout unverified** | Medium | Window resize to 420px did not take effect in the automation, so no route has been seen at a phone width. Responsive classes are written throughout but nothing confirms them. |
| 1.6 | **Remote image latency** | Medium | Eight `/_next/image` requests for Unsplash and flag images were still pending after 3.5s in view on the dev server. The optimizer itself answers in ~480ms per image, so this is queueing under load. Needs measuring on a production build before it is called solved. |
| 1.7 | **Hero photograph does not match the brief** | Low | Requested: a student walking into a university campus. Current: a warm studio-style portrait. 66 candidate Unsplash ids were checked by eye without finding that composition; blind id guessing cannot target a composition. Blocked on an Unsplash API key or supplied assets. |
| 1.8 | **Notch on the hero card is an approximation** | Low | Drawn as an overlaid rounded square rather than a true concave cut. Reads correctly at desktop; unverified at small widths. |
| 1.9 | **`/console/[caseId]` returns 404 for an out-of-caseload case** | By design | Recorded here so it is not later mistaken for a bug. It avoids confirming a record exists to someone who may not see it. |

---

## 2. Incomplete or pending implementations

Work that is started, structurally correct, and cannot finish without an
external dependency. None of these is a design gap; each is a missing key,
provider or database.

| # | Item | Blocked on | What already exists |
|---|---|---|---|
| 2.1 | **Persistence** | A Supabase project | `data/store.ts` is the single swap point; the permission matrix is written to move down into row level policies |
| 2.2 | **Document storage and malware scanning** | Object storage + a scanner endpoint | The upload pipeline is complete and fails closed, refusing every file and naming which precondition refused it |
| 2.3 | **Document Intelligence execution** | 2.2, plus an API key | Agent, staging area, per-field human confirmation and its tests are all built; it self-gates and explains why |
| 2.4 | **Model-backed agents running for real** | `ANTHROPIC_API_KEY` | Six agents wired through the kernel with schema validation, prohibition checks and capability filtering. **No model call has ever executed.** The kernel is proven by mocked tests, not by live output |
| 2.5 | **Notification delivery, retry and backoff** | Email + WhatsApp providers | Queue, dedupe, escalation on rising urgency, per-channel opt-in and honest provider status all built |
| 2.6 | **Consultation booking and payment** | Cal.com or Zoho, plus Razorpay | Six-question intake validates and persists nothing, says so plainly, and keeps answers in the visitor's browser |
| 2.7 | **Open Ledger write path** | 2.1 | Rows are published content edited in the repository. The founder-only permission that will gate writes exists and is tested but unused |
| 2.8 | **Commission change history** | 2.1 | Schema field specified in the source guide, not implemented |
| 2.9 | **Retention deletion** | 2.1 | The five-year clock is computed and a case past it reports as deletable; nothing deletes |
| 2.10 | **MFA for staff** | An auth provider | Session, hashing and route guard are real; there is no second factor |
| 2.11 | **Photography for remaining sections** | An Unsplash key or assets | Process, outcomes, policy and consultation pages carry no imagery |
| 2.12 | **Rate limiting, per-agent cost tracking, structured write logs** | Nothing external | Named as Phase 2 items in the source guide, deliberately deferred |

---

## 3. Missing features

Measured against what the two benchmarks actually offer. The right-hand column
is the honest reason it is absent, which in several cases is "deliberately
deferred by the specification" rather than "overlooked".

### 3a. Catalogue and search — the largest gap

| Feature | IDP | LeapScholar | Us |
|---|---|---|---|
| Course search | 183,830 courses; filters for subject, level, destination, institution, budget, mode, duration, IELTS band | Behind `platform.leapscholar.com` (unreachable at fetch time) | **None** |
| University finder | 1,380 institutions, sortable by THE ranking and name | A–Z index plus per-country top lists | **None** |
| University profile pages | Overview, entry requirements, scholarships, graduate outcomes, accommodation, news feed, events, gallery | Deeper structured data: acceptance rate, student/faculty ratio, four ranking bodies across four years, cost-of-living breakdown, exam minimums split UG/PG, named recruiters | **None** |
| Course detail pages | Fees, intake tables per campus, entry and English requirements | Fees, intakes with open/closed status | **None** |
| Scholarship finder | 5,100+ scholarships, browse by level and destination | AI-matched, plus their own $250k award | **None** |
| Comparison tool | Not present on either | Not present on either | **None** — and a genuine opening |

### 3b. Tools and calculators

| Tool | Benchmark behaviour | Us |
|---|---|---|
| Cost of living calculator | IDP: country → city → accommodation type → four expense categories. Leap: six emoji-led questions, **result withheld behind a signup wall** | **None** |
| Grade converters | Leap: CGPA↔percentage↔GPA, SGPA, seven variants. Cheap, useful, heavy SEO value | **None** |
| IELTS band calculator | Leap: four section scores → overall band with rounding rules | **None** |
| Eligibility check | IDP FastLane returns an "Offer in Principle" in minutes. Leap's "Check Admit Eligibility" is **three questions that book a call and return no score** | **None**, and our guardrails forbid a probability. A factual requirements-met checklist is the on-brand version |
| Loan EMI / eligibility | Neither publishes one; IDP names seven lenders with no rates at all | **None** |

### 3c. Services layer

Accommodation, education loans, forex, health insurance, student banking, SIM
cards, money transfer. IDP groups these as "Student Essentials" and monetises
them as referral funnels with **no disclosure of remuneration**. LeapScholar
runs lending in-house. We have none of them, and the ledger schema is the reason
we could enter this category credibly.

### 3d. Content and audience layer

| Feature | Benchmark | Us |
|---|---|---|
| Destination guides | IDP: templated per country with ranking tables, intakes, cost tiers, scholarships, visa requirements, city rankings, cost of living, work rights, FAQs. Leap: 14-section equivalent | Three destinations as **cards only**. Full guides explicitly deferred by the spec |
| Blog / articles | IDP: 878 articles, four filter axes, read-time, updated dates. Leap: ~19 categories plus a separate newsroom | **None**. Deferred by the spec |
| Events and webinars | IDP: 157 events, physical/virtual/hybrid. Leap: live registration counters, named speakers with credentials | **None** |
| Exam preparation | Leap's deepest vertical: free mock test needing no account, ₹99 self-paced course, band calculator. IDP co-owns IELTS | **None** |
| City / local SEO pages | IDP: ~70 Indian city pages | **None** |
| Reviews and testimonials | Leap: 404 verified reviews, filterable, with video stories | **None**, honestly, because there are no clients |
| Counsellor profiles | Leap names counsellors with student counts and years. IDP shows one representative per branch | **None** |
| Student ambassadors | IDP: named peers with "Chat with me" | **None** |
| Mobile app | Both ship one; Leap's is the actual product surface | **None** |

### 3e. Where we are already ahead

Worth protecting, because these took real work and neither benchmark has them:

- A published commission ledger with per-row verification status
- A zero-commission page that actively costs revenue
- Application tracking that is **transactional** rather than read-only. IDP's logged-in dashboard exposes only shortlisting; their tracker is a status bar
- Consent recorded per document category, withdrawable, gating collection
- An upload pipeline that fails closed
- Agent governance published on the operations dashboard
- Reporting that separates categories permanently and refuses to publish without a named sign-off

---

## 4. UX and UI improvements

| # | Item | Problem it solves | Priority |
|---|---|---|---|
| 4.1 | **First-run experience for a new student account** | Signup succeeds, then `/portal` says "No case record". A new user's first impression is an empty state with nothing to do. Both benchmarks put a guided next step here | **Critical** |
| 4.2 | **Progressive multi-step intake** | Our consultation form is one long page of six questions. Both benchmarks escalate commitment: country cards first, contact details last. Higher completion, same honesty | High |
| 4.3 | Mobile verification and polish across all 12 routes | Never seen at phone width. India-first audience is mobile-majority | **Critical** |
| 4.4 | WhatsApp as a first-class channel | Both benchmarks put a persistent WhatsApp button on every page; it is the norm for this audience. Ours is a consent-gated notification channel only | High |
| 4.5 | Photography across remaining sections | Hero and destination cards are done; process, outcomes, policy and consultation pages are text-only | Medium |
| 4.6 | Loading and skeleton states | No `loading.tsx` anywhere; navigation feels dead on slow connections | Medium |
| 4.7 | Sortable, filterable caseload | Console sort is fixed at priority then stagnation. No search, no filter, no deadline sort | Medium |
| 4.8 | Trust devices that are honest today | Both benchmarks lead with counsellor credentials, office locations, ratings. We have none because none exist. What we *can* show: the founder's own credentials once written, the accreditation timeline already on the page, and the ledger itself | Medium |
| 4.9 | Accessibility audit | Heading order, single H1, alt text and button labels check out on the homepage. Contrast, focus order, keyboard traps and screen-reader flow have not been audited on any route | High |
| 4.10 | Quick-entry chips under the hero | IDP's five chips (Courses, Scholarships, Universities, Events, Guide me) are the real IA shortcut past a large nav. Ours has a destination picker only | Low |

---

## 5. Functionality improvements

| # | Item | Detail | Priority |
|---|---|---|---|
| 5.1 | Matching at university level | Currently ranks four destination rows. Needs a university and programme catalogue underneath before it can do what the spec's ten factors describe | High |
| 5.2 | Requirements-met checklist | The on-brand answer to FastLane and "admit chances": state which published requirements the profile meets and which it does not, factually, with no probability | High |
| 5.3 | Document versioning | Spec requires every re-upload to create a version with old ones accessible. Deferred because nothing can write a second version until storage exists | Medium |
| 5.4 | Wider correction scope | Only intake, destination, priority and budget are correctable through the logged path. Name, counsellor, deadlines and application references are not | Medium |
| 5.5 | Per-case SLA indicator | Breach events exist; a visible response clock per case does not | Medium |
| 5.6 | One-click summarise | The case summary regenerates only as a side effect of saving a note | Low |
| 5.7 | Notification preferences UI | Channel consent is enforced in code with fixtures; students cannot manage it themselves | Medium |
| 5.8 | Bulk actions on the caseload | No multi-select for reassignment or reminders | Low |
| 5.9 | Risk intelligence on real data | Bands are explainable and evidence-backed but calibrated against nothing. Needs real outcome history, which needs real cases | Deferred by design |

---

## 6. Performance and technical improvements

| # | Item | Detail | Priority |
|---|---|---|---|
| 6.1 | **Database with row level security** | The single largest technical dependency. Unblocks 2.1, 2.7, 2.8, 2.9, 1.1, 1.2 | **Critical** |
| 6.2 | **Image strategy** | Self-host or pre-optimise hero and destination images, add explicit `sizes`, blur placeholders and width hints. Measure on a production build | High |
| 6.3 | **CI pipeline** | Tests, lint, type-check and build run only when invoked by hand. No pre-commit or pre-merge gate | High |
| 6.4 | Component and end-to-end tests | 197 tests cover domain logic, the store, the agent kernel and auth. **Zero component tests and zero browser tests.** The hero wrapping to four lines and the dropped CTA were both caught by a human looking, not by a test | High |
| 6.5 | Lighthouse and Core Web Vitals baseline | Never run. No LCP, INP or CLS numbers exist for any route | High |
| 6.6 | Rate limiting | None. Auth endpoints and the sweep are unthrottled | High |
| 6.7 | Structured logging and error tracking | No aggregation, no error reporting service | Medium |
| 6.8 | Per-agent cost and volume tracking | No counter, no spend signal, no budget cap | Medium |
| 6.9 | Backups and a tested restore | Follows the database | Medium |
| 6.10 | Caching of verified university data | Relevant once a catalogue exists | Low |
| 6.11 | Bundle analysis | Never run | Low |

---

## 7. New features inspired by IDP and LeapScholar

Each of these takes a capability they have and adds the disclosure they omit.
That combination, not the capability alone, is the product.

| # | Feature | Their version | Our version |
|---|---|---|---|
| 7.1 | **Commission-visible course search** | Catalogues scoped silently to commercial partners | Every row carries what we earn and its verification status. Non-partner institutions included and labelled "we earn nothing here" |
| 7.2 | **Ungated cost calculator** | Leap withholds the total behind a signup wall after six questions | Same calculation, answer shown immediately, no account, sources cited per figure |
| 7.3 | **Requirements checklist, not an admit predictor** | FastLane returns an "Offer in Principle"; Leap's "eligibility" returns a sales call | Which published requirements you meet and which you do not, with the source for each. No probability, ever |
| 7.4 | **Loan comparison that publishes the referral fee** | IDP names seven lenders with zero rates and no disclosure of remuneration | Rates, fees, and what we are paid for the referral, in the same ledger schema |
| 7.5 | **Accommodation with disclosed referral fees** | Three partners, "Enquire now", no disclosure | Same partners, published referral terms |
| 7.6 | **Verified reviews** | Leap: 404 reviews, filterable | Same discipline as the ledger: a review is published with who verified it and when, or not at all |
| 7.7 | **Published refusal file** | Neither publishes negative outcomes | Already specified: refusals and applicants advised not to proceed, in the quarterly report |
| 7.8 | **Shortlist provenance** | Neither explains why a university is on your list | Already half-built: matching states its reason and flags assumptions. Extend into a per-shortlist audit the student can read |
| 7.9 | Destination guides | Both are templated and deep | Ours would be three, complete, with a "last verified at source" date on every figure |
| 7.10 | Exam prep or, minimally, free tools | Leap's largest self-serve vertical | Band calculator and grade converters are cheap, genuinely useful, and need no partner |
| 7.11 | Events and webinars | 157 and 500+ respectively | Small, real, recorded |
| 7.12 | Counsellor profiles | Named, with student counts | Only once real counsellors exist, with credentials that can be checked |
| 7.13 | Mobile app | Both ship one | Far future. A responsive site first |
| 7.14 | **"Our numbers, one source" page** | Both contradict themselves across pages by an order of magnitude | A page listing every statistic we publish, where it comes from, and when it was last checked. Cheap to build, and directly attacks their weakest point |

---

# Phased implementation roadmap

Ordered so that each phase unblocks the next. Phases 1 and 2 are repair and
completion; nothing new is added until what exists is durable and honest.

---

## Phase 1 — Make it durable
**Goal:** nothing built so far is lost on restart, and the promises already
published are actually keepable.

| Implement | Solves | Outcome | Priority |
|---|---|---|---|
| Supabase project, schema, row level security policies mirroring the permission matrix | 1.1, 1.2, 2.1, 6.1 | Cases, users, consents, communications and the audit trail survive a deploy. The matrix is enforced twice, in the app and in the database | **P0** |
| Migrate `data/store.ts` and `data/users.ts` to Supabase | 1.1, 2.1 | One file each changes; nothing above them moves | **P0** |
| Durable audit trail with pagination and retention | 1.2 | The disputed-figure promise becomes keepable | **P0** |
| `error.tsx`, `global-error.tsx` and `loading.tsx` on every route group | 1.4 | Failures degrade gracefully instead of showing framework defaults | **P0** |
| Mobile verification and fixes across all 12 routes | 1.5, 4.3 | The mobile-majority audience gets a working site | **P0** |
| CI running tests, lint, type-check and build | 6.3 | Regressions caught before merge, not by hand | **P1** |
| Rate limiting on auth and the sweep endpoint | 6.6 | Brute force and abuse are bounded | **P1** |
| Lighthouse baseline for all routes; production image strategy | 1.6, 6.2, 6.5 | Real numbers exist to improve against | **P1** |

**Exit criteria:** restart the server, log back in, and every note, verification
and account is still there. All routes verified on a phone. CI green.

---

## Phase 2 — Complete what is already promised
**Goal:** every "not connected yet" notice on the site becomes either connected
or a deliberate, dated decision.

| Implement | Solves | Outcome | Priority |
|---|---|---|---|
| Document storage plus malware scanning | 2.2 | The upload pipeline stops refusing everything. Documents, versioning and the checklist become real | **P0** |
| Document Intelligence live, with its staging and confirmation flow | 2.3, 5.3 | Agent 2 runs. Extracted values reach a person for confirmation, never the record directly | **P0** |
| `ANTHROPIC_API_KEY` and a live run of all six model agents, including adversarial prompts against the prohibition checks | 2.4 | The kernel is proven against real model output, not only mocks. **This is the largest untested surface in the codebase** | **P0** |
| Email and WhatsApp providers, with retry, backoff and status transitions | 1.3, 2.5, 4.4 | Reminders actually arrive; WhatsApp becomes the channel this audience expects | **P1** |
| Cal.com or Zoho plus Razorpay for the ₹1,500 consultation | 2.6 | The booking form takes a booking. First revenue possible | **P1** |
| Open Ledger write path with change history, gated on the founder permission | 2.7, 2.8 | The verification workflow moves out of the repository and into the product | **P1** |
| Retention deletion enforcement | 2.9 | The five-year commitment is enforced at both ends | **P2** |
| MFA for staff accounts | 2.10 | Meets the security posture we publish | **P1** |

**Exit criteria:** the operations dashboard's security posture panel shows zero
"waiting on infrastructure" rows. Every agent has executed at least once against
the real API with its output inspected.

---

## Phase 3 — First-run experience and the honest tools
**Goal:** a stranger can arrive, get real value without an account, and a new
account has somewhere to go.

| Implement | Solves | Outcome | Priority |
|---|---|---|---|
| New-student onboarding: profile capture, then a real portal state | 4.1 | Signup no longer ends in an empty state. The six intake answers become the profile matching already reads | **P0** |
| Progressive multi-step intake replacing the single long form | 4.2 | Higher completion, same six questions, same honesty | **P1** |
| Cost of living calculator, ungated, sources cited | 3b, 7.2 | Direct differentiation against Leap's signup wall, on the metric students actually care about | **P1** |
| Grade converters and IELTS band calculator | 3b, 7.10 | Cheap, genuinely useful, strong search value, no partner needed | **P2** |
| Requirements-met checklist per destination | 5.2, 7.3 | The honest answer to "do I qualify", with no probability | **P1** |
| Accessibility audit and fixes across all routes | 4.9 | Contrast, focus order and screen-reader flow verified rather than assumed | **P1** |
| Component and browser tests for the marketing and portal surfaces | 6.4 | The two bugs a human caught by looking would have been caught automatically | **P1** |

**Exit criteria:** an anonymous visitor can compute a real cost estimate and a
real requirements checklist without an account. A new signup lands somewhere
useful.

---

## Phase 4 — The catalogue
**Goal:** close the largest capability gap, carrying the disclosure the
benchmarks omit. This is the biggest phase; sequence it institution-first.

| Implement | Solves | Outcome | Priority |
|---|---|---|---|
| University and programme data model, seeded for the three destinations only | 3a | The spine everything else hangs from. Three countries covered completely beats eleven covered thinly, and matches the existing scope discipline | **P0** |
| University profile pages: entry requirements, fees, intakes, rankings, cost of living, **commission status per institution** | 3a, 7.1 | The page IDP and Leap both have, plus the row they both omit | **P0** |
| Course search with filters, every row showing what we earn | 3a, 7.1 | The differentiating product. A search neither benchmark can copy without repricing their business | **P0** |
| Matching upgraded to university and programme level | 5.1 | The ten factors from the source guide become answerable | **P1** |
| Scholarship finder | 3a | Expected by anyone who has used either benchmark | **P2** |
| Comparison tool | 3a | Neither benchmark has one. Cheap once the catalogue exists | **P2** |
| Destination guides, full templates, "last verified" per figure | 3d, 7.9 | The SEO and credibility layer, with the dating discipline they lack | **P2** |

**Exit criteria:** a student can search real programmes across three
destinations and see, on every row, what we would earn if they enrolled.

---

## Phase 5 — Audience and trust
**Goal:** the layer that brings people in and the evidence that keeps them.

| Implement | Solves | Outcome | Priority |
|---|---|---|---|
| Blog and content hub with the filter taxonomy both benchmarks use | 3d | The acquisition channel. IDP runs 878 articles for a reason | **P1** |
| "Our numbers, one source" page | 7.14 | Attacks the benchmarks' weakest point directly and costs almost nothing | **P1** |
| First quarterly outcomes report published, refusals included | 7.7 | The promise the whole brand rests on, kept in public for the first time | **P0** when the first quarter closes |
| Verified reviews with ledger-grade verification | 7.6 | Social proof that survives scrutiny | **P2** |
| Counsellor profiles with checkable credentials | 4.8, 7.12 | Only once real counsellors exist | **P2** |
| Events and webinars | 3d, 7.11 | Small and real beats 157 and generic | **P3** |
| City pages for Bengaluru and nearby | 3d | Local search, honestly scoped to where we operate | **P3** |

**Exit criteria:** the first quarterly report is public, including refusals and
applicants advised not to proceed.

---

## Phase 6 — Services, with the disclosure attached
**Goal:** enter the categories that fund the benchmarks, on terms they do not offer.

| Implement | Solves | Outcome | Priority |
|---|---|---|---|
| Loan comparison publishing rates, fees and our referral remuneration | 3c, 7.4 | IDP names seven lenders with no rates at all. Publishing ours is a category-level differentiator | **P1** |
| Accommodation partners with disclosed referral terms | 3c, 7.5 | Same pattern | **P2** |
| Forex, insurance, banking, SIM | 3c | Completes the "student essentials" expectation | **P3** |
| Exam preparation, or a partnership | 3d, 7.10 | Leap's deepest vertical. Only worth entering properly | **P3** |
| Mobile app | 3d, 7.13 | Only after the responsive site is excellent | **P4** |

---

## Cross-cutting, every phase

- **Never let the catalogue introduce an unsourced number.** A catalogue is the
  usual entry point for exactly the fabrication this business exists to avoid.
  Every imported figure needs a source and a verification date, or an empty state.
- **Preserve the guardrails as scope grows.** Each new agent, surface or data
  source goes through the same capability declaration, prohibition checks and
  audit trail. The inert capability filter found in the last audit is what
  happens when that slips.
- **Extend `docs/AUDIT.md` per phase** rather than rewriting it, so the record of
  what was tested accumulates instead of resetting.

---

## What still gates a real launch, and is not engineering

Unchanged, and no phase above removes them:

1. Written permission from each aggregator and university to publish their
   commission band. Until then every ledger row stays an unverified estimate.
2. A lawyer on the data protection policy; the four open items are real gaps.
3. Incorporation: CIN, GSTIN, registered address, grievance officer.
4. A founder biography and photograph.
5. Re-verification of every policy figure and requirement list at source.
