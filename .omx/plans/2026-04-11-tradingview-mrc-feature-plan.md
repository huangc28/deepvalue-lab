# TradingView-aligned MRC technical chart plan

Date: 2026-04-11
Status: Draft v2 for discussion (review-revised)
Owner: Codex planning pass

## Requirements summary

Replace the repo's current approximate MRC implementation with a TradingView-aligned MRC model and upgrade the stock detail technical chart so MRC becomes a first-class visual system rather than a low-emphasis daily-only overlay.

The current system computes HLC3 and an approximate MRC in the backend (`be/lib/pkg/indicators/indicators.go:124-169`, `be/lib/app/stocks/technical_snapshot_worker.go:203-206`) and threads those values into a legacy daily overlay path (`be/lib/app/stocks/technical_price_chart_payload.go:75-87`, `web/src/pages/stock-detail-page.tsx:265-320`). The frontend chart can render only one center/upper/lower channel and currently treats MRC as optional low-emphasis decoration (`web/src/components/detail/technical-price-chart.tsx:55-63`, `122-151`). Existing product docs also explicitly defer direct HLC3 visualization and non-1D MRC parity (`docs/product/deepvalue-lab-stock-detail-technical-entry-chart-ux-contract.md:101-103`; vault context `context.md:25-26`).

This feature intentionally supersedes that v1 contract.

## Goals

1. Adopt TradingView MRC as the canonical indicator model for value-deck.
2. Redesign the technical snapshot contract so MRC data is explicit, timeframe-aware, and not dependent on legacy `points[]` backfill.
3. Upgrade visualization so users can read channel state, stretch, and mean-reversion zones at a glance.
4. Preserve RSI/EMA panes but make MRC the primary price-pane indicator language.
5. Establish parity verification against TradingView outputs before rollout.

## Non-goals

1. Reproducing TradingView's full indicator settings UI inside the app.
2. Implementing every TradingView interaction pattern on day one.
3. Keeping backward compatibility with the old approximate MRC forever.
4. Letting the frontend compute MRC from raw candles; backend remains source of truth.

## Planning assumptions

1. TradingView MRC will fully replace the current SMA ± 2σ approximation.
2. We will treat a specific TradingView script / parameter set as canonical and freeze it in docs/tests.
3. Visualization can ship before final algorithm replacement only if the new payload shape is already designed for the final TradingView model.
4. Daily and weekly are the minimum required timeframes for MRC parity; intraday support can follow the same contract once validated.

## Canonical MRC spec (execution gate)

This plan now treats canonical-spec freeze as a hard prerequisite, not a nice-to-have. Implementation may begin on UI shelling and type scaffolding, but the feature is not shippable until this section is fully populated and checked in.

### Canonical source of truth
- **Canonical TradingView source**: must be recorded as an exact TradingView script URL plus script title as seen in the user's workspace.
- **Version capture**: save the capture date and either a script version/hash or a screenshot/export showing the parameter dialog used for parity.
- **Why this matters**: public MRC/MRI variants differ. At least one public code excerpt with the same parameter family shows `length = 100`, while the user's live setup uses `200`; we should not assume a public script is already the exact target.

### Current best public candidate (2026-04-11)
- **Candidate script title**: `Mean Reversion Channel - (fareid's MRI Variant)`
- **Candidate script ID**: `5uaoczeP`
- **Candidate URL**: `https://www.tradingview.com/script/5uaoczeP-Mean-Reversion-Channel-fareid-s-MRI-Variant/`
- **Candidate author line**: `fareidzulkifli` as the strongest algorithm-source candidate; `Kwiskr` remains a plausible MTF/UI-layer variant author for the `On Hover / Auto / D / W` display behavior.
- **Confidence**: high for family identification, medium for exact workspace match.
- **Status**: candidate identified, still pending user confirmation or fixture-grade evidence.

How this candidate was identified:
- Gemini-backed 2-worker team search converged on the same script family and script ID from multiple independent searches.
- The parameter tuple `hlc3 / SuperSmoother / 200 / 1 / 2.415` and the MTF display tuple `On Hover / Auto / D / W` are the strongest public fingerprint match found so far.
- Research artifact now exists in repo: `testdata/technical/mrc/mrc-source-discovery.md`.

### Parameter table to freeze
The following values must be written into the plan artifact before backend parity work is considered complete:
- source = `hlc3`
- smoother = `SuperSmoother`
- length = `200`
- inner multiplier = `1`
- outer multiplier = `2.415`
- zone transparency = `60`
- MTF display mode = `On Hover`
- MTF mode = `Auto`
- higher timeframe anchors = `D`, `W`

### Provisional algorithm hypothesis
Until an exact script/export is captured, implementation may proceed against this **provisional algorithm hypothesis**:
- `source = hlc3 = (high + low + close) / 3`
- `meanline = SuperSmoother(source, 200)`
- `meanrange = SuperSmoother(TrueRange, 200)`
- `innerUpper = meanline + meanrange * 1`
- `innerLower = meanline - meanrange * 1`
- `outerUpper = meanline + meanrange * 2.415`
- `outerLower = meanline - meanrange * 2.415`
- zone classification is derived from price location versus meanline / inner / outer bands

This hypothesis is strong enough for:
- payload design
- rendering design
- backend scaffolding
- provisional fixture format design

This hypothesis is **not sufficient** to close final numerical parity without at least one fixture-grade artifact from the user's actual TradingView setup.

### Algorithm implementation notes to freeze early
- **SuperSmoother source** — treat `SuperSmoother` as a John Ehlers-style 2-pole filter implementation, not a generic moving average. Phase 1 should explicitly document the implementation source used for parity work (for example Ehlers reference material or the exact Pine behavior inferred from fixtures).
- **TrueRange first-bar fallback** — for the very first bar where no prior close exists, use the standard fallback `high - low` when deriving `TrueRange`.
- **Weekly bar construction decision** — weekly parity will use the app's existing server-side weekly aggregation path from daily bars, aligned to completed trading weeks / Friday-close semantics, rather than introducing a second weekly-bar source just for this feature.

### Fixture acquisition method
1. Pick one representative ticker with liquid data and stable history.
2. Export or manually capture TradingView values for one daily window and one weekly window over the same completed market dates.
3. Record, at minimum, the latest 30 fully-warmed points for:
   - centerline
   - inner upper / inner lower
   - outer upper / outer lower
4. Save fixtures under repo `testdata/technical/mrc/` with a README describing how they were captured.

### Parity tolerance
Unless the captured TradingView export suggests a tighter constraint is safe, use these initial tolerances:
- centerline absolute error <= `0.02`
- inner band absolute error <= `0.03`
- outer band absolute error <= `0.03`
- no directionally inverted classification for any validated point

### Phase 0 exit criteria
Phase 0 is complete only when all of the following are true:
- exact script URL/title and capture date are documented
- parameter table is frozen
- daily and weekly fixtures are committed
- tolerance thresholds are written down
- at least one manual visual comparison confirms the fixture really matches the user's live TradingView setup

## Acceptance criteria

### Product / UX
- The price chart renders five distinct MRC series when data is present: `center`, `innerUpper`, `innerLower`, `outerUpper`, `outerLower`.
- Hover on the latest plotted point shows at least: close, centerline, inner band pair, outer band pair, and zone classification.
- The chart exposes a `zone classification` enum for the active point: `inside_mean`, `inner_upper_zone`, `inner_lower_zone`, `outer_upper_zone`, `outer_lower_zone`, `outside_upper`, `outside_lower`.
- Switching between `1D` and `1W` preserves the same MRC grammar (same set of lines, same zone logic, same hover fields) when both payloads exist.
- Visual QA produces side-by-side comparison artifacts for at least one daily and one weekly chart against TradingView.

### Data contract
- Technical snapshot payload carries canonical MRC data directly inside the timeframe-aware contract and no longer depends on `payload.points` reattachment in `web/src/pages/stock-detail-page.tsx:265-320`.
- Each timeframe with MRC support exposes the same point-level fields for `center`, `innerUpper`, `innerLower`, `outerUpper`, `outerLower`, plus timeframe-level metadata describing algorithm source and parameters.
- Warmup values are omitted or `undefined` consistently until the backend has enough bars to produce valid output.
- Contract versioning is explicit so FE can distinguish new MRC snapshots from legacy approximate ones.

### Algorithm
- Backend computes TradingView-aligned MRC from frozen canonical inputs and produces center/inner/outer bands for each supported timeframe.
- Daily and weekly outputs pass fixture comparison within the documented tolerances.
- Rounding policy is documented; parity tests run on pre-display values, not only rounded payload values.

### Verification
- Backend unit tests cover source preprocessing, warmup semantics, serialization, and fixture parity.
- Frontend tests cover dual-read normalization plus rendering of all five MRC series and zone classifications.
- Manual QA artifacts are attached or saved for one daily and one weekly parity comparison.

## Payload draft (execution-ready contract proposal)

This section upgrades the earlier conceptual payload into an implementation-ready draft. The intent is to make the FE consume one canonical shape while the backend remains the only place that computes MRC.

### Proposed backend / wire shape

```ts
interface TechnicalMrcMetadata {
  algorithmVersion: 'tradingview-mrc-v1'
  source: 'hlc3'
  smoother: 'SuperSmoother'
  length: 200
  innerMultiplier: 1
  outerMultiplier: 2.415
}

interface TechnicalMrcPoint {
  center?: number
  innerUpper?: number
  innerLower?: number
  outerUpper?: number
  outerLower?: number
}

interface TechnicalPricePoint {
  timestampUtc: string
  exchangeTimestamp: string
  open: number
  high: number
  low: number
  close: number
  volume?: number
  rsi?: number
  emaOnRsi?: number
  mrc?: TechnicalMrcPoint
}

interface TechnicalChartSeries {
  timeframe: TechnicalChartTimeframe
  timezone: string
  sessionMode: SessionMode
  lookbackLabel: string
  mrcMeta?: TechnicalMrcMetadata
  points: TechnicalPricePoint[]
}
```

### Go shape to target
- Add `MRC *MRCPoint` to `OhlcPoint` instead of separate `MRCCenter/MRCUpper/MRCLower` fields.
- Add timeframe-level `MRCMeta *MRCMetadata` to `TimeframeSeries`.
- Keep `TechnicalPricePoint` / `points[]` only as a temporary legacy read path during migration.

### Dual-read mapping rules
- **New snapshot**: read `seriesByTimeframe[tf].points[*].mrc` directly.
- **Old snapshot**: if only legacy `mrcCenter/mrcUpper/mrcLower` exist, map them into:
  - `mrc.center <- mrcCenter`
  - `mrc.outerUpper <- mrcUpper`
  - `mrc.outerLower <- mrcLower`
  - `mrc.innerUpper / innerLower <- undefined`
  - mark series as `legacyApproximation = true` in FE normalization so UI can degrade intentionally.

### Versioning strategy
- Add top-level `snapshotVersion`, e.g. `technical-chart.v2`.
- Treat absence of `snapshotVersion` as legacy v1.
- FE normalization must branch on `snapshotVersion` first, then fall back to field detection only for old snapshots.

## Release gates

The plan now explicitly separates work that can begin early from work required for completion.

### Can start before parity is complete
- FE component refactor that prepares for five-line MRC grammar
- type additions behind dual-read support
- doc drafting

### Required for a shippable implementation
- frozen canonical TradingView spec
- committed daily + weekly fixtures
- backend parity within tolerance
- canonical payload emitted by backend
- FE rendering from canonical payload without legacy `points[]` reattachment
- visual QA artifacts attached to the change

### Not considered complete unless
- parity tests pass
- migration path is implemented as selected below
- docs and vault context are updated to remove the "MRC is low-emphasis / HLC3 is data-only" guidance where superseded

## Recommended implementation approach

### Migration decision

**Selected default: Option A — dual-read, single-write.**

Decision:
- Backend writes only the new canonical MRC contract for newly generated snapshots.
- Frontend reads both legacy and new snapshots during transition.
- Legacy snapshots render in degraded mode:
  - no inner-band visualization
  - explicit FE branch for `legacyApproximation` data
  - no claim of TradingView parity for legacy snapshots

Escalation to Option B (bulk backfill) happens only if one of these becomes true:
- legacy traffic volume remains materially high after rollout
- degraded legacy rendering causes product confusion
- parity QA shows mixed old/new behavior is unacceptable

### Phase 0 — freeze the canonical TradingView spec

Purpose: prevent rework by locking the exact indicator variant before deeper implementation.

Work:
1. Identify the exact TradingView script / version / parameter set that defines "correct" MRC for this project.
2. Capture the canonical inputs and outputs from TradingView for fixture windows:
   - one daily sample
   - one weekly sample
   - optional one intraday sample if we expect future intraday parity
3. Document which parameters are algorithmic vs visual/UI only, e.g. source, smoother, length, multipliers, timeframe anchors, transparency, hover behavior.
4. Write a short ADR / product note superseding the prior "HLC3 data-only" and "low-emphasis 1D MRC overlay" decisions.

Deliverables:
- product note or ADR naming the canonical TradingView reference
- fixture data committed under a testdata path
- explicit parameter table

### Phase 1 — redesign the snapshot contract around final MRC

Purpose: stop depending on the legacy daily overlay bridge.

Current constraints to replace:
- `TechnicalPricePoint` exposes only `mrcCenter`, `mrcUpper`, `mrcLower` (`web/src/types/stocks.ts:121-135`)
- backend payload keeps MRC only on legacy daily `points[]` (`be/lib/app/stocks/technical_price_chart_payload.go:75-87`)
- frontend reattaches those values into `1D` points in `snapshotToChart` (`web/src/pages/stock-detail-page.tsx:265-320`)

Plan:
1. Add a canonical timeframe-level MRC model to the backend payload, conceptually:
   - `mrc.center`
   - `mrc.innerUpper`
   - `mrc.innerLower`
   - `mrc.outerUpper`
   - `mrc.outerLower`
   - `mrc.source`
   - `mrc.smoother`
   - `mrc.length`
   - `mrc.innerMultiplier`
   - `mrc.outerMultiplier`
   - `mrc.algorithmVersion`
2. Thread MRC directly into `seriesByTimeframe[tf].points` or a sibling timeframe structure so every timeframe can be rendered uniformly.
3. Update TypeScript types and normalization logic so the chart consumes one canonical model and no longer needs the `payload.points` daily backfill path.
4. Define transition behavior for old snapshots already stored in R2:
   - either tolerate both shapes in FE until republish
   - or serve a versioned transform in backend read path

Files likely involved:
- `be/lib/app/stocks/technical_price_chart_payload.go`
- `be/lib/app/stocks/technical_snapshot_worker.go`
- `web/src/types/stocks.ts`
- `web/src/pages/stock-detail-page.tsx`

### Phase 2 — implement TradingView-aligned MRC math in backend

Purpose: replace approximation with parity-driven computation.

Current implementation to replace:
- `indicators.MRC(series, period)` computes `SMA(series, period) ± 2 * population stddev` (`be/lib/pkg/indicators/indicators.go:124-169`)
- worker hardcodes `MRC(hlc3, 20)` (`be/lib/app/stocks/technical_snapshot_worker.go:203-206`)

Plan:
1. Introduce a new indicator implementation that matches the canonical TradingView variant rather than mutating the old approximation in place.
2. Keep source calculation explicit (`HLC3` likely remains a helper) but separate raw source from the channel algorithm.
3. Compute all required channel bands for each timeframe that should expose MRC.
4. Encode warmup behavior clearly:
   - no fabricated early values
   - nil/omitted values until sufficient lookback exists
5. Add golden tests that compare backend output to captured TradingView fixture values within an agreed tolerance.
6. Once parity is proven, delete or deprecate the old approximation path.

Files likely involved:
- `be/lib/pkg/indicators/indicators.go`
- `be/lib/pkg/indicators/indicators_test.go`
- `be/lib/app/stocks/technical_snapshot_worker.go`
- any new `testdata/` fixtures

### Phase 3 — rebuild visualization around MRC as primary price signal

Purpose: make the new indicator visually legible and semantically useful. This phase may begin earlier as UI shell work, but it does not satisfy the feature by itself; final release remains gated by Phase 0 parity + Phase 2 payload/math completion.

Current rendering limits:
- chart only checks for `mrcCenter/mrcUpper/mrcLower` existence (`web/src/components/detail/technical-price-chart.tsx:58-63`)
- chart builds only three line segment sets (`122-151`)
- docs position MRC as low-emphasis and HLC3 as out of scope (`docs/product/deepvalue-lab-stock-detail-technical-entry-chart-ux-contract.md:101-103`)

Plan:
1. Replace the current low-emphasis single-channel rendering with a full MRC grammar:
   - centerline: anchor / fair-value mean
   - inner bands: active mean-reversion zone
   - outer bands: stretch / exhaustion zone
   - optional low-emphasis fill between bands for zone readability
2. Decide whether raw HLC3 is rendered:
   - default recommendation: do not draw HLC3 as a permanent line initially unless it materially improves reading; prioritize channel readability first
   - if needed, consider hover-only or opt-in display
3. Upgrade chart header / hover readouts to include:
   - latest centerline
   - distance from centerline
   - current zone classification (inside mean / inner stretch / outer stretch / outside channel)
4. Make timeframe switching preserve the same MRC reading model across `1D` and `1W`.
5. Keep RSI/EMA pane intact but visually subordinate to the new MRC overlay.

Files likely involved:
- `web/src/components/detail/technical-price-chart.tsx`
- `web/src/pages/stock-detail-page.tsx`
- i18n message files if new labels are added
- product docs / UX contract docs

### Phase 4 — migration, cleanup, and doc alignment

Purpose: remove temporary compatibility scaffolding.

Plan:
1. Remove legacy daily `points[]` MRC bridge once the new contract is in production and old snapshots are handled.
2. Update docs that currently describe MRC/HLC3 as deferred or low-emphasis.
3. Update vault context after the feature is validated so the second brain reflects the new chart architecture.
4. Consider whether historical snapshots need regeneration for existing reports.

Files likely involved:
- `web/src/pages/stock-detail-page.tsx`
- `web/src/types/stocks.ts`
- `docs/product/deepvalue-lab-stock-detail-technical-entry-chart-ux-contract.md`
- `~/Documents/markdowns/projects/value-deck/context.md`
- optional ADR under vault `decisions/`

## Migration strategy

### Selected strategy — Option A: dual-read, single-write
- Backend writes only the new MRC contract for newly generated snapshots.
- Frontend reads both old and new snapshots during transition.
- Old snapshots render with deliberate degraded behavior: outer-band-only legacy overlay, no inner bands, and no TradingView-parity claim.

Why selected:
- lowest rollout risk
- allows UI and backend migration without blocking on bulk backfill
- preserves historical reports while making the parity boundary explicit

### Deferred strategy — Option B: one-time snapshot backfill
- Regenerate all technical snapshots to new MRC contract before or after rollout if degraded legacy mode proves insufficient.

Trigger conditions for Option B:
- unacceptable UX confusion between legacy and canonical snapshots
- too many actively viewed reports remain on old snapshots
- FE dual-read complexity becomes an unacceptable maintenance cost

## Risks and mitigations

1. **Algorithm mismatch risk**
   - Risk: we implement an indicator that looks plausible but does not match the user's actual TradingView setup.
   - Mitigation: freeze canonical script + captured fixture output before algorithm coding; gate completion on parity tests.

2. **SuperSmoother implementation risk**
   - Risk: `SuperSmoother` is the highest-risk numerical step because parity depends on matching a specific Ehlers-style 2-pole filter behavior rather than any generic smoothing approximation.
   - Mitigation: treat `SuperSmoother` as the primary parity-risk item in Phase 1, document the chosen implementation source, and validate it directly against fixtures before trusting downstream band math.

3. **Contract churn risk**
   - Risk: we design a partial payload then revise it again when weekly/intraday support arrives.
   - Mitigation: design the MRC payload as timeframe-native from the start, not `1D`-special-cased.

4. **Weekly bar construction mismatch risk**
   - Risk: even with correct channel math, parity will fail if the weekly candles compared against TradingView are built with different week-boundary semantics.
   - Mitigation: freeze the weekly-bar construction decision now and ensure fixture capture uses the same completed-week interpretation as the app's server-side aggregation.

5. **Visualization clutter risk**
   - Risk: adding center/inner/outer/HLC3 all at once makes the chart less readable.
   - Mitigation: treat HLC3 display as secondary; establish strict visual hierarchy and zone fills.

6. **Legacy snapshot compatibility risk**
   - Risk: existing published reports lose chart rendering if the frontend expects only the new shape.
   - Mitigation: maintain dual-read compatibility during migration.

7. **False confidence from rounded values**
   - Risk: parity looks close visually but diverges numerically due to rounding or warmup differences.
   - Mitigation: compare unrounded fixture values in tests; round only at display/serialization boundaries if intentional.

## Verification plan

### Backend
- Unit tests for source preprocessing (`HLC3`) and new MRC implementation.
- Golden fixture tests against TradingView daily and weekly exports.
- Snapshot worker tests validating the new payload shape and omission semantics during warmup.

### Frontend
- Type-level and normalization tests for old/new payload handling.
- Rendering tests for:
  - no MRC data
  - partial warmup data
  - full center/inner/outer bands
  - daily vs weekly switching
- Visual/manual QA on representative tickers over dense and sparse windows.

### Product QA
- Compare value-deck chart against TradingView on the same ticker/date range.
- Confirm that the final chart still respects the product principle that technicals stay in the execution layer, not the thesis layer.

## Proposed execution sequence

1. Freeze canonical TradingView spec and collect fixtures.
2. Design and agree the new MRC payload contract.
3. Implement backend indicator and payload writer.
4. Update frontend types and normalization to consume the new contract.
5. Rebuild chart rendering with the new MRC visual grammar.
6. Add dual-read migration support.
7. Run parity tests and visual QA.
8. Update docs and remove legacy scaffolding.

## Discussion points for the next review

1. Should raw HLC3 ever be drawn, or stay hidden behind hover/debug views?
2. Do we want both daily and weekly MRC in v1 of the replacement, or daily first with weekly shortly after?
3. Should technical status text eventually become MRC-aware instead of RSI-led?
4. Do we want to regenerate existing historical report snapshots after launch?

## Review-driven changelog

- Added a hard execution gate for canonical TradingView spec freeze.
- Added explicit fixture capture method, tolerance thresholds, and Phase 0 exit criteria.
- Added an execution-ready payload draft with versioning and dual-read mapping rules.
- Converted acceptance criteria to more testable conditions.
- Selected migration Option A by default and defined when Option B should trigger.
- Added release-gate language clarifying that visualization-only progress does not complete the feature.

## Implementable PRD

### PRD status
- Date: 2026-04-11
- Status: Ready for implementation planning
- Parent artifact: this document
- Release type: existing-feature replacement / contract migration

### Product decision

DeepValue Lab will replace its current approximate MRC implementation with a TradingView-aligned MRC system and make that system the primary price-pane technical language on the stock detail page.

This PRD assumes:
- final truth = the user's TradingView MRC setup
- backend computes and owns indicator truth
- frontend renders a canonical snapshot contract
- legacy approximate snapshots are transitional only

### Problem statement

The current product exposes only an approximate MRC based on `SMA ± 2σ` (`be/lib/pkg/indicators/indicators.go:124-169`) and only surfaces that data as a low-emphasis overlay bridged through legacy daily points (`be/lib/app/stocks/technical_snapshot_worker.go:203-206`, `be/lib/app/stocks/technical_price_chart_payload.go:75-87`, `web/src/pages/stock-detail-page.tsx:265-320`). That is not the same indicator the user actually relies on in TradingView, and the UI does not communicate mean, stretch, or reversion zones with enough clarity for the intended workflow.

### User / job-to-be-done

Primary user: the analyst reviewing a published stock detail page after valuation work is done.

Job to be done:
- see the same MRC structure they trust in TradingView
- judge whether price is near mean, in an inner stretch zone, or in an outer stretch zone
- compare daily and weekly MRC context using one consistent visual grammar
- use technicals as execution context, not thesis replacement

### Scope

#### In scope
- TradingView-aligned MRC math in backend
- canonical timeframe-native MRC payload
- frontend rendering of centerline + inner/outer bands
- dual-read migration support for old snapshots
- parity verification against TradingView fixtures
- doc updates for the new architecture

#### Out of scope
- full TradingView settings UI
- user-configurable MRC parameters
- frontend-side indicator math
- broker-style drawing tools
- mandatory historical backfill before first rollout

### Success criteria

This PRD is successful when:
1. the new backend output matches frozen TradingView fixtures within tolerance
2. the frontend renders canonical MRC from timeframe-native payload without the legacy daily reattachment path
3. daily and weekly views expose the same MRC reading model
4. legacy snapshots still render safely in degraded mode during migration

### Functional requirements

#### FR-1 — Canonical TradingView reference must be frozen before parity claims
- The implementation must record an exact TradingView script URL/title and capture date.
- The implementation must store daily and weekly fixtures under `testdata/technical/mrc/`.
- No task may claim “aligned” or “complete” before Phase 0 exit criteria are met.

#### FR-2 — Backend must emit canonical MRC contract
- The technical snapshot writer in `be/lib/app/stocks/technical_snapshot_worker.go` must emit canonical MRC data for every supported timeframe.
- The canonical contract must support:
  - `center`
  - `innerUpper`
  - `innerLower`
  - `outerUpper`
  - `outerLower`
  - timeframe-level MRC metadata
- The snapshot must expose explicit versioning such as `snapshotVersion = technical-chart.v2`.

#### FR-3 — Frontend must consume canonical MRC contract
- `web/src/types/stocks.ts` must expose the new MRC model.
- `web/src/pages/stock-detail-page.tsx` must normalize new snapshots directly from `seriesByTimeframe`.
- The legacy `payload.points` reattachment path may remain only as a transitional fallback for old snapshots.

#### FR-4 — Chart must render a complete MRC grammar
- `web/src/components/detail/technical-price-chart.tsx` must render:
  - centerline
  - inner upper/lower
  - outer upper/lower
- The active point must expose a zone classification:
  - `inside_mean`
  - `inner_upper_zone`
  - `inner_lower_zone`
  - `outer_upper_zone`
  - `outer_lower_zone`
  - `outside_upper`
  - `outside_lower`

#### FR-5 — Daily and weekly support are required for parity release
- The release candidate must support `1D` and `1W` with the same MRC grammar when payload data exists.
- Intraday MRC may follow the same contract later, but is not required for first release.

#### FR-6 — Legacy snapshots must degrade safely
- Legacy snapshots may render only outer-band-equivalent approximation.
- Inner bands must not be fabricated from old data.
- The UI must not imply TradingView parity when rendering a legacy approximation snapshot.

### UX requirements

#### UX-1 — Visual hierarchy
- centerline is the primary anchor line
- inner bands are visible and readable but lower emphasis than price + center
- outer bands communicate stretch/exhaustion boundaries
- fills, if used, must improve zone readability rather than dominate candles

#### UX-2 — Hover / latest readout
- Hover for the latest point must show:
  - close
  - centerline
  - inner upper/lower
  - outer upper/lower
  - zone classification
- Header/rail summary must include at least:
  - latest zone classification
  - centerline distance or equivalent directional context

#### UX-3 — HLC3 display policy
- Default release behavior: do not render HLC3 as a permanent always-on line unless later manual QA shows it materially improves decisions.
- If HLC3 is surfaced in v1, it should be hover-only or debug-only.

### Technical design requirements

#### Backend files
- `be/lib/pkg/indicators/indicators.go`
  - add the TradingView-aligned MRC implementation
  - retain `HLC3` as source helper if still needed
- `be/lib/pkg/indicators/indicators_test.go`
  - add fixture parity tests
- `be/lib/app/stocks/technical_price_chart_payload.go`
  - add canonical MRC metadata + point structure
  - add snapshot versioning
- `be/lib/app/stocks/technical_snapshot_worker.go`
  - emit canonical timeframe-native MRC data

#### Frontend files
- `web/src/types/stocks.ts`
  - add canonical `mrc` point shape + metadata
- `web/src/pages/stock-detail-page.tsx`
  - normalize by `snapshotVersion`
  - read canonical `seriesByTimeframe[*].points[*].mrc`
  - preserve dual-read fallback for legacy snapshots
- `web/src/components/detail/technical-price-chart.tsx`
  - render five-line MRC grammar
  - add hover/latest zone presentation

#### Docs to update before completion
- `docs/product/deepvalue-lab-stock-detail-technical-entry-chart-ux-contract.md`
- `~/Documents/markdowns/projects/value-deck/context.md`

### Delivery plan by PR

#### PR-0 — Canonical spec freeze
Goal: unblock parity work.

Deliverables:
- fill in canonical TradingView source details in this doc
- commit daily/weekly fixture data and README
- document tolerance + exit criteria confirmation

Completion gate:
- Phase 0 exit criteria satisfied

#### PR-1 — Payload and backend parity foundation
Goal: introduce canonical MRC contract and backend writer.

Deliverables:
- new MRC types in backend payload
- snapshot versioning
- canonical backend indicator implementation scaffold
- fixture-driven backend tests
- no frontend rendering dependency required yet

Completion gate:
- backend can produce `technical-chart.v2`
- fixture tests pass for at least one daily + one weekly sample

Status update (2026-04-11):
- ✅ Completed and merged to main via `f58b198`
- ✅ Backend now exposes canonical MRC payload primitives, snapshot versioning, and timeframe-native MRC wiring for `1D` / `1W`
- ✅ Backend verification passed in main repo: `cd be && go test ./...`
- ⏳ Final numerical parity still blocked on fixture-grade TradingView evidence

Status update (2026-04-11):
- ✅ Completed and merged to main via `f58b198`
- ✅ Backend now exposes canonical MRC payload primitives, snapshot versioning, and timeframe-native MRC wiring for `1D` / `1W`
- ✅ Backend verification passed in main repo: `cd be && go test ./...`
- ⏳ Final numerical parity still blocked on fixture-grade TradingView evidence

#### PR-2 — Frontend dual-read + canonical rendering
Goal: consume the new payload and ship the new MRC visual system.

Deliverables:
- FE types + normalization for v2 snapshots
- degraded handling for legacy snapshots
- new technical price chart rendering grammar
- hover/latest readouts

Completion gate:
- `1D` and `1W` render correctly from canonical payload
- legacy snapshots still render safely

Status update (2026-04-11):
- ✅ Completed and merged to main via `ed56a0c`
- ✅ Frontend now consumes canonical `mrc` payloads, branches on `snapshotVersion`, and preserves degraded legacy fallback
- ✅ Chart renders center / inner / outer band grammar from canonical payloads
- ✅ Frontend verification passed in main repo: `cd web && pnpm tsc --noEmit && pnpm lint && pnpm build`

Status update (2026-04-11):
- ✅ Completed and merged to main via `ed56a0c`
- ✅ Frontend now consumes canonical `mrc` payloads, branches on `snapshotVersion`, and preserves degraded legacy fallback
- ✅ Chart renders center / inner / outer band grammar from canonical payloads
- ✅ Frontend verification passed in main repo: `cd web && pnpm tsc --noEmit && pnpm lint && pnpm build`

#### PR-3 — Cleanup and doc alignment
Goal: remove temporary ambiguity after rollout confidence.

Deliverables:
- trim legacy bridge code where safe
- update docs and vault context
- decide whether Option B backfill is needed

Completion gate:
- release gates satisfied
- docs reflect new reality

Status update (2026-04-12):
- ✅ Phase 3 visual hierarchy / readability polish completed and merged to main via `00697ab`
- ✅ Center / inner / outer hierarchy, zone fills, and MRC readout polish are now live in main
- ✅ Screenshot-based visual QA completed on 2026-04-12 with side-by-side SNDK localhost vs TradingView review
- ⏳ Remaining work in this phase is docs/final cleanup alignment plus final parity/fixture confirmation

Status update (2026-04-12):
- ✅ Phase 3 visual hierarchy polish completed and merged to main via `00697ab`
- ✅ Visual hierarchy/readability improved for center / inner / outer bands, zone fills, and MRC readouts
- ✅ Side-by-side screenshot QA on SNDK was judged “差不多了” after the inner-band normalization fix (`37e43f2`)
- ⏳ Remaining Phase 3/cleanup work is mostly docs alignment, fixture/parity confirmation, and final release readiness checks

### Implementation order

1. complete PR-0
2. implement backend contract + parity in PR-1
3. implement FE dual-read + rendering in PR-2
4. complete doc cleanup / optional legacy pruning in PR-3

### Test plan

#### Backend
- unit tests for source preprocessing
- golden fixture parity tests for daily and weekly
- snapshot serialization tests for warmup omission semantics

#### Frontend
- normalization tests for `snapshotVersion = technical-chart.v2`
- normalization tests for legacy snapshot fallback
- rendering tests for all five MRC lines
- rendering tests for legacy degraded mode
- timeframe switching tests for `1D` / `1W`

#### Manual QA
- side-by-side screenshot comparison against TradingView daily view
- side-by-side screenshot comparison against TradingView weekly view
- legacy snapshot sanity check to confirm no broken chart state

### Dependencies

External dependency:
- the user must provide the exact TradingView source reference or equivalent screenshot/export for the canonical setup

Internal dependencies:
- backend payload work depends on canonical spec freeze
- frontend rendering may start structurally earlier, but final UI QA depends on canonical backend output

### Release decision

Ship only when all of the following are true:
- canonical spec frozen
- backend parity green
- frontend renders canonical payload directly
- legacy path degrades safely
- daily/weekly manual QA artifacts exist

### Open execution inputs

Implementation can begin with either of these external inputs:
- a TradingView screenshot that clearly shows the indicator name, parameter string, and visual output
- the exact TradingView script/source reference used by the user

Execution confidence levels:
- **Screenshot only**: enough to begin payload design, frontend rendering work, backend scaffolding, and provisional algorithm implementation
- **Exact script/export/fixture-grade source**: required to close final numerical parity and declare algorithm alignment complete

Current external blocker for final parity:
- a fixture-grade artifact from the user's actual TradingView setup (script reference, export, or sufficiently detailed capture)

Current public-source state:
- strongest public candidate identified: `5uaoczeP`
- still blocked on user confirmation / fixture-grade evidence before treating it as canonical truth

With screenshot evidence alone, this PRD is ready to drive task breakdown and early implementation, but not final parity signoff.


## Phase checklists

### Phase 0 — Canonical spec freeze checklist

Objective: freeze the external truth source tightly enough that backend parity work has a real target.

Checklist:
- [x] Record the TradingView evidence source used for this feature (exact script reference or screenshot artifact).
- [ ] Store a screenshot/export artifact path in the repo or note where it lives externally.
- [x] Freeze the parameter table: `hlc3`, `SuperSmoother`, `200`, `1`, `2.415`, `60`, `On Hover`, `Auto`, `D`, `W`.
- [ ] Choose a representative ticker for fixture validation.
- [ ] Capture a daily fixture window.
- [ ] Capture a weekly fixture window.
- [x] Write fixture acquisition notes under `testdata/technical/mrc/README.md` or equivalent.
- [x] Confirm tolerance thresholds for center / inner / outer bands.
- [x] Confirm whether screenshot-only evidence is still temporary or has been superseded by fixture-grade evidence.

Evidence to collect:
- TradingView screenshot or source reference
- fixture files under `testdata/technical/mrc/`
- capture note / README

Exit criteria:
- exact or provisional evidence source documented
- daily + weekly fixtures committed or explicitly staged
- tolerance table written down
- Phase 0 exit criteria marked satisfied

### Phase 1 — Payload + backend parity checklist

Objective: emit a canonical MRC payload from the backend and establish parity harnesses.

Checklist:
- [x] Add top-level snapshot versioning (for example `technical-chart.v2`).
- [x] Add canonical `mrc` point shape to backend payload types.
- [x] Add timeframe-level `mrcMeta` metadata.
- [x] Document the chosen `SuperSmoother` implementation source and mark it as the primary Phase 1 parity risk.
- [x] Implement provisional TradingView-aligned MRC computation path in backend.
- [x] Preserve or clearly isolate old approximation code during migration.
- [x] Wire canonical MRC output into timeframe-native series data.
- [x] Define warmup / omission semantics for MRC points.
- [x] Add backend unit tests for preprocessing + serialization.
- [ ] Add fixture-driven parity tests for daily data.
- [ ] Add fixture-driven parity tests for weekly data.
- [x] Verify backend can emit `technical-chart.v2` snapshots without FE dependency.

Evidence to collect:
- changed payload types
- test files / fixture files
- test commands and output

Exit criteria:
- backend emits canonical MRC payload
- daily + weekly parity tests pass within tolerance
- warmup semantics are tested and documented

### Phase 2 — Frontend dual-read + rendering checklist

Objective: consume canonical MRC payload and render the new chart grammar while preserving safe legacy fallback.

Checklist:
- [x] Extend `web/src/types/stocks.ts` with canonical `mrc` model and metadata.
- [x] Normalize `snapshotVersion` in `web/src/pages/stock-detail-page.tsx`.
- [x] Read canonical `seriesByTimeframe[*].points[*].mrc` directly.
- [x] Keep transitional dual-read support for legacy snapshots.
- [x] Mark legacy approximation snapshots explicitly in FE normalization.
- [x] Render centerline + inner upper/lower + outer upper/lower in `technical-price-chart.tsx`.
- [x] Add zone classification logic for the active point.
- [x] Add hover/latest readouts for close + center + bands + zone.
- [x] Verify `1D` rendering from canonical payload.
- [x] Verify `1W` rendering from canonical payload.
- [x] Verify legacy snapshots degrade safely without fabricated inner bands.
- [ ] Add FE tests for normalization and rendering behavior.

Evidence to collect:
- UI screenshots for daily + weekly
- FE test output
- legacy snapshot fallback screenshots

Exit criteria:
- FE renders canonical payload directly
- daily + weekly chart grammar is consistent
- legacy mode is safe and explicit

### Phase 3 — Cleanup + doc alignment checklist

Objective: remove ambiguity, align docs, and decide how much legacy support remains.

Checklist:
- [x] Update product docs to reflect TradingView-aligned MRC direction.
- [x] Update vault context and decision pages after validation.
- [x] Remove or reduce legacy daily bridge code where safe.
- [x] Decide whether bulk backfill (Option B) is necessary.
- [x] Ensure release gates are all satisfied.
- [x] Attach or reference manual QA artifacts.
- [x] Confirm no remaining docs still describe approximate MRC as the intended final state.

Visual hierarchy / polish substatus:
- [x] Improve outer/inner/center visual hierarchy
- [x] Improve legibility of MRC state/readout labels
- [x] Add subtle zone fills for canonical snapshots
- [x] Compare polished chart visually against TradingView screenshots
- [x] Compare polished chart visually against TradingView screenshots

Evidence to collect:
- updated docs
- vault ingest notes
- QA artifact links / screenshots (`/tmp/sndk-localhost-after-inner-band-fix-2.png`, `/tmp/sndk-tradingview-mrc.png`)

Exit criteria:
- docs match implementation reality
- release gates are green
- any remaining legacy behavior is intentional and documented

Phase 3 decision update (2026-04-12):
- **Option B / bulk backfill** is **not required yet**. Continue with Option A (`dual-read, single-write`) unless legacy snapshot traffic stays materially high, degraded legacy rendering causes product confusion, or parity QA shows mixed old/new behavior is unacceptable.
- The remaining FE/BE legacy bridge code is intentionally retained for old snapshot compatibility until migration confidence and Phase 0 parity evidence make removal safe.

Closure decision update (2026-04-14):
- This feature is closed as **implementation-complete with accepted parity deferral**.
- The user cannot provide fixture-grade daily/weekly TradingView exports, so fixture-driven parity is explicitly deferred rather than treated as an active blocker.
- Release-signoff now rests on the implemented canonical MRC contract, frontend rendering, visual QA, and live TradingView evidence capture.
- Evidence source ambiguity is reduced to an acceptable level for closure: live TradingView legend/title and parameter string were captured on `SNDK`, and repo artifacts were stored at `testdata/technical/mrc/screenshots/tradingview-sndk-1d-2026-04-14.png` and `testdata/technical/mrc/screenshots/tradingview-sndk-1w-2026-04-14.png`.
- `fixture-grade parity` remains a future enhancement path, not a required completion gate for this rollout.

Accepted residual risks:
- Exact public TradingView script URL / author provenance is still candidate-level rather than directly exported from the live layout.
- Numerical parity against a committed 30+ point daily/weekly fixture window is unverified.
- Legacy fallback paths remain intentionally present for old snapshots.

Final status:
- **Feature status:** DONE
- **Parity status:** DEFERRED
- **Documentation / evidence status:** DONE
