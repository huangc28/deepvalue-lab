package stocks

import (
	"encoding/json"
	"testing"
	"time"

	"github.com/huangchihan/deepvalue-lab-be/lib/pkg/massive"
)

func TestBuildTechnicalPriceChartPayloadPhase3IntradayAndWeekly(t *testing.T) {
	job := TechnicalSnapshotJob{
		Ticker:        "TSM",
		ReportID:      "r1",
		PublishedAtMs: 1742860800000,
	}

	dailyBars := []massive.Bar{
		{
			Date:   "2026-03-23",
			Open:   100,
			High:   105,
			Low:    98,
			Close:  104,
			Volume: 1200000,
		},
		{
			Date:   "2026-03-24",
			Open:   104,
			High:   108,
			Low:    101,
			Close:  107,
			Volume: 1500000,
		},
		{
			Date:   "2026-03-25",
			Open:   107,
			High:   110,
			Low:    103,
			Close:  109,
			Volume: 900000,
		},
		{
			Date:   "2026-03-26",
			Open:   109,
			High:   112,
			Low:    108,
			Close:  111,
			Volume: 1100000,
		},
		{
			Date:   "2026-03-27",
			Open:   111,
			High:   115,
			Low:    110,
			Close:  114,
			Volume: 1300000,
		},
		{
			Date:   "2026-03-30",
			Open:   115,
			High:   118,
			Low:    113,
			Close:  117,
			Volume: 1400000,
		},
	}

	intradayBars := buildIntradayBarsForTest(t)
	weeklyBars := aggregateWeeklyBars(dailyBars)
	payload := buildTechnicalPriceChartPayload(job, dailyBars, intradayBars, weeklyBars)

	if payload.DefaultTimeframe != ChartTimeframe1D {
		t.Fatalf("expected default timeframe %q, got %q", ChartTimeframe1D, payload.DefaultTimeframe)
	}

	expectedOrder := []ChartTimeframe{
		ChartTimeframe15M,
		ChartTimeframe1H,
		ChartTimeframe4H,
		ChartTimeframe1D,
		ChartTimeframe1W,
	}
	if len(payload.AvailableTimeframes) != len(expectedOrder) {
		t.Fatalf("unexpected available timeframes: %#v", payload.AvailableTimeframes)
	}
	for index, timeframe := range expectedOrder {
		if payload.AvailableTimeframes[index] != timeframe {
			t.Fatalf("unexpected timeframe order at %d: want %q got %q", index, timeframe, payload.AvailableTimeframes[index])
		}
	}

	series15m := payload.SeriesByTimeframe[ChartTimeframe15M]
	if series15m.Timeframe != ChartTimeframe15M {
		t.Fatalf("expected 15M timeframe %q, got %q", ChartTimeframe15M, series15m.Timeframe)
	}
	if series15m.SessionMode != SessionModeMarketHours {
		t.Fatalf("expected 15M session mode %q, got %q", SessionModeMarketHours, series15m.SessionMode)
	}
	if len(series15m.Points) != 26 {
		t.Fatalf("expected 26 regular-hours 15M bars, got %d", len(series15m.Points))
	}

	first15m := series15m.Points[0]
	if first15m.TimestampUtc != "2026-03-24T13:30:00Z" {
		t.Fatalf("unexpected 15M timestampUtc: %q", first15m.TimestampUtc)
	}
	if first15m.ExchangeTimestamp != "2026-03-24T09:30:00-04:00" {
		t.Fatalf("unexpected 15M exchangeTimestamp: %q", first15m.ExchangeTimestamp)
	}

	series1h := payload.SeriesByTimeframe[ChartTimeframe1H]
	if series1h.Timeframe != ChartTimeframe1H {
		t.Fatalf("expected 1H timeframe %q, got %q", ChartTimeframe1H, series1h.Timeframe)
	}
	if len(series1h.Points) != 7 {
		t.Fatalf("expected 7 hourly bars, got %d", len(series1h.Points))
	}
	first1h := series1h.Points[0]
	if first1h.TimestampUtc != "2026-03-24T13:30:00Z" {
		t.Fatalf("unexpected 1H timestampUtc: %q", first1h.TimestampUtc)
	}
	if first1h.Open != 106 || first1h.High != 110.25 || first1h.Low != 105.75 || first1h.Close != 110 {
		t.Fatalf("unexpected 1H aggregation result: %+v", first1h)
	}
	if first1h.Volume != 400 {
		t.Fatalf("unexpected 1H volume: %v", first1h.Volume)
	}

	series4h := payload.SeriesByTimeframe[ChartTimeframe4H]
	if series4h.Timeframe != ChartTimeframe4H {
		t.Fatalf("expected 4H timeframe %q, got %q", ChartTimeframe4H, series4h.Timeframe)
	}
	if len(series4h.Points) != 2 {
		t.Fatalf("expected 2 four-hour bars, got %d", len(series4h.Points))
	}
	first4h := series4h.Points[0]
	if first4h.TimestampUtc != "2026-03-24T13:30:00Z" {
		t.Fatalf("unexpected 4H timestampUtc: %q", first4h.TimestampUtc)
	}
	if first4h.Open != 106 || first4h.High != 122.25 || first4h.Low != 105.75 || first4h.Close != 122 {
		t.Fatalf("unexpected 4H aggregation result: %+v", first4h)
	}
	if first4h.Volume != 1600 {
		t.Fatalf("unexpected 4H volume: %v", first4h.Volume)
	}

	series1d, ok := payload.SeriesByTimeframe[ChartTimeframe1D]
	if !ok {
		t.Fatalf("expected 1D series to be present")
	}
	if series1d.Timezone != technicalChartTimezone {
		t.Fatalf("expected 1D timezone %q, got %q", technicalChartTimezone, series1d.Timezone)
	}
	if series1d.LookbackLabel != technicalChartLookback {
		t.Fatalf("expected 1D lookback label %q, got %q", technicalChartLookback, series1d.LookbackLabel)
	}
	if len(series1d.Points) != len(dailyBars) {
		t.Fatalf("expected %d daily points, got %d", len(dailyBars), len(series1d.Points))
	}
	if series1d.Points[0].TimestampUtc != "2026-03-23T20:00:00Z" {
		t.Fatalf("unexpected 1D timestampUtc: %q", series1d.Points[0].TimestampUtc)
	}

	series1w, ok := payload.SeriesByTimeframe[ChartTimeframe1W]
	if !ok {
		t.Fatalf("expected 1W series to be present")
	}
	if series1w.Timeframe != ChartTimeframe1W {
		t.Fatalf("expected 1W timeframe %q, got %q", ChartTimeframe1W, series1w.Timeframe)
	}
	if len(series1w.Points) != 2 {
		t.Fatalf("expected 2 weekly bars, got %d", len(series1w.Points))
	}
	if series1w.Points[0].TimestampUtc != "2026-03-27T20:00:00Z" {
		t.Fatalf("unexpected 1W timestampUtc: %q", series1w.Points[0].TimestampUtc)
	}

	if payload.Indicators.RSIStatus != "neutral" {
		t.Fatalf("expected neutral indicator status, got %q", payload.Indicators.RSIStatus)
	}
	if payload.Latest.RSIStatus != payload.Indicators.RSIStatus {
		t.Fatalf("expected legacy latest summary to match indicators")
	}
	if len(payload.Points) != len(dailyBars) {
		t.Fatalf("expected legacy points to be preserved")
	}

	raw, err := json.Marshal(payload)
	if err != nil {
		t.Fatalf("marshal payload: %v", err)
	}

	var wire struct {
		DefaultTimeframe    string   `json:"defaultTimeframe"`
		AvailableTimeframes []string `json:"availableTimeframes"`
		SeriesByTimeframe   map[string]struct {
			Timeframe string `json:"timeframe"`
			Points    []struct {
				TimestampUtc string  `json:"timestampUtc"`
				Open         float64 `json:"open"`
				High         float64 `json:"high"`
				Low          float64 `json:"low"`
				Close        float64 `json:"close"`
				Volume       float64 `json:"volume"`
			} `json:"points"`
		} `json:"seriesByTimeframe"`
	}

	if err := json.Unmarshal(raw, &wire); err != nil {
		t.Fatalf("unmarshal payload: %v", err)
	}
	if wire.DefaultTimeframe != "1D" {
		t.Fatalf("expected wire default timeframe 1D, got %q", wire.DefaultTimeframe)
	}
	for index, timeframe := range []string{"15M", "1H", "4H", "1D", "1W"} {
		if wire.AvailableTimeframes[index] != timeframe {
			t.Fatalf("unexpected wire timeframe order at %d: want %q got %q", index, timeframe, wire.AvailableTimeframes[index])
		}
	}
	if wire.SeriesByTimeframe["15M"].Timeframe != "15M" {
		t.Fatalf("expected wire 15M timeframe, got %q", wire.SeriesByTimeframe["15M"].Timeframe)
	}
	if wire.SeriesByTimeframe["1H"].Points[0].TimestampUtc != "2026-03-24T13:30:00Z" {
		t.Fatalf("unexpected wire 1H timestampUtc: %q", wire.SeriesByTimeframe["1H"].Points[0].TimestampUtc)
	}
	if wire.SeriesByTimeframe["4H"].Points[0].TimestampUtc != "2026-03-24T13:30:00Z" {
		t.Fatalf("unexpected wire 4H timestampUtc: %q", wire.SeriesByTimeframe["4H"].Points[0].TimestampUtc)
	}
}

func buildIntradayBarsForTest(t *testing.T) []massive.Bar {
	t.Helper()

	location := technicalChartLocation
	start := time.Date(2026, 3, 24, 8, 0, 0, 0, location)
	end := time.Date(2026, 3, 24, 16, 15, 0, 0, location)
	bars := make([]massive.Bar, 0, 40)
	price := 100.0

	for cursor := start; !cursor.After(end); cursor = cursor.Add(15 * time.Minute) {
		open := price
		close := price + 1
		bar := massive.Bar{
			TimestampMs: cursor.UTC().UnixMilli(),
			Date:        cursor.Format("2006-01-02"),
			Open:        open,
			High:        close + 0.25,
			Low:         open - 0.25,
			Close:       close,
			Volume:      100,
		}
		bars = append(bars, bar)
		price += 1
	}

	return bars
}
