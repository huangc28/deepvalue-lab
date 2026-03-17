# Stock Detail Page UX Enhancement Plan

Date: 2026-03-17
Status: In Progress
Perspective: Value investor reviewing AMD at ~$193

---

## Problem

The AMD detail page contains excellent analytical content that maps well to the research report. However, information architecture and density issues reduce its utility for fast decision-making. A value investor needs to answer three questions quickly:

1. **Is this cheap, fair, or rich?**
2. **What am I betting on and what breaks it?**
3. **Should I act now or wait?**

The current page makes answering these harder than it should be due to misleading labels, buried numbers, verbose sections, and duplicated content.

---

## Enhancements (ranked by decision impact)

### 1. Discount/Premium Label Fix

**Problem:** Hero shows `DISCOUNT TO BASE: +4.9%`. A positive number with the word "discount" implies a buying opportunity, but +4.9% means the stock is *above* base fair value. This is the most dangerous UX issue — a misleading valuation signal at the top of the page.

**Fix:**
- Use dynamic label: `PREMIUM TO BASE` when positive, `DISCOUNT TO BASE` when negative
- Color code: green when price < base (actual discount), amber/red when price > base (premium)
- Add upside/downside asymmetry line: "Bull +51% / Bear -49%"

**Files:** `stock-detail-page.tsx`, `mock-stocks.ts`, `messages.ts`

---

### 2. Scenario Cards: Add Structured Numbers

**Problem:** Bear/Base/Bull cards show prose but bury the actual numbers (revenue, EPS, target P/E) inside text. A value investor scanning scenarios wants a table:

```
           Bear      Base      Bull
Revenue    $40B      $46.5B    $54B
EPS        $4.91     $6.56     $8.59
P/E        20x       28x       34x
Fair Value $98       $184      $292
```

This table doesn't exist. The scenario cards show long text blocks with a single "Fair Value" number.

**Fix:**
- Add structured fields to each scenario: `revenue`, `eps`, `targetPE`
- Display a compact data row at the top of each scenario card
- Or add a summary comparison table above the three cards

**Files:** `scenario-card.tsx`, `mock-stocks.ts`, `stocks.ts` (type), `messages.ts`

---

### 3. News-To-Model: Compact Layout

**Problem:** Each news item takes a full viewport (4 vertically-stacked label-value rows). With 5 items, this section is ~5 screens of scrolling. Unusable for scanning.

**Fix:**
- Convert to compact card layout: headline + one-line impact + scenario tag on a single card
- Show full detail on expand/click
- Target: 5 items visible in ~1 screen

**Files:** `stock-detail-page.tsx`, `messages.ts`

---

### 4. Price Implies Deduplication

**Problem:** Hero card "PRICE IMPLIES" contains the same paragraph as the "Pricing Context" section below. Reader sees identical content twice.

**Fix:**
- Hero card: short 1-sentence summary (e.g., "Market prices in consensus ~34% growth with no re-rating")
- Full paragraph stays in Pricing Context section only
- Add `currentPriceImpliesBrief` field to data model

**Files:** `mock-stocks.ts`, `stocks.ts`, `stock-detail-page.tsx`

---

### 5. Valuation Snapshot Reorder

**Problem:** Current Valuation Snapshot (market cap, EV, multiples) appears after Thesis in the reading order. A value investor needs this context alongside the Scenario Model to gut-check the numbers.

**Fix:**
- Move Current Valuation Snapshot to appear immediately after Scenario Model

**Files:** `stock-detail-page.tsx`

---

### 6. Expectation Bridge Tightening

**Problem:** The 4-step implied facts cards are conceptually strong but verbose. Labels are long, cards are tall.

**Fix:**
- Shorter labels (e.g., "2026 REVENUE GROWTH IMPLIED" → "Revenue Growth")
- Bolder values, inline label:value format to reduce card height

**Files:** `expectation-bridge.tsx`

---

### 7. Valuation Context Dedup

**Problem:** Left card shows Business Type which is already in the hero. Half the section width for one repeated line.

**Fix:**
- Remove standalone Business Classification card
- Make Valuation Lens full-width, or merge snapshot data into the freed space

**Files:** `stock-detail-page.tsx`

---

### 8. Conclusion / Thesis Status Merge

**Problem:** "Provisional Conclusion" and "Thesis Status" overlap significantly. Both discuss thesis health and valuation implications.

**Fix:**
- Merge into single "Conclusion & Thesis Status" section
- Lead with verdict (WATCH), then reasoning, then upgrade/downgrade triggers

**Files:** `stock-detail-page.tsx`, `messages.ts`

---

## Verification

```bash
cd web && pnpm lint && pnpm build
```

- Visual check at `http://localhost:5175/stocks/AMD`
- Cross-check TSM page for consistency
- Test both EN and 繁中 locales
