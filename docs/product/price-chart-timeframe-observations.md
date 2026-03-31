# Price Chart Timeframe Observations

> Observations from studying daily-dip TradingView-style charts across 5 timeframes.
> Purpose: inform x-axis / candle behavior for deep-value's daily-candle price chart.

## Observed Timeframes

### 15M (15-minute candles)
- **Time span**: ~2 weeks (3/17 → 3/27)
- **X-axis format**: `M/D H:MM` — e.g. `3/17 12:00`, `3/19 11:00`
- **Label spacing**: ~2 trading days between labels
- **Label count**: ~5 visible
- **Candle width**: very narrow, densely packed

### 1H (1-hour candles)
- **Time span**: ~2.5 months (1/14 → 3/19)
- **X-axis format**: `M/D H:MM` — e.g. `2/6 11:00`, `2/18 12:00`, `2/27 13:00`
- **Label spacing**: ~2 weeks between labels
- **Label count**: ~6 visible
- **Candle width**: moderate density, slightly wider than 15M

### 4H (4-hour candles)
- **Time span**: ~5 months (Oct → Feb)
- **X-axis format**: `M/D H:MM` — e.g. `11/17 15:00`, `12/11 15:00`, `1/7 15:00`
- **Label spacing**: ~3–4 weeks between labels
- **Label count**: ~5 visible
- **Candle width**: wider body, moderate density

### 1D (daily candles)
- **Time span**: ~13 months (Mar Y1 → Mar Y2)
- **X-axis format**: `M/D 0:00` (effectively date-only) — e.g. `4/1 0:00`, `6/12 0:00`, `8/25 0:00`
- **Label spacing**: ~2 months between labels
- **Label count**: ~6 visible
- **Candle width**: clearly visible individual bodies, well-spaced

### 1W (weekly candles)
- **Time span**: ~2 years
- **X-axis format**: `M/DD 0:00` (effectively date-only) — e.g. `7/29 0:00`, `11/25 0:00`, `3/24 0:00`
- **Label spacing**: ~4 months between labels
- **Label count**: ~6 visible
- **Candle width**: widest bodies, fewest candles visible

---

## X-Axis Pattern Summary

| Timeframe | Span | Format | Label Spacing | Labels |
|-----------|------|--------|---------------|--------|
| 15M | ~2 weeks | `M/D H:MM` | ~2 days | ~5 |
| 1H | ~2.5 months | `M/D H:MM` | ~2 weeks | ~6 |
| 4H | ~5 months | `M/D H:MM` | ~3–4 weeks | ~5 |
| 1D | ~13 months | `M/D` (date only) | ~2 months | ~6 |
| 1W | ~2 years | `M/DD` (date only) | ~4 months | ~6 |

**Key insight**: Every timeframe shows ~5–6 x-axis labels regardless of span. The format includes a time component (`H:MM`) for intraday, and drops it for daily/weekly.

---

## Y-Axis Behavior

- Always positioned on the **right side**
- Shows **~5–6 price levels** with horizontal dashed grid lines
- **Auto-fits** to visible price range with padding (~6% above and below)
- Current price shown as a **dashed horizontal line** with a colored price badge on the right edge
- Price labels use **2 decimal places**

---

## Candle Behavior

- Visual density remains **consistent** across timeframes — roughly the same number of candles appear regardless of span
- Candle width is **inversely proportional** to candle count
- Each candle has: a rectangular body (OHLC) + a wick line (high–low)
- **Bullish**: green `rgba(101, 222, 164, 0.9)` body, lighter green wick
- **Bearish**: red `rgba(255, 109, 117, 0.88)` body, lighter red wick
- Wick is always thinner and more transparent than the body

---

## Consistent Visual Patterns

- ~5–6 x-axis labels shown on **every** timeframe
- Dark background `#0d0f18` across all timeframes
- Dashed horizontal grid lines (y-axis), subtle vertical guides
- Current price always marked with dashed line + badge
- Candle width auto-adapts (smaller slot → narrower candle, clamped to minimum)

---

## Implications for Deep-Value (Daily-Candle Chart)

Deep-value uses **daily candles only**. The reference timeframe is 1D. Applying the pattern to value investor timeframes:

| Deep-Value Range | Data Points | Recommended X-Label Format | Spacing |
|-----------------|-------------|---------------------------|---------|
| 1Y | ~252 | `M/D` (e.g. `3/28`, `6/30`) | ~bi-monthly |
| 3Y | ~756 | `MMM 'YY` (e.g. `Mar '24`) | ~quarterly |
| 5Y | ~1260 | `MMM 'YY` (e.g. `Jun '22`) | ~semi-annual |
| 10Y | ~2520 | `YYYY` (e.g. `2020`) | ~yearly |
| MAX | all data | `YYYY` (e.g. `2018`) | ~2-year intervals |

**Candle width**: the current clamp formula `clamp(slot * 0.28, 1.5, 4)` handles auto-shrinking. At 10Y (2520 candles), candles render at minimum width (1.5px), creating a dense area-chart-like visual — acceptable for long-range views.

**Y-axis**: always auto-fit to visible period with ~6% padding. No change needed across timeframes.
