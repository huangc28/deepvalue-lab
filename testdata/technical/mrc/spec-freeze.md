# MRC Canonical Spec Freeze

Date: 2026-04-11
Status: PROVISIONAL — parameter table frozen; TradingView script title/params observed live on 2026-04-14, fixture-grade parity still pending
Owner: DeepValue Lab

## Evidence source

| Field | Value | Status |
|---|---|---|
| TradingView script title | Mean Reversion Channel - MRI Variant | OBSERVED LIVE in TradingView layout via chrome-devtools-mcp on 2026-04-14 |
| TradingView script URL | Candidate public script remains `https://www.tradingview.com/script/5uaoczeP-Mean-Reversion-Channel-fareid-s-MRI-Variant/` | CANDIDATE ONLY — live layout did not expose a canonical URL |
| Script ID | 5uaoczeP | CANDIDATE ONLY — inferred from prior source discovery, not directly exposed in live layout |
| Author | fareidzulkifli (aliases: Kwiskr, Farade) | CANDIDATE ONLY — not directly exposed in live layout |
| Capture date | 2026-04-14 | CONFIRMED |
| Screenshot artifact path | `testdata/technical/mrc/screenshots/tradingview-sndk-1d-2026-04-14.png`; `testdata/technical/mrc/screenshots/tradingview-sndk-1w-2026-04-14.png` | CONFIRMED |

### How the candidate was identified

Worker-2 ran 5 parallel Gemini CLI searches (2026-04-11) against the parameter string
`MRC (hlc3, SuperSmoother, 200, 1, 2.415, 60, On Hover, Auto, D, W)`.
4 of 5 completed searches converged independently on the same author and script ID.
The 2.415 outer multiplier (Silver Ratio = 1+sqrt(2)) was confirmed as specific to
fareidzulkifli's implementation.

Observed directly from the live TradingView chart on 2026-04-14:
- indicator title shown in the chart legend: `Mean Reversion Channel - MRI Variant`
- parameters shown in the legend: `hlc3`, `SuperSmoother`, `200`, `1`, `2.415`, `60`, `On Hover`, `Auto`, `D`, `W`
- screenshot artifacts committed under `testdata/technical/mrc/screenshots/`

What remains unconfirmed:
- exact canonical public script URL exposed by the live layout
- exact author / script ID provenance for release-signoff purposes
- fixture-grade daily / weekly exported values

## Frozen parameter table

These parameters define the canonical MRC variant for DeepValue Lab.
The values below are frozen from the plan document (2026-04-11) based on known user configuration.

| Parameter | Value | Algorithmic? |
|---|---|---|
| source | `hlc3` | YES — affects computation |
| smoother | `SuperSmoother` | YES — affects computation |
| length | `200` | YES — affects computation |
| innerMultiplier | `1` | YES — affects computation |
| outerMultiplier | `2.415` | YES — affects computation |
| zone transparency | `60` | NO — visual/UI only |
| MTF display mode | `On Hover` | NO — visual/UI only |
| MTF mode | `Auto` | NO — visual/UI only |
| higher timeframe anchors | `D`, `W` | NO — visual/UI only |

Visual-only parameters do not affect backend computation and need not be reproduced in parity tests.

## Provisional algorithm hypothesis

Until fixture-grade evidence is captured from TradingView, the implementation proceeds against
this provisional hypothesis. This is the working algorithm for Phase 1 scaffolding.

```
source      = hlc3 = (high + low + close) / 3
meanline    = SuperSmoother(source, 200)
meanrange   = SuperSmoother(TrueRange, 200)

innerUpper  = meanline + meanrange * 1
innerLower  = meanline - meanrange * 1
outerUpper  = meanline + meanrange * 2.415
outerLower  = meanline - meanrange * 2.415
```

### SuperSmoother implementation note

`SuperSmoother` is a John Ehlers-style 2-pole IIR filter, NOT a generic moving average.
The chosen implementation source must be documented here before Phase 1 closes:

| Field | Value |
|---|---|
| Implementation source | Ehlers (2013) *Cycle Analytics for Traders* — 2-pole SuperSmoother. Gemini-reconstructed Pine Script confirms coefficient `1.414 = sqrt(2)`. |
| Coefficients formula | 2-pole Butterworth-style filter as per Ehlers (2013) — confirmed via Pine Script reconstruction |

Standard Ehlers 2-pole SuperSmoother coefficients for period `N`:
```
a1 = exp(-sqrt(2) * pi / N)
b1 = 2 * a1 * cos(sqrt(2) * pi / N)
c2 = b1
c3 = -a1^2
c1 = 1 - c2 - c3

SS[i] = c1 * (src[i] + src[i-1]) / 2 + c2 * SS[i-1] + c3 * SS[i-2]
```

This formulation must be validated against TradingView fixture output before parity is declared.

### TrueRange first-bar fallback

For the first bar where no prior close exists:
```
TrueRange[0] = high[0] - low[0]
TrueRange[i] = max(high[i] - low[i], abs(high[i] - close[i-1]), abs(low[i] - close[i-1]))
```

### Weekly bar construction decision

Weekly parity uses the app's existing server-side weekly aggregation from daily bars,
aligned to completed trading weeks with Friday-close semantics.
No secondary weekly-bar data source is introduced for this feature.

## Parity tolerance table

| Band | Metric | Threshold |
|---|---|---|
| centerline | absolute error | <= 0.02 |
| innerUpper | absolute error | <= 0.03 |
| innerLower | absolute error | <= 0.03 |
| outerUpper | absolute error | <= 0.03 |
| outerLower | absolute error | <= 0.03 |
| any point | directional inversion | NOT ALLOWED |

"Directional inversion" means the implementation computes a zone classification that is
on the opposite side of the centerline from the TradingView fixture value.

These tolerances apply to pre-display values, not rounded display values.

## Representative ticker

`SNDK` is now the observed evidence ticker from the 2026-04-14 TradingView captures.
Fixture validation ticker selection is therefore no longer blocked, but fixture files are still missing.

Suggested criteria for selection:
- Highly liquid US equity with a long continuous daily history (10+ years).
- Stable enough that 200-bar SuperSmoother is fully warmed across the fixture window.
- Examples: AAPL, SPY, MSFT, NVDA.

## Phase 0 exit criteria confirmation

| Criterion | Status |
|---|---|
| Exact TradingView script title documented | DONE |
| Exact TradingView script URL documented | PENDING — only candidate public URL is known |
| Screenshot/export artifact committed or path noted | DONE |
| Parameter table frozen | DONE |
| Representative ticker chosen | DONE (`SNDK`) |
| Daily fixture file committed (30+ warmed points) | PENDING |
| Weekly fixture file committed (30+ warmed points) | PENDING |
| Tolerance table written | DONE |
| Manual visual comparison artifact captured | DONE |

Phase 0 is no longer blocked on basic evidence capture. It is now blocked specifically on
fixture-grade daily/weekly value capture plus exact script-URL provenance if release signoff
requires a canonical public script reference rather than a live-layout observation.

Observed live legend values on 2026-04-14 for `SNDK`:
- `1D`: Mean `505.45`, R1 `653.40`, S1 `357.50`, R2 `862.74`, S2 `148.16`
- `1W`: Mean `214.50`, R1 `277.38`, S1 `151.62`, R2 `366.35`, S2 `62.65`

These values are evidence artifacts only. They are not fixture-grade parity files because they
cover visible legend values rather than a committed 30+ point daily/weekly export window.
