# Everything still to build

A resumable handover. Every open item from `BACKLOG.md`, with what it is, why it
is open, what unblocks it, and where in the codebase it goes.

**35 open of 207.** 18 blocked on something outside this repository, 17 not
blocked, most of which are a decision (funding, a partnership, a legal
policy call, a research-scope call) rather than a task. `STATUS.md` has the completed side.

Closed since the last handover: **1.11** and **D.01** (every route walked at a
real 390px viewport, two shared layout bugs found and fixed at their one common
cause) and **D.14** (the design-token inventory, then the lint rule it was
waiting on). Every P0 that needed nothing but a device is now done; what is left
at P0 needs a Supabase project or an API key.

Since then, on 2026-09-13, the whole frontend was ported to the UX Fest
reference design (commit `4710e4c`, recorded in `STATUS.md`). Content, domain
and data were untouched; two done items were not. **D.16** (the header
condensing on scroll) no longer exists in the ported `header.tsx`, and the five
`token-exempt` values from **D.14** were replaced by the reference's own class
system, so the lint rule now has nothing to exempt. Both are noted in place
below rather than re-opened silently.

State at handover: `npm test` 363 passing, `npm run lint` clean, `npm run build`
clean, `npm run smoke` clean across 71 checked URLs. This count does not yet
include the essential-implementation-plan work from the 10 September 2026
external audit (case creation, student account linking, offer records, the
pre-departure checklist, the funding plan, staleness enforcement) — that work
closes real gaps but was not on `BACKLOG.md`'s original 207, so it is
committed and tested but not yet reconciled into this count.

---

## Start here next session

In this order, because each one unblocks or de-risks what follows.

1. **Set `ANTHROPIC_API_KEY` and run the six agents once** (2.04, 2.05, P0).
   This is the largest untested surface in the codebase: no model call has ever
   executed, and the prohibition guards are proven only against mocked strings.
   Until this happens, six features are theoretical.
2. **Create the Supabase project** (1.07–1.09, P0). The code side is done and
   tested (see A1 below); this is now purely two environment variables away.
   Everything in Phase 2 that is not the API key waits behind it, plus 2.08,
   2.09 and 2.12 — and full durability for 2.10, whose deletion logic is
   already built and running against the in-memory store (see B3 below).
3. Everything left in the P1 through P4 lists (B2 through B5 below) is now
   blocked on something outside this repository, and each one names exactly
   what: real students, a real counsellor's credential, a real office
   address, a signed partnership, real funding, or the same durable store as
   item 2. Two were flagged by name rather than left to be found by
   reading the tables, and both are now resolved:
   - **S.07** (guardianship for under-18 applicants) needed an explicit
     decision from whoever owns the business's legal exposure, not an
     engineering judgement call. That decision has been made: keep the
     policy as published. The privacy policy's declined-under-18 position
     and its stated reason are correct as they stand; see B6 below.
   - **6.06** (a fourth destination) needed someone prepared to research it
     as thoroughly, and with sources as checkable, as the first three,
     rather than guessed from training data the way the two corrections
     already on record (Germany tuition, Ireland post-study) happened the
     first time. The decision made: not yet. Launch on the current three
     first; revisit a fourth destination once the business has grown into
     it. Effort went instead into deepening the existing three, the
     "University/course data model" line in Part B below.

---

## Part A — Blocked on something outside this repository

Eighteen items. Each is grouped by the one thing that unblocks it, so a single
decision clears a group.

### A1. A Supabase project — 3 items, all P0, code side now done

All three are code-complete and tested; what remains is a project existing.

| ID | Item | Where it went |
|---|---|---|
| 1.07 | Supabase project, schema, row level security mirroring the permission matrix | `supabase/migrations/0001_schema.sql`, `0002_rls.sql`, `0003_functions.sql`. The matrix mirrored is `src/domain/rbac.ts` |
| 1.08 | Migrate `data/store.ts` and `data/users.ts` | Done. Both files branch on `supabaseConfigured()` and fall back to the in-memory fixtures otherwise; nothing above either file changed |
| 1.09 | Durable audit trail, bounded reads | `src/domain/audit.ts` now reads and writes `audit_log` the same way. "Bounded" rather than a cursor pager: `recentAudit(limit)` and `auditFor(subjectId)` were already the only two read shapes anything calls, and both stay narrow queries rather than loading the table. Retention deletion of the case file itself is 2.10, now done separately (see B3 below); pruning the audit trail on the same clock is not, deliberately |

**Verification, not taken on faith.** `supabase/tests/rls-check.sql` seeded two
students, two counsellors, a manager and a founder and ran eleven assertions as
a real non-superuser Postgres role, including the fail-closed case (no actor
context set at all sees nothing). All eleven passed, checked by hand against
`can`/`visibleCases`. `supabase/README.md` has the full account, including what
was deliberately left out (Supabase Auth, a table per nested array, 2.09).

**Why it still matters, and what is genuinely left.** Every write is lost on
restart today, including a consent grant, a verification and a correction — the
platform states this on every authenticated page rather than hiding it, and
that stays true until a real Supabase project exists and `SUPABASE_URL` /
`SUPABASE_SERVICE_ROLE_KEY` are set. At that point the switch is the environment
variables, nothing else: `npm test`, `npm run lint` and `npm run build` all
pass today with no project configured, exercising the in-memory fallback path
exactly as before.

**Downstream, once a project exists:** 2.08, 2.09, 2.10, 2.12.

### A2. An Anthropic API key — 2 items, both P0

| ID | Item | Where |
|---|---|---|
| 2.04 | A live run of all six model agents | `src/domain/agents/` — `kernel.ts`, `registry.ts`, `implementations.ts` |
| 2.05 | Adversarial testing of the prohibition checks against real model output | `src/domain/agents/guards.ts`, and `tests/guardrails.test.ts` |

**Why it matters most.** The guards are the thing that makes the platform's
claims true: no agent may mark a document verified, draft a statement of
purpose, or produce a probability. Every one of those is currently proven
against a string a test wrote, not against a model that was actually trying to
be helpful. The six agents are Case Summary, Message Drafting, Document
Extraction, Application Completeness, Student Guidance and SOP Coaching.

**What "done" looks like:** each agent invoked at least once against a real
model, with the transcript reviewed; then a deliberate attempt to make each
agent cross its prohibition, with the refusal recorded as a test.

### A3. Object storage and a malware scanner — 3 items

| ID | Item | Priority | Where |
|---|---|---|---|
| 2.01 | Document storage plus malware scanning | P0 | `src/domain/uploads.ts`, `src/app/actions/upload.ts` |
| 2.02 | Document Intelligence live, with staging and per-field confirmation | P0 | `src/domain/extraction.ts`, `src/components/app/document-intelligence.tsx` |
| 2.03 | Document versioning, old versions retained | P1 | `DocumentRecord.version` exists on `src/domain/case.ts` and nothing can write a second one |

The upload pipeline refuses every file by design until both storage and a
scanner exist. That refusal is deliberate and should stay until it can be
replaced by a real accept.

### A4. Message delivery providers — 1 item

| ID | Item | Priority |
|---|---|---|
| 2.06 | Email and WhatsApp providers with retry, backoff and status transitions | P1 |

`deliveryStatus` never leaves `queued` in `src/domain/notifications.ts`. The
consent control that governs delivery now exists ahead of the delivery itself
(`src/components/app/channel-preferences.tsx`), and the planner already fails
closed on a missing opt in, so this is the transport and nothing else.

Also set `NEXT_PUBLIC_WHATSAPP_NUMBER` when the number exists: the persistent
contact control in `src/components/site/talk-to-us.tsx` reads it and renders the
button instead of the honest absence.

### A5. Scheduling and payment — 1 item

| ID | Item | Priority |
|---|---|---|
| 2.07 | Consultation scheduling (Cal.com or Zoho) plus Razorpay | P1 |

`src/app/actions/intake.ts` has a single branch, guarded by
`bookingIntegration.live` in `src/content/consultation.ts`, marked as the one
place a real hold and a real charge will be created. The refund policy at
`/refund-policy` already states the windows this will operate under.

### A6. Operational tooling that follows the database — 3 items

| ID | Item | Priority |
|---|---|---|
| 2.12 | Backups and a tested restore | P2 |
| 2.13 | Structured logging and error tracking | P2 |
| 2.14 | Per-agent cost and volume tracking, budget caps | P2 |

2.13 has a hook already: `src/components/ui/error-state.tsx` logs to the console
with a scope, and the error digest is printed to the reader so a support
conversation can quote it. Replace the console call with the tracker.

### A7. Photography — 3 items

| ID | Item | Priority |
|---|---|---|
| 1.16 | Hero photograph matching the brief, a student walking into a campus | P1 |
| D.09 | Photography for process, outcomes, policy and consultation | P2 |
| D.10 | Hero portrait matching the brief | P1 |

66 candidate Unsplash ids were checked by eye without finding the composition.
Needs an Unsplash key or supplied assets. Every image id lives in
`src/content/photos.ts` with its credit; changing the ids is the whole job.

### A8. Real-world facts we do not have — 2 items

| ID | Item | Priority | Blocked on |
|---|---|---|---|
| 5.01 | First quarterly outcomes report, refusals included | P0 when the quarter closes | A closed quarter with real cases in it |
| 5.09 | Founder biography and photograph | P1 | The founder |

`src/domain/reporting.ts` already builds the report; it has nothing to count.

### A9. Also outside engineering

Recorded in `BACKLOG.md` and worth repeating, because three of them gate launch
rather than a feature:

1. Written permission from each aggregator and university to publish their
   commission band. Until then every band stays `unverified`, which the type
   system enforces.
2. A lawyer on the five legal pages. Each is published as a complete draft that
   says so at the top and lists its own gaps.
3. Incorporation: CIN, GSTIN, registered address, and a named grievance officer.
   The footer fields and the privacy policy's complaints section both hold the
   shape and refuse to invent a value.

---

## Part B — Not blocked

Fifty-seven items. Ordered by priority, then by what they touch.

### B1. P0 — done

| ID | Item |
|---|---|
| 1.11 | Verify and fix every route at phone width |
| D.01 | Mobile verification of all routes |

**Done, and it found two real bugs the structural audit could not.** Fifty
routes were loaded at a genuine 390px viewport and measured for horizontal
scroll. `resize_window` still does not shrink this machine's viewport (the tool
bug named in three previous sessions), so the routes were rendered in 390px
iframes against a production build instead — a real layout at a real width,
which is the thing that had never been done.

Two causes, both fixed at the one place every caller shares rather than per
page:

1. **`.overflow-x-auto { position: relative }`** in `globals.css`. An
   absolutely-positioned descendant is only clipped by an overflow ancestor
   that is also its containing block. Every wide table sits in a *static*
   `overflow-x-auto` wrapper and carries `sr-only` labels, which are absolute:
   they escaped the wrapper, kept their static position out at the table's full
   608–704px width, and pushed the document sideways by up to 119px on nine
   routes. The wrapper scrolled correctly the whole time, which is exactly why
   reading the CSS never found this.
2. **The button primitive wrapped instead of overflowing.** `whitespace-nowrap`
   plus a fixed `h-11` sent any long label past the right edge; "Check your own
   eligibility for United Kingdom" widened the three `jobs` pages by 13px.
   Heights are now minimums and the label wraps and centres, so a one-line
   button is pixel-identical and a long one grows a second line.

Also fixed on the way: the homepage revenue chart's `sr-only` data table was
994px wide, because a `<table>` cannot shrink below its content and `sr-only`
was on the table itself. The wrapper now takes the clipping.

**Result:** all fifty routes measured at `scrollWidth == clientWidth`, zero
horizontal scroll, verified against `npm run build && npm start`, with
`npm run smoke` clean across 71 URLs in the same state.

### B2. P1 — 1 item

Seven of the original eight are done. What each session found:

- **4.06** — `src/domain/matching.ts` now attaches the catalogue's institutions
  to every proposed destination and route: commission band, a fee comparison
  against the stated budget, and a stated language requirement read against
  whatever test result is on file. Alphabetical, not ranked — see the "should
  not undo" list below. Tests in `tests/lifecycle.test.ts`.
- **F.08** — `/services/profile-evaluation` runs the same checklist logic
  ungated, then offers a written-evaluation request form. The request itself
  is honestly not deliverable yet: no contact channel is connected and no
  anonymous visitor's details are stored ahead of the security/DPDP
  foundation, so it validates and says exactly that, the same pattern
  `submitIntake` already uses for the paid consultation.
- **1.14** — `docs/LIGHTHOUSE.md`. Found and fixed a real one: `--color-muted`
  failed WCAG AA contrast (3.75–3.99:1) against both `bg-paper` and
  `bg-surface`, used sitewide for captions and sources. Also fixed an invalid
  `<dl>` structure on the homepage's destination cards, three footer text
  tones too faint even for the fixed token, and one hero card's bespoke
  background. Home page accessibility: 89 → 100. The doc is explicit about
  which of its own numbers are trustworthy: this machine's `npx lighthouse`
  repeatedly failed to clean up its Chrome process on Windows, and the
  resulting pile-up inflated later TBT readings by 10x+ in the same run.
- **1.15** — The hero portrait was passed a `preload` prop, which does not
  exist on `next/image` and silently did nothing, so the likely LCP element on
  the busiest page was never actually prioritized. Fixed to `priority`, given
  a real `sizes`, and self-hosted (`src/content/photos-assets/`) so it also
  gets a blur placeholder. The four destination cards got the `sizes` they
  were missing but stay on Unsplash's CDN; they are not the LCP candidate.
- **3.36** — Added `@testing-library/react` and `jsdom` (devDependencies only)
  and `tests/filter-rail.test.tsx`, `tests/grade-converter.test.tsx`. Use the
  `// @vitest-environment jsdom` docblock per file, not a global config
  switch, so the existing pure-logic suite stays on the faster node
  environment. `tests/stubs/jest-dom-setup.ts` registers `afterEach(cleanup)`
  by hand, since this project does not run with vitest's `globals: true`.
- **D.02** — Every motion component already branched correctly on
  `useReducedMotion`; nothing to fix. Verified, not assumed: read all five.
- **D.03** — Found and fixed two real gaps. The header's dropdown menu had no
  `onBlur` handler, so tabbing through it and past it left a stale menu open
  over the page with no way to close it but Escape. `TalkToUs`'s panel claims
  `role="dialog"` but moved no focus on open and returned none on close;
  fixed with a pair of refs. `positive tabindex` and `div`-with-`onClick`
  anti-patterns: none found anywhere in the codebase.

| ID | Item | Where | Note |
|---|---|---|---|
| 2.08 | Open Ledger write path, founder gated | `src/content/ledger.ts` is repository-edited content today | Wants durable storage first, but the RBAC action already exists |

### B3. P2 — 13 of 22 done this session

**Done.** What each one turned into:

- **4.29 / 4.07** — `src/content/scholarships.ts` models five real, named schemes
  (Chevening, GREAT, DAAD EPOS, Erasmus Mundus, Government of Ireland) the
  same way the catalogue is modelled: a `Field<T>` per value. A deadline is
  never stated as a specific current-cycle date unless that date is already
  public; otherwise it is framed as the historical cycle with a qualifier
  pointing at the funder's own page, or left `unknown` with a reason.
  `/scholarships` lists and filters them by destination.
- **4.10** — `/destinations/[slug]/[topic]` for five topics (cost of studying,
  cost of living, scholarships, jobs, post-study work) across all three
  countries, fifteen static pages, all reading the same `DestinationGuide` and
  `scholarships` data the full guide already renders. No new research.
- **4.11** — `/universities/rankings`. Alphabetical by institution, never by
  rank: a QS band and a Times Higher band are different scales, and ordering
  by them would be a number nobody published.
- **F.06** — `/masters-in-germany`, `/masters-in-uk`, `/masters-in-ireland`,
  each the same `applyFilters`/`FilterRail`/`CourseCard` the general catalogue
  uses, pinned to one destination, with its own metadata. Only "Masters"
  exists as a landing page because the seeded catalogue has zero Bachelor's
  programmes; a "Bachelors in X" page would be an empty page.
- **F.07** — The "Courses" nav group now carries the three Masters pages,
  Rankings and Scholarships alongside the catalogue search.
- **F.03** — The shortlist comparison table gained a "Where you stand" row: it
  reads the signed-in student's own onboarding profile against each row's own
  destination (not one fixed destination, since a shortlist can span
  countries) and states met/not-met/cannot-tell counts. It does not reorder
  the columns, and the page's existing "there is no best row" copy was
  extended to say so explicitly, because sorting a side-by-side comparison
  by eligibility would have meant reordering courses by a count that reads
  exactly like a ranking.
- **5.18** — `/process/[stage]`, one page per stage, with what you receive,
  hand-picked links to pages that already exist for that stage (skipped
  entirely for stages with no genuine link rather than inventing one), and
  previous/next navigation. Linked from the homepage timeline.
- **3.41** — see the B2 write-up above; done alongside the other correction
  work.
- **D.13** — Reviewed `revenue-chart.tsx` in full: `role="img"` with a
  complete `aria-label`, a full `sr-only` data table, a hatch pattern
  distinguishing unconfirmed ranges from color alone, and no interactive
  state to make keyboard-accessible. Nothing to fix, verified rather than
  assumed.
- **4.15 / D.23** — `HeroQuickLinks` under the hero on the homepage, six
  pills straight to the catalogue, the checklist, the cost calculator and
  the three destination guides.
- **E.01** — Already satisfied, not duplicated. `/shortlist`'s "a shortlist
  needs an account" panel for a signed-out visitor is exactly this pattern,
  and it is the one place on the site an account earns its keep. Deliberately
  not added to the ungated tools: their own badge states "No signup. No
  email." and a save prompt there would contradict a promise the site makes
  on the page itself.
- **E.03** — One inline widget, at the midpoint of every article's body, not
  several: a "check your own profile" prompt pointed at the destination the
  article is about, or the general checklist if it is not about one
  destination. "Adopt sparingly" was the audit's own verdict on this pattern.

**5.06, 5.13, 5.07 — done in the only honest form available.** The engine and
the page are both real and production-ready; what they wait on is a real
outcome and a real credential, not more code:

- `src/content/reviews.ts` models a review the way the Open Ledger models a
  commission figure: `verifiedBy: string | null`. `publishableReviews()` is
  the only path from the list to the page and it filters out anything with
  no named verifier — pinned in `tests/reviews-counsellors-events.test.ts`.
  `/reviews` is paginated, filterable by destination and by outcome
  (refusals included as their own filter value, not hidden), and sortable
  by verification date. It starts, correctly, completely empty.
- `src/content/counsellors.ts` and `/counsellors` follow the identical
  shape: a credential is either checked against the issuing body by a named
  person, or the profile does not render.

**2.10 — closed in a later session.** `retentionFor` in `src/domain/retention.ts`
computed the clock; it had nothing to trigger. `src/data/store.ts`'s
`enforceRetention()` now deletes a case past its retention date and is wired
into the daily `/api/sweep`, right before `syncNotifications` so nothing gets a
fresh reminder queued moments before it is removed. Both modes stay in parity:
Supabase mode clears the referencing student account's `case_id` first (the
foreign key would otherwise refuse the delete) and lets `on delete cascade`
take the rest; in-memory mode filters every dependent array by hand the same
way. Two things this does not do, stated rather than glossed: it does not
survive a restart until the same Supabase project as A1 exists, and it does
not prune the audit trail for the deleted case, which `content/legal.ts` and
`domain/security-posture.ts` both still say plainly. Tests in
`tests/store.test.ts`'s "retention deletion runs on the sweep" block.

**Still open**

| ID | Item | Note |
|---|---|---|
| 3.49 | dMAT preparation guidance | The requirement is now published across four surfaces. Preparation guidance is the follow-up, and it should wait until the test's format is actually known rather than guessed |
| 2.09 | Commission change history | Required by the source guide schema. Needs storage |
| 6.02 | Accommodation partners with disclosed referral terms | `/services` already carries the disclosure shape and states that nobody pays us today. Adding a partner means filling in `remuneration: { kind: "referral", weEarn }` and the page renders the warning treatment automatically |

**D.14 — done, inventory first, then the rule.** The previous session declined
to ship a blanket lint rule without knowing which arbitrary values were drift
and which were deliberate. That inventory was done: 18 arbitrary radius and
shadow values, of which 13 were drift and are now tokens (seven flag images
carried `rounded-[2px]` and `rounded-[3px]` for the same 2px corner, now
`rounded-xs`; the hero picker's `rounded-[0.625rem]` was `rounded-input`
exactly). Five are real and stay, each carrying
`eslint-disable-next-line no-restricted-syntax -- token-exempt: <why>`: the
hero panel's 28/36px radius and its cut-corner notch and portrait, the picker's
blue-tinted glow, and the primary button's 1px contact shadow. The rule is
`no-restricted-syntax` in `eslint.config.mjs` matching `rounded-*-[` and
`shadow-[` across `Literal` and `TemplateElement`, so it catches values inside
`cn()` calls and not just JSX attributes; it was verified to fire on a probe
before the probe was deleted. The design port of 2026-09-13 then replaced the
five exempted values with the reference's own component classes; the rule is
unchanged and still runs, and `src` now carries zero arbitrary radius, shadow
or hex values and zero exemptions.

### B4. P3 — 6 of 20 done this session

**Done.**

- **3.42** — `resummarise` in `src/app/actions/case.ts`, and a "Read the case
  again" button in the case page's Notes panel (`ResummariseButton` in
  `case-controls.tsx`). Same agent, same prohibitions, same fields it may
  write as the note-triggered path; the only difference is what caused the
  run.
- **4.30** — `RelatedSearches` (`src/components/catalogue/related-searches.tsx`),
  built from queries the catalogue can actually answer — three
  destination-filtered views, zero commission, rankings, scholarships, and
  the top disciplines by how many programmes carry them — not decoration.
  On `/universities` and all three "Masters in X" pages.
- **4.31** — `/universities/rankings` gained a text search (institution or
  city) and filters by destination and by ranking body, all as GET
  parameters, so a filtered result is a real URL.
- **D.16** — The header now reads scroll position and condenses its height
  (h-18 to h-14) and logo size past an 8px threshold, with a CSS transition
  the global reduced-motion rule already collapses. **Undone by the design
  port of 2026-09-13:** the ported `header.tsx` carries no scroll listener and
  no condensed state. It is a P3 in `BACKLOG.md`; re-do it against the new
  `.Header` classes or record a decision not to.
- **D.17** — Found the actual cause: Lenis (the smooth-scroll library
  wrapping the whole app) owns scroll position once mounted, so the browser's
  native scroll-to-top-on-navigation never visibly did anything — the native
  offset moved, Lenis's virtualised one did not. Fixed with a small
  `usePathname` + `useLenis().scrollTo(0, { immediate: true })` effect in
  `smooth-scroll.tsx`, active only in the Lenis-mounted branch; the
  reduced-motion branch never had the bug since it uses native scrolling.
- **F.09** — `/tools/english-tests` compares IELTS, TOEFL iBT, PTE Academic
  and the Duolingo English Test on scale, sections, format, validity and
  whether each has historically been on the UK's Secure English Language
  Test list, with an official link per test. Deliberately no cross-test
  score conversion table (concordance guidance varies by publisher and
  changes over time) and deliberately excludes GRE, GMAT and SAT: this
  business covers three destinations for Master's applicants, and none of
  the existing destination guides names any of the three as a requirement.
  Also covers F.10's real content (an official resources link per test)
  without recommending specific books, which would be a commercial claim
  needing a currency this session cannot verify.

**Investigated, not done.** 4.16 (caching of verified university data): there
is nothing to cache. The whole catalogue is forty-five institutions and
fifty-two programmes held in memory, with no external fetch anywhere in the path, and
every read is a plain synchronous loop over that array. Wrapping it in a
cache would add a layer with nothing slow underneath it.

**Investigated, framework behaviour, deliberately not patched.** On a full
document load of any route group that has a `loading.tsx`, the live DOM ends
up with the whole page twice: once in `main`, and once inside
`<div hidden id="S:0">` left over under `body`. Measured on 2026-09-17
against a production build: identical text on both copies, ~300 KB of hidden
DOM per page, and a second `<h1>` that `hidden` keeps out of the
accessibility tree. The served HTML has one of everything, no console error,
and the (auth) group — no `loading.tsx`, so no boundary — is clean. The
cause is React 19.2's batched-reveal streaming protocol (the served `$RC`
pushes to `$RB` and defers `$RV` by a frame or up to two seconds); under
Next 16.3.4 the reveal fills `main` but does not remove the holder. None of
it is app code. Removing `S:*` holders in an effect would race React's own
reveal, so the honest move is to leave it, re-check after the next Next or
React patch, and never "fix" it by deleting `loading.tsx`, which is 1.10.

**5.10, 5.15, 5.16, E.06 — done in the only honest form available.**
`src/content/events.ts` models an event's registration count as a
`Measured<number>`: `state: "pending"` with a reason until a real count
exists, never a plausible-looking placeholder that never moves, which was
the specific failure named in the audit this item came from. `/events`
lists upcoming and past separately, and today, correctly, lists nothing:
no webinar is scheduled.

**Still open, all blocked on something outside engineering**

| ID | Item | Note |
|---|---|---|
| 5.11, 5.17 | Bengaluru and nearby city pages; city and office pages with address, hours and a named contact | A specific office address and named on-site contact do not exist yet beyond "Bengaluru, Karnataka", already published in `content/site.ts`. A dedicated page would either restate that one fact or invent the rest |
| 5.12, E.02 | Student stories and student ambassadors, once there are students | |
| E.07 | Newsroom or digest as a separate stream | |
| 6.02, 6.03, 6.04 | Accommodation partners, forex, insurance, banking, SIM, exam preparation | Each needs a real signed partnership before there is a real term to disclose |
| 6.06 | Additional destinations | Deliberately not attempted this session. `content/destinations.ts` states the rule this backlog item repeats: "a country is added only once its full profile can be answered without looking anything up." Guessing at a fourth country's tuition, funding threshold and visa steps from training data, the way this session cannot verify against a live source, is exactly the failure mode that produced the Germany tuition and Ireland post-study corrections already on record |

### B5. P4 — one done, in the only honest form available; three genuinely need something from you

- **6.05** — Not a native app: there is no separate codebase, app store account
  or team for one, and building a half-working native shell would be exactly
  the "partially implemented flow" this project was told not to leave. What
  is real and shippable today is a web app manifest: `src/app/manifest.ts`,
  plus generated icons (`icon.tsx`, `apple-icon.tsx`, `icon-192/route.tsx`,
  `icon-512/route.tsx`, all rendered from the same navy-square "N" mark the
  header already uses, via `next/og`, so there is no separate icon asset to
  drift out of sync). The site installs to a home screen and opens without
  browser chrome. If an actual native app is still wanted, that is a
  different project with its own team and its own timeline, not a checkbox
  this session could tick.

| ID | Item | Needs |
|---|---|---|
| F.11 | Our own scholarship or fee waiver | Real money. There is nothing to engineer here; a fee waiver with no funds behind it is a lie the moment someone tries to redeem it |
| S.08 | ISIC or student discount card | A real partnership with ISIC or an equivalent issuer. Nothing to build until one exists |

### B6. Decided, not pending

| ID | Item | Decision |
|---|---|---|
| E.08 | Country switcher | Not applicable at three destinations |
| S.07 | Guardianship for under-18 applicants | Confirmed: keep the published policy. Under-18 applicants stay declined, for the reason already stated on `/privacy` — the DPDP Act requires verifiable parental consent and forbids tracking or targeted advertising directed at children, and the position taken is that getting that wrong is worse than the lost business. No code or copy change, since the policy already states this plainly rather than tentatively |

---

## Things a future session should not undo

Written down because each one looks like an omission and is a decision.

1. **No probability, score, match percentage or admission chance anywhere.**
   Not in the checklist, not in the shortlist, not in the catalogue, not in
   search. `tests/calculators.test.ts`, `tests/recognition.test.ts` and
   `tests/catalogue.test.ts` all assert the absence of the words.
2. **Every calculator is ungated and runs in the browser.** No result is ever
   withheld behind a form. Adding an email capture to a calculator would be the
   single most damaging change available.
3. **A catalogue field is a value with a source or an absence with a reason.**
   `Field<T>` in `src/content/catalogue/types.ts` has two shapes and no third.
   A test walks every field and fails on a reason short enough to be a
   non-answer.
4. **Every institution carries a commission band.** Required on the type, not
   optional, and printed on the card, the profile, the course page, the
   comparison and the search result.
5. **Sort options state what they order by.** A test refuses any labelled
   popularity, relevance or recommended.
6. **`requirementsFor` refuses a sibling-route fallback.** A Germany case with
   no route recorded gets told there is no list to check against, rather than
   being checked against the public university list.
7. **Filters are a GET form with an explicit Apply.** No control can clear
   another, the result is a real URL, and the back button works.
8. **The verification banners say zero.** No figure on this site has been
   re-checked at source by a named person, and `/our-numbers` prints that count.
   It should become non-zero by someone doing the checking, not by softening the
   copy.
9. **Synthetic fixtures are withheld from a production build.** Set
   `NEXT_SCHOLAR_DEMO_DATA=true` to walk the authenticated surfaces.
10. **Matching lists institutions alphabetically, never by an invented fit.**
    `universityMatchesFor` in `src/domain/matching.ts` sorts by name. A fee
    comparison and a language-requirement readout are stated as facts, not
    folded into a score or an order that would imply one.
11. **The shortlist comparison never reorders its columns.** The "Where you
    stand" eligibility row (F.03) states met/not-met/cannot-tell counts per
    saved course but the column order stays the order the student saved them
    in. Sorting a side-by-side comparison by an eligibility count would read
    exactly like the ranking the rest of the site refuses to compute.
12. **A scholarship's deadline is never a specific current-cycle date unless
    that date is already public.** `src/content/scholarships.ts` states a
    historical cycle with a qualifier, or leaves the field `unknown`, rather
    than asserting this year's date from a training-data snapshot that could
    be wrong by the time anyone reads it.
13. **No English test score converts into another test's score anywhere on
    this site.** `/tools/english-tests` compares scale, format and SELT
    status side by side and stops there. A concordance table between IELTS,
    TOEFL, PTE and Duolingo looks precise, varies by publisher, and changes
    over time; the offer letter's own named test and threshold governs, not
    an equivalence this site computed.
14. **A review or a counsellor profile cannot render without a named
    verifier, and there is no rating number.** `publishableReviews` and
    `publishableCounsellors` in `src/content/reviews.ts` and
    `counsellors.ts` are the only paths to `/reviews` and `/counsellors`,
    and both filter out anything with `verifiedBy: null`. Do not add a
    "draft" or "pending" review state that renders anyway, and do not add a
    star rating: it would be a number this site computed, not one the
    reviewer gave.
15. **An event's registration count is a `Measured<number>`, never a
    plausible-looking placeholder.** `src/content/events.ts` states
    `{ state: "pending", reason }` until a real count exists. The benchmark
    this item was audited against runs counters that never move; that is
    the specific failure this shape exists to prevent.

---

## Running it

```bash
cd web
npm install
npm run dev          # http://localhost:3000

npm test             # 363 tests
npm run lint
npm run build        # type checks as part of the build

npm start &          # the smoke check needs a running production build
npm run smoke        # 71 routes: structure, and the three route guards
```

`web/.env.example` lists every optional key. Each unset one produces a stated
"not connected" state rather than a fabricated result, so the whole site runs
with none of them set.

Running Lighthouse locally (`npx lighthouse <url> --chrome-flags="--headless=new"`)
on Windows: `chrome-launcher` has failed to clean up its own Chrome process
after almost every run this session, leaving zombies that pile up across
repeated runs and quietly wreck the timing numbers of whichever run follows
(see `docs/LIGHTHOUSE.md`). Run `taskkill //F //IM chrome.exe //T` between
runs, or don't trust a TBT or LCP figure from a batch you didn't check for
leftover `chrome.exe` processes first.
