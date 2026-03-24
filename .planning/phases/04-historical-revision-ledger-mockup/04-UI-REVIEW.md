# Phase 04 — UI Review

**Audited:** 2026-03-24
**Baseline:** 04-CONTEXT.md (locked decisions) + abstract 6-pillar standards
**Screenshots:** Captured — dev server at localhost:4173
**Screenshot directory:** `.planning/ui-reviews/04-20260324-172246/`

---

## Pillar Scores

| Pillar | Score | Key Finding |
|--------|-------|-------------|
| 1. Copywriting | 3/4 | All strings localized and purposeful; one empty-state title reads as a developer note rather than a user-facing message |
| 2. Visuals | 3/4 | Strong two-column layout and clear state markers; trend rail x-axis date labels hardcoded to 4 columns, breaking on non-4 revision counts |
| 3. Color | 4/4 | Disciplined token usage throughout; two inline rgba values in the Chip component are acceptable and intentional semi-transparent tints |
| 4. Typography | 3/4 | Consistent mono type system with clear size hierarchy; four distinct body text sizes in the component are within budget but on the edge |
| 5. Spacing | 3/4 | Scale is coherent and grid-based; one arbitrary `min-w-[38rem]` and `h-[12rem]` pair in the trend rail are intentional but not token-backed |
| 6. Experience Design | 2/4 | All three revision states render correctly; compare mode is entirely absent despite 12 compare-related i18n keys being defined and mandated by the plan |

**Overall: 18/24**

---

## Top 3 Priority Fixes

1. **Compare mode is not implemented** — Users cannot review two revisions side by side, which is the primary interaction differentiator for this ledger. The plan mandates exactly-two-revision compare with base preservation on exit. The i18n keys already exist (`historyCompareMode`, `historyAddComparison`, `historyExitCompare`, `historyClearComparison`, `historyCompareTarget`, `historyBaseSelection`). A second `useState` for `compareId` and a `CompareRevisionCard` alongside `SelectedRevisionCard` would complete this.

2. **Trend date grid is hardcoded to 4 columns** — Line 352 in `historical-revision-ledger.tsx` renders `grid-cols-4` unconditionally. For TSM's 4 revisions this is fine, but it will silently misalign any stock with 3, 5, or 6 revisions. Change to `grid-cols-[repeat(var(--rev-count),minmax(0,1fr))]` with a CSS variable set from `chronological.length`, or use a dynamic Tailwind pattern: pass `style={{ gridTemplateColumns: `repeat(${chronological.length}, minmax(0, 1fr))` }}`.

3. **Empty-state title reads as a developer placeholder** — `historyEmptyTitle` in `messages.ts` (line 221) currently renders "Historical reports have not been mocked for this name yet." This is an implementation note, not a user-facing state. For a research cockpit it should say something like "No revision history available for this name." The `historyEmptyDescription` body correctly frames it as pre-API mock behavior, but the title creates a jarring register shift visible in the SOFI screenshot.

---

## Detailed Findings

### Pillar 1: Copywriting (3/4)

**Strengths:**
- All UI chrome strings go through `m.detail.*` — no hardcoded English strings in the component itself.
- Both EN and zh-TW strings are present for all new keys in `messages.ts` (lines 180–497).
- Revision list row copy (summary, changeSummary, currentPriceImplies) is substantive and analytical, not generic. Mock data quality is high.
- Label-value pairs in the SnapshotRow use established field names consistent with the rest of the page (currentPrice, historyPriceImpliesBrief, historyChangeSincePrevious).
- Empty state has a visible overarching label "NO STRUCTURED HISTORY" in terminal-label style plus description — the pattern is correct.

**Issues:**
- `historyEmptyTitle` (messages.ts line 221, zh-TW line 481): "Historical reports have not been mocked for this name yet." / "這個標的還沒有 historical reports mockup。" — These are implementation-phase notes, not settled user-facing copy. The word "mocked" breaks the research cockpit register. Recommend replacing with a neutral absence statement before this UI ships outside review context.
- ADBE mock data (mock-stocks.ts lines 185–197) uses plain English strings for `summary`, `currentPriceImpliesBrief`, `currentPriceImplies`, `monitorNext[]`, and `changeSummary` instead of `LocalizedText` objects. TypeScript accepts this because `LocalizedText = string | { en: string; 'zh-TW': string }` and `resolveLocalizedText` handles it, but it means switching to zh-TW locale on ADBE will render raw English. This is acceptable for a mockup but worth flagging for later seeding.

---

### Pillar 2: Visuals (3/4)

**Strengths:**
- Two-column layout (`xl:grid-cols-[minmax(18rem,0.86fr)_minmax(0,1.14fr)]`) gives the list clear visual weight against the snapshot panel. The asymmetric ratio (0.86/1.14) creates an intentional reading flow: scan list left, drill detail right.
- Selected state uses a copper border ring (`border-[var(--accent-copper)]`) plus a subtle box-shadow glow. Unselected rows use `--line-subtle`. The contrast is readable in screenshots.
- "LATEST" and "SELECTED" chip badges on revision rows are immediately scannable. The "latest" chip in accent tone clearly distinguishes the most recent revision without requiring a separate indicator element.
- `SelectedRevisionCard` nests the status badges, price metric, change summary, and the "What the Current Price Implies" + "What to Monitor Next" sub-cards. Information density is high but structured; the two-column nested grid at the bottom (`lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)]`) adds useful internal rhythm.
- Empty state uses a dashed border on a dark muted surface — standard cockpit empty signal, visually distinct from populated panels.
- Mobile layout collapses to single column. The revision list rows show date, provenance chip, summary, and price clearly at 375px.

**Issues:**
- Trend rail x-axis: The date labels grid is hardcoded `grid-cols-4` (line 352). For a 4-revision stock this aligns correctly, but the mismatch will be apparent visually the moment a different revision count is used. This is a structural fragility visible only with non-4 data.
- The trend SVG has no x-axis tick marks or gridlines. The two polylines (copper for current price, green for base fair value) are legible but the chart is purely relative — there are no y-axis value indicators on the SVG canvas itself. The labels below provide absolute values but they are spatially separated from the chart. For a supporting context rail this is acceptable, but adding even minimal y-axis min/max labels on the SVG would significantly improve the data-to-ink ratio without adding visual weight.
- The revision list left panel header area has a non-obvious layout: the description text (leading-7 body text) sits beside an AccentBadge count chip. On screens narrower than ~900px the chip can wrap below the text block unexpectedly. This is minor but worth a `flex-wrap` or `items-start` guard.
- Compare mode: the plan specifies visible compare affordances per revision row. Currently none are rendered. Users have no path to side-by-side review. This is a missing interaction surface, not a visual polish item.

---

### Pillar 3: Color (4/4)

**Token discipline is excellent across the component:**
- 39 CSS variable token usages (`text-[var(--...)]`, `border-[var(--...)]`, `bg-[var(--...)]`) vs. 0 raw hex or rgb values in class names.
- The single inline style is `LegendDot` at line 459: `style={{ backgroundColor: color }}` where `color` is passed as a CSS variable reference string (`'var(--accent-copper)'`, `'var(--signal-positive-soft)'`). This is correct — the values are still token-bound, not hardcoded hex.
- The two `rgba(...)` values in `Chip` (lines 444, 446) define the semi-transparent backgrounds for the "accent" and "positive" tones. These use the same numerical values already implied by the CSS custom properties (`88,166,255` = `--accent-copper` base, `46,160,67` = `--signal-positive`). They cannot be replaced by CSS variables without adding intermediate alpha tokens to `index.css`. The choice to use literal rgba here is intentional and appropriate for this alpha-tinted chip pattern.
- The copper/green color split in the trend rail correctly maps to the existing signal system: copper for current price (decision-relevant), green-soft for base fair value (positive thesis signal). This respects the established 60/30/10 role of accent colors.
- No new colors were introduced outside the existing `index.css` token set.

---

### Pillar 4: Typography (3/4)

**Size distribution in the component:**
- `text-[0.62rem]` — chip label, MiniMetric label (sub-label)
- `text-[0.64rem]` — trend date axis labels
- `text-[0.66rem]` — revision date span
- `text-[0.68rem]` — section chrome labels (most common pattern)
- `text-sm` — standard body, snapshot row values, list item text
- `text-base` — selected snapshot summary (slightly elevated body)
- `text-xl` — current price value in revision list row
- `text-2xl` — empty state heading

Eight distinct type sizes in a single component is above the recommended maximum of four in a focused UI module. However, the distribution is intentional:
- Three micro sizes (0.62/0.64/0.66) serve different label contexts (chip, axis, date) with meaningful differentiation.
- 0.68rem is the established app-wide "terminal label" convention used across all panels.
- The text-sm/base split between list body and snapshot body provides a subtle hierarchy that matches the reading-depth difference.

**Issues:**
- `text-[0.64rem]` (trend date axis) and `text-[0.66rem]` (revision date span) are 0.02rem apart — essentially imperceptible to users and visually indistinguishable. Collapsing both to `text-[0.66rem]` or the established `text-[0.68rem]` would simplify without visual loss.
- Only one font weight: `font-semibold` (on current price numerics and MiniMetric values). All other text uses the default mono weight. This is intentional for the cockpit aesthetic but means the snapshot panel's primary value (base fair value) has the same visual weight as supporting text. Adding `font-medium` to at least the scenario fair values in the selected snapshot would improve scannability.

---

### Pillar 5: Spacing (3/4)

**Standard values in use:** `p-5`, `px-4 py-4`, `px-5 py-5`, `px-5 py-6`, `gap-2`, `gap-3`, `gap-4`, `gap-5`, `gap-6`, `space-y-3`, `space-y-4`, `space-y-5`, `space-y-6`, `mt-2`, `mt-3`, `mt-4`, `mt-5`, `mt-6`. All from the standard Tailwind 4-unit scale.

**Arbitrary values:**
- `min-w-[38rem]` (line 308) — enforces the minimum width of the trend SVG wrapper so the chart does not compress below a readable width. This is a deliberate layout constraint for the overflow-x-auto scroll container; it cannot be expressed with a standard Tailwind size token.
- `h-[12rem]` (line 311) — sets the SVG canvas height. The choice of 192px is appropriate for the amount of data shown but is not backed by a design token.
- `rounded-[1.25rem]`, `rounded-[1.2rem]`, `rounded-[1.1rem]`, `rounded-[1rem]` — four distinct border radius values used for nesting depth levels. This is a thoughtful pattern (outer containers more rounded, inner sub-cards less rounded), but the four incremental values are not defined as design tokens and are fragile to maintain.
- `tracking-[0.18em]`, `tracking-[0.16em]`, `tracking-[0.14em]` — three letter-spacing values exist. The app consistently uses 0.18em for section chrome labels, which is correct. The 0.14em/0.16em variants appear in chips and legend dots. These are not systematized.

**Assessment:** Arbitrary spacing values are used with clear intent and are not random. None cause visual inconsistency. The main risk is that the four rounded radius values will diverge as the component is edited.

---

### Pillar 6: Experience Design (2/4)

**What works:**
- All three revision states render correctly: empty (SOFI), single revision (ADBE), many revisions (TSM).
- Latest revision auto-selects on load (`resolvedSelectedId` falls back to `sortedReports[0].reportId` when `selectedId` is null).
- Selecting a revision is keyboard-accessible: revision rows are `<button>` elements with `focus-visible:ring-2 focus-visible:ring-[var(--accent-copper)]`. Focus rings are visible and use the design system color.
- `role="list"` and `aria-label` on the revision list container is correct.
- `aria-label` on the SVG trend chart is present.
- The `SnapshotRow` component uses `<dl>`, `<dt>`, and `<dd>` semantic elements — correct for a key-value display.
- Single revision state conditionally changes the right-panel header label (line 148–156) and description to communicate reduced state cleanly.
- `isOldestRevision` correctly switches the "Change Since Previous" label to "Initial Revision" on the oldest entry (line 226–231).
- Legacy fallback (`LegacyHistory`) is preserved for stocks with no structured mock data.

**Missing: compare mode**
The plan (04-01-PLAN.md) mandates compare mode as a must-have. The i18n system has 12 compare-related keys across both locales. The component has zero implementation. Specifically missing:
- Second `useState` for `compareId`
- "Add compare" button affordance on each revision row (inactive on single-revision state as specified)
- `CompareRevisionCard` rendered alongside `SelectedRevisionCard` when compare is active
- Exit compare / clear one side behavior that preserves the base selected revision

The compare mode keys in messages.ts that are currently unreachable: `historyCompareTarget`, `historyBaseSelection`, `historyCompareHelper`, `historyClearComparison`, `historyAddComparison`, `historyCompareMode`, `historyCompareDescription`, `historyExitCompare`, `historyBaseRevision`, `historyComparisonRevision`.

**Minor gaps:**
- The trend SVG data points (circles) have no `title` element or `aria-label` per data point. Screen reader users receive only the outer `aria-label` on the SVG, not per-revision values. For a supporting context rail this is acceptable at mockup stage but should be addressed before accessibility review.
- The `monitorNext` list in `SelectedRevisionCard` slices to 3 items (line 249: `.slice(0, 3)`). There is no indication to the user that items beyond 3 exist. A count chip or expansion affordance would be appropriate.

---

## Files Audited

- `web/src/components/detail/historical-revision-ledger.tsx` — primary component (521 lines)
- `web/src/types/stocks.ts` — `HistoricalReport` and `StockDetail` type shapes
- `web/src/data/mock-stocks.ts` — TSM (4 revisions), ADBE (1 revision), SOFI (0 revisions) mock data
- `web/src/pages/stock-detail-page.tsx` — integration point and `historicalReports` resolution logic
- `web/src/i18n/messages.ts` — EN and zh-TW string coverage for all new keys
- `web/src/i18n/utils.ts` — `LocalizedText` resolution and plain-string fallback
- `web/src/index.css` — design token definitions
- Screenshots: `.planning/ui-reviews/04-20260324-172246/` (9 screenshots across desktop/mobile/tablet, TSM/ADBE/SOFI, normal and older-selected states)
