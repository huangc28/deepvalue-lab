package stocks

import (
	"encoding/json"
	"testing"

	"github.com/huangchihan/deepvalue-lab-be/lib/pkg/massive"
)

func TestBuildTechnicalPriceChartPayloadPhase1OneD(t *testing.T) {
	job := TechnicalSnapshotJob{
		Ticker:        "TSM",
		ReportID:      "r1",
		PublishedAtMs: 1742860800000,
	}
	bars := []massive.Bar{
		{
			Date:   "2026-03-24",
			Open:   100,
			High:   105,
			Low:    98,
			Close:  104,
			Volume: 1200000,
		},
		{
			Date:   "2026-03-25",
			Open:   104,
			High:   108,
			Low:    101,
			Close:  107,
			Volume: 1500000,
		},
	}

	payload := buildTechnicalPriceChartPayload(job, bars)

	if payload.DefaultTimeframe != ChartTimeframe1D {
		t.Fatalf("expected default timeframe %q, got %q", ChartTimeframe1D, payload.DefaultTimeframe)
	}
	if len(payload.AvailableTimeframes) != 1 || payload.AvailableTimeframes[0] != ChartTimeframe1D {
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

	first := series.Points[0]
	if first.TimestampUtc != "2026-03-24T20:00:00Z" {
		t.Fatalf("unexpected timestampUtc: %q", first.TimestampUtc)
	}
	if first.ExchangeTimestamp != "2026-03-24T16:00:00-04:00" {
		t.Fatalf("unexpected exchangeTimestamp: %q", first.ExchangeTimestamp)
	}
	if first.Open != 100 || first.High != 105 || first.Low != 98 || first.Close != 104 {
		t.Fatalf("unexpected ohlc point: %+v", first)
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
	if len(wire.AvailableTimeframes) != 1 || wire.AvailableTimeframes[0] != "1D" {
		t.Fatalf("unexpected wire available timeframes: %#v", wire.AvailableTimeframes)
	}
	if wire.SeriesByTimeframe["1D"].Timeframe != "1D" {
		t.Fatalf("expected wire series timeframe 1D, got %q", wire.SeriesByTimeframe["1D"].Timeframe)
	}
	if wire.SeriesByTimeframe["1D"].Points[0].TimestampUtc != "2026-03-24T20:00:00Z" {
		t.Fatalf("unexpected wire timestampUtc: %q", wire.SeriesByTimeframe["1D"].Points[0].TimestampUtc)
	}
}
