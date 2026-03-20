# Phase 2: Skill Output - Context

**Gathered:** 2026-03-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Running the analysis skill on any ticker produces a zh-TW markdown report and a bilingual StockDetail JSON, both saved correctly to the research archive. This phase modifies the SKILL.md instructions so that Claude follows the contracts established in Phase 1.

</domain>

<decisions>
## Implementation Decisions

### Translation workflow
- Write the full EN report first, then translate to zh-TW — EN is the source of truth
- zh-TW production is automatic in the same conversation turn — no separate prompt or user confirmation needed
- SOP Step 12 already sequences this correctly (after Step 11 Write Report)

### Bilingual JSON mapping
- Always produce bilingual `LocalizedText` (`{ en, 'zh-TW' }`) for all user-facing StockDetail fields — no more "English-only by default"
- Remove the existing SKILL.md note "Default to English-only unless the user requests bilingual content"
- `ScenarioKeyMetrics` fields (revenue, eps, targetPE) stay as English numeric tokens — language-neutral
- `sourcesUsed` labels get zh-TW translations (e.g., "Q4 2025 Earnings Call" → "2025年第四季財報電話會議"). URLs stay as-is.

### Publish flow
- Send bilingual StockDetail JSON in the publish payload (fields are just strings/objects, backend should accept as-is)
- Send EN markdown report only — backend can't handle two reports yet (zh-TW report stays in archive only)
- Keep the existing "publish?" prompt — don't disable publish flow
- When backend API phase (v2) lands, publish flow will be updated to send both reports

### Report template
- No zh-TW report template needed — the report contract Section 8.5 heading translation table is sufficient
- Claude translates from the finished EN report, following Section 8.5 rules

### Claude's Discretion
- Exact sentence-by-sentence translation approach
- How to handle edge cases (e.g., company names, product names that have established Chinese translations vs. keeping English)
- Paragraph structure adjustments for natural Chinese reading flow

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Skill definition
- `.agents/skills/deepvalue-stock-analysis/SKILL.md` — Full skill definition including zh-TW output requirements (added Phase 1), archive naming, publish flow, completion check
- `.agents/skills/deepvalue-stock-analysis/SKILL.md` §zh-TW Report Output — Mandatory zh-TW report section (line ~242)

### Report contract
- `docs/analysis/deepvalue-lab-report-contract.md` §8.5 — zh-TW translation rules: heading translation table, 6 translation rules, completion rule

### Execution SOP
- `docs/analysis/deepvalue-lab-agent-execution-sop.md` §Step 12 — zh-TW report production step, references report contract for rules

### Type definitions
- `web/src/types/stocks.ts` — `StockDetail`, `LocalizedText`, and all sub-interfaces. Every `LocalizedText` field must become `{ en, 'zh-TW' }`.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `LocalizedText` type at `web/src/types/stocks.ts` — already defined as `string | Record<'en' | 'zh-TW', string>`, no type changes needed
- `StockDetail` interface — all user-facing fields already typed as `LocalizedText`, just need bilingual values populated
- Report contract Section 8.5 heading table — provides exact zh-TW section headings for all 15 sections
- Existing archive structure at `research/archive/YYYY/MM/DD/` — established pattern, zh-TW files go alongside EN files

### Established Patterns
- SKILL.md is the single source of truth for how the analysis skill behaves — all changes go here
- The skill uses a "Required Workflow" numbered step pattern — modifications insert/update steps
- Publish flow uses `POST /v1/stocks/{TICKER}/reports` with `{ report: { markdown, provenance }, stockDetail }` payload
- Completion Check section is the final quality gate — must include zh-TW verification items

### Integration Points
- SKILL.md "Structured Data Generation" section — needs to specify bilingual LocalizedText values instead of English-only
- SKILL.md "Output and Publish" section — needs to specify bilingual JSON + EN-only markdown in payload
- SKILL.md "Notes" section — remove "Default to English-only" line, replace with "Always produce bilingual content"
- SKILL.md "Completion Check" section — already has zh-TW item from Phase 1

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches

</specifics>

<deferred>
## Deferred Ideas

- Backend API changes for accepting/serving both locale reports — v2 (API-01, API-02, API-03)
- Frontend rendering of zh-TW reports and bilingual StockDetail — v2 (FE-01, FE-02)
- zh-TW report template at research/templates/ — decided against (contract Section 8.5 is sufficient)

</deferred>

---

*Phase: 02-skill-output*
*Context gathered: 2026-03-20*
