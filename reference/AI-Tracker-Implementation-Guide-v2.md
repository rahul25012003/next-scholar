# AI-Assisted Student Tracker — Implementation Guide

A from-scratch build plan for the note-classification agent layered on top of the student pipeline tracker.

> **Document status:** This is v2. Part I below is the original document, unchanged, word for word. Part II is new material appended after it, evolving the single note-classification function into a full event-driven, multi-agent application-management system — per the roadmap in the companion Clearway summary doc, §18.

---

# PART I — Original Document (Unchanged)

## 1. What you're building, in one paragraph

A tool where a counselor types a free-text note about a student ("bank statement has a date mismatch, might need reissue"), an AI call reads that note plus the student's current stage and turns it into structured data (priority, document status, a one-line summary, a suggested next action), and that structured data is written into a shared database that the whole team sees in real time. The AI is a classification layer sitting between human input and stored data — it never replaces the storage, the UI, or the human's own note.

---

## 2. Architecture overview

```
┌─────────────┐     ┌──────────────┐     ┌───────────────────┐     ┌──────────────┐
│  Counselor   │ --> │  Frontend UI  │ --> │  LLM classify call │ --> │ Shared database│
│ types a note │     │ (note field)  │     │  (Claude API)      │     │ (all students) │
└─────────────┘     └──────────────┘     └───────────────────┘     └──────────────┘
                                                     │
                                                     ▼
                                          Falls back gracefully
                                          if parsing/network fails
                                          (note still saved, no data lost)
```

Four independent layers. You can build and test each one on its own before wiring them together.

---

## 3. Layer-by-layer build plan

### Layer 1 — Data model
Define the shape of a student record once, and never let anything else touch it except through defined update functions.

```json
{
  "id": "unique-id",
  "name": "string",
  "destination": "United Kingdom | Germany | Ireland",
  "intake": "string",
  "counselor": "string",
  "stage": "Consultation | Shortlist | Agreement | Documents | Applications | Offers | Finance | Visa | Pre-departure | Arrival | Admitted",
  "docStatus": "Not started | In review | Issue found | Verified",
  "priority": "Normal | High | Urgent",
  "summary": "string — AI-generated one-liner",
  "suggestedAction": "string — AI-generated next step",
  "stageUpdatedAt": "timestamp",
  "log": [{ "ts": "timestamp", "text": "string", "source": "human | ai" }]
}
```

Keep `source: "human"` vs `"ai"` on every log entry — you always want to know whether a status was set by a person or inferred by the model, in case you need to audit a decision later.

### Layer 2 — Storage
Any shared key-value or document store works. Options ranked by effort:

| Option | Effort | Cost | Notes |
|---|---|---|---|
| In-artifact shared storage (what you're using now) | Lowest | Free | Good for testing; not access-controlled, don't put real PII in it long-term |
| Airtable (free tier) | Low | Free up to limits | Has a REST API, easy for non-engineers to also view/edit directly |
| Firebase/Supabase | Medium | Free tier, then usage-based | Real auth, real access control — the right choice once you're handling live student data |
| Custom Postgres + backend | High | Free tier hosting exists (Render, Railway) | Full control; only worth it once you have an engineer on the team |

**Recommendation for you right now:** stay on the free in-artifact storage to prove the workflow, then migrate the same JSON shape to Supabase (has a generous free tier and built-in row-level access control) once you're ready to hold real student documents/notes.

### Layer 3 — The classification call
This is the new piece. One function, called whenever a note is submitted:

```javascript
async function classifyNote(student, noteText) {
  const prompt = `You are triaging a study-abroad case file. Read the note and context below. Return ONLY a JSON object, no other text, no markdown fences.

Student destination: ${student.destination}
Current stage: ${student.stage}
Days in current stage: ${daysSince(student.stageUpdatedAt)}
New note from counselor: "${noteText}"

Return JSON with exactly these fields:
{
  "priority": "Normal" | "High" | "Urgent",
  "docStatus": "Not started" | "In review" | "Issue found" | "Verified",
  "summary": "<one sentence, under 20 words, plain language>",
  "suggestedAction": "<one concrete next step, under 15 words>"
}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await response.json();
  const raw = data.content.map(b => b.text || "").join("");
  const clean = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}
```

**Design rules that matter here:**
- Always pass real context (stage, days-stuck) — not just the note in isolation — so the model's classification is grounded, not a guess from text alone.
- Constrain every enum field to an exact list of allowed strings — this is what keeps the output machine-usable.
- Keep `max_tokens` small (300 is plenty) — this is a classification task, not a generation task, and it keeps cost and latency low.
- Never send passport numbers, financial figures, or document contents in the note — send situation descriptions only ("bank statement date mismatch"), not the sensitive data itself. This keeps you aligned with your own anti-fraud/data policy commitments.

### Layer 4 — Fallback and validation
This is the layer most people skip, and the one that actually determines whether the feature is trustworthy in daily use.

```javascript
async function handleNoteSubmit(student, noteText) {
  saveRawNote(student.id, noteText); // always happens first, unconditionally

  try {
    const parsed = await classifyNote(student, noteText);
    const validPriorities = ["Normal", "High", "Urgent"];
    const validDocStatuses = ["Not started", "In review", "Issue found", "Verified"];
    if (!validPriorities.includes(parsed.priority)) throw new Error("bad priority");
    if (!validDocStatuses.includes(parsed.docStatus)) throw new Error("bad docStatus");

    updateStudent(student.id, parsed, { source: "ai" });
  } catch (err) {
    flagForManualReview(student.id, noteText);
    // The note is already saved — nothing is lost, the counselor
    // just sees "auto-classification failed, please set priority manually"
  }
}
```

**The non-negotiable rule:** the human's note is written to storage *before* the AI call even happens. If the API is down, times out, or returns malformed JSON, you lose the classification, never the underlying note. This single ordering decision is what prevents the AI layer from becoming a liability.

---

## 4. Build order (do this in sequence, test after each step)

1. **Build the manual-dropdown tracker first** (already done) — this proves the data model and UI work before AI enters the picture.
2. **Add the free-text note field** to each student card, with a "Save note" button that just appends to the log with no AI involved yet. Confirm this alone works reliably.
3. **Wire in the classification call** behind that same button, with the fallback logic from Layer 4. Test with 10–15 realistic sample notes (see testing section below) before anyone uses it on a real case.
4. **Add a "manual review" filter/badge** for any note where classification failed, so nothing silently falls through.
5. **Add a daily re-classification pass** (optional, later): once a day, re-run `classifyNote` on any student who hasn't had a stage change in 3+ days, even without a fresh note, purely based on days-stuck. This catches drift, not just explicit updates.
6. **Migrate storage** to Airtable/Supabase once you're comfortable with the workflow and are ready to handle real student data with proper access control.

---

## 5. Testing before real use

Run the classifier against notes you make up, covering edge cases, and manually check whether the output is sane:

| Sample note | Expected priority | Expected docStatus |
|---|---|---|
| "All good, transcript verified, moving to applications." | Normal | Verified |
| "Bank statement has a mismatched date, might need reissue" | High or Urgent | Issue found |
| "Still waiting to hear back from the university, no news" | Normal (unless days-stuck is high) | unchanged |
| "Visa interview is in 3 days and documents aren't ready" | Urgent | In review or Issue found |
| Empty or gibberish note | Should fail validation gracefully, not crash | — |

If classifications look wrong or inconsistent, the fix is almost always in the prompt (more explicit context, better examples inside the prompt) rather than needing a different model.

---

## 6. Cost and performance expectations

- Each classification call: roughly 100–200 input tokens (note + context) + ~50–80 output tokens. This is a very cheap call — a fraction of a cent per note on paid API infrastructure, effectively free at your current volume inside a Claude-built artifact.
- Latency: expect 1–3 seconds per call — fine for a "save note" button, not fine if you tried to run it on every keystroke (don't).
- At 4 employees logging even 30–40 notes a day combined, you're nowhere near a cost or rate-limit concern.

---

## 7. Security and compliance checklist (ties back to your own anti-fraud policy)

- [ ] Notes sent to the API contain situation descriptions only — never document contents, passport numbers, or financial figures.
- [ ] Every AI-classified field has a `source: "ai"` tag in the log, distinguishable from human-set fields, for later audit.
- [ ] Storage holding real student data has access control (not the free shared artifact storage) before any real case is logged in it.
- [ ] A visible way exists to see and correct any AI misclassification — never let a wrong "Verified" doc status sit unreviewed.
- [ ] This whole feature is disclosed internally as "AI-assisted triage, human-reviewed" — don't let it become an unreviewed decision-maker for anything touching visa or admission outcomes.

---

## 8. What this is not

This system does not decide outcomes, does not verify documents itself, and does not replace a counselor's judgment — it only turns messy notes into a scannable, prioritized view faster than a human re-reading every case file would. Keep that framing internally and with any future employees: it's a triage assistant, not a decision-maker.

---
---

# PART II — Platform Upgrade: Toward a Controlled AI-Agent Operating System

*Everything below is new. Layers 1–4 above are not replaced — the data model in Layer 1 is extended (not altered), the raw-input-first rule in Layer 4 is generalized to every workflow below, and the single classification function becomes one of ten scoped agents, not the whole AI layer.*

## 9. Event-Driven Application Lifecycle & State Management

The original system only reacts when a counselor types something. A real journey-tracking platform also reacts to *time passing* and *nothing happening* — which is when students are most likely to fall through the cracks.

**Extends Layer 1's `stage` enum** with the event types that watch it:

| Trigger event | Detection logic | Workflow triggered | Who's notified |
|---|---|---|---|
| Deadline approaching | Application/visa deadline field within 30 / 14 / 3 days | Escalating reminder sequence | Student + counselor |
| Missing document | Required doc for current stage not present or not Verified | Checklist flag + reminder | Student + counselor |
| Document/test/passport expiry | Expiry date within 60 / 30 / 7 days | Renewal reminder | Student + counselor |
| University response delay | No status change at Applications/Offers stage for N days (destination-specific threshold) | Follow-up task created for counselor | Counselor |
| Application stagnation | No stage change at all for 5+ days | Case flagged on counselor dashboard | Counselor |
| Student inactivity | No portal login / no response to a request for 5+ days | Escalating nudge, then counselor alert | Student, then counselor |
| Counselor follow-up due | A follow-up task's due date arrives | Task surfaces in follow-up queue | Counselor |
| SLA breach | Response-time threshold exceeded (e.g., no counselor reply to a student message in 24h) | Immediate flag | Counselor, then manager if unresolved |
| Manager escalation | Stagnation or SLA breach persists past a second threshold | Case escalated | Manager |

**The raw-input-first principle, extended:** exactly as Layer 4 writes the human's note to storage before the AI call, every event above is detected from state that was *already saved* by a human action or a verified timestamp. Automation never invents a stage change, a document status, or a deadline — it only watches what's already on record and raises visibility on it. This is the same design discipline as the original system, applied to time-based triggers instead of just text-based ones.

- **Purpose:** move from a system that only knows what a counselor remembered to type, to one that catches drift and deadlines automatically.
- **User value:** a student's case no longer goes quiet just because no one happened to check it that week.
- **Dependencies:** requires the data model to carry deadline/expiry date fields (extension of Layer 1, not a rebuild), and a background job scheduler (see §18).
- **Data requirements:** deadline dates, document expiry dates, last-login timestamps — all either already implied by the existing fields or trivial additions to Layer 1's schema.
- **Human review:** none required to *raise* an alert (low-risk, informational); a human always decides the actual response.
- **Phase:** Phase 2, after the security foundation and after the manual tracker (Layers 1–4) is stable in daily use.
- **Risks:** poorly tuned thresholds create alert fatigue; start with generous thresholds and tighten them based on real usage, not guesses.

---

## 10. Notification & Escalation Engine

**Channels:**

| Channel | Use case | Notes |
|---|---|---|
| In-app (portal/dashboard) | All notifications, always | The system of record — every notification exists here regardless of other channels |
| Email | Formal/document-related notices, weekly digests | Low urgency, high traceability |
| WhatsApp | Deadline reminders, urgent flags | Most effective channel for this audience per the brand's own market context — requires explicit opt-in consent, tracked in the consent log from the security foundation |
| Counselor alert (dashboard + push) | Stagnation, SLA breach, student inactivity | Goes to the assigned counselor first, always |
| Manager escalation | Unresolved counselor alerts past a second threshold | Never the first notification for anything — escalation is always a second step |

**Notification data model** (extends the `log` array pattern from Layer 1):

```json
{
  "id": "unique-id",
  "studentId": "reference",
  "type": "deadline | missing_doc | expiry | stagnation | inactivity | sla_breach | escalation",
  "priority": "Normal | High | Urgent",
  "channel": "in_app | email | whatsapp | counselor_alert | manager_escalation",
  "deliveryStatus": "queued | sent | delivered | failed | retried",
  "createdAt": "timestamp",
  "resolvedAt": "timestamp | null",
  "source": "system"
}
```

**Design rules:**
- Deduplication: the same underlying event never generates two active notifications — an unresolved alert is updated, not re-created.
- Retry handling: failed sends (e.g., WhatsApp API timeout) retry with backoff; a permanently failed send still shows in-app, so nothing is silently lost — the same "never lose the underlying record" discipline as Layer 4.
- Every notification's full lifecycle (queued → sent → delivered/failed → resolved) is logged for audit, same spirit as the `source: human/ai` tagging in Layer 1.

- **Purpose:** make sure a raised event actually reaches a human, through the channel most likely to get a response, without spamming or duplicating.
- **User value:** counselors and students both get told about problems proactively instead of discovering them at the next scheduled check-in.
- **Dependencies:** §9's event triggers; a WhatsApp Business API integration (needs its own opt-in consent flow, tied to §13 of the companion document).
- **Data requirements:** notification preferences per user (channel opt-ins), phone/email on file.
- **Human review:** not required for delivery; required for *content* wherever a notification includes AI-generated text (routes through the relevant agent's review rule in §12).
- **Phase:** Phase 2, alongside §9.
- **Risks:** WhatsApp for sensitive case details needs careful scoping — reminders and status nudges only, never document contents or financial figures, mirroring the existing rule in the original Layer 3 prompt design.

---

## 11. Three Connected Dashboards — Full Detail

*(Summarized in the companion Clearway document, §16; full spec here since these are views over this document's data model.)*

**Counselor Dashboard:**
- Caseload list, sortable by priority/stagnation/deadline proximity
- Assignment view (which cases are theirs) and a manager-only reassignment control
- Workload indicator (active case count vs. team average)
- Follow-up queue (tasks due today/this week)
- Escalation queue (cases flagged past SLA)
- One-click handover packet when a case needs to move to another counselor (see operational workflow in §19)
- AI-generated case summaries (Case Summary Agent, §12) — always labeled as AI-generated, always editable
- SLA monitoring per active case

**Founder/Operations Dashboard:**
- Pipeline health: count of active cases per stage (Section 8's 11 stages, from the companion document)
- Bottleneck view: which stage has the most stagnant cases right now
- Counselor workload comparison across the team
- Upcoming deadlines across *all* cases, not just one counselor's
- Offer and visa outcome tracking, feeding the quarterly outcomes report already committed to in the companion document, Section 9
- Stagnant-case list, platform-wide
- Commission-transparency verification status (from the companion document §14) — how many university figures are Verified, Pending, Denied — so the quarterly Open Ledger update is a status check, not a scramble
- Verified statistics only — see §20 below for the rule that governs what's allowed to appear here

**Student Dashboard:** fully specified in the companion Clearway document, §15 — it's a read-scoped, plain-language view of the same underlying data model defined in Layer 1 of this document.

- **Purpose:** three roles, one data model, no duplicated systems.
- **User value:** each role sees exactly what they need without reconstructing it manually from notes and memory.
- **Dependencies:** §9 and §10 for the data these dashboards visualize.
- **Human review:** dashboards display data; any AI-generated element within them (summaries) carries its own review rule from §12.
- **Phase:** Phase 2–3, built incrementally per role as the underlying event system stabilizes.
- **Risks:** building all three at once before the data model is trustworthy just produces three polished views of unreliable information — sequence matters here more than simultaneity.

---

## 12. Controlled AI-Agent Architecture

The single `classifyNote` function in Part I becomes one of ten scoped agents. **Every agent shares the same non-negotiable constraints:**

**Global prohibitions — no agent, ever, may:**
- Fabricate university requirements not already human-verified in the system
- Invent statistics or outcome numbers
- Create or alter a document
- Guarantee admission or visa approval, or state/imply a probability of either
- Make a high-impact decision autonomously (submit an application, mark a document "Verified," contact a student directly, close a case)
- Fabricate or infer financial figures or source-of-funds information
- Ghostwrite an SOP or any document meant to represent the student's authentic voice

Each agent below follows: **Purpose → Inputs → Outputs → Permissions → Human review → Failure handling → Prohibited.**

**1. Case Summary Agent**
- Purpose: turn a case's full log into a short brief for counselors/managers.
- Inputs: student record, log entries, stage, days-in-stage.
- Outputs: 2–4 sentence summary, tagged `source: ai`.
- Permissions: read-only on case data; writes only to the `summary` field.
- Human review: counselor can edit/override anytime; never shown to the student as-is.
- Failure handling: falls back to "no AI summary available, see raw log" — never blocks case access.
- Prohibited: cannot alter stage, doc status, or priority.

**2. Document Intelligence / OCR Agent**
- Purpose: extract structured fields (CGPA, dates, test scores, passport validity, financial figures) from uploaded documents to speed data entry.
- Inputs: an uploaded document image/PDF.
- Outputs: proposed field values with a confidence indicator, status `pending-verification`.
- Permissions: writes only to a staging/proposed-values area — never to the authoritative record.
- Human review: mandatory. A counselor or student must confirm before any extracted value becomes authoritative — this is the same discipline as the anti-fraud policy's "never alter a document," extended to reading them.
- Failure handling: low-confidence or unreadable input is flagged "manual entry required"; the document itself is still stored.
- Prohibited: cannot mark a document "Verified"; cannot alter the uploaded file; cannot infer a value not actually present in the document.

**3. Application Completeness Agent**
- Purpose: checks a case's documents/data against a specific program's requirement checklist and flags gaps.
- Inputs: case record, verified document list, a human-curated program requirement list.
- Outputs: checklist status, list of missing items.
- Permissions: reads case + requirements list; writes only to a checklist status field.
- Human review: counselor confirms before a student is told an application is "complete."
- Failure handling: an unlisted program returns "requirements not yet verified in system" rather than guessing.
- Prohibited: cannot invent university requirements not already human-verified in the system; cannot mark an application "ready to submit."

**4. Deadline & Expiry Monitoring Agent**
- Purpose: watches stored dates and raises the events defined in §9.
- Inputs: dates already on the case record.
- Outputs: alert events at set thresholds.
- Permissions: reads dates, writes to the notification queue only.
- Human review: not required to raise a low-risk informational alert; a human decides the response.
- Failure handling: a missing date field is flagged "date not on file," never silently skipped.
- Prohibited: cannot change deadlines, auto-submit anything, or auto-close a case.

**5. University Matching Agent**
- Purpose: proposes a ranked shortlist using the matching engine defined in §13.
- Inputs: student profile, verified university data, student preferences.
- Outputs: a ranked list with a stated reason per recommendation, and explicit flags on any assumption used.
- Permissions: read-only on verified data; cannot write to the Open Ledger.
- Human review: the counselor reviews the shortlist before it reaches the student — exactly as the existing Stage 2 ("Shortlist") in the companion document's 11-step process already requires.
- Failure handling: insufficient verified data for a destination excludes it, with a stated reason — never fills the gap with a guess.
- Prohibited: cannot recommend based on an unverified commission estimate without flagging it as unverified; cannot omit the commission figure from any recommendation.

**6. Counselor Copilot**
- Purpose: drafts reply templates, follow-ups, and handoff notes for review.
- Inputs: case history, communication history.
- Outputs: draft text only.
- Permissions: cannot send anything itself.
- Human review: the counselor must send manually — nothing reaches a student unreviewed.
- Failure handling: low-confidence drafts carry a visible warning.
- Prohibited: cannot send autonomously; cannot promise outcomes in draft text without a review flag.

**7. Student Guidance Agent**
- Purpose: answers a student's process questions using only their own verified case data and published policy content.
- Inputs: the logged-in student's own case record; public site content (Open Ledger, Zero-Commission list, Anti-Fraud policy).
- Outputs: plain-language answers, always sourced to a specific record or page.
- Permissions: read-only, scoped strictly to the logged-in student's own data.
- Human review: escalates to a counselor for anything outside its scope rather than guessing.
- Failure handling: an unrecognized question routes to a counselor.
- Prohibited: cannot give a visa/admission probability; cannot answer about other students; cannot replace the paid consultation's judgment-based advice; deliberately not a general-purpose chatbot — this scoped, data-grounded form is the *only* form this agent takes, consistent with the deferral of a generic chatbot noted in the companion document's preserved principles.

**8. Communication Summary Agent**
- Purpose: condenses email/WhatsApp/call-note threads into a short, structured history entry.
- Inputs: raw communication records.
- Outputs: a dated summary line per interaction.
- Permissions: writes only to a communication-history summary field; never alters the raw record.
- Human review: spot-checked rather than mandatory per-item, given low risk; always editable.
- Failure handling: an unclear thread returns "see raw thread" rather than inventing content.
- Prohibited: cannot delete or edit the raw communication log.

**9. SOP Coaching Agent**
- Purpose: helps a student develop their own SOP through structured, Socratic questions.
- Inputs: the student's own answers, program/destination context.
- Outputs: follow-up questions and structural feedback — never full paragraphs written for the student.
- Permissions: no write access to any "official" document field.
- Human review: the final SOP is still reviewed by a counselor before submission, per the existing anti-fraud policy.
- Failure handling: if a student asks it to "just write it," it declines and redirects to coaching questions.
- Prohibited: never drafts or ghostwrites SOP content — this is a direct, literal enforcement of the existing "coached and edited, never ghostwritten" commitment from the anti-fraud policy.

**10. Escalation Agent**
- Purpose: detects SLA breaches or prolonged stagnation and raises them to a manager.
- Inputs: case timestamps, SLA thresholds, the existing follow-up/escalation queue.
- Outputs: an escalation event plus a manager notification.
- Permissions: writes to the escalation queue only.
- Human review: a manager decides the actual response; the agent never resolves a case itself.
- Failure handling: an ambiguous threshold breach escalates anyway — it errs toward visibility, not silence.
- Prohibited: cannot reassign a case, contact the student directly, or close/resolve an escalation itself.

- **Purpose (of the architecture as a whole):** replace one general-purpose classification call with ten narrow, auditable, permission-scoped agents — each doing one job it can be held accountable for.
- **User value:** every AI output on the platform has a defined owner, a defined boundary, and a defined human checkpoint — nothing is a black box making decisions no one can trace.
- **Dependencies:** the `source: human/ai` tagging pattern from Layer 1, extended per §17 below; the security/RBAC foundation from the companion document §13.
- **Data requirements:** each agent's inputs are already-existing fields in the data model — no agent requires new sensitive data collection beyond what Section 6 (companion document) already governs.
- **Human review:** defined individually per agent above; the common thread is that no agent's output becomes authoritative without a specified human checkpoint.
- **Phase:** Phase 3 — after the event-driven backbone (§9) and dashboards (§11) exist for the agents to plug into. Agents 1 and 4 (Case Summary, Deadline Monitoring) are the lowest-risk and can move earlier if useful.
- **Risks:** the biggest risk isn't any single agent — it's scope creep, where an agent quietly starts doing more than its defined job. The prohibitions above should be enforced in code (permission checks, not just prompt instructions), not treated as guidance the model is trusted to self-police.

---

## 13. University Matching Engine — Differentiated, Not Generic

Standard eligibility-matching (which most competitors already do) just filters universities by grades and test scores. This engine goes further, and every output is explainable:

**Factors considered:** academic profile fit, program fit, tuition, living costs, available scholarships, admission requirements, commission-transparency status (from the companion document §14), verified historical information for that university/program, the student's own stated preferences, and relevant risk factors (§15).

**Every recommendation includes:**
- A plain-language "why this one" reason tied to specific factors above.
- A clear label distinguishing **verified information** (confirmed, dated, sourced) from **assumptions or unavailable data** (e.g., "commission status: unverified — see Open Ledger status" rather than silently omitting it).
- The commission figure or status for that university, always — per the University Matching Agent's prohibition against omitting it.

- **Purpose:** make matching a trust-reinforcing feature rather than a generic algorithm — this is where the brand's transparency principle should show up most concretely to a student.
- **User value:** a shortlist a student can actually interrogate, not a black-box ranked list.
- **Dependencies:** the verified university data set (commission status from §14 of the companion document, requirement lists from Agent 3 above).
- **Data requirements:** structured, human-curated university/program data — this cannot run well on unverified estimates, which is itself a reason §14's verification framework matters beyond just the public Open Ledger.
- **Human review:** counselor reviews every shortlist before it reaches a student (existing Stage 2 process, unchanged).
- **Phase:** Phase 3, after enough verified university data exists to make the matching meaningfully better than a generic filter.
- **Risks:** if built before enough verified data exists, this just becomes eligibility-matching with extra steps — sequencing after §14 matters.

---

## 14. Document Intelligence — Detail

Extends Agent 2 above with the operational features around it:

- **Versioning:** every re-upload of a document creates a new version; old versions remain accessible, never overwritten.
- **Expiry tracking:** passport validity, test score validity (IELTS/PTE typically 2 years), and any other time-bound document is tracked with an expiry date feeding §9's monitoring events.
- **Verification status:** Uploaded → Pending review → Verified / Issue found, per document — matches the student portal's document checklist in the companion document §15.
- **Duplicate detection:** flags when a newly uploaded document appears to duplicate an existing verified one, to avoid redundant counselor review.
- **Upload history & access history:** who uploaded what, when, and who has viewed it — feeds the audit trail from the companion document §13.
- **Missing-document detection:** cross-references the Application Completeness Agent's checklist (Agent 3) to flag gaps proactively rather than waiting for a counselor to notice.

- **Purpose:** make document handling assistive and auditable without ever making the AI the source of truth for what a document says.
- **User value:** faster data entry for counselors, clearer status for students, without weakening the existing "never alter a document" commitment.
- **Human review:** every extracted value requires confirmation before becoming authoritative (Agent 2's rule).
- **Phase:** Phase 3.
- **Risks:** OCR errors on handwritten or low-quality scans — the confidence threshold and mandatory human review exist specifically to catch this.

---

## 15. Risk Intelligence — Explainable, Not Predictive

This deliberately does **not** produce an admission or visa probability score. That would sit in direct tension with the permanent "no guarantee of admission or visa outcome" commitment in the companion document's Section 6.

Instead: **explainable risk bands**, each tied to a stated, evidence-based reason:

| Risk factor | Evidence it's based on | Band |
|---|---|---|
| Missing documents past a deadline threshold | Document checklist status (§14) | Needs attention |
| Deadline proximity with incomplete application | Application Completeness Agent output (Agent 3) | Watch |
| Inconsistency between stated and document-extracted data | Document Intelligence Agent flag (Agent 2), human-confirmed | Needs attention |
| Financial-document gaps (blocked account, funding evidence) | Document checklist status | Watch or Needs attention, depending on deadline proximity |
| No stage progress past the platform's stagnation threshold | §9's stagnation event | Watch |

Every risk indicator shown to a counselor or student states **why** it's flagged, in the language above — never as a percentage, and always with the explicit label: **"This is decision support, not a prediction or guarantee."**

- **Purpose:** surface real, evidence-based case risk without ever implying a probability of outcome the platform cannot honestly claim to know.
- **User value:** counselors get an early-warning system; students get honest visibility into what's actually incomplete, not a false sense of odds.
- **Dependencies:** §9's event system and §14's document status tracking — this has no separate data requirement beyond those.
- **Human review:** risk bands are informational; a counselor always interprets what to do about one.
- **Phase:** Phase 3, using only factors already tracked elsewhere — this is a display layer over existing data, not new modeling.
- **Advanced predictive models (e.g., outcome-probability modeling) are explicitly deferred** until the platform has enough verified historical outcome data (per the companion document's quarterly outcomes report, Section 9) to make such a model honest rather than speculative — consistent with the existing "not yet built" discipline.
- **Risks:** the biggest risk here is scope creep toward a probability score under pressure to "look more advanced" — this section exists specifically to draw that line in writing.

---

## 16. Counselor Productivity & Case Operations

- **Workload balancing:** automatic suggested assignment based on current caseload counts, with manual override always available to a manager.
- **Case assignment & handover:** a defined handover packet (case summary, open tasks, pending documents) generated when a case moves between counselors — see the handoff workflow in §19.
- **One-click case summaries:** the Case Summary Agent (Agent 1), surfaced directly on the counselor dashboard.
- **Reusable communication templates:** drafted by the Counselor Copilot (Agent 6), edited and saved by counselors themselves.
- **Follow-up queue & escalation queue:** as specified in §11.
- **SLA tracking:** response-time monitoring per case, feeding §9's SLA-breach event.
- **Activity history:** a full timeline per case — human actions and AI-assisted actions both, tagged per §17.
- **Manager review & exception handling:** a manager can review any flagged case, override an AI-suggested field, or reassign — always logged.

- **Purpose:** make the counselor's daily workflow faster without removing their judgment from any consequential step.
- **User value:** less time spent re-reading old notes, more time spent on actual student-facing judgment calls.
- **Dependencies:** §9 (events), §12 (Agents 1 and 6).
- **Human review:** built into each feature above individually.
- **Phase:** Phase 2–3, incrementally.
- **Risks:** over-automating case assignment could quietly deprioritize a counselor's existing relationship with a student — manual override should never be removed as an option.

---

## 17. Traceability & Audit Philosophy — Extended Platform-Wide

Layer 1's `source: "human" | "ai"` tag on log entries was the right instinct from day one. This section extends that exact pattern to every important record on the platform, not just tracker notes:

| Record type | Now carries |
|---|---|
| Tracker log entries | `source: human/ai` (unchanged from Part I) |
| Commission figures (companion doc §14) | source, evidence, verification date, verified-by, status, change history |
| Document-extracted fields (§14 above) | extraction confidence, `pending-verification` until human-confirmed, who confirmed it |
| Application status changes | who/what triggered it (human action vs. §9 event) |
| University matching recommendations (§13) | which factors were verified vs. assumed |
| Published quarterly statistics (§20) | which underlying records they were computed from |

- **Purpose:** every consequential fact on the platform can be traced back to who created it, who verified it, when, and on what evidence — the same discipline the brand already applies to commission figures, made universal.
- **User value:** if a wrong status or figure is ever questioned — by a student, a university, or a regulator — there's a real answer, not a shrug.
- **Dependencies:** none beyond consistent schema discipline across every table above.
- **Human review:** this section defines a record-keeping requirement, not a decision itself.
- **Phase:** MVP for the tracker fields (already exists in Part I); extended to each new record type as that feature ships.
- **Risks:** the only real risk is inconsistency — if this pattern isn't applied to *every* new feature, the platform ends up with some auditable data and some not, which undermines the whole point.

---

## 18. Scalable Architecture — MVP vs. Later Phases

The current build (Part I) intentionally runs on free, low-effort infrastructure. That's correct for now — this table shows what changes, and when, without over-engineering the MVP:

| Component | MVP (today) | Phase 2 | Phase 3 | Future scale |
|---|---|---|---|---|
| Database | In-artifact shared storage | Supabase/Postgres, RBAC-enabled | Same, with read replicas if needed | Dedicated infra only if volume actually demands it |
| APIs | Direct client calls to Claude API | Backend service layer between UI and API | Same, with agent routing (§12) | Rate-limited, versioned internal APIs |
| Background jobs / event queue | None | Simple scheduled job for §9's daily checks | Proper event queue (e.g., a managed queue service) | Full async event-driven pipeline |
| Notification workers | None | Basic email/WhatsApp send functions | Retry/dedup logic per §10 | Dedicated notification service |
| Object/document storage | None (no real docs yet) | Encrypted object storage (companion doc §13) | Versioning (§14) added | CDN-backed if volume demands |
| Caching | None needed | None needed yet | Cache verified university data (§13) — it changes rarely | Standard caching layer |
| Observability / structured logging | Basic console logs | Structured logs on all writes | Full audit-trail logging (§17) | Centralized log aggregation |
| Rate limiting | Not needed at current volume | Basic per-user limits | Per-agent limits (§12) | Full API gateway |
| AI-provider abstraction | Direct Claude API calls | Thin wrapper function (already the pattern in Layer 3) | Same wrapper, reused per agent | Provider-agnostic if ever needed |
| Cost controls | Not needed at current volume (§6, Part I) | Track per-agent call volume | Alerting on unexpected spend | Budget caps per environment |
| Backups & disaster recovery | None (no real data yet) | Automated backups (companion doc §13) | Tested restore process | Multi-region if scale demands |

- **Purpose:** grow the technical foundation exactly in step with real need, not ahead of it — the same discipline already applied to the site's deferred features (companion document, Section 11).
- **User value:** indirect — this is what keeps the platform reliable and affordable as caseload grows, without wasting early-stage effort on infrastructure a 4-person team doesn't need yet.
- **Dependencies:** each phase's components depend on the prior phase being stable.
- **Human review:** engineering/founder decision, not an AI governance question.
- **Phase:** as tabulated above — explicitly, do not build Phase 3/Future columns before Phase 2 is real and in use.
- **Risks:** the opposite failure mode is just as real as under-building — adopting a full event-queue/microservice architecture for a 4-person team's current caseload would be exactly the "overbuilt MVP" the original build notes already warned against.

---

## 19. Operational Workflows for Edge Cases

| Scenario | Trigger | Steps | Who's involved |
|---|---|---|---|
| Application delay | University response delay event (§9) | Counselor follow-up task created → university contacted → student informed of status | Counselor, student |
| Missing document | Checklist gap detected (§14/Agent 3) | Student notified with specific item → reminder sequence (§10) if unresolved | Student, counselor |
| Counselor handoff | Manual trigger or reassignment | Handover packet generated (§16) → new counselor confirms receipt → student notified of new contact | Outgoing counselor, incoming counselor, student |
| Failed application | University rejection recorded | Case updated, reason logged → counselor reviews next steps with student → feeds outcomes reporting (§20) | Counselor, student |
| Reapplication | Student/counselor decision after rejection or deferral | New application record created, linked to the original case (not a fresh unrelated record) | Counselor, student |
| Deferral | Offer accepted with deferred start | Stage held, deadlines recalculated for the new intake | Counselor, student |
| University change | Student changes target university mid-process | Prior application marked withdrawn (not deleted — §17 preserves the record), new one started | Counselor, student |
| Offer acceptance/rejection | Student decision recorded | Stage moves to Finance (acceptance) or shortlist revisited (rejection) | Counselor, student |
| Visa refusal | Visa outcome recorded | Case reviewed for reapplication/appeal options → outcome enters the quarterly report regardless (companion doc, Section 9) | Counselor, student, manager (for review) |
| Data correction | Student or counselor identifies an error | Correction logged with `source` and reason, per §17 — the old value is never silently overwritten without a trace | Whoever made the correction, logged |
| Escalation | SLA breach or stagnation (§9) | Manager notified → reviewed → resolution logged | Counselor, manager |
| Case closure | Outcome finalized (admitted, withdrawn, or student discontinued) | Final status set, retention timer (companion doc §13) begins | Manager, counselor |

- **Purpose:** make sure every non-happy-path situation has a defined process, not an improvised one.
- **User value:** consistent handling regardless of which counselor is involved.
- **Dependencies:** §9 (event triggers), §17 (audit trail for every change).
- **Human review:** every workflow above has a human decision point — none resolve autonomously.
- **Phase:** Phase 2–3, built alongside the corresponding stage functionality.
- **Risks:** the temptation to auto-resolve routine cases (e.g., auto-closing after inactivity) should be avoided — closure should always be a human decision, logged with a reason.

---

## 20. Analytics & Transparency Reporting Architecture

This is what actually generates the quarterly outcomes report already committed to in the companion document, Section 9 — honestly, not by inference.

**Hard rule:** quarterly/public statistics are generated **only** from records explicitly marked `Verified` or with a final, human-confirmed outcome status. Nothing is inferred, estimated, or extrapolated from incomplete data.

**Categories tracked and reported separately — never blended into a single headline number:**

- Applications submitted
- Offers received
- Enrollments confirmed
- Visa applications submitted
- Visa approvals
- Visa refusals
- Withdrawals (student-initiated)
- Cases still in progress (explicitly excluded from any "success rate" calculation — an in-progress case is neither a success nor a failure yet)

- **Purpose:** make the "we publish real outcomes, including refusals" commitment (companion document, Section 9) technically enforceable, not just a policy intention.
- **User value:** a quarterly report a competitor's marketing-driven statistics cannot match on honesty, because the underlying system structurally cannot fabricate or blend categories.
- **Dependencies:** §17's audit trail (every stat must trace to source records) and §19's workflows (every outcome type above needs a defined final status).
- **Data requirements:** none beyond what's already collected through normal case management — this is a reporting rule, not a new data collection need.
- **Human review:** the founder reviews and signs off on the quarterly report before publication, same as any Open Ledger figure.
- **Phase:** Phase 3, effective as soon as the first full quarter of real operation (per the existing commitment) produces enough verified records to report on.
- **Risks:** the temptation to report a flattering blended "success rate" once real numbers exist — this section exists specifically to keep the categories separate, permanently.

---

## 21. Updated Build Order — Cross-Referenced with the Companion Document

This document's build order nests inside the 10-step roadmap in the companion Clearway summary, §18:

1. Security foundation (companion §13) — before any real student data touches this tracker.
2. Commission verification framework (companion §14) — separate track, same priority.
3. Student portal (companion §15) — depends on this document's data model (Layer 1) being stable.
4. **This document, §9** — event-driven lifecycle, the backbone step.
5. **This document, §10** — notifications built on top of §9's events.
6. **This document, §11** — dashboards visualizing §9/§10's data.
7. **This document, §14** — document intelligence.
8. **This document, §13** — university matching engine.
9. **This document, §12** — the full 10-agent architecture, plus §16 (SOP coaching is Agent 9).
10. **This document, §15 and §20** — risk intelligence and quarterly reporting, only once enough verified outcome data exists.

---

## 22. Preserved Principles Checklist (This Document)

- ✅ Raw-input-before-AI-enhancement (Part I, Layer 4) — preserved exactly, and generalized as the operating principle for every event in §9.
- ✅ `source: human/ai` tagging (Part I, Layer 1) — preserved and extended across the entire platform in §17.
- ✅ "Fraction of a cent per note, effectively free at current volume" framing (Part I, §6) — preserved; §18's cost-control additions only apply once volume actually grows, not before.
- ✅ Never send passport numbers/financial figures/document contents to the classification call (Part I, §3) — preserved and extended as a global prohibition on every agent in §12.
- ✅ No SOP ghostwriting, no fabricated source-of-funds content — preserved as explicit, individually-stated prohibitions on Agent 9 and every other agent in §12.
- ✅ "This is not a decision-maker" framing (Part I, §8) — preserved and is the literal organizing principle of every agent's "human review" and "prohibited" fields in §12.
- ✅ No generic chatbot — preserved explicitly as Agent 7's defined, narrow scope, not an open product.
- ✅ No predictive admission/visa percentages — preserved explicitly in §15, with advanced predictive modeling formally deferred until sufficient verified data exists.

---

## 23. Second End-to-End Audit

| Dimension | Before this upgrade | After this upgrade | Still open |
|---|---|---|---|
| Automation model | Reactive only (note-triggered) | Event-driven, covering deadlines/expiry/stagnation/SLA (§9) | Requires a working background job scheduler to actually run — not yet built |
| AI governance | One function, informal trust | 10 scoped agents, each with explicit inputs/outputs/permissions/prohibitions (§12) | Prohibitions need to be enforced in code (permission checks), not just specified in this document |
| Document handling | Not addressed at all | Full extraction/versioning/expiry/verification workflow (§14) | Depends on the security foundation (companion §13) existing first — cannot hold real documents without it |
| Risk/prediction | Not addressed | Explainable risk bands, explicit ban on probability scores (§15) | Requires §9/§14 data to actually be populated before it has anything to show |
| Reporting integrity | Correct intention (companion §9), no enforcement mechanism | Hard category-separation rule, verified-records-only (§20) | Only as strong as the discipline to never blend categories under future pressure to look better |
| Scalability | Deliberately minimal (correct for MVP) | Explicit phase-by-phase architecture (§18) | Execution discipline — the risk is now over-building ahead of need, not under-building |

**What still prevents a genuine 10/10 today:** exactly as with the companion document, this remains a specification. The event-driven backbone (§9), the notification engine (§10), and the agent permission boundaries (§12) all need to be actually implemented and tested — including deliberately trying to break the "human review required" boundaries to confirm they hold in code, not just in this document — before this qualifies as the "controlled AI-agent operating system" it's designed to become.
