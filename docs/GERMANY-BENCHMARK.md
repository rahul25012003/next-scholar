# Germany benchmark: nxtstep-de.com, and the dMAT gap

Date: 2026-09-03

nxtstep-de.com ("NextStep Germany") is a Germany-only consultancy aimed at
Indian students. It is a React SPA with no server rendering, so its content was
read directly from the shipped application bundle rather than sampled by
fetching pages. That makes the inventory below exhaustive rather than partial:
every route, string and formula was read from the code.

---

## 1. The finding that matters most: dMAT

Their strongest section covers a requirement **our site does not mention at
all**, and it lands squarely on our stated audience.

Verified independently of their marketing, not taken on their word:

| Fact | Detail |
|---|---|
| What | Digital Master Test, a standardised academic aptitude test added to the APS India process |
| Rolled out | 29 June 2026 by APS India |
| Mandatory from | **Summer semester 2027 intake** for affected applicants |
| Who is affected | Indian Bachelor's holders applying for a Master's in Germany whose degree is in **Engineering, Commerce, Finance, Economics or Business** |
| Exempt | Bachelor's programme applicants; those without at least 5 semesters (3 year) or 7 semesters (4 year) completed; PhD applicants; fields outside the listed three; official exchange, double degree or partnership programmes; and anyone who completed APS online registration or submitted a complete APS application **before 29 June 2026** |
| Fee | **EUR 150**, separate from the APS fee |
| First cycle | Registration opened 29 June 2026 and **closes 15 September 2026**; test 26 September 2026; certificates 12 October 2026 |
| Content | Logical reasoning, quantitative aptitude, data interpretation, analytical thinking. **Not** subject knowledge |
| Weighting | The German side has stated publicly it is **not a pass-fail barrier**; it is an additional evaluation input |

**Why this is the most urgent Germany item.** Our stated audience is
"Bengaluru engineering and business graduates applying for a Master's". That is
the trigger population, almost exactly. Our Policy Desk carries a Germany note
about APS and says nothing about dMAT. Our destination card offers Germany with
October and April intakes and no mention of it. A student reading our site today
and planning a 2027 intake would not learn that a new mandatory test exists,
that it costs EUR 150, or that the first registration window closes within days
of this being written.

For a site whose entire differentiator is that its published facts can be
checked, an omission this current and this targeted is close in seriousness to
the Baden-Wurttemberg error.

---

## 2. What else they do that we do not

Four things are genuinely Germany-specific and would not appear on a generic
UK, US or Australia agency site.

| # | Capability | Their implementation | Our state |
|---|---|---|---|
| 2.1 | **dMAT guidance** | Dedicated page: who must sit it, four exemption categories, two module structure, 3.5 hour CBT format, fee separate from APS, certificate validity, and that a low score is an input rather than a rejection | **Absent** |
| 2.2 | **APS as a first-class workflow** | Dedicated nav item and page. An 8 document checklist, a 6 step process, a 7 step preparation checklist, and 6 common mistakes including mismatched names across documents and missing transcripts for any semester | One line: "APS certificate issued" |
| 2.3 | **Modified Bavarian Formula grade calculator** | Working, client-side, correctly implemented: `1 + 3 x ((max - obtained) / (max - pass))`, clamped 1.0 to 4.0, with the right German bands (Sehr gut <= 1.5, Gut <= 2.5, Befriedigend <= 3.5, Ausreichend <= 4.0) and an honest disclaimer that the final evaluation rests with the university or uni-assist | **Absent.** We have no grade conversion at all |
| 2.4 | **ECTS credit mapping as a stated method** | A 9 point curriculum audit: total credits, subject-wise credits, core subject requirements, mathematics, programming and technical, engineering fundamentals, business and management, electives, and **missing prerequisites** | **Absent.** German Master's admission is credit-by-credit subject matching against the Bachelor's, and nothing in our model represents it |
| 2.5 | LOM, Letter of Motivation | Offered as SOP / LOM / LOR. LOM is a German-specific artefact distinct from an SOP | We model SOP only |
| 2.6 | Europass CV | European standard CV formatting as a named service | Absent |
| 2.7 | uni-assist versus direct application | Presented as a real choice, since many but not all public universities route through uni-assist | We name uni-assist as a step without the choice |
| 2.8 | Public versus private as equal nav weight | Two dedicated pages | We already split the two routes, and price and disclose them differently. **We are ahead here** |

---

## 3. Where they are weaker than us

Recorded so the comparison is honest in both directions.

| Area | Their state |
|---|---|
| Baden-Wurttemberg tuition | **Also missing.** Zero matches in their entire bundle, against repeated blanket "tuition-free" claims. The same error we are fixing, so it appears to be a sector-wide blind spot rather than a standard we are failing |
| Blocked account | Named eight times, **no amount anywhere**. The word Sperrkonto never appears, no provider named |
| Health insurance | Zero matches. No statutory versus private, no provider |
| German language requirements | **TestDaF, DSH, Goethe, telc, OSD: zero matches.** No CEFR levels, no language course provision |
| Studienkolleg, anabin, NC | Zero matches each |
| Intake dates and deadlines | **None at all.** No winter or summer deadline, no calendar. Deadlines are "communicated" privately |
| Work rights, Anmeldung, Blue Card, PR | Zero matches each |
| Accommodation | Zero matches |
| Named universities | **Zero.** Their public and private university pages name no institution |
| Statistics, testimonials, team, address | **Zero of each.** Three of four social links are `href="#"` placeholders |
| Blog | Three teaser cards that are not clickable and have no article bodies. The date field contains the string "Guidance" |
| Pricing | No figure anywhere. Fees are quoted per student in a private service agreement |
| Commission disclosure | No commission statement. They do disclose a **recruitment partner channel for private universities** without saying money flows, which is more than IDP or LeapScholar do and still well short of ours |
| Technical | SPA with no SSR, so crawlers see an empty title and no content. A real discoverability weakness |

Their Germany depth is real but narrow: it is deep on the three steps between
transcript and offer letter, and close to silent on everything after it.

---

## 4. What to take, and what not to

**Take**: dMAT coverage, the APS workflow depth, the Bavarian grade calculator,
ECTS credit mapping, LOM as distinct from SOP, Europass CV, and the
uni-assist versus direct choice.

**Do not take**: a client-rendered site with no SSR, a blog with no articles,
placeholder social links, an absent address, or pricing that exists only inside
a private agreement. Their candour is admirable and their evidence base is
empty, which is the inverse of the position we are building.

**Note in passing**: their "No False Promises" value and their flat "No" to
"Do you guarantee admission or visa approval?" match our own posture closely.
It is the correct instinct, executed without the verification apparatus to back
it up.
