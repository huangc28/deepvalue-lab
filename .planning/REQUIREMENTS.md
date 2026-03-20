# Requirements: DeepValue Lab — Analysis Localization & Simplification

**Defined:** 2026-03-20
**Core Value:** Every stock analysis produces a zh-TW report and bilingual StockDetail JSON so the platform can serve Traditional Chinese readers.

## v1 Requirements

### Skill Output

- [ ] **SKILL-01**: Analysis skill produces a separate zh-TW markdown report following the same 15-section structure as the English report
- [ ] **SKILL-02**: zh-TW report uses lightly simplified language — clearer sentences, acronyms explained on first use, plain-language leads before technical detail
- [ ] **SKILL-03**: Unavoidable financial jargon remains in zh-TW report (jargon education is a separate future feature)
- [ ] **SKILL-04**: StockDetail JSON uses `LocalizedText` (`{ en, 'zh-TW' }`) for all user-facing display fields

### Archive & Persistence

- [ ] **ARCH-01**: zh-TW report saved to research archive as `<TICKER>-analysis-zh-TW.md` alongside the English version
- [ ] **ARCH-02**: StockDetail JSON in archive contains bilingual `LocalizedText` fields

### Documentation

- [ ] **DOC-01**: SKILL.md updated with zh-TW output requirements and archive naming convention
- [ ] **DOC-02**: Report contract updated to specify zh-TW translation rules and simplification guidelines
- [ ] **DOC-03**: Agent execution SOP updated with translation step in the workflow

## v2 Requirements

### Backend API

- **API-01**: Publish endpoint accepts and stores bilingual StockDetail JSON
- **API-02**: Publish endpoint accepts both EN and zh-TW markdown reports
- **API-03**: API serves locale-specific report content to frontend

### Frontend

- **FE-01**: Frontend renders zh-TW reports based on user locale
- **FE-02**: Frontend displays bilingual StockDetail fields in user's locale

## Out of Scope

| Feature | Reason |
|---------|--------|
| Frontend i18n / locale switching | Requires backend API changes first — separate phase |
| Jargon glossary or tooltip | Planned as a separate feature |
| Heavy report simplification | Light simplification chosen; audience includes finance-literate readers |
| Changing analysis methodology | Out of scope — only output format changes |
| Backend API modifications | Needs its own phase with proper API design |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| SKILL-01 | Phase 2 | Pending |
| SKILL-02 | Phase 2 | Pending |
| SKILL-03 | Phase 2 | Pending |
| SKILL-04 | Phase 2 | Pending |
| ARCH-01 | Phase 2 | Pending |
| ARCH-02 | Phase 2 | Pending |
| DOC-01 | Phase 1 | Pending |
| DOC-02 | Phase 1 | Pending |
| DOC-03 | Phase 1 | Pending |

**Coverage:**
- v1 requirements: 9 total
- Mapped to phases: 9
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-20*
*Last updated: 2026-03-20 after roadmap creation*
