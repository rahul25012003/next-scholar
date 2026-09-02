# Master implementation backlog

Every outstanding item, numbered, from all four audits. Nothing here removes or
replaces anything that already works.

Sources: `ROADMAP.md` (project audit and benchmark gap analysis),
`FEATURE-DETAIL.md` (field and interaction level build sheet),
`GERMANY-BENCHMARK.md` (nxtstep-de and the dMAT gap),
`COUNTRY-AUDIT.md` (per-destination content and accuracy),
`BENCHMARK-SPEC.md` (complete IDP and LeapScholar inventory), `AUDIT.md` (the
no-fabricated-data audit and its correction).

Status key: **P0** blocking or incorrect, **P1** core, **P2** important,
**P3** valuable, **P4** later.

---

## Phase 1 — Correctness and durability

Nothing new is built. Existing work becomes true and survives a restart.

| ID | Item | Why | Priority |
|---|---|---|---|
| 1.01 | Correct the Germany tuition claim: add the Baden-Wurttemberg EUR 1,500 per semester exception everywhere tuition is stated | **We publish a false figure on our flagship zero-commission route** | **P0** |
| 1.02 | Add the blocked account figure: EUR 11,904 per year, EUR 992 per month | Policy Desk flags it as unknown; it is known | P0 |
| 1.03 | Correct Ireland post-study to 12 plus 12, and note Level 8 gets 12 months | We state a flat 24 | P0 |
| 1.04 | Add a `route` field to the case record | A German private applicant is silently checked against the public requirement set | **P0** |
| 1.05 | Add `german-test` to `DocumentCategory`, plus a generic `language-test` shape | TestDaF, DSH, telc and Goethe cannot be stored at all | **P0** |
| 1.06 | Model degree recognition: anabin equivalence, bachelor duration, Studienkolleg pathway | The biggest German gate for Indian applicants is invisible to the system | **P0** |
| 1.07 | Supabase project, schema, row level security mirroring the permission matrix | Every write is lost on restart | **P0** |
| 1.08 | Migrate `data/store.ts` and `data/users.ts` to Supabase | Same | P0 |
| 1.09 | Durable audit trail with pagination and retention | The disputed-figure promise does not survive a deploy | P0 |
| 1.10 | `error.tsx`, `global-error.tsx`, `loading.tsx` per route group | No error boundary or loading state exists anywhere | P0 |
| 1.11 | Verify and fix every route at phone width | No route has ever been seen at mobile size | **P0** |
| 1.12 | CI running tests, lint, type-check, build | Only ever run by hand | P1 |
| 1.13 | Rate limiting on auth and the sweep endpoint | Unthrottled | P1 |
| 1.14 | Lighthouse baseline for all routes | No LCP, INP or CLS number exists | P1 |
| 1.15 | Production image strategy: self-host or pre-optimise, `sizes`, blur placeholders | Eight remote images pending after 3.5s in dev | P1 |
| 1.16 | Hero photograph matching the brief, a student walking into a campus | 66 candidate ids checked by eye without finding the composition. Needs the Unsplash key or supplied assets | P1 |
| 1.17 | **Publish dMAT.** New APS India Digital Master Test, mandatory from summer semester 2027 for Indian Bachelor's holders in Engineering, Commerce, Finance, Economics or Business. EUR 150, separate from the APS fee. Our stated audience is almost exactly the trigger population and our site does not mention it | **P0** |
| 1.18 | Add the dMAT exemption list, including the transitional exemption for anyone who registered or submitted APS before 29 June 2026 | P0 |
| 1.19 | Add the dMAT cycle dates to the Policy Desk, and state that it is not a pass-fail barrier | P0 |

---

## Phase 2 — Complete what is already promised

Every "not connected yet" notice becomes a connection or a dated decision.

| ID | Item | Why | Priority |
|---|---|---|---|
| 2.01 | Document storage plus malware scanning | The upload pipeline refuses everything by design until both exist | **P0** |
| 2.02 | Document Intelligence live, with staging and per-field confirmation | Built and gated; cannot run | P0 |
| 2.03 | Document versioning, old versions retained | Spec requires it; nothing can write a second version yet | P1 |
| 2.04 | `ANTHROPIC_API_KEY` and a live run of all six model agents | **No model call has ever executed. Largest untested surface in the codebase** | **P0** |
| 2.05 | Adversarial live testing of the prohibition checks against real model output | Guards are proven against mocked strings only | P0 |
| 2.06 | Email and WhatsApp providers with retry, backoff and status transitions | `deliveryStatus` never leaves `queued` | P1 |
| 2.07 | Consultation scheduling (Cal.com or Zoho) plus Razorpay | The booking form takes no booking | P1 |
| 2.08 | Open Ledger write path, founder gated | Rows are repository-edited content | P1 |
| 2.09 | Commission change history | Required by the source guide schema | P2 |
| 2.10 | Retention deletion enforcement | The clock computes; nothing deletes | P2 |
| 2.11 | MFA for staff accounts | We publish it as a requirement | P1 |
| 2.12 | Backups and a tested restore | Follows the database | P2 |
| 2.13 | Structured logging and error tracking | No aggregation | P2 |
| 2.14 | Per-agent cost and volume tracking, budget caps | No spend signal | P2 |

---

## Phase 3 — Country completeness and honest tools

The per-country content becomes complete and curated, and a stranger gets real
value without an account.

### 3a. Data model

| ID | Item | Priority |
|---|---|---|
| 3.01 | Per-destination financial thresholds, varying by country and by city | P1 |
| 3.02 | Post-arrival obligations model: registration, insurance activation, work-hour limits | P1 |
| 3.03 | Per-destination visa document checklist behind the Visa stage | P1 |
| 3.04 | Named curator and verification date on every requirement set, replacing the current nulls | P1 |
| 3.05 | Intake deadlines as dates, not month names | P1 |

### 3b. United Kingdom content

| ID | Item | Priority |
|---|---|---|
| 3.06 | Maintenance funds: GBP 1,529 London, GBP 1,171 outside, up to nine months, plus outstanding CAS tuition | P1 |
| 3.07 | The 28 consecutive day funds rule | P1 |
| 3.08 | Immigration Health Surcharge, GBP 776 per year | P1 |
| 3.09 | TB test certificate, required from India | P1 |
| 3.10 | ATAS certificate for certain STEM programmes | P2 |
| 3.11 | IELTS for UKVI versus Academic as distinct tests | P1 |
| 3.12 | Credibility interview | P2 |
| 3.13 | Term time work rights | P2 |
| 3.14 | CAS as a dated dependency | P2 |

### 3c. Germany content

| ID | Item | Priority |
|---|---|---|
| 3.15 | anabin recognition guidance and the three versus four year bachelor distinction | **P1** |
| 3.16 | Studienkolleg pathway | P1 |
| 3.17 | German language qualifications: TestDaF, DSH, telc, Goethe, with levels | P1 |
| 3.18 | Semester contribution as a figure | P2 |
| 3.19 | Health insurance: statutory versus private, and who qualifies | P1 |
| 3.20 | Visa appointment lead time as the binding timeline constraint | P1 |
| 3.21 | City registration after arrival | P2 |
| 3.22 | Work rights in full and half days | P2 |
| 3.23 | Application deadlines: mid July winter, mid January summer | P1 |

### 3c2. Germany, from the nxtstep-de comparison

| ID | Item | Priority |
|---|---|---|
| 3.43 | **Modified Bavarian Formula grade calculator**, clamped 1.0 to 4.0 with the German bands. Our own conversion, with the honest caveat that the university or uni-assist decides | P1 |
| 3.44 | **ECTS credit mapping**: total credits, subject-wise credits, core and mathematics requirements, technical subjects, and missing prerequisites. This is how German Master's admission actually works and nothing in our model represents it | **P1** |
| 3.45 | **APS workflow depth**: document checklist, step sequence, and the common mistakes that cause rejection, such as mismatched names across documents and a missing semester transcript | P1 |
| 3.46 | LOM, Letter of Motivation, modelled as distinct from an SOP | P2 |
| 3.47 | Europass CV guidance | P2 |
| 3.48 | uni-assist versus direct application, presented as the real choice it is | P2 |
| 3.49 | dMAT preparation guidance, once the requirement itself is published | P2 |

### 3d. Ireland content

| ID | Item | Priority |
|---|---|---|
| 3.24 | Proof of funds, EUR 10,000 per year, six months of statements | P1 |
| 3.25 | EUR 6,000 tuition paid before the visa application | P1 |
| 3.26 | Private medical insurance, EUR 25,000 accident and EUR 25,000 disease. Replaces the mislabelled "accommodation" step | P1 |
| 3.27 | IRP registration, EUR 300, first in person | P1 |
| 3.28 | Stamp 2 conditions and work rights | P2 |

### 3e. First-run experience and tools

| ID | Item | Priority |
|---|---|---|
| 3.29 | New-student onboarding: profile capture then a real portal state | **P0** |
| 3.30 | Progressive multi-step intake replacing the single long form | P1 |
| 3.31 | Cost of living calculator, **ungated**, line-itemised, sources cited | P1 |
| 3.32 | Requirements-met checklist per destination, factual, no probability | P1 |
| 3.33 | Grade converters, seven variants: CGPA to percentage, CGPA to marks, CGPA to GPA, percentage to GPA on three scales, percentage to marks, SGPA to CGPA, GPA calculator | P2 |
| 3.34 | IELTS band calculator: four section scores, equal weighting, half-band rounding, 0 to 9 descriptor table | P2 |
| 3.50 | **German grade calculator, Modified Bavarian Formula.** Inputs degree, university, obtained, maximum, passing. Clamped 1.0 to 4.0. Bands Sehr gut, Gut, Befriedigend, Ausreichend | P1 |
| 3.51 | Calculator **shows its arithmetic**: the substituted formula with the student's own numbers | P1 |
| 3.52 | Calculator names its source and carries a verification date | P1 |
| 3.53 | Preset scales with max and pass prefilled: 10-point CGPA, percentage, 4-point GPA | P2 |
| 3.54 | Calculator states its limits: universities may convert differently, uni-assist decides | P1 |
| 3.55 | Copy the working to clipboard | P3 |
| 3.56 | Link the converted grade to the requirements checklist | P2 |
| 3.57 | All calculators ungated. No signup to see a result, ever | **P1** |
| 3.35 | Accessibility audit and fixes across all routes | P1 |
| 3.36 | Component and browser tests for marketing and portal | P1 |
| 3.37 | Loading and skeleton states | P2 |
| 3.38 | Sortable, filterable, searchable caseload | P2 |
| 3.39 | Per-case SLA indicator | P2 |
| 3.40 | Notification preferences UI for students | P2 |
| 3.41 | Wider correction scope: name, counsellor, deadlines, references | P2 |
| 3.42 | One-click summarise on the case page | P3 |

---

## Phase 4 — The catalogue

The largest capability gap, built to carry the disclosure both benchmarks omit.

| ID | Item | Priority |
|---|---|---|
| 4.01 | University and programme data model, seeded for three destinations only | **P0** |
| 4.02 | University profile pages: entry requirements, fees, intakes, rankings, cost of living, **commission status per institution** | P0 |
| 4.03 | Course search with filters, **every row showing what we earn** | **P0** |
| 4.04 | Course detail pages with intake tables and entry requirements | P1 |
| 4.05 | Left-rail filters with explicit Apply, matching the pattern students know | P1 |
| 4.06 | Matching upgraded to university and programme level | P1 |
| 4.07 | Scholarship finder | P2 |
| 4.08 | Comparison tool, which neither benchmark has | P2 |
| 4.09 | Full destination guide pages, fifteen section template, with a verification date on every figure | P2 |
| 4.10 | Country sub-pages: cost of studying, cost of living, scholarships, jobs, post-study work | P2 |
| 4.11 | Top universities table with rankings per country | P2 |
| 4.12 | Cost of living broken into line items, in EUR/GBP and INR | P2 |
| 4.13 | Visa fee and components stated as figures per country | P1 |
| 4.14 | Work rights stated concretely per country | P1 |
| 4.15 | Quick-entry chips under the hero, once there is somewhere to send them | P2 |
| 4.16 | Caching of verified university data | P3 |
| 4.17 | University card fields: name, logo, flag, ranking **with the body named**, international students, course count, commission badge | P1 |
| 4.18 | List sort options that each **state what they order by**. Never an undefined "popularity" | P1 |
| 4.19 | Tabbed university profile: Overview, Admissions, Rankings, Courses and Fees | P1 |
| 4.20 | Profile highlights: established, total students, international students, staff ratio, acceptance rate, accreditation | P1 |
| 4.21 | Exam minimums **split undergraduate versus postgraduate**, with "Not required" as an explicit value | P1 |
| 4.22 | Rankings from multiple bodies with year history | P2 |
| 4.23 | Intakes with an open or closed status flag | P1 |
| 4.24 | Course card fields: fee marked indicative, duration, next intake with expandable further dates, badges | P1 |
| 4.25 | Course detail with a full intake table, campus per intake | P1 |
| 4.26 | Filters that **do not reset each other**, with explicit Apply and Reset | P1 |
| 4.27 | A stated reason wherever a field is missing, never a bare "not available" | P1 |
| 4.28 | Source and verification date on every imported catalogue field | **P0 for the catalogue** |
| 4.29 | Scholarship record fields: name, institution, destination, level, award type, deadline | P2 |
| 4.30 | Related-search blocks at the foot of results pages | P3 |
| 4.31 | Rankings explorer, searchable and filterable | P3 |

---

## Phase 3g — UX, animation and design

Cross-cutting. Several are Phase 1 blockers, listed here so the design work sits
in one place.

| ID | Item | Priority |
|---|---|---|
| D.01 | Mobile verification of all 12 routes | **P0** |
| D.02 | Reduced-motion audit end to end | P1 |
| D.03 | Focus states and keyboard tab order walked on every route | P1 |
| D.04 | Loading and skeleton states | P1 |
| D.05 | Error boundaries per route group | P1 |
| D.06 | Empty state for a new account that has no case yet | **P0** |
| D.07 | Consistent card hover lift across all surfaces, not only destination cards | P2 |
| D.08 | Cap the reveal stagger so long lists do not crawl | P2 |
| D.09 | Photography for process, outcomes, policy and consultation | P2 |
| D.10 | Hero portrait matching the brief | P1 |
| D.11 | Print styles for the Open Ledger and the quarterly report | P2 |
| D.12 | Wide-table behaviour on mobile, ledger and catalogue | P1 |
| D.13 | Chart accessibility review beyond the screen-reader table | P2 |
| D.14 | Enforce radius and shadow tokens as new surfaces are built | P2 |
| D.15 | Navigation growth plan before the catalogue lands | P1 |
| D.16 | Sticky nav condensing on scroll | P3 |
| D.17 | Scroll to top on route change | P3 |
| D.18 | Table-of-contents jump list on long pages | P2 |
| D.19 | FAQ accordion closing long pages | P2 |
| D.20 | Tabbed layout for the university profile | P1 |
| D.21 | Progressive form with visual country cards before any personal data | P1 |
| D.22 | Persistent WhatsApp button with a pre-filled message | P1 |
| D.23 | Quick-entry chips under the hero once there is somewhere to send them | P2 |
| D.24 | Read time and updated date on articles | P2 |
| D.25 | Fee qualifier plus verification date wherever money is shown | P1 |

---

## Phase 5 — Audience and trust

| ID | Item | Priority |
|---|---|---|
| 5.01 | First quarterly outcomes report, refusals included | **P0 when the quarter closes** |
| 5.02 | Blog and content hub with a four-axis filter taxonomy, read time and updated dates | P1 |
| 5.03 | "Our numbers, one source" page listing every statistic, its source and its check date | P1 |
| 5.04 | FAQ accordions closing every long page | P2 |
| 5.05 | Table-of-contents jump lists on long pages | P2 |
| 5.06 | Verified reviews with ledger-grade verification | P2 |
| 5.07 | Counsellor profiles with checkable credentials | P2 |
| 5.08 | Persistent WhatsApp channel | P1 |
| 5.09 | Founder biography and photograph | P1 |
| 5.10 | Events and webinars | P3 |
| 5.11 | Bengaluru and nearby city pages | P3 |
| 5.12 | Student stories, once there are students | P3 |
| 5.13 | Reviews page structure: paginated, filterable by country and category, sortable, with course, university, flag, category tag, date and excerpt | P2 |
| 5.14 | Blog taxonomy with four filter axes: destination, topic, service, journey stage | P2 |
| 5.15 | Event card fields: title, date and time, city, mode physical virtual or hybrid, destination flags, study levels | P3 |
| 5.16 | Event filters beyond subject and sort, which is where IDP is weak at 157 events | P3 |
| 5.17 | City and office pages with address, hours, named contact and services | P3 |
| 5.18 | Journey spine as a navigable content structure, one model not three | P2 |

---

## Phase 6 — Services, with disclosure attached

| ID | Item | Priority |
|---|---|---|
| 6.01 | Loan comparison publishing rates, fees **and our referral remuneration** | P1 |
| 6.02 | Accommodation partners with disclosed referral terms | P2 |
| 6.03 | Forex, insurance, banking, SIM | P3 |
| 6.04 | Exam preparation, or a partnership | P3 |
| 6.05 | Mobile app | P4 |
| 6.06 | Additional destinations, only when answerable without looking anything up | P3 |
| 6.07 | Loan guidance page: process, lender categories, borrowing tips, and an explicit "we are not a lender" statement | P2 |
| 6.08 | Refund and cancellation policy with claim window, processing time and explicit refundable lists | P1 |
| 6.09 | Non-affiliation disclaimer naming APS India, DAAD and uni-assist | P1 |
| 6.10 | SOP guidance with annotated samples and a structural outline, coached not written | P2 |

---

## Deliberately not doing

Recorded so they are decisions, not oversights.

| Item | Reason |
|---|---|
| Admit predictor or probability score | Our guardrails forbid it, and neither benchmark's version returns a real prediction anyway |
| Signup wall on calculator results | LeapScholar's sharpest conversion mechanic and the exact opposite of our position |
| Catalogue silently scoped to paying partners | The thing we exist to correct |
| Repeating one CTA five times per page | IDP's pattern; wrong register |
| Emoji as a systematic tone device | LeapScholar's pattern; wrong register |
| Dark mode | Single locked light theme, deliberate |
| Undisclosed referral funnels | Every service partner carries its terms or we do not run it |

---

## Not engineering, and still gating launch

1. Written permission from each aggregator and university to publish their commission band
2. A lawyer on the data protection policy; four open items
3. Incorporation: CIN, GSTIN, registered address, grievance officer
4. Founder biography and photograph
5. Re-verification of every policy figure and requirement list at source, by a named person
