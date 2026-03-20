# DeepValue Lab — Analysis Localization & Simplification

## What This Is

An enhancement to the DeepValue Lab stock analysis skill that adds Traditional Chinese (繁體中文) report output and bilingual structured data. The analysis skill currently produces English-only markdown reports and StockDetail JSON — this project makes the output accessible to a zh-TW audience with lightly simplified language.

## Core Value

Every stock analysis produces a zh-TW markdown report alongside the English one, and the StockDetail JSON uses bilingual `LocalizedText` fields — so the frontend can serve zh-TW readers without a separate analysis pass.

## Requirements

### Validated

- ✓ SKILL.md specifies zh-TW report as mandatory output with archive naming — Phase 1
- ✓ Report contract defines zh-TW translation rules (plain-language leads, acronyms, jargon) — Phase 1
- ✓ Agent execution SOP includes explicit zh-TW translation step — Phase 1

### Active

- (none — all requirements validated)

### Validated in Phase 2

- ✓ Analysis skill produces a separate zh-TW markdown report alongside the English report — Phase 2
- ✓ zh-TW report uses lightly simplified language (clearer sentences, fewer unexplained acronyms) while keeping the same section structure — Phase 2
- ✓ Unavoidable financial jargon remains in the zh-TW report (jargon education is a separate future feature) — Phase 2
- ✓ StockDetail JSON uses `LocalizedText` (`{ en, 'zh-TW' }`) for all user-facing display fields (summary, thesis, scenarios, etc.) — Phase 2
- ✓ Both EN and zh-TW reports are saved to the research archive — Phase 2
- ✓ Publish endpoint accepts bilingual StockDetail and stores it correctly — Phase 2

### Out of Scope

- Frontend i18n / locale switching — separate phase
- Jargon tooltip or glossary feature — separate future feature
- Replacing the English report — English version is kept as-is
- Changing the analysis methodology or section structure
- Backend API structural changes beyond accepting bilingual data

## Context

- The existing analysis skill is defined in `.claude/skills/deepvalue-stock-analysis/SKILL.md`
- The skill's output contract, SOP, and report template live in `docs/analysis/` and `research/templates/`
- `LocalizedText` type already exists at `web/src/types/stocks.ts` as `string | Record<'en' | 'zh-TW', string>`
- The backend publish endpoint is `POST /v1/stocks/{TICKER}/reports` — it needs to handle bilingual StockDetail
- The research archive path is `research/archive/YYYY/MM/DD/`
- The audience is Traditional Chinese readers, some without finance backgrounds

## Constraints

- **Skill-only scope**: This project modifies the analysis skill output and related docs — no frontend changes
- **Existing structure**: The zh-TW report must follow the same 15-section structure as the English report contract
- **Archive format**: zh-TW reports go to the same archive directory as English ones, with a `-zh-TW` suffix
- **Simplification level**: Light — clearer sentences, brief plain-language leads before technical detail, not a fundamental rewrite

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Separate zh-TW file, not bilingual single file | Keeps each report clean and independently readable | — Pending |
| Bilingual LocalizedText in JSON, not zh-TW only | Frontend can render either locale without re-fetching | — Pending |
| Light simplification, not heavy rewrite | Audience includes some finance-literate readers; jargon education is a planned future feature | — Pending |
| Skill output only, frontend is separate phase | Limits blast radius, frontend i18n is its own concern | — Pending |

---
*Last updated: 2026-03-20 after Phase 2 completion — all milestone phases complete*
