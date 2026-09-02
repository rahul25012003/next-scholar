# No fabricated data audit

Written record of what was tested, how, and what came back. Re-run it before any
deploy that a real client will see.

Date: 2026-09-02
Scope: everything under `web/src`, plus the rendered output of all ten routes.
Tooling: `npm test` (80 tests), `npx eslint src tests`, `npm run build`, and
HTTP checks against a production build.

---

## 1. Adversarial checks against the guardrails

Each of these is an attempt to break a promise the business makes publicly. All
of them live in `web/tests` and run on every `npm test`.

| Attempt | Result | Where |
|---|---|---|
| Read another student's case while signed in as a student | Refused by the permission matrix, and the refusal is itself written to the audit trail | `store.test.ts`, `guardrails.test.ts` |
| Read a case outside a counselor's assigned caseload | Refused, both through `can()` and through the store. The route answers 404 rather than 403, so it does not confirm the record exists | `store.test.ts` |
| Write a note onto a case the actor cannot read | Refused before the write | `store.test.ts` |
| Verify a commission figure as a counselor or a manager | Refused. Only a founder holds `commission.verify` and `commission.publish` | `guardrails.test.ts` |
| Give any agent a capability reaching document verification, the ledger, stage changes or reassignment | No agent in the registry declares one | `guardrails.test.ts` |
| Return a field an agent was not granted | Dropped and reported as rejected | `guardrails.test.ts` |
| Have an agent state a visa or admission percentage | Blocked by the prohibition check, output discarded | `guardrails.test.ts` |
| Have an agent state a chance or a guarantee without a number | Blocked | `guardrails.test.ts` |
| Have an agent draft a letter or certificate | Blocked | `guardrails.test.ts` |
| Have an agent state a funding figure | Blocked | `guardrails.test.ts` |
| Have the statement of purpose coach write first person prose | Blocked by the ghostwriting check | `guardrails.test.ts` |
| Publish a commission figure with no source, evidence, date or named verifier | No such row can exist; the test asserts it for every publishable row | `guardrails.test.ts` |
| Upload a document with no consent, a wrong type, an oversized file, or no malware scanner | Refused, with the specific blocker named | `security.test.ts` |
| Run document extraction without stored documents | Refused before any model call | `security.test.ts` |
| Get a probability out of the risk assessment | No number is produced anywhere in the output | `lifecycle.test.ts` |
| Leak document or financial detail into a WhatsApp message | The channel is built from templates, so event detail cannot reach it | `lifecycle.test.ts` |
| Produce a blended success rate, or count in-progress cases as outcomes | Categories are separate; in-progress is excluded | `lifecycle.test.ts` |
| Publish a report computed from synthetic records | Refused, with the reason | `lifecycle.test.ts` |
| Double-queue a notification by running detection twice | Deduped on the event key; the second run queues nothing | `lifecycle.test.ts`, and confirmed over HTTP against `/api/sweep` |
| Hit the sweep endpoint unauthenticated in production | Refused with 503; a wrong secret gets 401 | verified over HTTP |

**Result: zero violations.**

---

## 2. Fabricated data sweep

| Check | Method | Result |
|---|---|---|
| Success rates, placement counts, "students placed" numbers | Regex over rendered HTML of all five marketing pages | None found |
| Em dashes, the template's own copy tells | Source grep plus rendered output | Zero |
| The reference template's stat row numbers (1.1M students, 600K programmes) | Replaced entirely with day-one-true figures | Not present |
| Testimonials, partner university logos, ratings | None exist. The slot that would hold them says so and explains why | By construction |
| Invented company registration details | Footer fields render "Not yet issued" rather than a placeholder value | By construction |
| An invented domain in metadata | `metadataBase` reads an env var and is null when unset | Fixed during the audit |
| Seeded demo students reachable in production | The store returns nothing in a production build unless `NEXT_SCHOLAR_DEMO_DATA` is set explicitly | Verified against a production build |

Every fixture carries `synthetic: true`, and the reporting layer refuses to
publish anything computed from a record carrying it.

---

## 3. What each number on the site traces to

Guardrail 7 allows exactly three sources. Every figure was traced.

| Figure | Source |
|---|---|
| Commission bands and client fees | `content/destinations.ts` and `content/ledger.ts`, each carrying a status, a source, and a verification date or an explicit null. All four are currently market estimates and are labelled as such everywhere they appear, including in the chart |
| Day one figures on the homepage | Facts about the business itself, checkable on the page they describe |
| Destination tuition, intakes, post study windows | Human entered, flagged as needing re-checking at source, with the source named |
| Outcome counters | Empty states with a stated reason. No client has been taken on |
| Pipeline, workload, deadline and audit counts on `/ops` | Computed live from case records |
| Retention dates | Computed from a case close timestamp a person set |
| Everything else | An empty state |

No fourth source was found.

---

## 4. What this audit could not cover

Stated so the passes above are not read as more than they are.

- **Visual review.** Every route was checked over HTTP for status, content and
  chart geometry. Nobody has looked at the pages in a browser.
- **Authentication.** There is none, so no session, token or MFA behaviour was
  tested. The permission matrix is real; identity is not yet checked.
- **Anything behind a provider.** Encryption, backups, restore, real delivery on
  email or WhatsApp, real payment, and real malware scanning cannot be tested
  because they are not connected. `/ops` reports each as waiting rather than
  claiming it.
- **The commission figures themselves.** The platform enforces that an
  unverified figure cannot be published as confirmed. Whether the underlying
  estimates are close to reality is a question for the universities, not for a
  test suite.
- **Legal sufficiency.** The DPDP items are listed as gaps because they are
  gaps. No test can close them.

---

## 5. Re-running it

```bash
cd web
npm test                 # the 80 guardrail and behaviour tests
npx eslint src tests     # zero warnings expected
npm run build            # type check plus production build
NEXT_SCHOLAR_DEMO_DATA=true npm start   # then walk the ten routes
```

The fabricated-data sweep in section 2 is a grep over the rendered HTML. Any new
marketing copy carrying a statistic should be added to it.
