---
phase: 07-frontend-api-integration-for-historical-reports
verified: 2026-03-24T12:57:00Z
status: verified
score: 9/9 must-haves verified
human_verification: []
---

# Phase 07: Frontend API Integration For Historical Reports — Verification Report

**Phase Goal:** The stock detail page consumes live historical report APIs for revision list, selected snapshot, and compare mode while preserving the current latest detail experience.
**Verified:** 2026-03-24T12:57:00Z
**Status:** verified

## Goal Achievement

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | The page keeps `useStock(ticker, locale)` as the latest-detail boundary for loading, 404, and top-level error handling | VERIFIED | `stock-detail-page.tsx` still uses `useStock(...)` for page-level loading and error branches before any history rendering |
| 2 | Live history now reads `/v1/stocks/{ticker}/reports` through dedicated client/query helpers instead of mixing live latest detail with mock history | VERIFIED | `fetchStockReports`, `buildStockReportsUrl`, and `useStockReports` added; old `stock.historicalReports ?? mockStock?.historicalReports` path removed |
| 3 | Mock history is used only when the whole page is already in mock fallback | VERIFIED | `const useMockHistory = !liveStock && !!mockStock` and history props branch on that exact boundary |
| 4 | Selected and compare historical details load lazily per report ID and reuse React Query cache keys | VERIFIED | `useStockReportDetail` uses query key `['stock-report-detail', ticker, reportId, locale]` with `enabled: enabled && Boolean(reportId)` |
| 5 | Historical detail payloads are merged onto summary rows so `localeHasFallback`, `latest`, and provenance metadata survive detail fetches | VERIFIED | `mergeHistoricalReportDetail(summary, detail)` spreads `summary` first and overlays detail-only fields |
| 6 | History list, selected-detail, and compare-detail failures degrade inside the History section instead of collapsing the whole stock page | VERIFIED | `HistoricalRevisionLedger` receives `listState`, `selectedDetailState`, and `compareDetailState`; page-level `ErrorState` is still driven only by `useStock(...)` |
| 7 | Live zh-TW fallback labeling remains explicit in the selected revision path | VERIFIED | Browser smoke on `http://127.0.0.1:4173/stocks/TSM` against repo backend on `http://localhost:9100` shows the History card rendering `部分內容以英文顯示` while `/v1/stocks/TSM/reports?locale=zh-TW` returns `localeHasFallback: true` |
| 8 | Live compare mode keeps the base revision visible while the comparison side loads independently | VERIFIED | Browser smoke on `http://127.0.0.1:4173/stocks/DVSMK` shows compare mode rendering the base card immediately and `正在載入比較版本` on the right side before the compare detail resolves |
| 9 | Current repo backend and frontend contracts align for historical list/detail reads | VERIFIED | Current repo backend started on port `9100` returns frontend-aligned `/reports` rows with `reportId`, valuation/thesis/entry statuses, fair values, summary, and `localeHasFallback`; `/reports/{reportId}` returns structured detail payloads consumed by the new merge helper |

## Validation Commands

- `cd /Users/huangchihan/develop/deep-value/web && pnpm lint && pnpm build`
- `cd /Users/huangchihan/develop/deep-value/be && go test ./lib/app/stocks -count=1`
- `curl -sf http://localhost:9100/v1/stocks/TSM/reports`
- `curl -sf http://localhost:9100/v1/stocks/TSM/reports/TSM-20260319-daaf1f8b`
- Browser smoke against `VITE_API_URL=http://localhost:9100 pnpm dev --host 127.0.0.1 --port 4173`

## Runtime Notes

- The pre-existing backend process on `http://localhost:9000` is stale relative to the repository and still serves the old metadata-only `/reports` shape with `r2Key`. Per project rules, the repository was treated as the source of truth.
- Verification was therefore run against the current repo backend started separately on `http://localhost:9100`, which serves the expected Phase 6 summary/detail contracts and proves the Phase 7 frontend wiring against repo-truth.
- No live sample in the current dataset combines both multi-report compare mode and `localeHasFallback: true` on one side. The compare fallback path is still code-verified because both selected and compare cards use the same `locale === 'zh-TW' && report.localeHasFallback` rule.

## Result

Phase 7 satisfies `INTH-01` and `INTH-02`. The stock detail page now reads live historical summaries and details through dedicated query hooks, keeps latest-detail rendering independent, and contains historical failures within the History section. The only operational caveat is environment drift: `web/.env` still points to a stale local backend on port `9000`.
