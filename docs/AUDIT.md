# No fabricated data audit

Written record of what was tested, how, and what came back. Re-run it before any
deploy that a real client will see.

Date: 2026-09-02
Scope: everything under `web/src`, plus the rendered output of all ten routes
and the two metadata routes.
Tooling: `npm test` (160 tests), `npx eslint src tests`, `npm run build`, and
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
| Return a field an agent was not granted | The whole output is refused and the refusal is written to the audit trail | `kernel.test.ts` |
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
| Reassign or close a case as a counselor | Refused by the store before the transformation runs | `store.test.ts` |
| Overwrite a value without leaving the old one behind | Not possible. A correction writes the old value, the new value and the reason into the log | `workflows.test.ts` |
| Remove a withdrawn application from the record | Not possible. It is marked withdrawn and stays | `workflows.test.ts` |
| File a reapplication as an unrelated new record | It carries the id of the application it replaces | `workflows.test.ts` |
| Defer an intake and leave the old deadlines behind | Every deadline moves with it, and the log says how many | `workflows.test.ts` |
| Close a case automatically because it went quiet | No code path does this. Closure takes a person, an outcome and a reason | `workflows.test.ts` |
| Show a student the internal notes about their case | The portal reads only records marked visible to them | `workflows.test.ts` |
| Have the summary agent edit the thread it summarises | It writes a separate field; the raw record is untouched | `data/store.ts`, `workflows.test.ts` |

**Result: zero violations.**

### Correction, same day

An independent audit against the second source document found that this table
previously overstated one row. The capability filter was computed in the kernel
and then **not applied**: the unfiltered model output was returned, the rejected
field list was never read, and the schema keys did not match the declared
capability list for five of the six model backed agents. The unit test of
`filterWrites` in isolation passed, which is precisely why the gap survived
review, and this document reported the attack as covered when it was not.

Fixed by returning the filtered object, refusing the entire output when any
unlisted key appears, writing the refusal to the audit trail, and adding
`tests/kernel.test.ts`, which drives the whole path with the model mocked rather
than testing the guard in isolation. A further test asserts that each agent's
declared capability list equals the keys its schema actually returns, so the two
cannot drift apart again.

The lesson is recorded rather than tidied away: a control tested only in
isolation is not a control, and an audit that tests the part rather than the
path will report a green light on a disconnected wire.

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
npm test                 # the 160 guardrail and behaviour tests
npx eslint src tests     # zero warnings expected
npm run build            # type check plus production build
NEXT_SCHOLAR_DEMO_DATA=true npm start   # then walk the ten routes
```

The fabricated-data sweep in section 2 is a grep over the rendered HTML. Any new
marketing copy carrying a statistic should be added to it.
