# Per-country content audit

All three destinations audited to the same depth, rather than auditing Germany
and spot-checking the rest. Every public claim on our site checked at source.

Date: 2026-09-03

---

## 1. Accuracy of what we already publish

| Claim on our site | Verdict | Detail |
|---|---|---|
| UK Graduate Route: 18 months for applications from 1 Jan 2027, PhDs keep 36 | **Accurate** | Confirmed against UKCISA and Home Office reporting |
| Ireland: 24 months, Third Level Graduate Programme | **Accurate but incomplete** | True for Master's and doctoral (NFQ 9/10), granted as 12 months plus a 12 month renewal. A Level 8 bachelor gets 12 months only. We state a flat 24 |
| Germany: "No tuition fee. Semester contribution only" | **FALSE** | Baden-Wurttemberg has charged non-EU students **EUR 1,500 per semester** at public universities since winter 2017 and still does for winter 2026/27. That state holds Heidelberg, Stuttgart, KIT, Tubingen, Freiburg and Mannheim, among the most common targets for Bengaluru engineering graduates |
| Germany: blocked account amount "needs reconfirming" | **Now known** | EUR 11,904 per year, EUR 992 per month, unchanged since winter semester 2024 |

**This is the highest priority item in the entire backlog.** A site whose single
differentiator is that its numbers are checkable cannot carry a false fee claim
about its own zero-commission flagship route.

---

## 2. Per-country process coverage

Current state: each destination has four document categories and four process
steps in `content/requirements.ts`, and all three carry `curatedBy: null` and
`curatedOn: null`, meaning no named person has checked them at source. The code
already reports this honestly. Below is what a complete set looks like.

### 2.1 United Kingdom, missing

| Item | Detail |
|---|---|
| Maintenance funds | GBP 1,529 per month in London, GBP 1,171 outside, up to nine months (GBP 13,761 / GBP 10,539), in addition to outstanding tuition on the CAS |
| The 28 day rule | Funds held for 28 consecutive days in the applicant or parent account |
| Immigration Health Surcharge | GBP 776 per year, paid up front |
| TB test certificate | Required for applicants from India |
| ATAS certificate | Required for certain STEM programmes |
| IELTS for UKVI vs Academic | Different tests for different routes; we model one English test only |
| Credibility interview | Not mentioned anywhere |
| Term time work rights | Not mentioned |
| CAS | Present as a checklist line, but not as a dated dependency |

### 2.2 Germany, missing

| Item | Detail |
|---|---|
| Baden-Wurttemberg fee exception | See section 1. Currently contradicted by our own page |
| Blocked account figure | EUR 11,904 per year, EUR 992 per month |
| anabin degree recognition | The single biggest gate for Indian applicants. A three year Indian bachelor is commonly insufficient for direct Master's entry. Nothing models it |
| Studienkolleg | The pathway when recognition fails |
| German language qualifications | TestDaF, DSH, telc, Goethe. Cannot currently be stored at all, see section 3 |
| Semester contribution amount | Stated as a concept, never as a figure |
| Health insurance detail | Statutory versus private, and which applies to whom |
| Visa appointment booking | Frequently the binding constraint on the whole timeline |
| City registration after arrival | Absent |
| Work rights | Absent, and expressed in Germany as full and half days rather than hours |
| Application deadlines | Mid July for winter, mid January for summer |

### 2.3 Ireland, missing

| Item | Detail |
|---|---|
| Proof of funds | EUR 10,000 for each year of study, with six months of statements |
| Tuition paid before visa | At least EUR 6,000 before the application |
| Private medical insurance | Minimum EUR 25,000 accident and EUR 25,000 disease cover. Our step list currently says "accommodation" where insurance belongs |
| IRP registration | EUR 300, first registration in person, renewals online |
| Stamp 2 conditions | Absent |
| Work rights | 20 hours term time, 40 in holidays |
| Stamp 1G structure | The 12 plus 12 split, and the Level 8 distinction |

---

## 3. Structural gaps the country audit exposed

Data model problems, not content problems. They block the content work above
from being expressible at all.

| # | Gap | Consequence | Priority |
|---|---|---|---|
| 3.1 | **A case has no route field.** `destination` is a bare string | A German student cannot be recorded as public or private, although the two differ in our fee (INR 45,000 vs 25,000), our commission (INR 0 vs 1.3 to 3.5L) and their requirements. `requirementsFor("Germany")` returns the public set for everyone, so a private university applicant is silently checked against the wrong requirements | **P0** |
| 3.2 | **No German language test category.** `DocumentCategory` offers `english-test` only | TestDaF, DSH, telc and Goethe cannot be uploaded, tracked or expired. The same gap blocks any future non English speaking destination | **P0** |
| 3.3 | **No degree recognition concept** | anabin equivalence, three versus four year bachelor, and the Studienkolleg pathway cannot be represented. For a Bengaluru audience this is the most consequential German gate, and it is invisible to the system | **P0** |
| 3.4 | **No per-destination financial threshold** | The case carries one `budgetInr`. Visa maintenance requirements differ by country and, in the UK, by city. Nothing checks a student's funds against the rule that will actually be applied | **P1** |
| 3.5 | **No post-arrival obligations model** | Stage 10 is "Arrival" with check-ins at 30, 90 and 180 days, but nothing models IRP registration, city registration, insurance activation or work hour limits, which is where students actually get into trouble | **P1** |
| 3.6 | **Requirement lists are uncurated drafts** | All three sets have a null curator and a null date. The completeness check reports this honestly, but it means no counselor should currently rely on any of them | **P1** |
| 3.7 | **Visa stage has no checklist** | The eleven stage process names Visa as a stage with a deliverable, but there is no per-destination visa document checklist behind it | **P1** |

---

## 4. Effect on the phase plan

- The tuition correction moves to the **front of Phase 1**. It is a few lines of
  content and it removes a false statement from a live page.
- 3.1, 3.2 and 3.3 join **Phase 1** as schema changes, because every later phase
  writes against this model and changing it afterwards is expensive.
- Section 2 content completion becomes its own **Phase 3 workstream**, done per
  destination with a named curator and a verification date on every figure, so
  that `curatedBy` and `curatedOn` stop being null.
- 3.4, 3.5 and 3.7 land in **Phase 3** alongside it, since the checklists need
  the fields to exist first.
