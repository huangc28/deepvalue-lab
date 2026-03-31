package stocks

import (
	"encoding/json"
	"testing"

	"github.com/huangchihan/deepvalue-lab-be/lib/pkg/massive"
)

func TestBuildTechnicalPriceChartPayloadPhase2OneDAndOneW(t *testing.T) {
	job := TechnicalSnapshotJob{
		Ticker:        "TSM",
		ReportID:      "r1",
		PublishedAtMs: 1742860800000,
	}
	bars := []massive.Bar{
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

	weeklyBars := aggregateWeeklyBars(bars)
	payload := buildTechnicalPriceChartPayload(job, bars, weeklyBars)

	if payload.DefaultTimeframe != ChartTimeframe1D {
		t.Fatalf("expected default timeframe %q, got %q", ChartTimeframe1D, payload.DefaultTimeframe)
	}
	if len(payload.AvailableTimeframes) != 2 || payload.AvailableTimeframes[0] != ChartTimeframe1D || payload.AvailableTimeframes[1] != ChartTimeframe1W {
		t.Fatalf("unexpected available timeframes: %#v", payload.AvailableTimeframes)
	}

	series, ok := payload.SeriesByTimeframe[ChartTimeframe1D]
	if !ok {
		t.Fatalf("expected 1D series to be present")
	}
	if series.Timeframe != ChartTimeframe1D {
		t.Fatalf("expected timeframe %q, got %q", ChartTimeframe1D, series.Timeframe)
	}
	if series.Timezone != technicalChartTimezone {
		t.Fatalf("expected timezone %q, got %q", technicalChartTimezone, series.Timezone)
	}
	if series.SessionMode != SessionModeMarketHours {
		t.Fatalf("expected session mode %q, got %q", SessionModeMarketHours, series.SessionMode)
	}
	if series.LookbackLabel != technicalChartLookback {
		t.Fatalf("expected lookback label %q, got %q", technicalChartLookback, series.LookbackLabel)
	}
	if len(series.Points) != len(bars) {
		t.Fatalf("expected %d ohlc points, got %d", len(bars), len(series.Points))
	}

	weeklySeries, ok := payload.SeriesByTimeframe[ChartTimeframe1W]
	if !ok {
		t.Fatalf("expected 1W series to be present")
	}
	if weeklySeries.Timeframe != ChartTimeframe1W {
		t.Fatalf("expected weekly timeframe %q, got %q", ChartTimeframe1W, weeklySeries.Timeframe)
	}
	if weeklySeries.Timezone != technicalChartTimezone {
		t.Fatalf("expected weekly timezone %q, got %q", technicalChartTimezone, weeklySeries.Timezone)
	}
	if weeklySeries.SessionMode != SessionModeMarketHours {
		t.Fatalf("expected weekly session mode %q, got %q", SessionModeMarketHours, weeklySeries.SessionMode)
	}
	if weeklySeries.LookbackLabel != "1W" {
		t.Fatalf("expected weekly lookback label %q, got %q", "1W", weeklySeries.LookbackLabel)
	}
	if len(weeklySeries.Points) != 2 {
		t.Fatalf("expected 2 weekly ohlc points, got %d", len(weeklySeries.Points))
	}

	first := series.Points[0]
	if first.TimestampUtc != "2026-03-23T20:00:00Z" {
		t.Fatalf("unexpected timestampUtc: %q", first.TimestampUtc)
	}
	if first.ExchangeTimestamp != "2026-03-23T16:00:00-04:00" {
		t.Fatalf("unexpected exchangeTimestamp: %q", first.ExchangeTimestamp)
	}
	if first.Open != 100 || first.High != 105 || first.Low != 98 || first.Close != 104 {
		t.Fatalf("unexpected ohlc point: %+v", first)
	}

	firstWeekly := weeklySeries.Points[0]
	if firstWeekly.TimestampUtc != "2026-03-27T20:00:00Z" {
		t.Fatalf("unexpected weekly timestampUtc: %q", firstWeekly.TimestampUtc)
	}
	if firstWeekly.ExchangeTimestamp != "2026-03-27T16:00:00-04:00" {
		t.Fatalf("unexpected weekly exchangeTimestamp: %q", firstWeekly.ExchangeTimestamp)
	}
	if firstWeekly.Open != 100 || firstWeekly.High != 115 || firstWeekly.Low != 98 || firstWeekly.Close != 114 {
		t.Fatalf("unexpected weekly ohlc point: %+v", firstWeekly)
	}
	if firstWeekly.Volume != 6000000 {
		t.Fatalf("unexpected weekly volume: %v", firstWeekly.Volume)
	}

	if payload.Indicators.RSIStatus != "neutral" {
		t.Fatalf("expected neutral indicator status, got %q", payload.Indicators.RSIStatus)
	}
	if payload.Latest.RSIStatus != payload.Indicators.RSIStatus {
		t.Fatalf("expected legacy latest summary to match indicators")
	}
	if len(payload.Points) != len(bars) {
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
			Timeframe     string `json:"timeframe"`
			Timezone      string `json:"timezone"`
			SessionMode   string `json:"sessionMode"`
			LookbackLabel string `json:"lookbackLabel"`
			Points        []struct {
				TimestampUtc      string  `json:"timestampUtc"`
				ExchangeTimestamp string  `json:"exchangeTimestamp"`
				Open              float64 `json:"open"`
				High              float64 `json:"high"`
				Low               float64 `json:"low"`
				Close             float64 `json:"close"`
				Volume            float64 `json:"volume"`
			} `json:"points"`
		} `json:"seriesByTimeframe"`
		Indicators struct {
			RSI       float64 `json:"rsi"`
			EMAOnRSI  float64 `json:"emaOnRsi"`
			RSIStatus string  `json:"rsiStatus"`
		} `json:"indicators"`
	}

	if err := json.Unmarshal(raw, &wire); err != nil {
		t.Fatalf("unmarshal payload: %v", err)
	}
	if wire.DefaultTimeframe != "1D" {
		t.Fatalf("expected wire default timeframe 1D, got %q", wire.DefaultTimeframe)
	}
	if len(wire.AvailableTimeframes) != 2 || wire.AvailableTimeframes[0] != "1D" || wire.AvailableTimeframes[1] != "1W" {
		t.Fatalf("unexpected wire available timeframes: %#v", wire.AvailableTimeframes)
	}
	if wire.SeriesByTimeframe["1D"].Timeframe != "1D" {
		t.Fatalf("expected wire series timeframe 1D, got %q", wire.SeriesByTimeframe["1D"].Timeframe)
	}
	if wire.SeriesByTimeframe["1D"].Points[0].TimestampUtc != "2026-03-23T20:00:00Z" {
		t.Fatalf("unexpected wire timestampUtc: %q", wire.SeriesByTimeframe["1D"].Points[0].TimestampUtc)
	}
	if wire.SeriesByTimeframe["1W"].Timeframe != "1W" {
		t.Fatalf("expected wire weekly timeframe 1W, got %q", wire.SeriesByTimeframe["1W"].Timeframe)
	}
	if wire.SeriesByTimeframe["1W"].Points[0].TimestampUtc != "2026-03-27T20:00:00Z" {
		t.Fatalf("unexpected wire weekly timestampUtc: %q", wire.SeriesByTimeframe["1W"].Points[0].TimestampUtc)
	}
}
