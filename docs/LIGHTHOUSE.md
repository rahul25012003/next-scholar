# Lighthouse baseline, September 2026

Item 1.14 from `REMAINING.md`: no LCP, INP or CLS figure existed for any route
before this. Run against a local production build (`npm run build && npm
start`), mobile emulation, Chrome's default throttling, using `npx lighthouse`
against `localhost:3000`.

## What this run found and fixed

Three real, code-level bugs, all now fixed and verified on a clean re-run:

1. **`--color-muted` failed contrast.** `#77808f` on `bg-paper` (white) measured
   3.99:1, and on `bg-surface` measured 3.75:1 — both below the 4.5:1 WCAG AA
   floor for normal text. This token is used for captions, sources and
   timestamps across most of the site, so it was the single highest-leverage
   fix available: one token change instead of patching each instance.
   Replaced with `#6a7280` (4.85:1 on paper, 4.55:1 on surface). The two
   hardcoded copies of the old hex in `revenue-chart.tsx`'s SVG label fills
   (SVG `fill` does not read CSS custom properties) were updated to match.
2. **Two footer text tones were too faint even for the new token to cover**,
   because they used raw `text-white/NN` opacity rather than the token:
   `text-white/45` and `text-white/35` on the incorporation-details row
   (`footer.tsx`), and `text-white/40` on the bottom copyright bar. All three
   moved to `/55` or `/60`, matching opacity levels already proven to pass
   elsewhere in the same footer.
3. **One hero card's background is a bespoke, one-off color** (`bg-[#e8effe]`,
   not a design token), and `text-muted` only reaches 4.2:1 against it even
   after the token fix. Moved that one paragraph to `text-body` (5.19:1)
   rather than darkening the shared token further for one card.
4. **`<dl>` structural violation.** The homepage's destination comparison cards
   (`components/marketing/destinations.tsx`) nested a `<div>` containing
   `<dt>`/`<dd>` two levels inside the `<dl>`, with a `<p>` note as a third,
   non-`dt`/`dd` sibling — invalid under the HTML5 `<dl>` content model, which
   requires either bare `dt`/`dd` children or `<div>` children containing
   *only* `dt` then `dd`. Fixed by demoting the outer list to a plain `<div>`
   and giving each row its own small `<dl>` around just the `dt`/`dd` pair,
   with the note staying a sibling of that `<dl>`, not inside it. Same fix
   applied to the inline "We earn" row in the same component.

Home page accessibility: **89 → 100**, verified on a clean re-run after the
fixes, with no accessibility audit failures remaining.

## The baseline

| Route | Perf | A11y | Best Practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| `/` (final, clean run) | 78 | 100 | 100 | 100 | 4.2 s | 0 | 240 ms |
| `/destinations/germany` | 63 | 97 | 100 | 92 | 4.6 s | 0 | — |
| `/universities` | 58 | 96 | 100 | 92 | 3.9 s | 0 | — |
| `/universities/kit-karlsruhe` | 58 | 96 | 100 (rechecked) | 85 | 4.3 s | 0 | — |
| `/tools/german-grade-calculator` | 50 | 96 | 100 | 92 | 3.7 s | 0 | — |
| `/services` | 84 | 96 | 100 | 92 | 3.7 s | 0 | — |
| `/login?next=/console/case-1` | 95 | 98 | 100 | 100 | 2.8 s | 0 | 110 ms |

**A note on the TBT and Performance columns for everything but the two clean
runs.** `npx lighthouse`'s Chrome cleanup failed repeatedly mid-session
(`ENOENT` on its own temp profile during teardown, a known chrome-launcher
issue on Windows), leaving up to a dozen zombie `chrome.exe` processes running
concurrently by the time later routes in the batch were measured. `npm test`
on this same machine went from its normal ~2.5s to 118s at the peak of that
pile-up. The two routes measured before and after clearing those processes
(`/`, run alone both times) returned Performance 77 and 78 with TBT of 410 ms
and 240 ms; the batch run of the same exact build returned Performance 43 and
TBT of 5,870 ms for the identical page. The Accessibility, Best Practices and
SEO columns are static structural audits, not wall-clock timing, so they are
unaffected by this and are trustworthy as printed (one exception rechecked
and corrected above: `university-profile` best practices read 0 mid-pileup,
100 on a clean rerun). **Treat every Perf/LCP/TBT figure in this table except
the `/` and `/login` rows as a floor, not a ceiling** — rerun them individually,
with `taskkill //F //IM chrome.exe //T` between each, for a trustworthy number.

## The image strategy this baseline also fixed (1.15)

The hero portrait was carrying `preload`, which is not a real `next/image`
prop — it does nothing, silently, so the single most likely LCP element on
the busiest page was never actually prioritized. Fixed to `priority`, given
a `sizes` attribute matching its actual rendered width, and self-hosted
(`src/content/photos-assets/hero-portrait.jpg`, fetched once at the exact
crop the code already requested from Unsplash) so it now also gets an
automatic blur placeholder and does not wait on a third-party CDN. The
homepage's destination cards (`components/marketing/destinations.tsx`) were
also missing `sizes` and now have it; they stay on Unsplash's CDN rather than
being vendored, since they are not the LCP candidate and self-hosting all
four would be four more binary files for a much smaller return. The other
seven named photos in `content/photos.ts` (`portraitOnBlue`, `smilingStudent`,
etc.) are not rendered anywhere yet — a curated bank for the D.09 work once
real photography exists — so nothing was spent optimizing images nobody
serves.

## What is left to decide, not yet done

- **LCP sits at 3.7–4.6 s across every content page**, comfortably clear of
  "poor" (4 s) on some routes. `largest-contentful-paint-element` did not
  resolve cleanly in this run's traces to name the element; the next session
  should capture that explicitly (`lighthouse ... --output=html` renders the
  filmstrip) before guessing at a fix.
- **`unused-javascript` flags roughly 64–85 KiB per route** — real and stable
  (a static bytes count, not timing-sensitive), consistent enough to act on.
- **`mainthread-work-breakdown` and `bootup-time`** were also measured but are
  timing-based and inherited the same noise described above; re-measure
  cleanly before treating either as a target.
- No route was measured at 390 px viewport width or on throttled mobile
  hardware beyond Lighthouse's own default CPU/network throttling profile.
