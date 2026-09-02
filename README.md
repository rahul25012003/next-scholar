# Next Scholar

A two sided study abroad platform: a public marketing site that publishes what
the business earns on every university it recommends, plus a student portal, a
counselor console and an operations dashboard behind it.

The differentiator is not a feature. It is a constraint: every number on the
platform has to trace to a live source, a named person who entered it, or an
explicit empty state. There is no fourth option, and the code is arranged so
that there cannot be one.

```
web/                 the Next.js application
docs/AUDIT.md        the no-fabricated-data audit, and how to re-run it
reference/           the source specification and the design reference image
```

## Running it

```bash
cd web
npm install
npm run dev          # http://localhost:3000
npm test             # 197 tests
npm run build
```

No environment variables are needed to run it. See `web/.env.example` for the
optional ones. Every unset key produces a stated "not connected" state rather
than a fabricated result.

In a production build the synthetic case fixtures are withheld, so the three
authenticated surfaces render empty. Set `NEXT_SCHOLAR_DEMO_DATA=true` to walk
them.

## What is here

**Marketing** (`/`, `/open-ledger`, `/zero-commission`, `/anti-fraud-policy`,
`/book-consultation`). Design tokens are derived from the reference screenshot
in `reference/design-reference.png`. Anything sampled by eye rather than pixel
picked is flagged `[VERIFY]` in `web/src/app/globals.css`.

**Sign in and sign up** (`/login`, `/signup`). Scrypt hashed passwords, signed
httpOnly session cookies, a route guard in `proxy.ts`, and role based landing.
Signup only ever creates a student; staff accounts are made by someone who
already holds one. Users live in memory until the database lands, but how they
are checked is the real thing, and the tests try to forge, edit and expire a
session rather than describing one.

**Student portal** (`/portal`). Stage and next action, deadlines, document
checklist, application reference numbers, consent per document category with
withdrawal, in-app notifications, a guidance agent scoped to their own record,
and statement of purpose coaching. No admission or visa probability appears
anywhere, by design.

**Counselor console** (`/console`). Caseload sorted by priority and stagnation,
follow up and escalation queues, and per case: the machine written summary, the
note box, a message drafting copilot, the completeness check, a shortlist
proposal carrying commission figures, risk bands, document verification, the
raw communication history with per thread summarising, a generated handover
packet, and the case operations from section 8.10 of the spec: recording a visa
or application outcome, opening a linked reapplication, deferring an intake with
its deadlines, and correcting a value with its reason.

**Operations** (`/ops`). Security and data protection posture, pipeline,
workload and assignment suggestion, deadlines across every case, retention
state, commission verification status, the quarterly report, the agent
governance table, the live audit trail, notification channel status, and the two
actions a counselor cannot take alone: reassignment and closure.

**Scheduled sweep** (`/api/sweep`, GET or POST). Runs detection across every
case, queues what is new, escalates a reminder whose deadline has closed in,
and resolves what has cleared. Deduped, so a repeat run on unchanged state
queues nothing. Refuses to run unauthenticated in production. `vercel.json`
schedules it daily at 03:00.

## How the guarantees are enforced

Written policy is not a control. These are:

| Guarantee | Where it lives |
|---|---|
| A student can only ever read their own case | `domain/rbac.ts`, enforced again in `data/store.ts` |
| A case cannot be read without an actor, and every read is recorded | `data/store.ts`, `domain/audit.ts` |
| Only a founder can verify or publish a commission figure | `domain/rbac.ts` |
| No agent holds a capability reaching verification, the ledger or sending | `domain/agents/registry.ts` |
| Output claiming a probability, a guarantee, a drafted letter or an invented funding figure is discarded | `domain/agents/guards.ts` |
| The statement of purpose coach cannot ghostwrite | `domain/agents/guards.ts` |
| A commission figure cannot publish without source, evidence, date and a named verifier | `content/ledger.ts` |
| Risk is a band with a reason, never a score | `domain/risk.ts` |
| WhatsApp carries a template, never document or financial detail | `domain/notifications.ts` |
| A document cannot be collected without live consent for its category | `domain/consent.ts`, `domain/uploads.ts` |
| Nothing is stored that could not be scanned for malware | `domain/uploads.ts` |
| A counselor's note is saved before any agent runs on it | `app/actions/case.ts` |
| Requirements are never guessed for an unlisted programme | `domain/completeness.ts` |
| Reports exclude in progress cases and never blend categories | `domain/reporting.ts` |
| Synthetic records never load in production | `data/store.ts` |
| An agent that returns a field it was not granted has its whole output refused, and the refusal is audited | `domain/agents/kernel.ts` |
| An agent's declared capability list must equal the keys its schema returns | asserted in `tests/guardrails.test.ts` |
| A note that looks like it carries a passport number, a financial figure or a long reference is never sent to a model | `domain/agents/guards.ts` |
| A failed classification leaves a visible flag that only a person can clear | `data/store.ts`, `app/actions/case.ts` |
| The case document status is derived from the documents, so the roll-up cannot drift | `domain/completeness.ts` |
| Required documents come from one curated list, not two copies that disagree | `content/requirements.ts` |
| A messaging channel needs a recorded opt in, and fails closed without one | `domain/consent.ts`, `domain/notifications.ts` |
| A reminder escalates as its deadline approaches instead of firing once | `domain/notifications.ts` |
| A report figure carries the record ids it was computed from, and does not publish without a named sign off | `domain/reporting.ts` |
| A correction keeps its old value and its reason, and a withdrawn application stays on the record | `domain/case-operations.ts` |
| A case is closed only by a person, never by a timer, and closure starts the retention clock | `domain/case-operations.ts` |
| A student sees correspondence addressed to them, never internal notes | `domain/communications.ts` |

`npm test` runs all of these as attempts to break them, not as demonstrations
that they work. `docs/AUDIT.md` is the written record.

## The ten agents

`domain/agents/registry.ts` declares each agent's purpose, the exact fields it
may write, its human checkpoint, its failure behaviour and its prohibitions.
`kernel.ts` runs every model call through the same path: schema validation,
prohibition checks, then a filter down to the declared fields. A field the agent
was not granted is dropped and recorded as a violation.

Six use the model. Four are rules only: deadline and expiry monitoring,
escalation, application completeness, and university matching.

Without `ANTHROPIC_API_KEY` the model backed agents return their stated fallback.
Nothing is guessed in their place.

## What is deliberately not built

Listed here so nothing reads as an oversight:

- **A database.** Cases live in memory from synthetic fixtures. `data/store.ts`
  is the only file that changes when Supabase arrives, and the permission matrix
  moves down into row level policies at the same time.
- **Document storage.** The upload pipeline fails closed: no consent, no
  allowlisted type, no scanner, no upload. Document extraction refuses to run
  until there is a stored document to read.
- **Payment and scheduling.** The consultation form validates the six questions,
  keeps the answers in the visitor's own browser, and says plainly that nothing
  was sent, no slot was held and no money was taken.
- **Photography.** The site carries flags and one chart, no stock imagery. A
  photograph implying real students or a real founder would be the same
  fabrication the brand exists to avoid.
- **Notification delivery.** The queue plans, dedupes and escalates. Nothing
  sends, because no provider is connected, and a channel that cannot send says
  so rather than logging a pretend delivery.
- **A write path for the Open Ledger.** Commission rows are published content,
  edited in the repository under review. The founder-only permission that will
  gate the eventual write path exists and is tested; the path itself arrives
  with the database.
- **Rate limiting and per-agent cost tracking.** Phase two items in the source
  guide, and not worth building against a four person caseload.

## What has to happen outside this repository

None of this is engineering work, and all of it gates a real launch:

1. **Written permission from every aggregator and university** to publish their
   commission band. Most partner agreements restrict this by default. Until that
   lands, every ledger row stays an unverified market estimate.
2. **A lawyer on the data protection policy.** The four open items on
   `/anti-fraud-policy` are real gaps, published as gaps.
3. **Incorporation.** CIN, GSTIN, registered address, a grievance officer and a
   published contact. The footer keeps those fields empty rather than carrying
   invented values.
4. **A founder bio and photograph.**
5. **Re-verification of every policy figure at source**, and of the requirement
   lists in `content/requirements.ts`, which no named person has checked yet.
