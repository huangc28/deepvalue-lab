# Requirements: DeepValue Lab — Historical Analysis Reports

**Defined:** 2026-03-21
**Core Value:** A stock detail page should show not only the latest judgment, but how that judgment changed over time and why.

## v1.1 Requirements

### Historical Review UX

- [x] **HIST-01**: User can browse a latest-first historical revision ledger within the stock detail page
- [x] **HIST-02**: User lands on the latest historical revision by default and can inspect a selected revision snapshot
- [x] **HIST-03**: User can compare exactly two historical revisions side by side
- [x] **HIST-04**: The history UI handles no-history, single-revision, and many-revision states explicitly
- [x] **HIST-05**: The revision ledger supports visible focus states, keyboard navigation, and clear selected/latest/compare-selected markers

### Frontend Data Contract

- [x] **FEH-01**: Frontend history surfaces use structured historical summary/detail types with canonical `publishedAtMs`
- [x] **FEH-02**: Frontend labels locale fallback explicitly in single-revision and compare views

### Historical Report API

- [ ] **APIH-01**: Backend persists historical per-report summary data for performant revision list reads
- [ ] **APIH-02**: `GET /v1/stocks/{ticker}/reports` returns summary fields sorted by `publishedAtMs` descending
- [ ] **APIH-03**: `GET /v1/stocks/{ticker}/reports/{reportId}` returns locale-aware structured historical detail for a single revision

### Frontend Integration

- [ ] **INTH-01**: Frontend revision ledger consumes live historical report APIs without regressing the current latest stock detail experience
- [ ] **INTH-02**: Live revision ledger handles mixed-locale compare and explicit fallback labels correctly

## v1.2+ Requirements

### Original Report Access

- **RPT-01**: User can open the original markdown report for a historical revision
- **RPT-02**: User can access original report artifacts without exposing storage-layout internals directly

## Out of Scope

| Feature | Reason |
|---------|--------|
| Raw markdown viewer in this milestone | Deferred until revision ledger behavior is validated |
| Cross-stock historical comparison | Not required for the first historical reports milestone |
| 3+ way compare mode | Adds interaction complexity without first proving the two-way compare workflow |
| Generic locale expansion beyond `zh-TW` | Existing locale scope is sufficient for this milestone |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| HIST-01 | Phase 4 | Complete |
| HIST-02 | Phase 4 | Complete |
| HIST-03 | Phase 4 | Complete |
| HIST-04 | Phase 4 | Complete |
| HIST-05 | Phase 4 | Complete |
| FEH-01 | Phase 5 | Complete |
| FEH-02 | Phase 5 | Complete |
| APIH-01 | Phase 6 | Pending |
| APIH-02 | Phase 6 | Pending |
| APIH-03 | Phase 6 | Pending |
| INTH-01 | Phase 7 | Pending |
| INTH-02 | Phase 7 | Pending |

**Coverage:**
- v1.1 requirements: 12 total
- Mapped to phases: 12
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-21*
*Last updated: 2026-03-21 after milestone v1.1 definition*
