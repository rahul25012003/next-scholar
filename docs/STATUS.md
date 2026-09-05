# Build status, September 2026

What has been implemented against `BACKLOG.md`, what is still open, and why each
open item is open. The backlog itself is left unedited so the two can be read
against each other.

**152 of 207 backlog items done, 55 open.** Of the 55, 18 are blocked on
something outside this repository and 37 are not. `REMAINING.md` breaks all 55
down with what unblocks each and where it goes.

Verified at the point of writing: `npm test` 327 passing, `npm run lint` clean,
`npm run build` clean, `npm run smoke` 66 routes clean against a production
build.

---

## Done

### Phase 1 — Correctness

| ID | Item | Where |
|---|---|---|
| 1.01 | Baden-Wurttemberg EUR 1,500 per semester exception, everywhere tuition is stated | `content/destinations.ts`, `content/guides/germany.ts`, the catalogue for KIT and Stuttgart |
| 1.02 | Blocked account EUR 11,904 a year, EUR 992 a month | Germany guide, policy desk, requirements checklist |
| 1.03 | Ireland post-study corrected to 12 renewable once, Level 8 gets 12 | `content/destinations.ts`, Ireland guide, an article |
| 1.04 | `route` on the case record | `domain/case.ts`, and `requirementsFor` refuses a sibling-route fallback |
| 1.05 | `german-test` and `degree-recognition` document categories, one `LanguageTestResult` shape for every language | `domain/case.ts`, `domain/consent.ts` |
| 1.06 | Degree recognition: anabin rating, bachelor duration, ECTS credits, Studienkolleg | `domain/recognition.ts`, surfaced on the console above the document checklist |
| 1.10 | `error.tsx` per route group, `global-error.tsx`, `loading.tsx` | `app/(marketing)`, `app/(app)`, `app/(auth)` |
| 1.12 | CI running lint, tests, build and a route smoke check | `.github/workflows/ci.yml` |
| 1.13 | Rate limiting on both auth actions and the sweep endpoint | `domain/rate-limit.ts` |
| 1.17 | dMAT published: scope, fee, and that it is not pass or fail | Policy desk, Germany guide, requirements checklist, an article |
| 1.18 | dMAT exemptions including the 29 June 2026 transitional one | Same, plus the checklist asks the question directly |
| 1.19 | dMAT on the policy desk with its cycle framing | `components/marketing/policy-desk.tsx` |

### Phase 2 — Completing what was promised

| ID | Item | Note |
|---|---|---|
| 2.11 | Contact channel consent control | Students grant and withdraw their own; a staff account is refused |

### Phase 3 — Country completeness and honest tools

| ID | Item |
|---|---|
| 3.01 | Per-destination financial thresholds, varying by country and city |
| 3.02 | Post-arrival obligations per destination |
| 3.03 | Per-destination visa document checklist |
| 3.04 | Source on every requirement set, plus `statedOn`, with `curatedBy` honestly null |
| 3.05 | Intake deadlines as dates |
| 3.06–3.14 | UK content in full: maintenance funds, the 28 day rule, IHS, TB test, ATAS, IELTS variants, credibility interview, work rights, CAS |
| 3.15–3.23 | Germany content in full: anabin, Studienkolleg, German qualifications, semester contribution, insurance, appointment lead time, registration, work days, deadlines |
| 3.24–3.28 | Ireland content in full, including replacing the mislabelled "accommodation" visa step with private medical insurance |
| 3.29 | New-student onboarding, then a real portal state |
| 3.30 | Progressive three-step intake |
| 3.31 | Cost of living calculator, ungated, line-itemised, sourced |
| 3.32 | Requirements-met checklist, factual, no probability |
| 3.33 | Grade converters, eight variants |
| 3.34 | IELTS band calculator with the descriptor table |
| 3.35 | Structural accessibility pass: one h1 per route, alt on every image, a caption on every table, no empty interactive elements, all asserted in CI |
| 3.37 | Loading and skeleton states |
| 3.38 | Sortable, filterable, searchable caseload |
| 3.39 | Per-case SLA indicator |
| 3.40 | Notification preferences for students |
| 3.43–3.48 | Modified Bavarian Formula, ECTS mapping, APS workflow depth, LOM, Europass, uni-assist versus direct |
| 3.50–3.57 | The German grade calculator in full, with working shown, source, limits, presets, clipboard, and a link into the checklist. Ungated |

### Phase 4 — The catalogue

| ID | Item |
|---|---|
| 4.01 | University and programme model, seeded for three destinations |
| 4.02 | University profiles with commission status per institution |
| 4.03 | Course search, every row showing what we earn |
| 4.04 | Course detail with intake tables and entry requirements |
| 4.05 | Left-rail filters with an explicit Apply |
| 4.08 | Comparison tool |
| 4.09 | Destination guides, sixteen sections, verification date on every figure |
| 4.12 | Cost of living in line items, local currency and INR |
| 4.13 | Visa fees as figures per country |
| 4.14 | Work rights stated concretely per country |
| 4.17–4.28 | Card fields, sort options that state their ordering, tabbed profiles, highlights, exam minimums split by level, rankings with bodies and years, intake status flags, filters that do not reset each other, a stated reason on every missing field, source and date on every field |
| F.01 | Shortlist saved to an account |
| F.02 | Side by side comparison |
| F.04 | Site-wide search |
| F.05 | Subject taxonomy, as discipline filters and links |

### Phase 5 and 6 — Trust, content and services

| ID | Item |
|---|---|
| 5.02 | Content hub, four filter axes, read time computed, updated dates |
| 5.14 | The four axes themselves: destination, topic, service, journey stage |
| 5.03 | "Our numbers, one source", generated from the content modules |
| 5.04 | FAQ accordions |
| 5.05 | Table-of-contents jump lists |
| 5.08 | Persistent contact control, honest about the absent WhatsApp number |
| 6.01 | Loan guidance publishing that we earn nothing from any lender |
| 6.07 | Loan guidance page with an explicit "we are not a lender" |
| 6.08 | Refund and cancellation policy with real windows and figures |
| 6.09 | Non-affiliation disclaimer naming nine bodies |
| 6.10 | SOP guidance, coached not written |
| S.01 | Mock visa interview as a named deliverable |
| S.02 | Certification, translation and courier |
| S.03 | Video counselling |
| S.04 | Health insurance guidance |
| S.05 | Forex and money transfer, with the referral position stated |
| S.06 | Pre-departure briefing |
| E.04 | Sticky talk-to-a-counsellor |
| E.05 | Reassurance content for weak profiles, as an article |
| L.01–L.06 | Privacy, terms, cookies, refunds, non-affiliation, and the grievance route |

### Phase 3g — UX and design

| ID | Item |
|---|---|
| D.04 | Loading and skeleton states |
| D.05 | Error boundaries per route group |
| D.06 | New-account empty state |
| D.07 | One hover treatment across every card surface |
| D.08 | Stagger capped at four steps |
| D.11 | Print styles, expanding link URLs and opening accordions |
| D.12 | Every wide table scrolls inside its own container |
| D.15 | Navigation restructured for the catalogue |
| D.18 | Jump lists on long pages |
| D.19 | FAQ accordions |
| D.20 | Tabbed university profile |
| D.21 | Progressive form with country cards before any personal data |
| D.22 | Persistent contact control |
| D.24 | Read time and updated date on articles |
| D.25 | Qualifier plus date wherever money is shown |

### Phase 7 — Seven of the eight P1s not blocked externally

| ID | Item | Where |
|---|---|---|
| 4.06 | Matching upgraded to institution level: commission, a fee-versus-budget read, and a stated language requirement, per institution the catalogue has curated for the matched destination and route | `src/domain/matching.ts` |
| F.08 | Free profile evaluation given an actual route: the requirements checklist ungated at `/services/profile-evaluation`, plus a written-evaluation request that honestly states delivery is not connected yet | `src/app/(marketing)/services/profile-evaluation`, `src/components/marketing/evaluation-request-form.tsx` |
| 1.14 | Lighthouse baseline recorded, and two real bugs it found fixed: `--color-muted` failed WCAG AA contrast sitewide, and the homepage's `<dl>` markup was structurally invalid | `docs/LIGHTHOUSE.md`, `src/app/globals.css`, `src/components/marketing/destinations.tsx`, `src/components/site/footer.tsx`, `src/components/marketing/hero.tsx` |
| 1.15 | The hero image's `preload` prop (not a real `next/image` prop) fixed to `priority`, given a real `sizes`, and self-hosted with a blur placeholder | `src/components/marketing/hero.tsx`, `src/content/photos.ts`, `src/content/photos-assets/` |
| 3.36 | Component tests added for the filter rail's rendered form state and the grade converter's live input handling | `web/tests/filter-rail.test.tsx`, `web/tests/grade-converter.test.tsx`, `@testing-library/react` and `jsdom` added as devDependencies |
| D.02 | Reduced-motion audited end to end: all five motion-using components branch correctly on `useReducedMotion`. Nothing to fix, verified rather than assumed | — |
| D.03 | Focus and keyboard audit found and fixed two real gaps: the header dropdown had no way to close on blur, and `TalkToUs`'s dialog moved no focus on open or close | `src/components/site/header.tsx`, `src/components/site/talk-to-us.tsx` |

Only 2.08 (Open Ledger write path) remains open from the original eight; it is
genuinely blocked on durable storage, the same as items 1.07–1.09.

### Phase 8 — Thirteen more P2s, everything engineering could reach

| ID | Item | Where |
|---|---|---|
| 4.29, 4.07 | Scholarship record model and finder: five real, named schemes, each a `Field<T>` per value, deadlines framed as historical cycles rather than asserted as this year's date | `src/content/scholarships.ts`, `/scholarships` |
| 4.10 | Country sub-pages: cost of studying, cost of living, scholarships, jobs, post-study work, fifteen static pages across three destinations, all reading the existing guide and scholarship data | `/destinations/[slug]/[topic]` |
| 4.11 | Rankings table, alphabetical by institution and never by rank, because comparing a QS band against a Times Higher band would be a number nobody published | `/universities/rankings` |
| F.06 | "Masters in Germany/the UK/Ireland" landing pages, the same catalogue components pinned to one destination | `/masters-in-germany`, `/masters-in-uk`, `/masters-in-ireland` |
| F.07 | Nav carries the three Masters pages, Rankings and Scholarships | `src/content/site.ts` |
| F.03 | Shortlist gained a "Where you stand" row reading the student's own profile against each row's own destination, counts only, no reordering | `src/app/(marketing)/shortlist/page.tsx` |
| 5.18 | One page per journey stage, with hand-picked links to pages that already exist and no invented ones for stages that have none | `/process/[stage]` |
| 3.41 | Correction path widened to name, counsellor, a named deadline, and a named application's reference | `src/domain/case-operations.ts` |
| D.13 | Chart accessibility reviewed in full: complete `aria-label`, full `sr-only` table, a hatch pattern for colour-independent distinction, nothing interactive to make keyboard-accessible. Nothing to fix |
| 4.15, D.23 | Six quick-entry chips under the homepage hero | `src/components/marketing/hero.tsx` |
| E.01 | Already satisfied at `/shortlist`; deliberately not duplicated onto the ungated tools, whose own badge promises no signup ever |
| E.03 | One inline "check your own profile" widget per article, at the midpoint, matching the audit's own "adopt sparingly" verdict | `src/app/(marketing)/guides/[slug]/page.tsx` |

D.14 (a lint rule for radius and shadow tokens) was attempted and deliberately
not shipped: the codebase has legitimate bespoke arbitrary values (the hero
card's cut corner) that a blanket rule cannot distinguish from drift without
a real design-token audit first.

---

## Open, and why

### Blocked on something external

| ID | Item | Blocked on |
|---|---|---|
| 1.07, 1.08, 1.09 | Supabase, migration, durable audit | A Supabase project. Every write is still lost on restart, and the platform says so on every authenticated page |
| 2.01, 2.02, 2.03 | Document storage, Document Intelligence, versioning | Object storage plus a malware scanner. The upload pipeline refuses everything by design until both exist |
| 2.04, 2.05 | A live run of the six model agents, and adversarial testing of the prohibition checks | `ANTHROPIC_API_KEY`. No model call has ever executed; the guards are proven against mocked strings only. This remains the largest untested surface in the codebase |
| 2.06 | Email and WhatsApp delivery | Provider credentials. `deliveryStatus` never leaves `queued`, and the consent control now exists ahead of the delivery it governs |
| 2.07 | Scheduling and payment | A Cal.com or Zoho account and Razorpay keys |
| 2.12, 2.13, 2.14 | Backups, error tracking, per-agent cost caps | Follow the database and the API key |
| 1.16, D.09, D.10 | Photography | An Unsplash key or supplied assets |
| 5.01 | First quarterly outcomes report | A closed quarter with real cases in it |
| 5.09 | Founder biography and photograph | The founder |
| L.01–L.06 | Lawyer review, and a named grievance officer | Incorporation and a lawyer. The pages are published as complete drafts that say so at the top |

### Not blocked, not done

| ID | Item | Note |
|---|---|---|
| 1.11, D.01 | Mobile verification of every route | The structural checks pass in CI and every wide table scrolls in its own container. Nobody has looked at these routes on a phone, and that is not the same thing. The in-session Chrome browser tool has not been connected in either of the last two sessions |
| 2.08, 2.09, 2.10 | Ledger write path, commission change history, retention deletion | All three want durable storage first |
| 3.42 | One-click summarise | Small console addition |
| 3.49 | dMAT preparation guidance | Deliberately waiting until the test's format is known rather than guessing |
| 4.16, 4.30, 4.31 | Caching, related-search blocks, a searchable rankings explorer | Catalogue depth beyond what exists |
| 5.06, 5.07, 5.11–5.17 | Reviews, counsellor profiles, city pages, events | Need real students, real counsellors and a real office |
| 6.02–6.06 | Accommodation partners, forex, exam prep, mobile app, more destinations | Partnerships and scope decisions rather than engineering |
| D.14, D.16, D.17 | A design-token lint rule, nav condensing, scroll restoration | Polish |

---

## The correction record

Three figures this site published incorrectly, corrected in this phase, each
with the correction left visible rather than edited away:

1. **Germany tuition.** Published as "No tuition fee". Baden-Wurttemberg charges
   non-EU students EUR 1,500 a semester and has since 2017/18. Corrected on the
   destination row, in the guide, in the catalogue for the two affected
   institutions, and written up as an article.
2. **Ireland post-study.** Published as a flat 24 months. It is 12 months
   renewable once for Level 9 and above, and 12 months with no renewal for
   Level 8. Corrected in the same four places.
3. **The blocked account.** Listed on the policy desk as a figure needing
   reconfirmation when it is a published statutory minimum: EUR 11,904 a year,
   EUR 992 a month.

And one requirement the site did not mention at all: the **dMAT**, mandatory
from the summer semester 2027 intake for Indian Bachelor's holders applying to a
Master's in engineering, commerce, business, finance or economics. That is close
to a description of this business's stated audience.
