# Next Scholar — Master Build Prompt
### (ReadyToStudy Visual System × Full Business Spec × Full AI-Agent Architecture)

> **Renamed per your instruction:** "Clearway Global Education" → **Next Scholar** throughout. Every business mechanic, page, data rule, and agent below is unchanged in substance — only the brand name changed. If any legal filing name, domain, or logo wordmark needs to match exactly, confirm the exact spelling/casing you want (`Next Scholar`, `NextScholar`, `Next Scholar Global` etc.) before it goes on a footer or a contract.
>
> **Yes — this is now end-to-end.** The previous version cross-referenced the two source documents ("see Doc §X"). This version pulls the *actual content* of both documents into the prompt itself — the full 10-agent architecture, the full event table, the full data schema and code, the full destinations/process/policy content, all of it — so nothing has to be re-opened from the original zip to build this. Section 12 tells you exactly where each piece came from, so you can still audit against the source if you ever need to.
>
> **What this still doesn't fabricate:** real hex codes not sampled from your screenshot, real API keys, a real founder bio, real signed commission figures, and real legal sign-off. Those aren't missing because I skipped them — they don't exist yet, and Section 1's guardrail is exactly what stops a coding agent from inventing them to fill the gap.

---

## 0. How to use this document

1. Paste **Section 1** into `CLAUDE.md` once — every phase below inherits it.
2. Sections 2–11 are the **complete reference content** — brand, design, website content, full data model, full agent architecture, full event/notification/dashboard/security specs. Keep these attached through the whole build; they're the source of truth, not background reading.
3. **Section 13** is the phase-by-phase loop. Paste one phase at a time into Claude Code, in order, confirming each Definition of Done before moving to the next.
4. **Section 12** maps every section back to where it came from in your original two files, if you ever want to check this prompt against the source.

---

## 1. Guardrails — paste into `CLAUDE.md`, keep active for every phase

```
PROJECT: Next Scholar — two-sided study-abroad consultancy platform
(marketing site + student portal + counselor/founder dashboards + governed AI agents)

NON-NEGOTIABLE RULES:

1. NEVER fabricate data — no stats, testimonials, university counts, commission
   figures, or "X students placed" numbers. If real data doesn't exist yet,
   render an honest empty/pending state in the same visual component. This is
   the brand's core differentiator (Section 4.7 below), not a style choice.

2. Every commission figure is `unverified` by default and carries the status
   schema in Section 4.3. No AI agent may ever set a commission record to
   "Verified" — only a founder/admin action can, and it must be logged.

3. No AI agent auto-generates: source-of-funds letters, bank statements,
   work-experience letters, or SOPs. SOP support is Socratic coaching only
   (Section 7, Agent 9) — this is a hard prohibition, not configurable.

4. No predictive admission or visa percentage is ever shown to anyone.
   Risk intelligence is explainable bands with stated reasons (Section 9),
   never a probability score.

5. No real student PII (passport, transcript, bank statement) is stored or
   processed until Section 5 (security/DPDP foundation) is fully implemented.
   Dev/staging use synthetic data only.

6. Match the design tokens in Section 3 exactly. Flag any color/font not yet
   verified against the source screenshot as `[VERIFY]` in code comments
   rather than shipping a guess as if it were confirmed.

7. Every number on the platform must trace to one of exactly three sources:
   a live API call, a value entered by an authenticated staff member (with
   the audit trail from Section 10), or an explicit "pending" state. No
   fourth option, ever.

8. Global agent prohibitions (apply to all 10 agents in Section 7, no
   exceptions): no fabricating university requirements, no inventing
   statistics, no creating/altering documents, no guaranteeing or implying
   an admission/visa probability, no autonomous high-impact actions
   (submitting an application, marking a document Verified, contacting a
   student directly, closing a case), no fabricating financial figures,
   no ghostwriting an SOP.

9. Build in the phase order in Section 13. Security before student data.
   Data model before dashboards. Dashboards before agents. Agents before
   risk intelligence.

10. The raw-input-before-AI rule (Section 6, Layer 4) applies everywhere:
    a human's input is written to storage before any AI call runs on it.
    If the AI call fails, the human's data is never lost — only the
    AI-derived enrichment is.
```

---

## 2. Brand & positioning (Next Scholar)

- **Name:** Next Scholar. **Base:** Bengaluru, Karnataka — serves clients online across India.
- **One-line pitch:** "We publish what we earn on every university we recommend."
- **Target client:** Bengaluru engineering/business graduates applying for Master's study abroad.
- **Core differentiator:** most consultancies take undisclosed commission from universities (commonly 10–20% of first-year tuition), so universities that pay nothing quietly vanish from shortlists. Next Scholar publishes the exact commission figure for every university it recommends — including the ones that pay zero — before the client pays anything.
- **Phase-1 scope discipline:** only 3 destinations launched (UK, Germany, Ireland), not a broad country list — the rule is to add a country only once its full profile can be answered without looking anything up.

---

## 3. Design system — ReadyToStudy visual system (unchanged from prior version)

Same as before — screenshot-derived, `[VERIFY]` flags mean "sample the exact value from the source PNG before shipping," not "this is confirmed."

### 3.1 Color tokens
| Token | Approx. value | Usage |
|---|---|---|
| `--color-navy-900` | `#0E2A5E` `[VERIFY]` | Headline text (line 1), footer background |
| `--color-blue-600` | `#1553D6` `[VERIFY]` | Headline accent (line 2), primary CTA fill, active nav |
| `--color-blue-500` | `#2E6BF0` `[VERIFY]` | Link hover, secondary accents, badge fills |
| `--color-white` | `#FFFFFF` | Base background |
| `--color-surface-gray` | `#F6F8FC` `[VERIFY]` | Alternating section backgrounds |
| `--color-text-body` | `#5B6472` `[VERIFY]` | Paragraph copy |
| `--color-border` | `#E7EBF3` `[VERIFY]` | Card borders, dividers |
| Stat-icon pastels | soft blue `#DCEBFF`, rose `#FCE1E6`, mint `#DFF5E8`, peach `#FDE9D9`, lilac `#EBE1FB` `[VERIFY all]` | Circular icon backgrounds in the stats row |
| `--color-success-badge` | green, `#16A34A`-family `[VERIFY]` | "95% Success rate"-style pill badges |
| Duotone photo overlays | orange `#E8672E`-ish, forest-green `#1F4B3A`-ish `[VERIFY]` | Small overlapping hero photo tiles |

### 3.2 Typography
- **Display/Headline:** rounded-geometric bold sans, visually close to **Sora**, **Plus Jakarta Sans**, or **General Sans** (600–700 weight). Two-tone H1: line 1 navy, line 2 accent blue.
- **Body:** clean grotesque sans, close to **Inter** or **DM Sans**, regular weight, ~1.6 line-height, body-gray token.
- **Numerals (stats row):** display font, bold, `text-4xl`–`text-5xl`, tight tracking.
- Load via `next/font`, no system-font fallback in production.

### 3.3 Component patterns
| Component | Pattern |
|---|---|
| Header/Nav | Logo left; center nav with dropdown chevrons; two right buttons — outlined "Sign up," filled "Log in," both pill-shaped |
| Hero | Two-column: two-tone H1 + short paragraph + single filled-pill CTA left; layered photo collage right (one large portrait + two smaller duotone-overlay tiles) |
| Trust banner | Full-width dark-blue rounded banner under hero: rating badge + "Our Students Studying at" + partner logo row |
| Stats row | Centered heading/subhead, then 5 items: circular pastel icon, large bold number, small gray label |
| Global-reach panel | Secondary heading introducing a world-map/country-explorer module |
| Country explorer | Destination filter tabs (flags/labels), photo cards below, rounded corners + soft shadow |
| World map widget | Circular student photo centered on a simplified world map, small circular flag markers around it |
| Stat badge chips | Small pill cards over photos (icon + number + label), white/light fill, shadow |
| Certification badge | Bottom-corner circular badge with small flag icons, layered over a photo |
| Cards (general) | Rounded ~16–20px, soft shadow, white fill, thin border token |

### 3.4 Motion spec
- **Lenis:** global smooth scroll, ~1.0–1.2s duration, `easeOutExpo`-style curve; every anchor/CTA scroll goes through it.
- **GSAP ScrollTrigger:** stats count up on first viewport entry (no re-fire); headings fade + 16–24px upward translate on enter; country cards stagger-fade (60–90ms) on enter; hero collage parallax (large photo vs. tiles at ~0.85x/1.15x scroll speed).
- **Framer Motion:** nav dropdowns fade+translate ~150ms; buttons scale to 1.03 + shadow lift on hover (spring); cards lift `-4px` + shadow on hover; mobile menu slide/fade with staggered links; page transitions 150–200ms crossfade.
- **Accessibility:** every animation has a `prefers-reduced-motion` fallback (fade-only or instant).

---

## 4. Complete website content (source of truth — build every page from this, don't re-derive it)

### 4.1 Site structure
| Page | Purpose |
|---|---|
| `/` (Home) | Hero, problem statement, Policy Desk, destinations, 11-step process, outcomes (honest "Not yet open" until real), final CTA |
| `/open-ledger` | Full commission disclosure table + methodology + commission-flagging rule |
| `/zero-commission` | Universities paying zero commission, per destination, + how to self-apply |
| `/anti-fraud-policy` | Document-integrity rules + data protection policy (DPDP Act 2023 draft, marked as such) |
| `/book-consultation` | ₹1,500 paid 45-min consultation booking — must be a real booking+payment flow, not a static form |
| `/portal` | Student dashboard (Section 8) |
| `/console` | Counselor dashboard (Section 8) |
| `/ops` | Founder/operations dashboard (Section 8) |

### 4.2 Destinations (Phase 1 — exactly these three, no more)
| Destination | Intakes | Tuition | Post-study visa window | Commission to Next Scholar | Client fee |
|---|---|---|---|---|---|
| United Kingdom | Sep, Jan | £14k–38k | 18 months *(dropping from 24→18 for applications from 1 Jan 2027; PhDs keep 36 months — `needs-verify` before publishing)* | ₹1.5L–2.5L (`needs-verify`) | ₹25,000 |
| Germany — public | Oct, Apr | €0 (public) | 18 months | ₹0 — public universities pay no agents | ₹45,000 flat advisory fee |
| Germany — private | Oct, Apr | varies | 18 months | ₹1.3L–3.5L (`needs-verify`, flagged "above-average") | ₹25,000 |
| Ireland | Sep, Jan | €12k–26k | 24 months (Third Level Graduate Programme) | ₹90k–1.6L (`needs-verify`) | ₹25,000 |

**Policy Desk notes (all flagged "verify before publishing"):**
- UK: Graduate Route shortens 24→18 months for applications from 1 Jan 2027; PhD graduates keep 36 months.
- Germany: APS certificate mandatory for Indian applicants; blocked-account amount and free-appeal rules need reconfirming.
- Ireland: Third Level Graduate Programme gives a defined post-study window; accommodation availability (not visa policy) is the practical planning bottleneck.

### 4.3 The Open Ledger — commission transparency mechanism
- Publishes, per destination: what Next Scholar earns from the university, what the client pays, contract type (Partner/None), and an anomaly flag.
- **Commission-flagging rule:** if a university's commission is more than double the category average for its tier, that's disclosed **in writing on the shortlist before recommending it** — not after. It doesn't rule out the recommendation; it removes any doubt about the incentive.
- **Update cadence:** re-verified and republished every quarter, even if unchanged — a stale "last verified" date is treated as worse than no date.
- **Critical pre-launch blocker:** every commission figure today is a *market-typical estimate*, not a confirmed contract term. Before publishing anything real, Next Scholar needs **written confirmation from every aggregator/university that public disclosure is permitted** — most partner agreements restrict this by default. This is the single most important pre-launch legal/business step.
- **Full verification schema, one row per university/program relationship:**

| Field | Purpose |
|---|---|
| University / Program | What the figure applies to |
| Commission figure or band | The number, or a range if full disclosure isn't permitted |
| Source | Signed partner agreement / aggregator statement / direct written confirmation / market estimate |
| Evidence | Reference to the actual document/email confirming it |
| Verification date | When last confirmed accurate |
| Verified by | Named Next Scholar person who confirmed it |
| Status | See status states below |
| Last review date | Independent of verification date — reviewed quarterly regardless |
| Change history | Every prior value, with date and reason |

**Status states (never skips straight to "published"):**
1. Unverified (market estimate) — current default state, never shown as confirmed.
2. Outreach sent — permission request sent to the university/aggregator.
3. Permission denied — figure confirmed, public disclosure declined.
4. Permission pending — awaiting response.
5. Verified — publishable — confirmed and cleared for exact-number publication.
6. Verified — band only — confirmed internally, university permits only a range.
7. Disputed — a figure Next Scholar believed correct is contested; frozen from publication.

**Fallback strategy by university response:**
| University response | What's shown |
|---|---|
| Confirms zero commission | The verified zero, always — no permission needed to disclose a truthful zero |
| Confirms a figure, permits publication | The exact figure |
| Confirms a figure, permits only a range | A published band + note that the exact figure is confidential by request |
| Confirms a figure, refuses any disclosure | "Next Scholar receives a commission from this university; the university has not authorized publishing an amount." The relationship's existence is still disclosed — silence about existence is the one thing the brand cannot do |
| Doesn't respond | Stays `needs-verify` on the client-facing side, excluded from the verified Open Ledger entirely — never defaults to showing the market estimate as if confirmed |

### 4.4 Zero-Commission List
- Lists universities/systems that pay agents nothing, so students know they can apply directly for free.
- **Germany — public universities:** pay agents nothing, without exception; tuition is near-free (semester contribution only). Next Scholar charges only a flat advisory fee for process help (APS, uni-assist, blocked account) — never a university-paid commission.
- **UK & Ireland sections:** currently placeholders — need a verified, specific list, marked `needs-verify`.
- **Self-apply steps:** go to the university's own admissions page → check programme-specific requirements/deadlines → prepare your own documents → submit directly → come to Next Scholar only for a specific process bottleneck (visa file, blocked account, APS), where the flat-fee model removes any commission conflict.
- **Rationale, stated plainly:** this page can cost Next Scholar commission revenue — some readers self-apply and are never invoiced — and that's the point. It's proof the recommendations aren't commission-driven.

### 4.5 Anti-Fraud & Data Protection Policy
**Document integrity commitments (non-negotiable):**
- Verify every transcript/certificate against the original or the issuing institution directly.
- Never edit, retouch, or alter any document.
- Never write a bank statement, source-of-funds letter, or work-experience letter on a student's behalf.
- Decline to work with anyone requesting falsified/misrepresented documents.
- SOPs are written in the student's own voice — coached and edited, never ghostwritten with untrue claims.
- Maintain a written file per student for 5 years.
- Report suspected fraudulent documents to the relevant institution.

**Data protection (explicitly an unfinished draft, needs lawyer review — DPDP Act 2023):**
- What's collected: transcripts, passport copies, test scores, bank statements/funding evidence, LORs, photos — only as needed.
- Consent: explicit written consent before collecting sensitive documents, naming exactly who it will be shared with.
- **Open items needing real answers before launch:** actual storage system + access controls + encryption status; a written breach protocol (who's notified, what timeframe, how); retention period cross-checked against actual DPDP requirements; a real complaints procedure (named contact, response-time commitment, escalation path, tested before launch).

**Guarantees explicitly disclaimed, permanently:** no guarantee of admission; no guarantee of visa outcome — "including if it's us, at some point in the future, under different management."

### 4.6 Book a Consultation
- 45-minute paid consultation, ₹1,500, credited in full against the service fee if the client proceeds.
- **6-question structured intake, in this exact order:**
  1. Academic background + percentage/CGPA
  2. Graduation year + explanation of any gap
  3. English test status (IELTS/PTE/TOEFL/Duolingo)
  4. Total year-one budget (tuition + living)
  5. Target intake
  6. Whether another consultant has already submitted an application for them
- Within 24 hours of the call: written assessment with 2–3 ranked destinations, reasoning, and risks for each.
- **Build requirement:** must be wired to a real booking + payment flow (suggested: Cal.com or Zoho Bookings + Razorpay) — a static form is not acceptable at launch.

### 4.7 The 11-stage client process (homepage)
1. **Consultation** — 45 min, paid, honest profile assessment (including "should you go at all")
2. **Shortlist** — 8–10 universities (ambitious/target/safe), commission listed next to each
3. **Agreement** — written scope, fee, timeline; nothing verbal
4. **Documents** — verified against originals; never created/altered
5. **Applications** — submitted and tracked; client gets every reference number/login
6. **Offers** — compared side by side, including ones Next Scholar would advise declining
7. **Finance** — education loan, blocked account, forex/TCS planning
8. **Visa** — file prep + interview rehearsal against current refusal patterns
9. **Pre-departure** — accommodation, insurance, flights, banking, arrival briefing
10. **Arrival** — check-ins at 30, 90, 180 days
11. **Outcome published** — result (approved or refused) enters the quarterly report, anonymised, always

### 4.8 Outcomes & Credentials — honesty-by-default
- Homepage shows **all outcome metrics as "Not yet open"** (applications, offers, visas approved/refused, students advised not to proceed) — deliberate, since no client has been taken yet. Never use the earlier prototype's fabricated stats ("34 applications, 28 offers").
- **Credentials shown as "in progress," never claimed outright:** ICEF ITAC, British Council AQF, ICEF Agency Status (planned Month 6–12).
- First quarterly outcomes report publishes after the first full quarter of operation — includes refusals and students told *not* to proceed, not just successes.

### 4.9 Every placeholder that must be resolved before launch
| Placeholder | Location(s) | Why it matters |
|---|---|---|
| Commission figures (`needs-verify`) | Home, Open Ledger | Currently market-typical estimates, not confirmed contract terms |
| CIN, GSTIN, registered address, email, phone | Every page footer | Currently fake/placeholder values from the prototype |
| "Last verified" dates | Policy Desk, destination cards, Open Ledger | Every regulatory figure needs re-checking against current official sources, not just re-dating old numbers |
| Complaints procedure + data storage/retention/breach details | Anti-fraud policy | Structural placeholder — needs lawyer review |
| Booking form | Book a Consultation | Currently non-functional; needs real booking + payment integration |
| Founder bio + photo | Not yet built | Genuine trust signal — don't skip |

**The single step that gates everything else:** get written confirmation from every aggregator/university that Next Scholar is permitted to publish their commission band publicly, *before* publishing any real figure.

### 4.10 Explicitly deferred — do not build yet
Individual full-template country pages, blog/SEO infrastructure, a live monthly-refresh Policy Desk, a "For Universities" B2B page, a founder/about page, a dedicated "Refusal File" page, a cost calculator/eligibility checker. Rationale: building these pre-legal-entity, pre-verified-Ledger, pre-real-clients repeats the overbuilt-MVP mistake the original audit flagged.

### 4.11 Competitive context (researched Sep 2026)
- **LeapScholar** (part of the Leap group — LeapScholar, LeapFinance, GeeBee, Yocket): AI-powered, Series-E funded, 11 countries, 3M+ community members, 1,500+ partner universities, claims 97–98% visa approval and 70+ NPS, expanding with 15+ new India centres in 2026. Optimized for scale/volume, not disclosure — commission structure not published to students.
- **IDP Education:** similarly large, global, standardized-process model.
- **The structural gap Next Scholar exploits:** neither competitor discloses per-university commission or publishes negative outcomes; both optimize for breadth (10+ countries, 1,000+ universities) over depth/verification. Next Scholar's "3 countries known completely + published commission + published refusals" model is a direct, hard-to-replicate-at-scale inversion of their approach.

---

## 5. Security & DPDP foundation (MVP-blocking — build first, no exceptions)

| Requirement | Detail |
|---|---|
| Storage | Managed Postgres/object storage with row-level security (Supabase recommended) — never the free in-artifact store beyond prototyping |
| Encryption at rest | Provider-managed AES-256 or equivalent, all documents/PII, no exceptions |
| Encryption in transit | TLS on every connection, including internal service-to-service calls |
| RBAC | Four roles — see matrix below |
| Consent management | Explicit, written, per-document-category, timestamped, revocable consent log per student record |
| Access logging & audit trail | Every read/write of a sensitive field logged: who, when, what changed |
| Retention & deletion | Technical enforcement of the 5-year written-file commitment, plus automated deletion once it lapses |
| Backups & DR | Automated daily backups, tested restore process, documented RTO/RPO |
| Breach response | Named contact, notification timeframe, escalation path |
| Secure upload | File-type allowlist, size limits, malware scan before storage |
| MFA | Required for Counselor/Manager/Founder logins from day one; offered (not mandatory) for students |
| Environment separation | Dev/staging use synthetic data only — a real passport/transcript never leaves production |
| DPDP-specific | Lawful basis for processing, data-principal rights (access/correction/erasure), a designated grievance officer, cross-border transfer check for non-Indian vendors |

**RBAC permission matrix:**
| Role | Reads | Writes | Verifies/approves |
|---|---|---|---|
| Student | Own case record only | Own document uploads, own SOP drafts | — |
| Counselor | Assigned caseload only | Notes, doc-status flags, log entries for assigned cases | Document verification (not commission figures) |
| Manager | All active cases (read) | Reassignment, escalation resolution | Escalation sign-off |
| Founder/Admin | Everything, including Open Ledger source records | System configuration, commission-record verification | Final commission publication status |

**This is the one section where "we'll get to it later" isn't acceptable once real students are involved** — a breach involving passports or bank statements would be existential for a brand whose entire pitch is "we tell you the truth about money."

---

## 6. Core data model & classification layer (full code, from the AI agent doc)

### 6.1 Layer 1 — Data model
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
Keep `source: "human"` vs `"ai"` on every log entry — always know whether a status was set by a person or inferred by the model, for later audit.

### 6.2 Layer 2 — Storage options
| Option | Effort | Cost | Notes |
|---|---|---|---|
| In-artifact shared storage | Lowest | Free | Prototyping only — not access-controlled, never real PII |
| Airtable (free tier) | Low | Free up to limits | REST API, easy for non-engineers to view/edit |
| Firebase/Supabase | Medium | Free tier, then usage-based | Real auth, real access control — the right choice for live student data |
| Custom Postgres + backend | High | Free hosting exists (Render, Railway) | Full control, only worth it with an engineer on the team |

**Migration path:** prototype on free storage to prove the workflow, then migrate the same JSON shape to Supabase (generous free tier, built-in row-level access control) before any real student document is stored.

### 6.3 Layer 3 — The classification call
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
**Design rules:** always pass real context (stage, days-stuck), never just the note in isolation. Constrain every enum field to an exact allowed list. Keep `max_tokens` small (300 is plenty — this is classification, not generation). **Never send passport numbers, financial figures, or document contents in the note** — situation descriptions only ("bank statement date mismatch"), matching the anti-fraud policy.

### 6.4 Layer 4 — Fallback and validation (the layer that determines trustworthiness)
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
**The non-negotiable rule:** the human's note is written to storage *before* the AI call runs. If the API is down, times out, or returns malformed JSON, only the classification is lost — never the underlying note.

### 6.5 Testing before real use
| Sample note | Expected priority | Expected docStatus |
|---|---|---|
| "All good, transcript verified, moving to applications." | Normal | Verified |
| "Bank statement has a mismatched date, might need reissue" | High or Urgent | Issue found |
| "Still waiting to hear back from the university, no news" | Normal (unless days-stuck is high) | unchanged |
| "Visa interview is in 3 days and documents aren't ready" | Urgent | In review or Issue found |
| Empty or gibberish note | Fails validation gracefully, no crash | — |

### 6.6 Cost/performance
Each call: ~100–200 input tokens + ~50–80 output tokens — a fraction of a cent per note. Latency 1–3 seconds — fine for a "save note" button, never on every keystroke. At 4 staff logging 30–40 notes/day combined, no cost or rate-limit concern.

---

## 7. Full controlled AI-agent architecture — all 10 agents

**Global prohibitions — no agent, ever, may:** fabricate university requirements not already human-verified; invent statistics or outcome numbers; create or alter a document; guarantee or imply an admission/visa probability; make a high-impact decision autonomously (submit an application, mark a document Verified, contact a student directly, close a case); fabricate/infer financial or source-of-funds figures; ghostwrite an SOP or any document meant to represent the student's authentic voice.

Each agent: **Purpose → Inputs → Outputs → Permissions → Human review → Failure handling → Prohibited.**

**1. Case Summary Agent** — Turns a case's full log into a short counselor/manager brief. *In:* student record, log, stage, days-in-stage. *Out:* 2–4 sentence summary, `source: ai`. *Permissions:* read-only on case data, writes only `summary`. *Human review:* counselor can edit/override anytime; never shown to the student as-is. *Failure:* falls back to "no AI summary available, see raw log." *Prohibited:* cannot alter stage, doc status, or priority.

**2. Document Intelligence / OCR Agent** — Extracts structured fields (CGPA, dates, test scores, passport validity, financial figures) from uploaded documents. *In:* uploaded document. *Out:* proposed field values + confidence, status `pending-verification`. *Permissions:* writes only to a staging area, never the authoritative record. *Human review:* mandatory before any extracted value becomes authoritative. *Failure:* low-confidence/unreadable → "manual entry required"; document still stored. *Prohibited:* cannot mark a document Verified, alter the file, or infer a value not actually present.

**3. Application Completeness Agent** — Checks a case against a program's requirement checklist. *In:* case record, verified documents, human-curated requirement list. *Out:* checklist status, missing items. *Permissions:* reads case + requirements, writes only a checklist field. *Human review:* counselor confirms before telling a student an application is "complete." *Failure:* unlisted program → "requirements not yet verified in system," never a guess. *Prohibited:* cannot invent requirements or mark an application "ready to submit."

**4. Deadline & Expiry Monitoring Agent** — Watches stored dates, raises Section 8.1's events. *In:* dates on the case record. *Out:* alert events at set thresholds. *Permissions:* reads dates, writes only the notification queue. *Human review:* not required to raise an alert; required for the response. *Failure:* missing date → "date not on file," never silently skipped. *Prohibited:* cannot change deadlines, auto-submit, or auto-close a case.

**5. University Matching Agent** — Proposes a ranked shortlist via the matching engine (Section 8.5). *In:* student profile, verified university data, preferences. *Out:* ranked list with a stated reason per recommendation, flagged assumptions. *Permissions:* read-only on verified data, cannot write to the Open Ledger. *Human review:* counselor reviews before it reaches the student (Stage 2). *Failure:* insufficient verified data for a destination excludes it, with a stated reason. *Prohibited:* cannot recommend on an unverified commission estimate without flagging it, cannot omit a commission figure.

**6. Counselor Copilot** — Drafts reply templates, follow-ups, handoff notes. *In:* case history, communication history. *Out:* draft text only. *Permissions:* cannot send anything. *Human review:* counselor sends manually, always. *Failure:* low-confidence drafts carry a visible warning. *Prohibited:* cannot send autonomously or promise outcomes without a review flag.

**7. Student Guidance Agent** — Answers a student's process questions from their own verified data + published policy content only. *In:* the logged-in student's own case record, Open Ledger/Zero-Commission/Anti-Fraud page content. *Out:* plain-language answers, always sourced. *Permissions:* read-only, scoped strictly to that student's own data. *Human review:* escalates unrecognized questions to a counselor. *Failure:* unrecognized → routes to counselor. *Prohibited:* no visa/admission probability, no answering about other students, doesn't replace the paid consultation's judgment; deliberately **not** a general-purpose chatbot — this narrow, data-grounded form is the only form it takes.

**8. Communication Summary Agent** — Condenses email/WhatsApp/call-note threads into a structured history entry. *In:* raw communication records. *Out:* dated summary line per interaction. *Permissions:* writes only a summary field, never alters the raw record. *Human review:* spot-checked, not mandatory per-item (low risk), always editable. *Failure:* unclear thread → "see raw thread." *Prohibited:* cannot delete or edit the raw log.

**9. SOP Coaching Agent** — Helps a student develop their own SOP via structured, Socratic questions. *In:* the student's own answers, program/destination context. *Out:* follow-up questions and structural feedback only — **never full paragraphs written for the student**. *Permissions:* no write access to any "official" document field. *Human review:* the final SOP is still counselor-reviewed before submission. *Failure:* if the student asks it to "just write it," it declines and redirects to coaching questions. *Prohibited:* never drafts or ghostwrites SOP content — direct enforcement of "coached and edited, never ghostwritten."

**10. Escalation Agent** — Detects SLA breaches or prolonged stagnation, raises to a manager. *In:* case timestamps, SLA thresholds, follow-up/escalation queue. *Out:* an escalation event + manager notification. *Permissions:* writes only the escalation queue. *Human review:* a manager decides the response; the agent never resolves a case. *Failure:* ambiguous breach escalates anyway — errs toward visibility. *Prohibited:* cannot reassign, contact the student directly, or close/resolve an escalation itself.

**Architecture-level notes:** this replaces one general classification call with ten narrow, auditable, permission-scoped agents, each with a defined owner, boundary, and human checkpoint. The biggest risk isn't any single agent — it's scope creep, where an agent quietly does more than its defined job. **Enforce every prohibition above in code (permission checks), not as prompt guidance the model is trusted to self-police.** Agents 1 and 4 (Case Summary, Deadline Monitoring) are lowest-risk and can be built earliest; the rest wait for the event backbone and dashboards to exist first.

---

## 8. Platform architecture — full detail

### 8.1 Event-driven application lifecycle
| Trigger event | Detection logic | Workflow triggered | Who's notified |
|---|---|---|---|
| Deadline approaching | Application/visa deadline within 30/14/3 days | Escalating reminder sequence | Student + counselor |
| Missing document | Required doc for current stage not present/Verified | Checklist flag + reminder | Student + counselor |
| Document/test/passport expiry | Expiry within 60/30/7 days | Renewal reminder | Student + counselor |
| University response delay | No status change at Applications/Offers for N days (destination-specific) | Follow-up task for counselor | Counselor |
| Application stagnation | No stage change at all for 5+ days | Case flagged on counselor dashboard | Counselor |
| Student inactivity | No portal login/no response for 5+ days | Escalating nudge, then counselor alert | Student, then counselor |
| Counselor follow-up due | Follow-up task's due date arrives | Task surfaces in queue | Counselor |
| SLA breach | Response-time threshold exceeded (e.g. no reply in 24h) | Immediate flag | Counselor, then manager if unresolved |
| Manager escalation | Stagnation/SLA breach persists past a second threshold | Case escalated | Manager |

**Raw-input-first, extended:** every event above is detected from state a human already saved or a verified timestamp — automation never invents a stage change, document status, or deadline; it only watches and raises visibility.

### 8.2 Notification & escalation engine
**Channels:**
| Channel | Use case | Notes |
|---|---|---|
| In-app | All notifications, always | System of record regardless of other channels |
| Email | Formal/document notices, weekly digests | Low urgency, high traceability |
| WhatsApp | Deadline reminders, urgent flags | Most effective channel for this audience — requires explicit opt-in, tracked in the consent log |
| Counselor alert (dashboard + push) | Stagnation, SLA breach, inactivity | Goes to the assigned counselor first, always |
| Manager escalation | Unresolved counselor alerts past a second threshold | Never the first notification for anything |

**Notification data model:**
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
**Design rules:** dedupe — one active notification per underlying event, updated not re-created. Retry with backoff on failure; a permanently failed send still shows in-app. Full lifecycle logged for audit. WhatsApp scope: reminders/nudges only, **never document contents or financial figures**.

### 8.3 Three connected dashboards

**Counselor Dashboard:** caseload list (sortable by priority/stagnation/deadline), assignment + manager-only reassignment, workload indicator vs. team average, follow-up queue, escalation queue, one-click handover packet, AI-generated case summaries (always labeled, always editable), SLA monitoring per case.

**Founder/Operations Dashboard:** pipeline health (active cases per stage of the 11), bottleneck view, counselor workload comparison, upcoming deadlines across all cases, offer/visa outcome tracking feeding the quarterly report, platform-wide stagnant-case list, commission-transparency verification status (Verified/Pending/Denied counts, turning the quarterly Open Ledger update into a status check instead of a scramble), **verified statistics only** (Section 11's rule).

**Student Dashboard** (see Section 8.4): current stage in plain language, what's done vs. pending, the specific next action required of *them*, upcoming deadlines, document checklist with per-file status (Uploaded → In review → Verified/Issue found), every application reference number/portal login Next Scholar holds on their behalf, assigned counselor's name/contact, readable communication history (student-appropriate, not raw internal notes), offers compared side by side (including any Next Scholar would advise declining), visa status, notifications.

### 8.4 Student portal — explicit non-goals
- No predictive admission/visa percentage shown anywhere.
- No general-purpose AI chatbot — the Student Guidance Agent (Agent 7) is scoped strictly to the student's own verified data.
- No self-serve SOP generation — SOP support is a coaching flow (Agent 9), never an auto-write button.

### 8.5 University matching engine — differentiated, not generic
**Factors considered:** academic profile fit, program fit, tuition, living costs, available scholarships, admission requirements, commission-transparency status, verified historical information for that university/program, the student's own stated preferences, relevant risk factors.
**Every recommendation includes:** a plain-language "why this one" tied to specific factors; a clear label distinguishing **verified information** from **assumptions/unavailable data** (e.g., "commission status: unverified — see Open Ledger status," never silently omitted); the commission figure or status, always.

### 8.6 Document intelligence — operational detail
Versioning (every re-upload creates a new version, old ones remain accessible, never overwritten); expiry tracking (passport validity, IELTS/PTE ~2-year validity, any time-bound document, feeding Section 8.1's monitoring); verification status (Uploaded → Pending review → Verified/Issue found, matching the student portal checklist); duplicate detection; upload/access history (who uploaded/viewed what, when — feeds the audit trail).

### 8.7 Risk intelligence — explainable, never predictive
Deliberately **does not** produce an admission or visa probability score — that would contradict the permanent "no guarantee of outcome" commitment. Instead, explainable risk bands with a stated reason:
| Risk factor | Evidence it's based on | Band |
|---|---|---|
| Missing documents past a deadline threshold | Document checklist status | Needs attention |
| Deadline proximity with incomplete application | Application Completeness Agent output | Watch |
| Inconsistency between stated and document-extracted data | Document Intelligence Agent flag, human-confirmed | Needs attention |
| Financial-document gaps (blocked account, funding evidence) | Document checklist status | Watch or Needs attention, by deadline proximity |
| No stage progress past the stagnation threshold | §8.1 stagnation event | Watch |

Every risk indicator always states **why**, never a percentage, and always carries the label: **"This is decision support, not a prediction or guarantee."** Advanced predictive modeling is explicitly deferred until enough verified historical outcome data exists to make it honest.

### 8.8 Counselor productivity & case operations
Automatic suggested case assignment by current caseload (manager override always available); defined handover packet (summary, open tasks, pending documents) on counselor change; one-click case summaries (Agent 1) on the dashboard; reusable communication templates (Agent 6 drafts, counselor edits/saves); follow-up and escalation queues (§8.3); SLA response-time tracking; full activity history (human + AI actions, tagged); manager review/override/reassignment, always logged.

### 8.9 Traceability & audit philosophy — platform-wide
The `source: human/ai` tag from Layer 1 extends to every important record:
| Record type | Carries |
|---|---|
| Tracker log entries | `source: human/ai` |
| Commission figures | source, evidence, verification date, verified-by, status, change history |
| Document-extracted fields | extraction confidence, `pending-verification` until human-confirmed, who confirmed it |
| Application status changes | who/what triggered it (human vs. system event) |
| University matching recommendations | which factors were verified vs. assumed |
| Published quarterly statistics | which underlying records they were computed from |

If a wrong status or figure is ever questioned — by a student, a university, or a regulator — there's a real, traceable answer. The only real risk here is inconsistency: applying this discipline to some features and not others undermines the whole point.

### 8.10 Operational workflows for edge cases
| Scenario | Trigger | Steps | Who's involved |
|---|---|---|---|
| Application delay | University response delay event | Counselor follow-up created → university contacted → student informed | Counselor, student |
| Missing document | Checklist gap detected | Student notified with specific item → reminder sequence if unresolved | Student, counselor |
| Counselor handoff | Manual trigger/reassignment | Handover packet generated → new counselor confirms receipt → student informed | Both counselors, student |
| Failed application | University rejection recorded | Case updated, reason logged → counselor reviews next steps → feeds outcomes reporting | Counselor, student |
| Reapplication | Decision after rejection/deferral | New application record created, linked to the original (not a fresh unrelated record) | Counselor, student |
| Deferral | Offer accepted, deferred start | Stage held, deadlines recalculated for new intake | Counselor, student |
| University change | Student changes target mid-process | Prior application marked withdrawn (never deleted), new one started | Counselor, student |
| Offer acceptance/rejection | Student decision recorded | Stage moves to Finance (accept) or shortlist revisited (reject) | Counselor, student |
| Visa refusal | Visa outcome recorded | Case reviewed for reapplication/appeal → outcome enters the quarterly report regardless | Counselor, student, manager |
| Data correction | Error identified | Correction logged with source and reason — old value never silently overwritten | Whoever corrected it |
| Escalation | SLA breach/stagnation | Manager notified → reviewed → resolution logged | Counselor, manager |
| Case closure | Outcome finalized | Final status set, retention timer begins | Manager, counselor |

Every workflow above has a human decision point — none resolve autonomously. Avoid the temptation to auto-close inactive cases; closure is always a human decision, logged with a reason.

### 8.11 Analytics & transparency reporting architecture
**Hard rule:** quarterly/public statistics are generated **only** from records explicitly marked `Verified` or with a final, human-confirmed outcome status — nothing inferred, estimated, or extrapolated.
**Categories tracked and reported separately — never blended into one headline number:** applications submitted, offers received, enrollments confirmed, visa applications submitted, visa approvals, visa refusals, withdrawals (student-initiated), cases still in progress (explicitly excluded from any "success rate" — in-progress is neither success nor failure yet).
The founder reviews and signs off on the quarterly report before publication, same as any Open Ledger figure. The temptation this section exists to prevent: a flattering blended "success rate" once real numbers exist — categories stay separate, permanently.

---

## 9. Real-data enforcement — concrete rules per data type

| Data | Must come from | Never |
|---|---|---|
| Currency conversion | Live FX API with a real key | A hardcoded rate |
| University public info | Official public sources (HESA, DAAD, university sites), cited in-code | Invented programs or fake tuition |
| Visa/policy figures | Official government sources, re-verified quarterly | A number the agent "recalls" without a source |
| Commission figures | Founder-entered via the RBAC-gated `/ops` console, full status schema (§4.3) | Any AI-generated or estimated figure shown as confirmed |
| Homepage stats | See conflict note below | The template's own placeholder numbers, shipped unchanged |
| Student case data | Real student input + counselor verification | Any seeded "demo student" left in production |
| Testimonials/logos | Real signed-off permission or real signed partner agreements | Stock-photo "students" presented as real alumni |
| Quarterly public statistics | §8.11's verified-records-only rule | Anything inferred or blended across categories |

**Conflict to resolve before launch:** the reference screenshot's stats row ("1.1M+ Satisfying Students," "600K+ Global Programs," etc.) is exactly the kind of number the brand's own honesty policy (§4.8) refuses to fabricate. Two honest resolutions:
1. Ship the component empty/pending — same visual layout, values replaced with "Not yet open" until the founder enters verified figures through `/ops`.
2. Repurpose the component for numbers real on day one — "3 destinations covered in full depth," "11-stage process," "45-min paid consultation."
Either is consistent with the brand; keeping the template's fabricated numbers silently is not.

---

## 10. Scalable architecture — MVP vs. later phases

| Component | MVP (today) | Phase 2 | Phase 3 | Future scale |
|---|---|---|---|---|
| Database | In-artifact shared storage | Supabase/Postgres, RBAC-enabled | Same, with read replicas if needed | Dedicated infra only if volume demands |
| APIs | Direct client calls to Claude API | Backend service layer | Same, with agent routing | Rate-limited, versioned internal APIs |
| Background jobs/event queue | None | Simple scheduled job for §8.1's daily checks | Proper event queue | Full async event-driven pipeline |
| Notification workers | None | Basic email/WhatsApp send functions | Retry/dedup logic | Dedicated notification service |
| Object/document storage | None | Encrypted object storage | Versioning added | CDN-backed if volume demands |
| Caching | None needed | None needed yet | Cache verified university data | Standard caching layer |
| Observability | Basic console logs | Structured logs on all writes | Full audit-trail logging | Centralized log aggregation |
| Rate limiting | Not needed at current volume | Basic per-user limits | Per-agent limits | Full API gateway |
| AI-provider abstraction | Direct Claude API calls | Thin wrapper function | Same wrapper, reused per agent | Provider-agnostic if ever needed |
| Cost controls | Not needed at current volume | Track per-agent call volume | Alerting on unexpected spend | Budget caps per environment |
| Backups/DR | None (no real data yet) | Automated backups | Tested restore process | Multi-region if scale demands |

**The opposite failure mode is just as real:** adopting a full event-queue/microservice architecture for a 4-person team's current caseload repeats the "overbuilt MVP" mistake the original audit warned against. Grow the stack in step with real need, not ahead of it.

---

## 11. Tech stack

- **Frontend:** Next.js (App Router) + React + TypeScript + Tailwind (design tokens from Section 3.1 as CSS variables) + shadcn/ui, restyled to Section 3.
- **Motion:** Framer Motion (component-level) + GSAP/ScrollTrigger (scroll-driven) + Lenis (global smooth scroll).
- **Backend/data:** Supabase (Postgres + RLS + Auth + Storage) — the source docs explicitly reject the free in-artifact store for anything beyond prototyping.
- **Auth:** Supabase Auth with MFA for staff roles; RBAC enforced at the RLS layer, not just the UI.
- **Notifications:** transactional email provider + WhatsApp Business API (India-relevant), wired to §8.2.
- **Payments/booking:** real integration for the ₹1,500 flow (Cal.com/Zoho Bookings + Razorpay suggested).
- **AI agents:** Claude API calls, each scoped per Section 7's per-agent boundaries, with a `requires_review: true` flag enforced in code on any output touching commission status, financial letters, or SOP content.

---

## 12. Source map — where every section came from

| This document | Original source |
|---|---|
| §2, §4 | `Clearway-Consolidated-Summary-v2.md`, Part I §1–12 (business/site content, renamed brand) |
| §5 | `Clearway-Consolidated-Summary-v2.md`, Part II §13 (Security & DPDP) |
| §4.3 verification schema | `Clearway-Consolidated-Summary-v2.md`, Part II §14 (Commission Verification & Disclosure) |
| §8.4 | `Clearway-Consolidated-Summary-v2.md`, Part II §15 (Student Portal) |
| §6 | `AI-Tracker-Implementation-Guide-v2.md`, Part I §1–8 (data model, classification call, testing, cost) |
| §7 | `AI-Tracker-Implementation-Guide-v2.md`, Part II §12 (10-agent architecture) |
| §8.1–8.2 | `AI-Tracker-Implementation-Guide-v2.md`, Part II §9–10 (event lifecycle, notifications) |
| §8.3 | `AI-Tracker-Implementation-Guide-v2.md`, Part II §11 (dashboards) |
| §8.5–8.7 | `AI-Tracker-Implementation-Guide-v2.md`, Part II §13–15 (matching, document intelligence, risk) |
| §8.8–8.11 | `AI-Tracker-Implementation-Guide-v2.md`, Part II §16–20 (counselor ops, audit, edge cases, reporting) |
| §10 | `AI-Tracker-Implementation-Guide-v2.md`, Part II §18 (scalable architecture) |
| §3 | Your reference screenshot ("ReadyToStudy") — visually read, `[VERIFY]`-flagged |
| §9 | Synthesized — the enforcement translation of both docs' "never fabricate" rules |

Both original build-order roadmaps (business doc §18, agent doc §21) are merged into Section 13 below.

---

## 13. Execution loop — phase-by-phase prompts for Claude Code

Run in order. Confirm each Definition of Done before starting the next phase.

### Phase 0 — Scaffold
> Set up Next.js + TypeScript + Tailwind. Add Framer Motion, GSAP, Lenis. Define every design token from Section 3.1–3.2 as CSS variables and a Tailwind theme extension. No page content yet — infrastructure only.
**Done when:** project builds; tokens are defined and demonstrable (a token-swatch test page); Lenis and one GSAP ScrollTrigger demo work.

### Phase 1 — Security & DPDP foundation (Section 5)
> Implement Supabase with RLS, the four-role RBAC matrix, MFA for staff roles, the consent-log schema, audit-trail logging, and the secure-upload pipeline exactly as specified in Section 5. No student-facing feature yet.
**Done when:** every row in Section 5's checklist is implemented and testable; a real login per role enforces the correct read/write boundaries.

### Phase 2 — Marketing site (Sections 3–4)
> Build the 5 public pages (`/`, `/open-ledger`, `/zero-commission`, `/anti-fraud-policy`, `/book-consultation`) using the design system in Section 3 and the complete content in Section 4. Apply the motion spec (3.4). Resolve the stats-row conflict per Section 9's note — pick option 1 or 2 and implement it. Wire `/book-consultation` to a real booking/payment provider.
**Done when:** all 5 pages match the visual system; no fabricated data exists anywhere; the consultation booking actually books/charges, or is clearly marked "not yet live" — never a fake success state.

### Phase 3 — Data model & event lifecycle (Sections 6, 8.1)
> Implement the student-record data model (Section 6.1) and the 11-stage event-driven lifecycle (Section 8.1). This is the backbone every dashboard/portal reads from.
**Done when:** a test case can move through all 11 stages and every downstream view reads live state, not a hand-updated copy.

### Phase 4 — Student portal (Section 8.4, `/portal`)
> Build the authenticated student portal per Section 8.3/8.4's full spec — stage, next action, deadlines, document checklist, reference numbers/logins, counselor contact, communication history, offers comparison, visa status, notifications. Respect the explicit non-goals in 8.4.
**Done when:** every item in Section 8.3's "what a student sees" list is real and reads from Phase 3's live data.

### Phase 5 — Counselor & founder dashboards (Section 8.3, `/console`, `/ops`)
> Build both dashboards per Section 8.3's full spec, including the founder dashboard's commission-verification-status view feeding the quarterly Open Ledger update.
**Done when:** a counselor sees and acts on their real caseload; a founder sees real pipeline health and commission-verification status, sourced from Phase 3's data.

### Phase 6 — Notification & escalation engine (Section 8.2)
> Wire real email/WhatsApp notifications to the event lifecycle per Section 8.2's channels, data model, and design rules.
**Done when:** a real state change triggers a real notification through a real provider — not a console.log stand-in.

### Phase 7 — Controlled AI agents (Section 7)
> Implement all 10 agents from Section 7, one at a time, each with its exact prohibitions enforced in code — not just in the prompt sent to the model.
**Done when:** every output Section 1 requires human review for is actually gated behind a review step; confirm by trying to bypass it and failing to.

### Phase 8 — Matching, document intelligence, risk intelligence (Sections 8.5–8.7)
> Build university matching (explainable), document intelligence (verification, not generation), and risk intelligence (explainable bands, never predictive) per Sections 8.5–8.7. Risk intelligence ships only once enough real outcome data exists to be honest.
**Done when:** matching always shows its reasoning; document intelligence never modifies a document; no probability score exists anywhere in the UI.

### Phase 9 — Counselor productivity & audit trail (Sections 8.8–8.9)
> Implement workload balancing, handover packets, the follow-up/escalation queues, and the platform-wide `source: human/ai` traceability pattern from Section 8.9 across every record type in that table.
**Done when:** every record type in 8.9 carries its required provenance fields, not just the original tracker log.

### Phase 10 — Analytics & quarterly reporting (Section 8.11)
> Implement the verified-records-only reporting rule, with the categories kept permanently separate (never blended into one "success rate").
**Done when:** a test quarterly report generates only from `Verified`/final-outcome records, and in-progress cases are provably excluded from any success-rate calculation.

### Phase 11 — QA & no-mock-data audit (Section 9, Section 1)
> Full audit: grep for hardcoded numbers, seeded demo records, placeholder testimonials outside clearly-marked dev fixtures. Confirm every production number traces to a real source per Section 9's table. Adversarially test every Section 1 guardrail (try to make an agent write a bank letter; try to publish a commission without founder sign-off; try to view another student's case as a student).
**Done when:** the audit finds zero violations, with a written record of what was tested.

---

## 14. What's still genuinely out of scope for any AI coding agent

The DPDP legal review, the actual university outreach for commission-disclosure permission (§4.3), the founder's real bio/photo, and the real CIN/GSTIN/registered-address footer details all require a real person doing real-world work — a lawyer, an outreach email answered by a real university, a founder's own biography. Everything else in this document is buildable; those specific items are the actual gate on "real" launch, exactly as your own source documents already say.
