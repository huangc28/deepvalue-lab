# PRD: DeepValue Stock Analysis Skill — Artifact Restructure

## Status

Draft

## Problem

The current skill produces three artifacts:

1. `{TICKER}-analysis.md` — English markdown report
2. `{TICKER}-analysis-zh-TW.md` — zh-TW markdown report
3. `{TICKER}-stock-detail.json` — single bilingual JSON with `{ en, 'zh-TW' }` objects in every `LocalizedText` field

This design has three problems:

1. **Triple maintenance** — the same prose content exists in EN markdown, zh-TW markdown, and the bilingual JSON. Inconsistency risk is high.
2. **`LocalizedText` complexity** — the frontend must unpack `data.field[locale]` everywhere. The `StockDetail` type uses `string | Record<'en' | 'zh-TW', string>`, and the skill must produce bilingual objects for every user-facing field.
3. **zh-TW markdown is redundant** — once the zh-TW JSON exists with all prose content, a separate zh-TW markdown file serves no additional purpose.

## Solution

Change the artifact output from:

```
{TICKER}-analysis.md          (EN markdown)
{TICKER}-analysis-zh-TW.md    (zh-TW markdown)
{TICKER}-stock-detail.json    (bilingual JSON)
```

To:

```
{TICKER}.analysis.md           (EN markdown — archive source of truth)
{TICKER}.stock-detail.json     (EN JSON — all fields as plain string)
{TICKER}.stock-detail-zh-TW.json  (zh-TW JSON — all fields as plain string)
```

## Changes to Skill Workflow

### Before (current)

1. Write EN markdown report (15 sections)
2. Write zh-TW markdown report (15 sections, translated)
3. Generate bilingual `StockDetail` JSON by extracting from both markdown reports
4. Save 3 files to `research/archive/YYYY/MM/DD/`

### After (new)

1. Write EN markdown report (15 sections)
2. Generate EN `StockDetail` JSON by extracting from EN markdown
3. Generate zh-TW `StockDetail` JSON by translating prose fields from EN JSON (numerical and status fields copied as-is)
4. Save 3 files to `research/archive/YYYY/MM/DD/`

Key change: the zh-TW translation step moves from markdown-to-markdown to JSON-to-JSON. The agent translates the EN JSON's prose fields directly, without producing an intermediate zh-TW markdown.

## Changes to SKILL.md

### Remove

1. **"Bilingual Field Production" section** — no longer needed. Each JSON is monolingual.
2. **"zh-TW Report Output" section** — zh-TW markdown is no longer produced.
3. **All references to `{ en, 'zh-TW' }` bilingual objects** — JSON fields are plain strings.
4. **Step 12 "Produce the zh-TW Report"** — replaced with "Generate zh-TW JSON from EN JSON."
5. **Completion check item** for zh-TW markdown existence.

### Modify

1. **"Structured Data Generation" section** — update to describe two monolingual JSONs instead of one bilingual JSON.
2. **"Save To Research Archive" section** — update file list:
   - `{TICKER}.analysis.md`
   - `{TICKER}.stock-detail.json`
   - `{TICKER}.stock-detail-zh-TW.json`
3. **"Output and Publish" section** — update to note that publish sends 2 JSONs + markdown (detailed publish design is out of scope for this PRD).
4. **`sourcesUsed` field mapping** — simplify from `{ label: { en, 'zh-TW' }, url? }` to `{ label: string, url?: string }` per JSON.
5. **Completion check** — replace "zh-TW markdown was produced" with "zh-TW JSON was produced."
6. **Archive naming** — update filename convention (dot-separated: `TMDX.stock-detail.json` instead of `TMDX-stock-detail.json`).

### Add

1. **zh-TW JSON Production rule** — new short section describing:
   - Source: EN `StockDetail` JSON
   - Translate: all `string` fields that contain prose (thesis, variant perception, scenarios, conclusion, etc.)
   - Copy as-is: all numerical fields, status tokens, dates, URLs, ticker, company name
   - The zh-TW translation rules from the report contract (Section 8.5) still apply: plain-language leads, acronyms explained on first use, light simplification, retain financial jargon, retain all numerical data

## Fields: What Gets Translated vs Copied

### Copied as-is (identical in both JSONs)

- `id`, `ticker`, `companyName`, `lastUpdated`
- `currentPrice`, `baseFairValue`, `bearFairValue`, `bullFairValue`, `discountToBase`
- `valuationStatus`, `newsImpactStatus`, `thesisStatus`, `technicalEntryStatus`, `actionState`, `dashboardBucket`
- `scenario[].label`, `scenario[].keyMetrics.*`
- `sourcesUsed[].url`
- All other number, boolean, or enum fields

### Translated (different in each JSON)

- `businessType`
- `summary`
- `thesisStatement`, `thesisBullets[]`
- `variantPerception`
- `valuationLens.primary`, `.crossCheck`, `.rationale`
- `currentValuationSnapshot.marketCap`, `.enterpriseValue`, `.multiples[]`, `.balanceSheetNote`
- `newsToModel[].event`, `.modelVariableChanged`, `.impact`, `.affectedScenario`
- `scenario[].operatingAssumption`, `.valuationAssumption`, `.fairValue`, `.whatMustBeTrue`
- `currentPriceImplies`, `currentPriceImpliesBrief`
- `currentPriceImpliedFacts[].label`, `.value`
- `provisionalConclusion`
- `technicalCommentary`
- `technicalSignals[].label`, `.value`
- `risks[]`, `catalysts[]`, `monitorNext[]`
- `sourcesUsed[].label`
- `history[]`

## Impact on Other Documents

The following documents reference zh-TW markdown or bilingual JSON behavior and may need corresponding updates after this change is applied:

- `docs/analysis/deepvalue-lab-report-contract.md` — Section 8.5 (zh-TW Report Contract)
- `docs/analysis/deepvalue-lab-agent-execution-sop.md` — Step 12 (Produce the zh-TW Report)

These updates are out of scope for this PRD but should be tracked.

## Impact on Frontend Type

No change to `StockDetail` TypeScript interface required. The `LocalizedText` type (`string | Record<'en' | 'zh-TW', string>`) already accepts plain `string`. Both JSONs will use plain strings, which satisfies the type.

## Out of Scope

- Publish endpoint payload design (2 JSONs + markdown to backend/R2)
- Backend API changes
- Frontend language-switching fetch logic
- Updating the report contract or execution SOP documents
