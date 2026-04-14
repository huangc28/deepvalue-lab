# Phase 3 cleanup + doc alignment execution plan

Date: 2026-04-12
Status: Completed on 2026-04-14
Owner: Codex
Related: .omx/plans/2026-04-11-tradingview-mrc-feature-plan.md

## Goal
Finish the remaining actionable items in Phase 3 without overstating release readiness.

## Outcome
- Repo docs and vault context were aligned to the implemented TradingView-aligned MRC reality.
- Option B remained explicitly deferred.
- Release readiness was re-framed on 2026-04-14 as implementation-complete with accepted parity deferral, because fixture-grade exports are unavailable.
- Remaining fixture-grade parity work is now a future enhancement, not part of this cleanup plan.

## Constraints
- Do not mark release gates satisfied while Phase 0 fixture/parity items remain open.
- Preserve intentional legacy fallback behavior unless code inspection proves a path is redundant.
- Keep diffs small and reversible.
- Run frontend and backend verification after changes.

## Planned steps

### 1) Align stale docs to current implementation truth
Update repo docs and vault notes that still describe approximate MRC / low-emphasis 1D overlay / HLC3-data-only language as the intended final state.

Target files:
- docs/product/deepvalue-lab-stock-detail-technical-entry-chart-ux-contract.md
- docs/product/deepvalue-lab-stock-detail-technical-entry-price-chart-prd.md
- ~/Documents/markdowns/projects/value-deck/context.md
- ~/Documents/markdowns/projects/value-deck/decisions/technical-price-chart.md

Expected result:
- Docs describe TradingView-aligned MRC as the target state
- Any approximate/SMA±2σ language is clearly historical or superseded
- Legacy rendering is described as temporary/degraded migration behavior

### 2) Record the Option B decision explicitly
Document that bulk backfill is **not required yet** and that Option A (dual-read, single-write) remains the chosen strategy unless specific trigger conditions are met.

Target files:
- .omx/plans/2026-04-11-tradingview-mrc-feature-plan.md
- ~/Documents/markdowns/projects/value-deck/decisions/tradingview-mrc-replacement-prd.md (if needed for consistency)

Expected result:
- Phase 3 checklist item for Option B can be checked with rationale
- Trigger conditions for revisiting Option B remain documented

### 3) Reduce legacy bridge code only where clearly safe
Inspect FE normalization and BE payload compatibility paths, then make the smallest safe reduction in legacy bridging if any path is provably redundant.

Inspection targets:
- web/src/pages/stock-detail-page.tsx
- be/lib/app/stocks/technical_price_chart_payload.go
- be/lib/app/stocks/technical_snapshot_worker.go

Decision rule:
- If a legacy branch still serves real legacy payload compatibility, keep it and document why.
- If a branch is redundant with the canonical v2 path, remove or simplify it.

Expected result:
- Either a small safe code reduction, or an explicit documented reason that further removal is deferred until post-parity / post-migration

### 4) Update Phase 3 checklist accurately
Only check items that are truly done after the above work.
Do not check "Ensure release gates are all satisfied" unless Phase 0 blockers are actually cleared.

### 5) Verify
Run:
- cd web && pnpm tsc --noEmit && pnpm lint && pnpm build
- cd be && go test ./...

## Expected outcome
After this pass, Phase 3 should be reduced to only the items that are genuinely blocked by Phase 0 or by deliberate migration policy.
