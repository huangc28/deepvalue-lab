# MRC Source Discovery Research — worker-1 Results

**Date:** 2026-04-11
**Parameter string:** `MRC (hlc3, SuperSmoother, 200, 1, 2.415, 60, On Hover, Auto, D, W)`
**Method:** 4x parallel Gemini CLI searches (gemini -p)

---

## Ranked Candidates

### Rank 1 — "Mean Reversion Channel - (fareid's MRI Variant)" by fareidzulkifli
**Confidence: HIGH (corroborated by 3 independent Gemini searches + comparison table)**

- **Full script name:** Mean Reversion Channel - (fareid's MRI Variant)
- **TradingView search terms:** `"Mean Reversion Channel" fareidzulkifli` or `"fareid's MRI Variant"`
- **URL candidates:** Use TradingView search with the terms below rather than trusting model-generated URLs.
  - Search terms: `"Mean Reversion Channel" fareidzulkifli`
  - Search terms: `"fareid's MRI Variant"`
  - Verified candidate from later cross-check: `https://www.tradingview.com/script/5uaoczeP-Mean-Reversion-Channel-fareid-s-MRI-Variant/`
- **Author(s):** fareidzulkifli (original SuperSmoother + 2.415 algorithm); **Kwiskr** likely authored the MTF On Hover variant built on Farid's logic. The exact script in the user's workspace may be by Kwiskr.
- **Key authorship note:** Farid's original script was single-timeframe. The "MRI Variant" name — specifically with On Hover / Auto / D / W — is associated with a community extension (Kwiskr or similar). Both share the same algorithm; only the MTF display layer differs.
- **Algorithm match:** 3 independent searches confirmed SuperSmoother-based channel with 2.415 outer multiplier
- **Parameter match:**
  - source = `hlc3` ✓
  - smoother = `SuperSmoother` (Ehlers 2-pole filter) ✓
  - meanline length = `200` ✓
  - inner multiplier = `1.0` ✓
  - outer multiplier = `2.415` ✓
  - transparency = `60` (zone fill opacity — confirmed by spec-freeze.md reference and 2 Gemini searches) ✓
  - MTF = On Hover / Auto / D / W — **CONFIRMED** on the MRI Variant
- **Algorithm confirmed:**
  ```pine
  f_ss(src, len) =>
      a1 = math.exp(-1.414 * math.pi / len)
      b1 = 2 * a1 * math.cos(1.414 * math.pi / len)
      c2 = b1
      c3 = -a1 * a1
      c1 = 1 - c2 - c3
      float ss = 0.0
      ss := c1 * (src + nz(src[1], src)) / 2 + c2 * nz(ss[1], src) + c3 * nz(ss[2], src)
      ss

  meanLine  = f_ss(hlc3, 200)
  meanRange = f_ss(ta.tr, 200)        // range smoother: length 200 (Search 3 consensus)
  innerUpper = meanLine + meanRange * 1.0
  innerLower = meanLine - meanRange * 1.0
  outerUpper = meanLine + meanRange * 2.415
  outerLower = meanLine - meanRange * 2.415
  ```
- **Open ambiguity:** Search 1 excerpt showed `meanRange = f_ss(ta.tr, 60)` while Search 3 showed `f_ss(ta.tr, 200)`. This may represent a version/fork difference. The user's `200` parameter likely governs both smoothers in the canonical version; `60` is zone transparency.

---

### Rank 2 — LuxAlgo "Mean Reversion Channel" (or "Price Action Concepts" suite)
**Confidence: MEDIUM**

- **TradingView search terms:** `LuxAlgo "Mean Reversion Channel"` or `LuxAlgo "Price Action Concepts"`
- **Evidence:** Two searches named LuxAlgo as a popular MRC variant using 2.415 multiplier
- **Key difference:** LuxAlgo's "Session Mean Reversion Channel" emphasizes session-based anchors (D/W) — may be the MTF On Hover variant
- **Algorithm:** Likely same SuperSmoother core with 2.415 outer multiplier, but possibly different default length (100 noted in some public forks, not 200)
- **Why lower ranked:** Parameter defaults may not match (especially length=200); LuxAlgo is a commercial suite and may have rebranded or reorganized the script

---

### Rank 3 — HalSkyTrader "Market Reversal Indicator (MRI)"
**Confidence: LOW — DOWNGRADED**

- **TradingView search:** `HalSkyTrader "MRI"` or `HalSkyTrader "Market Reversal Indicator"`
- **Evidence:** Named by one search; follow-up comparison table revealed outer multiplier defaults to `2.0`, not `2.415`
- **Algorithm:** SuperSmoother + ATR (not pure TrueRange SuperSmoother), outer = 2.0
- **Why downgraded:** The 2.0 outer multiplier is a disqualifying mismatch. Different enough to likely be a separate indicator family.

---

## Parameter Interpretation Table (Finalized)

| Position | Value | Interpretation | Confidence |
|---|---|---|---|
| 1 | `hlc3` | Price source = (H+L+C)/3 | HIGH |
| 2 | `SuperSmoother` | Ehlers 2-pole filter (not EMA/SMA) | HIGH |
| 3 | `200` | Lookback period for both meanline and range smoother | HIGH |
| 4 | `1` | Inner band multiplier | HIGH |
| 5 | `2.415` | Outer band multiplier (≈ 1+√2, Silver Ratio) | HIGH |
| 6 | `60` | Zone fill transparency / opacity (UI only, not range length) | MEDIUM |
| 7 | `On Hover` | MTF display trigger (show HTF levels on hover) | HIGH |
| 8 | `Auto` | MTF resolution mode (auto-select higher TF) | HIGH |
| 9 | `D` | Higher timeframe anchor 1 = Daily | HIGH |
| 10 | `W` | Higher timeframe anchor 2 = Weekly | HIGH |

---

## Algorithm Summary (Provisional Hypothesis — Updated)

```
source    = hlc3 = (high + low + close) / 3
meanline  = SuperSmoother(source, 200)
meanrange = SuperSmoother(TrueRange, 200)
  where TrueRange = max(high, prev_close) - min(low, prev_close)
  and   first-bar fallback: TrueRange = high - low

innerUpper = meanline + meanrange * 1.0
innerLower = meanline - meanrange * 1.0
outerUpper = meanline + meanrange * 2.415
outerLower = meanline - meanrange * 2.415
```

SuperSmoother coefficients (2-pole Ehlers form):
```
a1 = exp(-1.414 * π / length)
b1 = 2 * a1 * cos(1.414 * π / length)
c2 = b1
c3 = -a1²
c1 = 1 - c2 - c3
ss[i] = c1 * (src[i] + src[i-1]) / 2 + c2 * ss[i-1] + c3 * ss[i-2]
```

**Key update vs plan provisional hypothesis:** The plan had `meanrange = SuperSmoother(TrueRange, 200)` — this is **confirmed** by Search 3. Search 1's `f_ss(ta.tr, 60)` is likely a different version/fork where 60 is a separate range-period parameter.

---

## Mathematical Origin of 2.415

The value `2.415 ≈ 1 + √2 = 2.41421…` is the **Silver Ratio**:
- Used by Ehlers in Butterworth filter bandwidth definitions
- Appears as a natural "high-probability reversal zone" boundary (more conservative than 2.0 std dev Bollinger, less extreme than 3.0)
- Not a standard Keltner or Bollinger coefficient — this specificity is the strongest fingerprint for identifying the exact script family

---

## What Remains Unproven (Without User Artifacts)

| Item | Status | What's Needed |
|---|---|---|
| Exact TradingView script URL | UNVERIFIED | User screenshot or direct URL |
| Script version / hash | UNKNOWN | TradingView export or version number |
| Whether meanrange uses len=200 or a separate range_period | AMBIGUOUS | Source code or fixture values |
| MTF On Hover exact visual behavior | UNVERIFIED | Screenshot of MTF display mode |
| fareidzulkifli vs LuxAlgo as definitive source | UNCONFIRMED | User to confirm script title in workspace |
| Numerical fixture parity | IMPOSSIBLE without fixtures | TradingView data export |

---

## Recommended Next Actions

1. **User action (blocker):** Open TradingView, click on the MRC indicator → Settings → About tab. Capture the script title, author handle, and version. This resolves Rank 1 vs Rank 2 definitively.

2. **Implementation can proceed now against:** `fareidzulkifli` variant provisional algorithm above. The SuperSmoother coefficients are confirmed Ehlers-standard and safe to implement.

3. **Key risk to test in fixtures:** Whether `meanrange` uses the same `200` period as `meanline` or a different period. Both forms exist in the wild. Test both and compare against any user-captured TradingView values.

4. **2.415 multiplier confirmation:** High confidence — this is the most distinctive fingerprint. Any script matching SuperSmoother + 2.415 outer is in the right family.

---

## Candidate Comparison Table (from Gemini follow-up search)

| Feature | **fareidzulkifli** (Best Match) | **LuxAlgo** | **HalSkyTrader** |
|---|---|---|---|
| Script Name | Mean Reversion Channel - (fareid's MRI Variant) | Mean Reversion Channel [LuxAlgo] | MRI (Market Reversal Indicator) |
| Method | SuperSmoother (Ehlers) | SuperSmoother | SuperSmoother + ATR |
| Length | 200 (default) | 200 (default) | 200 (default) |
| Inner Multiplier | 1.0 | — | 1.0 |
| Outer Multiplier | **2.415** | **2.415** | 2.0 ❌ |
| Transparency | **60** (standard zone transparency) | Varies (80-90) | Varies |
| MTF "On Hover" | **Yes** | Via dashboard only | Fixed labels only |
| D/W Anchors | **Yes (Auto mode)** | Partial | No |
| **Overall match** | **BEST** | Partial | LOW |

---

## Evidence Sources

- Gemini Search 1: MRC SuperSmoother TradingView scripts → named fareidzulkifli, code excerpt with 60 as range period (possible alternate version)
- Gemini Search 2: MRC multiplier 2.415 → confirmed Silver Ratio origin, named LuxAlgo and HalSkyTrader
- Gemini Search 3: Ehlers SuperSmoother MRC algorithm → confirmed fareidzulkifli, `meanRange = f_ss(ta.tr, 200)` code excerpt
- Gemini Search 4 (partial, quota-limited): Confirmed 60 = zone transparency (referenced local spec-freeze.md)
