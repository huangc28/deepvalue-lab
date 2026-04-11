# MRC Canonical Spec Freeze

Date: 2026-04-11
Status: PROVISIONAL — parameter table frozen; TradingView script reference PENDING user input
Owner: DeepValue Lab

## Evidence source

| Field | Value | Status |
|---|---|---|
| TradingView script title | Mean Reversion Channel - (fareid's MRI Variant) | CANDIDATE — pending user confirmation |
| TradingView script URL | https://www.tradingview.com/script/5uaoczeP-Mean-Reversion-Channel-fareid-s-MRI-Variant/ | CANDIDATE — pending user confirmation |
| Script ID | 5uaoczeP | CANDIDATE — pending user confirmation |
| Author | fareidzulkifli (aliases: Kwiskr, Farade) | CANDIDATE — pending user confirmation |
| Capture date | PENDING | User must provide when capturing fixtures |
| Screenshot artifact path | PENDING | Commit to `testdata/technical/mrc/screenshots/` |

### How the candidate was identified

Worker-2 ran 5 parallel Gemini CLI searches (2026-04-11) against the parameter string
`MRC (hlc3, SuperSmoother, 200, 1, 2.415, 60, On Hover, Auto, D, W)`.
4 of 5 completed searches converged independently on the same author and script ID.
The 2.415 outer multiplier (Silver Ratio = 1+sqrt(2)) was confirmed as specific to
fareidzulkifli's implementation.

**Action required:** User should open the candidate URL, confirm it matches their indicator, then update Status → CONFIRMED and capture fixtures.

When the user confirms the script reference, update Status → CONFIRMED in the table above.

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

PENDING — user to confirm the ticker to use for fixture validation.

Suggested criteria for selection:
- Highly liquid US equity with a long continuous daily history (10+ years).
- Stable enough that 200-bar SuperSmoother is fully warmed across the fixture window.
- Examples: AAPL, SPY, MSFT, NVDA.

## Phase 0 exit criteria confirmation

| Criterion | Status |
|---|---|
| Exact TradingView script URL/title documented | CANDIDATE IDENTIFIED — user confirmation required |
| Screenshot/export artifact committed or path noted | PENDING |
| Parameter table frozen | DONE |
| Representative ticker chosen | PENDING |
| Daily fixture file committed (30+ warmed points) | PENDING |
| Weekly fixture file committed (30+ warmed points) | PENDING |
| Tolerance table written | DONE |
| Manual visual comparison performed | PENDING |

Phase 0 is BLOCKED on the user providing a TradingView screenshot or script reference.
All other deliverables (fixture directory, format, parameter spec, tolerance table, algorithm
hypothesis, and fixture README) are complete and committed.
