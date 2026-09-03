# Everything still to build

A resumable handover. Every open item from `BACKLOG.md`, with what it is, why it
is open, what unblocks it, and where in the codebase it goes.

**75 open of 207.** 18 blocked on something outside this repository, 57 not
blocked, one of which is a decision rather than a task. `STATUS.md` has the completed side.

State at handover: `npm test` 305 passing, `npm run lint` clean, `npm run build`
clean across 44 routes, `npm run smoke` clean across 52 routes.

---

## Start here next session

In this order, because each one unblocks or de-risks what follows.

1. **Look at the site on a phone** (1.11, D.01, both P0). The only P0 left that
   needs nothing but a device. Structural checks pass in CI and every wide table
   scrolls inside its own container, but nobody has actually seen a route at
   390px. Half a day, and it will find things.
2. **Set `ANTHROPIC_API_KEY` and run the six agents once** (2.04, 2.05, P0).
   This is the largest untested surface in the codebase: no model call has ever
   executed, and the prohibition guards are proven only against mocked strings.
   Until this happens, six features are theoretical.
3. **Create the Supabase project** (1.07–1.09, P0). Everything in Phase 2 that
   is not the API key waits behind it, plus 2.08, 2.09, 2.10 and 2.12.
4. Then the P1s in whatever order suits: 4.06 matching at programme level is the
   highest-value one now that the catalogue exists.

---

## Part A — Blocked on something outside this repository

Eighteen items. Each is grouped by the one thing that unblocks it, so a single
decision clears a group.

### A1. A Supabase project — 3 items, all P0

Nothing here is hard; it is gated on a project existing.

| ID | Item | Where it goes |
|---|---|---|
| 1.07 | Supabase project, schema, row level security mirroring the permission matrix | New. The matrix to mirror is `src/domain/rbac.ts` |
| 1.08 | Migrate `data/store.ts` and `data/users.ts` | `src/data/store.ts` and `src/data/users.ts` are the only two files that know where records live. Replace the function bodies; nothing above them changes |
| 1.09 | Durable audit trail with pagination and retention | `src/domain/audit.ts`, currently an in-memory ring |

**Why it matters.** Every write is lost on restart today, including a consent
grant, a verification and a correction. The platform states this on every
authenticated page rather than hiding it, but the disputed-figure promise on the
Open Ledger does not survive a deploy, which is a promise the business cannot
keep as things stand.

**Note on shape.** `store.ts` already enforces two rules the database must not
lose: a read is scoped by the permission matrix, and a read is recorded. Row
level security should mirror `visibleCases()` rather than replace it, so the
check exists in both places.

**Downstream, once this lands:** 2.08, 2.09, 2.10, 2.12.

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

### B1. P0 — 2 items, and they are the same item twice

| ID | Item |
|---|---|
| 1.11 | Verify and fix every route at phone width |
| D.01 | Mobile verification of all routes |

**Status.** A structural audit was done and what it found was fixed: every wide
table sits inside an `overflow-x-auto` container, every grid child holding a
scroller carries `min-w-0`, a global `overflow-wrap: break-word` stops a long
token widening the page, and `npm run smoke` asserts no inline pixel width over
100px on any route. None of that is the same as having looked.

**What to do.** Open all 20 public routes at 390px and walk them. The ones most
likely to break, in order: the university profile tab strip (`overflow-x-auto`
on a sticky bar), the shortlist comparison table (sticky first column), the
console caseload filter form (six controls in a `flex-wrap`), the cost of living
calculator's editable table, and the `TalkToUs` panel at the bottom right.

### B2. P1 — 8 items

| ID | Item | Where | Note |
|---|---|---|---|
| 4.06 | Matching upgraded to university and programme level | `src/domain/matching.ts` | The highest-value P1 now that the catalogue exists. Today it ranks destinations and routes only, and the comment saying it cannot rank universities "because nobody has curated the data" is now out of date: `src/content/catalogue/` has it. Keep the two existing rules — a reason stated per entry, and assumptions listed rather than folded in — and keep the commission on every proposal |
| F.08 | Free profile evaluation as a named, scoped product | Named on `/services`; needs the actual intake and delivery | The scoped product is described. What is missing is the route that takes a transcript and returns the written answer within three working days |
| 1.14 | Lighthouse baseline for all routes | New | No LCP, INP or CLS figure exists for any route. Run it, record the numbers in `docs/`, then decide what to fix. Guessing at performance work before measuring is the wrong order |
| 1.15 | Production image strategy | `next.config.ts`, `src/content/photos.ts` | `sizes` is set on the newer images; self-hosting or pre-optimising the eight remote ones is not done. Blur placeholders need the images to be local first |
| 2.08 | Open Ledger write path, founder gated | `src/content/ledger.ts` is repository-edited content today | Wants durable storage first, but the RBAC action already exists |
| 3.36 | Component and browser tests for marketing and portal | `web/tests/` | `npm run smoke` covers route structure; component behaviour is untested. The highest-value targets are the calculators' input handling and the filter rail's URL round trip |
| D.02 | Reduced-motion audit end to end | Every motion component | All of them read `useReducedMotion` and the global CSS rule collapses transitions, but nobody has turned the setting on and walked the site |
| D.03 | Focus states and keyboard tab order on every route | Every route | Same shape of gap: `:focus-visible` is defined globally in `globals.css`, and no one has tabbed a route end to end. Check the header dropdowns, the university tab strip, and the `TalkToUs` panel's focus trap first |

### B3. P2 — 22 items

**Catalogue depth**

| ID | Item | Note |
|---|---|---|
| 4.07 | Scholarship finder | Needs 4.29 first |
| 4.29 | Scholarship record: name, institution, destination, level, award type, deadline | Model it the way the catalogue is modelled: a `Field<T>` per value, so a scholarship with an unknown deadline states why |
| 4.10 | Country sub-pages: cost of studying, cost of living, scholarships, jobs, post-study work | The content already exists inside the destination guides. This is a routing and navigation decision, not new research |
| 4.11 | Top universities table with rankings per country | `src/content/catalogue/index.ts` has the data; it needs a view |
| F.06 | Course-level landing pages, e.g. "Masters in Germany" | A filtered `/universities` view with its own copy and metadata |
| F.07 | Country menu carrying top cities, top courses, top universities | `src/content/site.ts` nav, which was restructured with this in mind |
| F.03 | Shortlist sorted by eligibility, with the reason stated | `src/domain/eligibility.ts` already produces the reason. Careful: sorting by eligibility must not become a ranking that implies a probability |

**Content and trust**

| ID | Item | Note |
|---|---|---|
| 5.06 | Verified reviews with ledger-grade verification | Needs real students. Design it so an unverified review cannot render |
| 5.13 | Reviews page structure: paginated, filterable, sortable | Follows 5.06 |
| 5.07 | Counsellor profiles with checkable credentials | Needs real counsellors |
| 5.18 | Journey spine as a navigable content structure | The eleven stages in `src/content/process.ts` are already one model driving three surfaces; what is missing is a page per stage |
| 3.49 | dMAT preparation guidance | The requirement is now published across four surfaces. Preparation guidance is the follow-up, and it should wait until the test's format is actually known rather than guessed |
| 2.09 | Commission change history | Required by the source guide schema. Needs storage |
| 2.10 | Retention deletion enforcement | `src/domain/retention.ts` computes the clock; nothing deletes. The privacy policy states this gap explicitly, so closing it also updates that page |
| 3.41 | Wider correction scope: name, counsellor, deadlines, references | `src/domain/case-operations.ts` — extend the existing correction path, keeping the reason mandatory |

**Design and UX**

| ID | Item | Note |
|---|---|---|
| D.13 | Chart accessibility beyond the screen-reader table | `src/components/marketing/revenue-chart.tsx` |
| D.14 | Enforce radius and shadow tokens as new surfaces are built | A lint rule would do it better than vigilance |
| 4.15, D.23 | Quick-entry chips under the hero | The same item twice. There is now somewhere to send them: `/universities`, `/tools`, the three guides |

**Services**

| ID | Item | Note |
|---|---|---|
| 6.02 | Accommodation partners with disclosed referral terms | `/services` already carries the disclosure shape and states that nobody pays us today. Adding a partner means filling in `remuneration: { kind: "referral", weEarn }` and the page renders the warning treatment automatically |

**Conversion patterns**

| ID | Item | Verdict from the benchmark audit |
|---|---|---|
| E.01 | Sign-in prompt as an inline interstitial offering saved preferences | Adopt, without gating anything |
| E.03 | Inline conversion widgets on content and university pages | Adopt sparingly |

### B4. P3 — 20 items

| ID | Item |
|---|---|
| 3.42 | One-click summarise on the case page |
| 4.16 | Caching of verified university data |
| 4.30 | Related-search blocks at the foot of results pages |
| 4.31 | Rankings explorer, searchable and filterable |
| D.16 | Sticky nav condensing on scroll |
| D.17 | Scroll to top on route change |
| 5.10, 5.15, 5.16, E.06 | Events and webinars: the pages, the card fields, filters beyond subject and sort, and live registration counters only when real |
| 5.11, 5.17 | Bengaluru and nearby city pages; city and office pages with address, hours and a named contact |
| 5.12, E.02 | Student stories and student ambassadors, once there are students |
| E.07 | Newsroom or digest as a separate stream |
| 6.03 | Forex, insurance, banking, SIM as delivered services rather than guidance |
| 6.04 | Exam preparation, or a partnership |
| 6.06 | Additional destinations, only when answerable without looking anything up |
| F.09 | Exam pages beyond IELTS: PTE, TOEFL, Duolingo, GRE, GMAT, SAT |
| F.10 | Recommended books and resources per exam |

### B5. P4 — 4 items

| ID | Item | Note |
|---|---|---|
| 6.05 | Mobile app | |
| F.11 | Our own scholarship or fee waiver | Only if ever funded |
| S.07 | Guardianship for under-18 applicants | The privacy policy currently states we do not take under-18 applicants, and says why. Reversing that is a policy decision before it is a feature |
| S.08 | ISIC or student discount card | |

### B6. Decided, not pending

| ID | Item | Decision |
|---|---|---|
| E.08 | Country switcher | Not applicable at three destinations |

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

---

## Running it

```bash
cd web
npm install
npm run dev          # http://localhost:3000

npm test             # 305 tests
npm run lint
npm run build        # type checks as part of the build

npm start &          # the smoke check needs a running production build
npm run smoke        # 52 routes: structure, and the three route guards
```

`web/.env.example` lists every optional key. Each unset one produces a stated
"not connected" state rather than a fabricated result, so the whole site runs
with none of them set.
