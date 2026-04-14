# MRC Fixture Directory

## Purpose

This directory holds fixture data used to verify parity between the DeepValue Lab MRC
implementation and the canonical TradingView MRC indicator.

Fixtures are the Phase 0 exit gate: implementation may not claim TradingView alignment
until at least one daily and one weekly fixture set is committed here and passes parity
tests within the documented tolerances.

## Status

| Item | Status |
|---|---|
| Parameter table frozen | DONE (see spec-freeze.md) |
| Provisional algorithm documented | DONE (see spec-freeze.md) |
| Representative ticker chosen | PENDING — user to confirm |
| TradingView script URL/title | OBSERVED IN LIVE TRADINGVIEW LAYOUT (2026-04-14) — see spec-freeze.md |
| Screenshot artifact committed | DONE — see `screenshots/tradingview-sndk-1d-2026-04-14.png` and `screenshots/tradingview-sndk-1w-2026-04-14.png` |
| Daily fixture data | PENDING — user to capture from TradingView |
| Weekly fixture data | PENDING — user to capture from TradingView |
| Tolerance table confirmed | DONE (see spec-freeze.md) |

## Phase 0 exit criteria checklist

- [x] Exact TradingView script title and capture date documented in spec-freeze.md
- [x] Screenshot artifact path noted
- [ ] Exact TradingView script URL documented
- [ ] Representative ticker chosen and written into spec-freeze.md
- [ ] Daily fixture file committed (see format below)
- [ ] Weekly fixture file committed (see format below)
- [x] At least one visual comparison artifact captured from live TradingView

## Fixture file format

Each fixture is a JSON file with the following shape:

```json
{
  "meta": {
    "ticker": "AAPL",
    "timeframe": "1D",
    "source": "tradingview-manual-capture",
    "captureDate": "2026-04-11",
    "scriptTitle": "<TradingView script title>",
    "scriptUrl": "<TradingView script URL or 'built-in'>",
    "parameters": {
      "source": "hlc3",
      "smoother": "SuperSmoother",
      "length": 200,
      "innerMultiplier": 1.0,
      "outerMultiplier": 2.415
    }
  },
  "points": [
    {
      "date": "2026-03-28",
      "open": 0.00,
      "high": 0.00,
      "low": 0.00,
      "close": 0.00,
      "center": 0.00,
      "innerUpper": 0.00,
      "innerLower": 0.00,
      "outerUpper": 0.00,
      "outerLower": 0.00
    }
  ]
}
```

### Requirements for fixture points
- Must include the latest 30 fully-warmed points minimum (i.e., all five band values non-null).
- Dates must be completed trading days/weeks (no partial candles).
- For weekly fixtures, `date` is the week's Friday close date.
- Values should be copied from TradingView's data table or tooltip at full precision (do not round to 2dp).

## Fixture file naming convention

```
<TICKER>-daily-fixture.json
<TICKER>-weekly-fixture.json
```

Examples:
- `AAPL-daily-fixture.json`
- `AAPL-weekly-fixture.json`

## Capture method

1. Open TradingView with the canonical MRC indicator loaded.
2. Navigate to the chosen ticker on the 1D timeframe.
3. Use the TradingView data table (right-click chart > Add Data Table) to export or copy the indicator values.
4. Alternatively, hover over each bar and record the tooltip values for the last 30+ warmed bars.
5. Paste into the JSON fixture format above.
6. Repeat for 1W timeframe.
7. Note the script title, URL, and parameters used in the `meta` block.

## Parity tolerances

See `spec-freeze.md` for the agreed tolerance table.
