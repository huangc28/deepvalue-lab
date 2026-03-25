# DeepValue Lab Technical Entry Chart Product / UX Contract

Date:
- 2026-03-25

Status:
- approved for v1 implementation

Scope:
- stock detail page
- `Technical Entry Status` section
- frontend-facing product and UX contract only

## Purpose

Lock the v1 product and UX decisions for the technical entry chart so frontend cleanup and future data-contract work can proceed without reopening scope.

## Resolved Mismatch

Older product notes were inconsistent about whether `Technical Entry Status` should sit before or after `Provisional Conclusion`.

V1 decision:
- keep `Technical Entry Status` after `What The Current Price Implies`
- keep `Technical Entry Status` before `Provisional Conclusion`

Reason:
- valuation and pricing context still come first
- technicals remain an execution layer, not a thesis layer
- the conclusion can then synthesize valuation plus entry timing instead of forcing technicals to read like an appendix

## Section Placement

- The chart only appears inside `Technical Entry Status`.
- The chart must not appear in the hero, valuation panels, or historical revision ledger.
- A compact technical status badge may continue to appear in the hero because it is part of the top-level decision snapshot, but the full chart must stay lower in the page.
- In the detail-page reading order, the technical section sits after:
  - `Scenario Model`
  - `Current Valuation Snapshot`
  - `What The Current Price Implies`
- In the detail-page reading order, the technical section sits before:
  - `Provisional Conclusion`
  - `Valuation Context`
  - `Thesis`

## Hierarchy Rules

- Valuation and pricing context own the page narrative.
- The chart supports entry timing only and must not visually overpower valuation sections above it.
- The section should feel like a research tool, not a trading terminal or broker widget.
- The chart is the primary object inside `Technical Entry Status`, but it remains a secondary object in the full page hierarchy.

## V1 Chart Surface

- Default data cadence: daily
- Default range: `1Y`
- Allowed quick ranges in v1: `1M`, `3M`, `6M`, `1Y`
- Control style: compact segmented buttons only
- Canonical plot type: daily candlestick / OHLC view
- Right-side current price rail: required
- Grid lines: subtle only
- Plot annotations: minimal
- Volume: optional and hidden by default in v1

## V1 Visual Grammar

- Use a dark, compact panel with high text contrast.
- Keep the panel readable on both desktop and mobile without turning the chart into a miniature decoration.
- Do not place a status chip inside the plot area.
- Do not place a paragraph-length timing explanation inside the chart chrome.
- Keep chart chrome limited to market context such as ticker, date context, source tag, and quick metrics.

## V1 Supporting Content

- A compact summary rail is required below the chart.
- The rail keeps exactly three fields in v1:
  - `Entry Status`
  - `Timing Note`
  - `Framework`
- The `Timing Note` belongs in the summary rail, not inside the chart body.
- Technical signals, if shown, stay below the summary rail and remain visually secondary to the chart.

## Indicator Policy

- V1 does not render indicator overlays inside the chart plot.
- V1 may show indicator meaning through the summary rail or signal strip only.
- The chart must not imply that RSI, EMA, or MRC overlays are available if they are not actually rendered.

## V1 Non-Scope

- intraday streaming
- advanced crosshair behavior
- broker-style drawing tools
- compare mode inside the chart
- alerts UI
- user-drawn studies
- indicator overlay parity with TradingView or Pine Script

## Frozen Copy

### English

- section title: `Technical Entry Status`
- section description: `Technicals stay in the execution layer after valuation and thesis work.`
- chart title: `Price Chart`
- source tag: `Mock Price Path`
- quick-range label: `Range`
- summary rail label 1: `Entry Status`
- summary rail label 2: `Timing Note`
- summary rail label 3: `Framework`
- chart metric label 1: `Current`
- chart metric label 2: `Period Move`
- chart metric label 3: `Period High`
- chart metric label 4: `Period Low`
- framework value: `RSI(22) + EMA(12) on RSI + MRC-compatible stretch logic`

### zh-TW

- section title: `技術面進場狀態`
- section description: `技術面只存在於估值與 thesis 之後，作為執行層。`
- chart title: `價格走勢圖`
- source tag: `Mock 價格路徑`
- quick-range label: `區間`
- summary rail label 1: `進場狀態`
- summary rail label 2: `時機說明`
- summary rail label 3: `框架`
- chart metric label 1: `目前價格`
- chart metric label 2: `區間變動`
- chart metric label 3: `區間高點`
- chart metric label 4: `區間低點`
- framework value: `RSI(22) + RSI 上的 EMA(12) + MRC 相容 stretch 判讀`

## Engineering Implications

- Frontend cleanup should remove duplicated timing commentary from chart chrome once the cleanup phase starts.
- The current chart shell can keep mock data during UI iteration, but the visual grammar should already match the OHLC-first contract.
- The frontend data model should move toward daily OHLC-backed payloads without changing these UX decisions.
- Locale behavior should keep enum semantics stable in English and localize only the user-facing labels.

## Definition Of Done For Phase 1

Phase 1 product / UX contract is complete when:
- section placement is fixed
- v1 chart behavior is fixed
- v1 non-scope is fixed
- indicator-overlay policy is fixed
- EN and zh-TW labels are fixed
- later engineering work can proceed without reopening chart hierarchy questions
