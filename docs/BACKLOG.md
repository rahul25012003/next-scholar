# Master implementation backlog

Every outstanding item, numbered, from all four audits. Nothing here removes or
replaces anything that already works.

Sources: `ROADMAP.md` (project audit and benchmark gap analysis),
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
| 3.33 | Grade converters: CGPA to percentage, to GPA, SGPA, percentage to GPA | P2 |
| 3.34 | IELTS band calculator with descriptor table | P2 |
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
