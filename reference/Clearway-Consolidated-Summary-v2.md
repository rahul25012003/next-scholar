# Clearway Global Education — Consolidated Project Summary

*A single reference document covering every page, decision, and open item across the 5-page MVP website + build notes.*

> **Document status:** This is v2. Part I below is the original document, unchanged, word for word. Part II is new material appended after it, upgrading the strategy from a 5-page MVP toward a genuine two-sided, AI-first consultancy platform — per the audit findings summarized in Section 19. Nothing in Part I has been deleted, reworded, or reordered.

---

# PART I — Original Document (Unchanged)

## 1. Brand & Positioning

- **Name:** Clearway Global Education
- **One-line pitch:** "We publish what we earn on every university we recommend."
- **Base:** Bengaluru, Karnataka. Serves clients online across India.
- **Target client:** Bengaluru engineering/business graduates applying for **Master's study** abroad.
- **Core differentiator (the whole brand thesis):** Most consultancies are paid commission by universities (commonly 10–20% of first-year tuition) and don't disclose it — so universities that pay nothing quietly vanish from shortlists. Clearway publishes the exact commission figure for every university, including the ones that pay zero, *before* the client pays anything.
- **Design system:** Blue (#0B2A5B / #1553C7) + white, "institutional/records" aesthetic. Fonts: Bricolage Grotesque (display), Newsreader (body/serif), IBM Plex Mono (data/labels). Signature UI element: **"The Ledger"** — a bordered, monospace-labeled table styled like a financial record.

---

## 2. Site Structure (5 pages, 1 shared stylesheet)

| Page | Purpose |
|---|---|
| `index.html` | Home — hero, problem statement, Policy Desk, destinations, 11-step process, outcomes (currently "not yet open"), final CTA |
| `open-ledger.html` | Full commission disclosure table + methodology + the "commission-flagging rule" |
| `zero-commission.html` | Universities that pay **zero** commission, per destination, + how to apply directly yourself |
| `anti-fraud-policy.html` | Document-integrity rules + data protection policy (DPDP Act 2023 draft) |
| `book-consultation.html` | ₹1,500 paid 45-min consultation booking page (currently a non-functional static form) |
| `styles.css` | Shared design system for all pages |

No build step required — plain HTML/CSS, opens directly in browser.

---

## 3. Destinations (Phase 1 — deliberately limited to 3)

**Decision, stated explicitly in build notes:** Only UK, Germany, Ireland are launched — not the 6 in the original prototype, not the "20+" mentioned elsewhere. Rule: *add a country only once you can answer its full 10-section template without looking anything up.*

| Destination | Intakes | Tuition | Post-study visa window | Commission to Clearway | Client fee |
|---|---|---|---|---|---|
| United Kingdom | Sep, Jan | £14k–38k | 18 months *(dropping from 24→18 months for applications from 1 Jan 2027; PhDs keep 36 months — needs verification before publishing)* | ₹1.5L–2.5L (needs-verify) | ₹25,000 |
| Germany — public | Oct, Apr | €0 (public) | 18 months | ₹0 — public universities pay no agents | ₹45,000 flat advisory fee |
| Germany — private | Oct, Apr | (varies) | 18 months | ₹1.3L–3.5L (needs-verify) — flagged "above-average" | ₹25,000 |
| Ireland | Sep, Jan | €12k–26k | 24 months (Third Level Graduate Programme) | ₹90k–1.6L (needs-verify) | ₹25,000 |

**Policy Desk notes (all flagged "verify before publishing"):**
- **UK:** Graduate Route shortens from 24 to 18 months for applications made on/after 1 Jan 2027 (PhD graduates retain 36 months).
- **Germany:** APS certificate mandatory for Indian applicants; blocked-account amount and free-appeal rules have changed — confirm current figures.
- **Ireland:** Third Level Graduate Programme gives a defined post-study window; accommodation availability (not visa policy) is the practical bottleneck to plan around.

---

## 4. The Open Ledger (signature transparency mechanism)

- Publishes, per destination: what Clearway earns from the university, what the client pays Clearway, contract type (Partner/None), and a "flag" for anomalies.
- **Commission-flagging rule:** if a university's commission is more than double the category average for its tier, Clearway discloses this *in writing on the shortlist before recommending it* — not after the fact. Doesn't mean they won't recommend it; means the client never has to wonder about the incentive.
- **Update cadence:** re-verified and republished every quarter, even if unchanged (a stale "last verified" date is treated as worse than no date).
- **Critical open blocker (flagged in build notes and inside the file itself):** every commission figure shown is currently a *market-typical estimate*, not a confirmed contract term. Before publishing real figures anywhere, Clearway must get **written confirmation from every aggregator/university that public disclosure of their commission is permitted** — many partner agreements restrict this by default. This is called out as the single most important pre-launch legal/business step.

---

## 5. Zero-Commission List

- Lists universities/systems that pay **no** agent commission, so students know they exist and can apply directly for free.
- **Germany — public universities:** pay agents nothing, without exception; tuition itself is near-free (semester contribution only). Clearway charges a flat advisory fee only for help with process steps (APS, uni-assist, blocked account) — never a university-paid commission.
- **UK & Ireland sections:** currently placeholders — need a verified, specific list of no/low-commission institutions (marked `needs-verify`).
- **Self-apply steps outlined:** go to the university's own admissions page → check programme-specific requirements/deadlines → prepare own documents → submit directly → come to Clearway only for a specific process bottleneck (visa file, blocked account, APS), where the flat-fee model removes any commission conflict.
- **Stated rationale:** this page can cost Clearway commission revenue (some readers will self-apply and never be invoiced), and that's the point — it's proof the recommendations aren't commission-driven.

---

## 6. Anti-Fraud & Data Protection Policy

**Document integrity commitments (non-negotiable, already finalized in tone):**
- Verify every transcript/certificate against the original or the issuing institution directly.
- Never edit, retouch, or alter any document.
- Never write a bank statement, source-of-funds letter, or work-experience letter on a student's behalf.
- Decline to work with anyone who asks for falsified/misrepresented documents.
- SOPs are written in the student's own voice — coached and edited, never ghostwritten with untrue claims.
- Maintain a written file per student for **5 years**.
- Report suspected fraudulent documents to the relevant institution.

**Data protection section — explicitly marked as an unfinished draft, needs lawyer review (DPDP Act 2023):**
- What's collected: transcripts, passport copies, test scores, bank statements/funding evidence, LORs, photos — only as needed.
- Consent: explicit written consent before collecting sensitive documents, naming exactly who it will be shared with.
- **Open items needing real answers before launch:** actual storage system + access controls + encryption status; a written breach protocol (who is notified, in what timeframe, how); retention period cross-checked against actual DPDP Act requirements; a real complaints procedure (named contact, response-time commitment, escalation path, tested before launch).

**Guarantees explicitly disclaimed:** no guarantee of admission; no guarantee of visa outcome — stated as a permanent commitment, "including if it's us, at some point in the future, under different management."

---

## 7. Book a Consultation

- **Offer:** 45-minute paid consultation, ₹1,500, credited in full against the service fee if the client proceeds.
- **Structured intake — 6 questions asked in this order** (so as not to recommend a country that won't work for the profile):
  1. Academic background + percentage/CGPA
  2. Graduation year + explanation of any gap
  3. English test status (IELTS/PTE/TOEFL/Duolingo)
  4. Total year-one budget (tuition + living)
  5. Target intake
  6. Whether another consultant has already submitted an application for them
- Within 24 hours of the call: written assessment with 2–3 ranked destinations, reasoning, and risks for each.
- **Current build status:** the form is a static placeholder with no backend — needs to be wired to a real booking + payment flow (suggested: Cal.com or Zoho Bookings + Razorpay) before launch.

---

## 8. The 11-Stage Client Process (from homepage)

1. **Consultation** — 45 min, paid, honest profile assessment (including "should you go at all")
2. **Shortlist** — 8–10 universities (ambitious/target/safe), commission listed next to each
3. **Agreement** — written scope, fee, timeline; nothing verbal
4. **Documents** — verified against originals; never created/altered
5. **Applications** — submitted and tracked; client gets every reference number/login
6. **Offers** — compared side by side, including ones Clearway would advise declining
7. **Finance** — education loan, blocked account, forex/TCS planning
8. **Visa** — file prep + interview rehearsal against current refusal patterns
9. **Pre-departure** — accommodation, insurance, flights, banking, arrival briefing
10. **Arrival** — check-ins at 30, 90, 180 days
11. **Outcome published** — result (approved or refused) enters the quarterly report, anonymised, always

---

## 9. Outcomes & Credentials (honesty-by-default approach)

- Homepage currently shows **all outcome metrics as "Not yet open"** (applications, offers, visas approved/refused, students advised not to proceed) — a deliberate choice, since no client has been taken yet. Build notes explicitly reject using the original prototype's fabricated stats (e.g., "34 applications, 28 offers").
- **Credentials shown as "in progress," never claimed outright:** ICEF ITAC, British Council AQF, ICEF Agency Status (planned Month 6–12).
- First quarterly outcomes report is committed to publish after the first full quarter of operation — and will include refusals and students told *not* to proceed, not just successes.

---

## 10. Every Placeholder That Must Be Resolved Before Launch

From the build notes, in priority order:

| Placeholder | Location(s) | Why it matters |
|---|---|---|
| Commission figures (`needs-verify` tags) | Home, Open Ledger | Currently market-typical estimates, not confirmed contract terms |
| CIN, GSTIN, registered address, email, phone | Every page footer | Currently fake/placeholder values from the prototype |
| "Last verified" dates | Policy Desk, destination cards, Open Ledger | Every regulatory figure needs re-checking against current official sources — not just re-dating old numbers |
| Complaints procedure + data storage/retention/breach details | Anti-fraud policy | Structural placeholder only — needs lawyer review, not just a CA |
| Booking form | Book a Consultation | Currently non-functional; needs real booking + payment integration |
| Founder bio + photo | Not yet built | Recommended as a genuine trust signal — don't skip |

**The single step that gates everything else:** get written confirmation from every aggregator/university that Clearway is permitted to publish their commission band publicly, *before* publishing any real figure. Flagged as a critical blocker — the outreach email template already tells universities commission arrangements will be published publicly, before any agreement confirms they're comfortable with that.

---

## 11. Explicitly Deferred (Not Built Yet, By Design)

Per the build notes, these are considered premature for a pre-revenue, pre-legal-entity MVP:
- Individual country pages (full 10-section template)
- Blog / SEO content infrastructure
- Live Policy Desk with a monthly-refresh workflow
- "For Universities" B2B page
- Founder/About page
- A "Refusal File" (presumably a dedicated page for published refusals)
- Cost calculator / eligibility checker

Rationale: building these now — before a legal entity exists, before the Open Ledger has real verified numbers, and before there are real clients to report honest outcomes on — would be the kind of overbuilt MVP the underlying audit warned against.

---

## 12. Competitive Context (LeapScholar / IDP — researched Sep 2026)

- **LeapScholar** (part of the "Leap" group — LeapScholar, LeapFinance, GeeBee, Yocket): AI-powered, Series-E funded, operating across 11 countries, 3M+ community members, 1,500+ partner universities, claims 97–98% visa approval and 70+ NPS. Expanding rapidly with 15+ new physical centres in India in 2026. Optimized for **scale and volume**, not disclosure — commission structure is not published to students.
- **IDP Education:** similarly large, global, standardized-process model.
- **Structural gap Clearway can exploit:** neither discloses per-university commission or publishes negative outcomes (refusals, discouraged applicants); both are optimized for breadth (10+ countries, 1,000+ universities) rather than depth or verification. Clearway's "3 countries known completely + published commission + published refusals" model is a direct, hard-to-replicate-at-scale inversion of their approach.

---

*Compiled from: index.html, open-ledger.html, zero-commission.html, anti-fraud-policy.html, book-consultation.html, styles.css, and README-build-notes.md.*

---
---

# PART II — Platform Upgrade: Path to 10/10

*Everything below is new. It extends Part I — it does not replace any decision, principle, or deferral made above. Where a new section modifies how an existing mechanism works (e.g., commission verification), it says so explicitly and restates what's preserved.*

## 13. Security, Privacy & DPDP Foundation *(Priority 1 — blocks all real student data)*

This is the single highest-priority addition. Section 6 already flagged data protection as an unfinished draft; this section turns that flag into a concrete build spec. Nothing here contradicts Section 6 — it operationalizes it.

| Capability | Design decision for Clearway | Phase | Needs legal (DPDP) verification? |
|---|---|---|---|
| Document & data storage | Managed Postgres/object storage with row-level security (e.g. Supabase) as the real-data baseline — never the free in-artifact store referenced in the tracker guide's Layer 2 for anything beyond prototyping | MVP-blocking | No (technical), but retention period below needs legal check |
| Encryption at rest | Provider-managed encryption (AES-256 or equivalent) on all documents and PII fields, no exceptions | MVP-blocking | No |
| Encryption in transit | TLS on every connection, including internal service-to-service calls | MVP-blocking | No |
| Role-based access control (RBAC) | Four roles: Student, Counselor, Manager/Admin, Founder — matrix below | MVP-blocking | No |
| Consent management | Explicit, written, per-document-category, timestamped, revocable consent log tied to each student record — this is the technical implementation of the consent commitment already in Section 6 | MVP-blocking | Yes — DPDP consent-basis requirements |
| Access logging & audit trail | Every read/write of a sensitive field logged: who, when, what changed | MVP (lightweight) → Phase 2 (full) | No |
| Retention & deletion rules | Technical enforcement of the existing 5-year written-file commitment (Section 6), plus an automated deletion job once that period lapses | Phase 2 | Yes — confirm 5-year figure is actually what DPDP requires/permits |
| Backups & disaster recovery | Automated daily backups, a tested restore process, documented recovery time/point objectives | Phase 2 | No |
| Breach response procedure | Named contact, notification timeframe, escalation path — this is the exact open item Section 6 already flagged as needing a real answer, not just a policy sentence | MVP-blocking | Yes — DPDP breach-notification timeline |
| Secure upload / malware & file validation | File-type allowlist, size limits, virus/malware scan before anything touches storage | MVP-blocking | No |
| Multi-factor authentication (MFA) | Required for Counselor, Manager, and Founder logins from day one; offered (not mandatory) for Students | MVP | No |
| Environment separation | Dev/staging environments use synthetic data only — a real student's passport or transcript never leaves production | MVP | No |
| DPDP-specific requirements | Lawful basis for processing, data-principal rights (access/correction/erasure), a designated grievance officer, and a check on where data is actually hosted (cross-border transfer rules if any vendor is non-Indian) | MVP-blocking | Yes — full legal review, exactly as already flagged in Section 6 and Section 10 |

**RBAC permission matrix:**

| Role | Reads | Writes | Verifies/approves |
|---|---|---|---|
| Student | Own case record only | Own document uploads, own SOP drafts | — |
| Counselor | Assigned caseload only | Notes, doc-status flags, log entries for assigned cases | Document verification (not commission figures) |
| Manager | All active cases (read) | Reassignment, escalation resolution | Escalation sign-off |
| Founder/Admin | Everything, including Open Ledger source records | System configuration, commission-record verification | Final commission publication status |

- **Purpose:** protect the passports, financial documents, and identity records the platform will hold, and protect Clearway itself — a single breach in a brand built entirely on trust would be far more damaging here than for a volume-optimized competitor.
- **User value:** students can hand over sensitive documents with a real answer to "who can see this and what happens if something goes wrong," not just a policy paragraph.
- **Dependencies:** a hosting/storage decision (the tracker guide already recommends Supabase for this reason — see Doc 2 §2), and a lawyer for every row marked "needs legal verification" above.
- **Data requirements:** none beyond what's already planned to be collected in Section 6 — this section only changes *how* it's protected, not what's collected.
- **Human review:** every access-control and retention rule needs founder sign-off before go-live; every DPDP-marked item needs lawyer sign-off before a single real document is stored.
- **Phase:** MVP-blocking. This is the one section in this whole document where "we'll get to it later" is not an acceptable answer once real students are involved.
- **Risks if skipped:** a breach involving passports or bank statements would not just be a data-protection failure — for a brand whose entire pitch is "we tell you the truth about money," it would be existential.

---

## 14. Commission Verification & Disclosure Framework *(extends Section 4 — the Open Ledger)*

Section 4 already identifies the correct blocker: every commission figure is currently an estimate, and publishing it requires university/aggregator permission. This section adds the operational framework to actually resolve that blocker — it does not change the underlying commitment, which is preserved exactly: **anomalies (commission more than double the category average) are still disclosed in writing on the shortlist before any recommendation is made, full stop.**

**Every commission record now carries this schema**, instead of a single number:

| Field | Purpose |
|---|---|
| University / Program | What the figure applies to |
| Commission figure or band | The actual number, or a range if full disclosure isn't permitted |
| Source | Where the figure came from (signed partner agreement, aggregator statement, direct written confirmation, market estimate) |
| Evidence | A reference to the actual document/email confirming it — not just a claim |
| Verification date | When it was last confirmed as accurate |
| Verified by | Named person at Clearway who confirmed it |
| Status | See status states below |
| Last review date | Independent of verification date — every figure is reviewed quarterly per Section 4's existing cadence, even if nothing changed |
| Change history | Every prior value, with date and reason for the change |

**Status states** (a figure moves through these, never skips straight to "published"):

1. **Unverified (market estimate)** — current state of every figure today, per Section 3's `needs-verify` tags. Never shown to a client as a confirmed number.
2. **Outreach sent** — Clearway has asked the university/aggregator for written confirmation and permission to publish.
3. **Permission denied** — university confirmed the figure but declined public disclosure.
4. **Permission pending** — awaiting response.
5. **Verified — publishable** — confirmed figure, university has agreed to public disclosure. Only this status can appear on the live Open Ledger as an exact number.
6. **Verified — band only** — confirmed internally, but the university will only permit a range, not an exact figure.
7. **Disputed** — a figure Clearway believed correct is contested by the university; frozen from publication until resolved.

**Fallback strategy when a university/aggregator refuses disclosure** (this is the piece Section 4 flagged as the critical blocker without yet having an answer):

| If the university... | Clearway shows... |
|---|---|
| Confirms zero commission | The verified zero, always — this is the strongest case and requires no permission to disclose a truthful "they pay nothing" |
| Confirms a figure and permits publication | The exact figure |
| Confirms a figure but permits only a range | A published band (e.g., "₹1.5L–2L confirmed range") plus a note that the exact figure is confidential by the university's request |
| Confirms a figure but refuses any public disclosure | "Clearway receives a commission from this university; the university has not authorized publishing an amount." The relationship's *existence* is still disclosed — silence about the existence of a commission is the one thing the brand cannot do, even where the amount can't be shown |
| Does not respond at all | Remains tagged `needs-verify` on the client-facing side and is excluded from the "verified" Open Ledger entirely until resolved — never defaults to showing the market estimate as if it were confirmed |

- **Purpose:** turn "we need permission before publishing anything" from an unresolved blocker into a concrete, trackable workflow with a defined outcome for every possible response.
- **User value:** a client sees the real state of verification for every figure, not a polished number masking an unconfirmed estimate.
- **Dependencies:** the outreach email template mentioned in Section 10 needs to be sent (and tracked) systematically; a lawyer should review the "existence disclosed even without amount" fallback for any partner-agreement conflicts.
- **Data requirements:** the schema above, one row per university/program relationship.
- **Human review:** every status change to "Verified" requires founder sign-off — this is the one dataset on the platform where an AI agent (see Doc 2 §12) is explicitly barred from writing.
- **Phase:** MVP-blocking for anything claiming to be a "verified" figure; the site can and should continue showing `needs-verify` tags honestly in the meantime, exactly as it does today.
- **Risks:** if most universities decline disclosure, the Open Ledger's core promise weakens — the "existence disclosed, amount confidential" fallback exists specifically so the brand thesis survives even a low permission-response rate.

---

## 15. Student Portal — Completing the Two-Sided Platform

Section 8's 11-stage process already promises the client "every reference number/login" (Stage 5) — this section is what actually builds that promise. The counselor-facing tracker in Doc 2 has no student-facing counterpart today; this closes that gap.

**What a logged-in student sees:**

- Current stage (of the 11 in Section 8), in plain language
- What has been completed so far, and what's still pending
- The specific next action required of *them* (not the counselor)
- Upcoming deadlines (application, financial, visa)
- Document checklist: what's required, what's uploaded, what's verified, what's missing
- Document upload, with visible status per file (Uploaded → In review → Verified / Issue found)
- Every application reference number and portal login Clearway holds on their behalf — matching the existing promise in Stage 5
- Their assigned counselor's name and contact details
- A readable communication history (not raw internal notes — a student-appropriate view)
- Offers received, compared side by side, including any Clearway would advise declining (mirrors Stage 6)
- Visa application status and stage
- Notifications: deadline reminders, document requests, status changes

**Explicit non-goals for the student portal** (preserving deferrals already established elsewhere in this document):
- No predictive admission/visa percentage shown anywhere in the student view — consistent with the permanent disclaimer in Section 6 and the risk-intelligence approach in Doc 2 §15.
- No general-purpose AI chatbot — the Student Guidance Agent (Doc 2 §12) is scoped strictly to the student's own verified data, not an open chat product.
- No self-serve SOP generation — SOP support is a coaching flow (Doc 2 §12, Agent 9), never an auto-write button.

- **Purpose:** let a student understand exactly where their application stands without depending on WhatsApp or manually asking a counselor — closing the biggest structural gap identified in the audit.
- **User value:** transparency the brand already promises at the commission level, extended to the student's own case status.
- **Dependencies:** the Security & DPDP foundation (§13) must exist first — this is the first feature that puts real student PII behind a login.
- **Data requirements:** reuses the exact student data model already defined in Doc 2 §3, Layer 1 — no new schema needed, just a read-scoped, student-facing view of it.
- **Human review:** none required to *display* already-verified data; any AI-generated content shown to the student (e.g., a Case Summary Agent output) must be reviewed per that agent's rules in Doc 2 §12.
- **Phase:** Phase 2 — after the security foundation and after the tracker's core data model (Doc 2 §1–4) is stable, per the roadmap in §18 below.
- **Risks:** a student-facing surface that shows stale or wrong data is worse than no portal at all — this depends on the event-driven lifecycle in Doc 2 §9 keeping the underlying record actually current, not just on the UI existing.

---

## 16. Three Connected Dashboards *(summary — full detail in Doc 2 §11)*

The platform needs three views into the same underlying data, not three separate systems:

- **Student Dashboard** — described fully in §15 above.
- **Counselor Dashboard** — caseload, assignments, workload, follow-ups, handovers, deadlines, stagnant cases, AI-generated case summaries, SLA monitoring. Full spec in Doc 2 §11.
- **Founder/Operations Dashboard** — pipeline health, applications by stage, bottlenecks, counselor workload, upcoming deadlines across all cases, offer/visa outcomes, stagnant cases, and — critically — the commission-transparency verification status from §14 above, feeding directly into the quarterly public Open Ledger update and the outcomes report already committed to in Section 9. This is the dashboard that turns "re-verified every quarter" (Section 4) from a manual scramble into something the founder can see the real status of at any time.

Detailed build spec for all three lives in Doc 2, since they're views over the tracker's data model rather than a separate product.

---

## 17. Preserved Principles Checklist

Nothing below is new — this section exists only to confirm, explicitly, that every principle identified as a strength in the audit survives this upgrade unchanged:

- ✅ The "not yet built" list in Section 11 (country pages, blog/SEO, live Policy Desk, "For Universities" B2B page, founder/about page, Refusal File, cost calculator) remains deferred. None of it is required to reach the 10-step roadmap below.
- ✅ Raw-input-before-AI-enhancement pattern (Doc 2's original Layer 4) is preserved and *extended* to every new automation in Doc 2 §9 — every event-driven workflow reacts to already-stored state, never invents it.
- ✅ Refusal to fabricate outcome statistics (Section 9) is preserved and reinforced by the reporting rules in Doc 2 §20.
- ✅ Refusal to auto-generate source-of-funds letters, bank statements, or work-experience letters (Section 6) is preserved and made a hard prohibition on every AI agent in Doc 2 §12.
- ✅ Refusal to ghostwrite SOPs (Section 6) is preserved and operationalized as the SOP Coaching Agent's explicit boundary in Doc 2 §12, Agent 9.
- ✅ Commission-anomaly-disclosed-before-recommendation rule (Section 4) is preserved exactly, restated in §14 above.
- ✅ No guarantee of admission or visa outcome (Section 6) is preserved and extended into a specific prohibition on predictive percentages in Doc 2 §15.
- ✅ No premature generic chatbot, no predictive success percentages, no unnecessary country-page expansion, no premature "For Universities" B2B page — all remain deferred until the underlying verified data and platform maturity justify them.
- ✅ The overall transparency-first, depth-over-breadth positioning against LeapScholar/IDP (Section 12) is the organizing principle behind every addition in Part II — nothing here is an attempt to out-scale them.

---

## 18. Reorganized Roadmap — 10-Step Execution Priority Order

This supersedes no prior decision; it sequences everything in both documents into one build order:

1. **Security, privacy & DPDP foundation** (§13) — no real student data before this exists.
2. **Commission disclosure / legal / verification framework** (§14) — resolves the single blocker Section 4 already identified as most critical.
3. **Student portal** (§15) — the two-sided platform.
4. **Complete application lifecycle & state management** (Doc 2 §9) — the event-driven backbone everything else runs on.
5. **Event-driven automation & notifications** (Doc 2 §9–10).
6. **Counselor and founder dashboards** (§16 / Doc 2 §11).
7. **Document intelligence** (Doc 2 §14).
8. **Explainable university matching** (Doc 2 §13).
9. **Controlled AI agents & SOP coaching** (Doc 2 §12).
10. **Risk intelligence & advanced analytics** (Doc 2 §15, §20) — only after enough verified outcome data exists to make it honest, consistent with Section 9's "first quarterly report after the first full quarter" commitment.

---

## 19. Second End-to-End Audit

| Dimension | Before this upgrade | After this upgrade | Still open |
|---|---|---|---|
| Security/DPDP readiness | 3/10 — explicitly unfinished draft | Fully specified, MVP-blocking checklist | Actual legal review of every DPDP-marked item — cannot be completed on paper alone |
| Commission transparency mechanism | Correct principle, no path to resolve the blocker | Full verification schema + fallback strategy for every possible university response | Real-world response rate from universities is unknown until outreach actually happens |
| Two-sided platform | Counselor-only | Student portal fully specified | Not yet built — this document specifies it, doesn't build it |
| Automation | Note-triggered only | Event-driven lifecycle specified (Doc 2 §9) | Depends on the state-management backbone actually being implemented first |
| AI governance | One classification function | 10-agent architecture with explicit prohibitions per agent (Doc 2 §12) | Requires disciplined engineering to actually enforce the "human review required" boundaries in code, not just in a spec |
| Strategic differentiation vs. LeapScholar/IDP | Correctly identified, not yet operationalized | Every new capability explicitly serves the transparency moat, not scale-matching | Execution risk: depth-first only works if verification (§14) and security (§13) are actually completed, not just planned |

**What still prevents a genuine 10/10 today:** this document is a specification, not a built system. The gap from 4/10 to 10/10 closes only as each phase in §18 is actually implemented and legally reviewed — particularly the DPDP items and the university outreach in §14, neither of which can be resolved by documentation alone. The remaining work is execution, in the order above, not further planning.
