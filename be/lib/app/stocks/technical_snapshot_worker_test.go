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

func TestTimeframeSeriesPointsCarryRSI(t *testing.T) {
	job := TechnicalSnapshotJob{
		Ticker:        "RSI",
		ReportID:      "rsi-test",
		PublishedAtMs: 1742860800000,
	}

	dailyBars := []massive.Bar{
		{Date: "2026-03-23", Open: 100, High: 105, Low: 98, Close: 104, Volume: 1_200_000},
		{Date: "2026-03-24", Open: 104, High: 108, Low: 101, Close: 107, Volume: 1_500_000},
		{Date: "2026-03-25", Open: 107, High: 110, Low: 103, Close: 109, Volume: 900_000},
		{Date: "2026-03-26", Open: 109, High: 112, Low: 108, Close: 111, Volume: 1_100_000},
		{Date: "2026-03-27", Open: 111, High: 115, Low: 110, Close: 114, Volume: 1_300_000},
		{Date: "2026-03-30", Open: 115, High: 118, Low: 113, Close: 117, Volume: 1_400_000},
	}

	// 26 regular-session 15M bars — RSI(22) has 4 valid values (indices 22-25), EMA(12) needs 12 so all nil.
	intradayBars := buildIntradayBarsForTest(t)
	weeklyBars := aggregateWeeklyBars(dailyBars)
	payload := buildTechnicalPriceChartPayload(job, dailyBars, intradayBars, weeklyBars)

	// 1D: 6 bars — all RSI nil (below RSI(22) warmup threshold).
	series1d := payload.SeriesByTimeframe[ChartTimeframe1D]
	for i, p := range series1d.Points {
		if p.RSI != nil {
			t.Fatalf("1D[%d]: expected nil RSI during warmup, got %v", i, *p.RSI)
		}
		if p.EMAOnRSI != nil {
			t.Fatalf("1D[%d]: expected nil EMAOnRSI during warmup, got %v", i, *p.EMAOnRSI)
		}
	}

	// 15M: 26 bars — RSI nil for indices 0-21, non-nil for 22-25.
	series15m := payload.SeriesByTimeframe[ChartTimeframe15M]
	if len(series15m.Points) != 26 {
		t.Fatalf("expected 26 15M points, got %d", len(series15m.Points))
	}
	for i := 0; i < 22; i++ {
		if series15m.Points[i].RSI != nil {
			t.Fatalf("15M[%d]: expected nil RSI (warmup), got %v", i, *series15m.Points[i].RSI)
		}
	}
	for i := 22; i < 26; i++ {
		p := series15m.Points[i]
		if p.RSI == nil {
			t.Fatalf("15M[%d]: expected non-nil RSI after warmup", i)
		}
		if *p.RSI < 0 || *p.RSI > 100 {
			t.Fatalf("15M[%d]: RSI %v out of [0,100]", i, *p.RSI)
		}
		// Only 4 valid RSI values — not enough to seed EMA(12), must stay nil.
		if p.EMAOnRSI != nil {
			t.Fatalf("15M[%d]: expected nil EMAOnRSI (insufficient RSI history), got %v", i, *p.EMAOnRSI)
		}
	}

	// Verify RSI values appear in the JSON wire format for 15M.
	raw, err := json.Marshal(payload)
	if err != nil {
		t.Fatalf("marshal payload: %v", err)
	}
	var wire struct {
		SeriesByTimeframe map[string]struct {
			Points []struct {
				RSI      *float64 `json:"rsi"`
				EMAOnRSI *float64 `json:"emaOnRsi"`
			} `json:"points"`
		} `json:"seriesByTimeframe"`
	}
	if err := json.Unmarshal(raw, &wire); err != nil {
		t.Fatalf("unmarshal wire: %v", err)
	}
	pts15m := wire.SeriesByTimeframe["15M"].Points
	if len(pts15m) != 26 {
		t.Fatalf("wire 15M: expected 26 points, got %d", len(pts15m))
	}
	for i := 0; i < 22; i++ {
		if pts15m[i].RSI != nil {
			t.Fatalf("wire 15M[%d]: expected omitted rsi, got %v", i, *pts15m[i].RSI)
		}
	}
	for i := 22; i < 26; i++ {
		if pts15m[i].RSI == nil {
			t.Fatalf("wire 15M[%d]: expected rsi present in JSON", i)
		}
	}
}

func TestTimeframeSeriesEMAAppearsWithSufficientHistory(t *testing.T) {
	job := TechnicalSnapshotJob{
		Ticker:        "EMA",
		ReportID:      "ema-test",
		PublishedAtMs: 1742860800000,
	}

	// 2 full trading days of 15M bars → 52 regular-session bars.
	// RSI(22) first valid at index 22; EMA(12) seeds at index 33, valid from 33 onward.
	intradayBars := buildMultiDayIntradayBarsForTest(t, 2)
	payload := buildTechnicalPriceChartPayload(job, nil, intradayBars, nil)

	series15m := payload.SeriesByTimeframe[ChartTimeframe15M]
	if len(series15m.Points) < 34 {
		t.Fatalf("expected ≥34 15M points for EMA validation, got %d", len(series15m.Points))
	}

	// Index 33 is the first EMA seed — must be non-nil.
	if series15m.Points[33].EMAOnRSI == nil {
		t.Fatalf("15M[33]: expected non-nil EMAOnRSI at EMA seed point")
	}
	// Everything after must also be non-nil.
	for i := 33; i < len(series15m.Points); i++ {
		p := series15m.Points[i]
		if p.EMAOnRSI == nil {
			t.Fatalf("15M[%d]: expected non-nil EMAOnRSI after seed, got nil", i)
		}
		if *p.EMAOnRSI < 0 || *p.EMAOnRSI > 100 {
			t.Fatalf("15M[%d]: EMAOnRSI %v out of [0,100]", i, *p.EMAOnRSI)
		}
	}
}

// TestTimeframeRSIWarmupOmissionShortSeries verifies that per-timeframe RSI and
// EMAOnRSI are nil (omitted from JSON) for every timeframe whose bar count is
// below the RSI(22) warmup threshold. The single-day fixture produces:
//
//	1H → 7 bars, 4H → 2 bars, 1W → 2 bars, 1D → 6 bars — all under threshold.
func TestTimeframeRSIWarmupOmissionShortSeries(t *testing.T) {
	job := TechnicalSnapshotJob{
		Ticker:        "WARM",
		ReportID:      "warmup-omission",
		PublishedAtMs: 1742860800000,
	}

	dailyBars := []massive.Bar{
		{Date: "2026-03-23", Open: 100, High: 105, Low: 98, Close: 104, Volume: 1_200_000},
		{Date: "2026-03-24", Open: 104, High: 108, Low: 101, Close: 107, Volume: 1_500_000},
		{Date: "2026-03-25", Open: 107, High: 110, Low: 103, Close: 109, Volume: 900_000},
		{Date: "2026-03-26", Open: 109, High: 112, Low: 108, Close: 111, Volume: 1_100_000},
		{Date: "2026-03-27", Open: 111, High: 115, Low: 110, Close: 114, Volume: 1_300_000},
		{Date: "2026-03-30", Open: 115, High: 118, Low: 113, Close: 117, Volume: 1_400_000},
	}
	intradayBars := buildIntradayBarsForTest(t)
	weeklyBars := aggregateWeeklyBars(dailyBars)
	payload := buildTechnicalPriceChartPayload(job, dailyBars, intradayBars, weeklyBars)

	type caseSpec struct {
		tf       ChartTimeframe
		wantLen  int
	}
	// All four short timeframes must have fully nil RSI and EMAOnRSI.
	cases := []caseSpec{
		{ChartTimeframe1H, 7},
		{ChartTimeframe4H, 2},
		{ChartTimeframe1W, 2},
		{ChartTimeframe1D, 6},
	}

	for _, tc := range cases {
		series, ok := payload.SeriesByTimeframe[tc.tf]
		if !ok {
			t.Fatalf("%s: series missing from payload", tc.tf)
		}
		if len(series.Points) != tc.wantLen {
			t.Fatalf("%s: expected %d points, got %d", tc.tf, tc.wantLen, len(series.Points))
		}
		for i, p := range series.Points {
			if p.RSI != nil {
				t.Fatalf("%s[%d]: expected nil RSI during warmup, got %v", tc.tf, i, *p.RSI)
			}
			if p.EMAOnRSI != nil {
				t.Fatalf("%s[%d]: expected nil EMAOnRSI during warmup, got %v", tc.tf, i, *p.EMAOnRSI)
			}
		}
	}

	// Wire format: rsi and emaOnRsi must be absent (omitempty), not null.
	raw, err := json.Marshal(payload)
	if err != nil {
		t.Fatalf("marshal payload: %v", err)
	}
	var wire struct {
		SeriesByTimeframe map[string]struct {
			Points []struct {
				RSI      *float64 `json:"rsi"`
				EMAOnRSI *float64 `json:"emaOnRsi"`
			} `json:"points"`
		} `json:"seriesByTimeframe"`
	}
	if err := json.Unmarshal(raw, &wire); err != nil {
		t.Fatalf("unmarshal wire: %v", err)
	}
	for _, tf := range []string{"1H", "4H", "1W", "1D"} {
		for i, p := range wire.SeriesByTimeframe[tf].Points {
			if p.RSI != nil {
				t.Fatalf("wire %s[%d]: expected rsi omitted, got %v", tf, i, *p.RSI)
			}
			if p.EMAOnRSI != nil {
				t.Fatalf("wire %s[%d]: expected emaOnRsi omitted, got %v", tf, i, *p.EMAOnRSI)
			}
		}
	}
}

// TestSnapshotVersionIsV2 verifies the top-level snapshotVersion field is set.
func TestSnapshotVersionIsV2(t *testing.T) {
	job := TechnicalSnapshotJob{Ticker: "VER", ReportID: "v2", PublishedAtMs: 1742860800000}
	dailyBars := []massive.Bar{
		{Date: "2026-03-23", Open: 100, High: 105, Low: 98, Close: 104, Volume: 1_000_000},
	}
	payload := buildTechnicalPriceChartPayload(job, dailyBars, nil, nil)
	if payload.SnapshotVersion != SnapshotVersion {
		t.Errorf("snapshotVersion: got %q, want %q", payload.SnapshotVersion, SnapshotVersion)
	}

	// Verify it appears in the wire format.
	raw, err := json.Marshal(payload)
	if err != nil {
		t.Fatalf("marshal: %v", err)
	}
	var wire struct {
		SnapshotVersion string `json:"snapshotVersion"`
	}
	if err := json.Unmarshal(raw, &wire); err != nil {
		t.Fatalf("unmarshal: %v", err)
	}
	if wire.SnapshotVersion != SnapshotVersion {
		t.Errorf("wire snapshotVersion: got %q, want %q", wire.SnapshotVersion, SnapshotVersion)
	}
}

// TestMRCMetaPresentOnDailyAndWeeklyOnly verifies that MRCMeta is set on 1D and 1W series
// but not on intraday timeframes.
func TestMRCMetaPresentOnDailyAndWeeklyOnly(t *testing.T) {
	job := TechnicalSnapshotJob{Ticker: "META", ReportID: "meta-test", PublishedAtMs: 1742860800000}
	dailyBars := []massive.Bar{
		{Date: "2026-03-23", Open: 100, High: 105, Low: 98, Close: 104, Volume: 1_200_000},
		{Date: "2026-03-24", Open: 104, High: 108, Low: 101, Close: 107, Volume: 1_500_000},
		{Date: "2026-03-25", Open: 107, High: 110, Low: 103, Close: 109, Volume: 900_000},
		{Date: "2026-03-26", Open: 109, High: 112, Low: 108, Close: 111, Volume: 1_100_000},
		{Date: "2026-03-27", Open: 111, High: 115, Low: 110, Close: 114, Volume: 1_300_000},
		{Date: "2026-03-30", Open: 115, High: 118, Low: 113, Close: 117, Volume: 1_400_000},
	}
	intradayBars := buildIntradayBarsForTest(t)
	weeklyBars := aggregateWeeklyBars(dailyBars)
	payload := buildTechnicalPriceChartPayload(job, dailyBars, intradayBars, weeklyBars)

	// 1D and 1W must have MRCMeta.
	for _, tf := range []ChartTimeframe{ChartTimeframe1D, ChartTimeframe1W} {
		s := payload.SeriesByTimeframe[tf]
		if s.MRCMeta == nil {
			t.Errorf("%s: expected MRCMeta to be set, got nil", tf)
			continue
		}
		if s.MRCMeta.AlgorithmVersion != MRCAlgorithmVersion {
			t.Errorf("%s: MRCMeta.AlgorithmVersion = %q, want %q", tf, s.MRCMeta.AlgorithmVersion, MRCAlgorithmVersion)
		}
		if s.MRCMeta.Source != "hlc3" {
			t.Errorf("%s: MRCMeta.Source = %q, want hlc3", tf, s.MRCMeta.Source)
		}
		if s.MRCMeta.Smoother != "SuperSmoother" {
			t.Errorf("%s: MRCMeta.Smoother = %q, want SuperSmoother", tf, s.MRCMeta.Smoother)
		}
		if s.MRCMeta.Length != mrctvLength {
			t.Errorf("%s: MRCMeta.Length = %d, want %d", tf, s.MRCMeta.Length, mrctvLength)
		}
		if s.MRCMeta.InnerMultiplier != mrctvInnerMultiplier {
			t.Errorf("%s: MRCMeta.InnerMultiplier = %f, want %f", tf, s.MRCMeta.InnerMultiplier, mrctvInnerMultiplier)
		}
		if s.MRCMeta.OuterMultiplier != mrctvOuterMultiplier {
			t.Errorf("%s: MRCMeta.OuterMultiplier = %f, want %f", tf, s.MRCMeta.OuterMultiplier, mrctvOuterMultiplier)
		}
	}

	// Intraday timeframes must NOT have MRCMeta.
	for _, tf := range []ChartTimeframe{ChartTimeframe15M, ChartTimeframe1H, ChartTimeframe4H} {
		s := payload.SeriesByTimeframe[tf]
		if s.MRCMeta != nil {
			t.Errorf("%s: expected MRCMeta to be nil on intraday series, got %+v", tf, s.MRCMeta)
		}
	}
}

// TestMRCWarmupOmissionShortSeries verifies that MRC points are nil on all bars of a
// short series (fewer bars than warmup period).
func TestMRCWarmupOmissionShortSeries(t *testing.T) {
	job := TechnicalSnapshotJob{Ticker: "WARM", ReportID: "mrc-warmup", PublishedAtMs: 1742860800000}
	dailyBars := []massive.Bar{
		{Date: "2026-03-23", Open: 100, High: 105, Low: 98, Close: 104, Volume: 1_200_000},
		{Date: "2026-03-24", Open: 104, High: 108, Low: 101, Close: 107, Volume: 1_500_000},
		{Date: "2026-03-25", Open: 107, High: 110, Low: 103, Close: 109, Volume: 900_000},
	}
	payload := buildTechnicalPriceChartPayload(job, dailyBars, nil, nil)

	series1d := payload.SeriesByTimeframe[ChartTimeframe1D]
	for i, p := range series1d.Points {
		if p.MRC != nil {
			t.Errorf("1D[%d]: expected nil MRC during warmup (only %d bars < %d warmup), got %+v",
				i, len(dailyBars), mrctvLength, p.MRC)
		}
	}

	// Wire format: mrc must be absent (omitempty) for warmup bars.
	raw, err := json.Marshal(payload)
	if err != nil {
		t.Fatalf("marshal: %v", err)
	}
	var wire struct {
		SeriesByTimeframe map[string]struct {
			Points []struct {
				MRC *struct{} `json:"mrc"`
			} `json:"points"`
		} `json:"seriesByTimeframe"`
	}
	if err := json.Unmarshal(raw, &wire); err != nil {
		t.Fatalf("unmarshal: %v", err)
	}
	for i, p := range wire.SeriesByTimeframe["1D"].Points {
		if p.MRC != nil {
			t.Errorf("wire 1D[%d]: expected mrc omitted during warmup", i)
		}
	}
}

// TestMRCNonNilAfterWarmup verifies that canonical MRC values are present after the
// warmup period when enough bars are provided, and that band ordering holds.
func TestMRCNonNilAfterWarmup(t *testing.T) {
	job := TechnicalSnapshotJob{Ticker: "LONG", ReportID: "mrc-long", PublishedAtMs: 1742860800000}

	// Build 250 daily bars — enough to pass the 200-bar SuperSmoother warmup.
	n := 250
	dailyBars := make([]massive.Bar, n)
	baseDate := time.Date(2020, 1, 2, 0, 0, 0, 0, time.UTC)
	price := 100.0
	for i := range dailyBars {
		close := price + float64(i%7)*0.5
		dailyBars[i] = massive.Bar{
			Date:   baseDate.AddDate(0, 0, i).Format("2006-01-02"),
			Open:   close - 1,
			High:   close + 2,
			Low:    close - 2,
			Close:  close,
			Volume: 1_000_000,
		}
	}

	payload := buildTechnicalPriceChartPayload(job, dailyBars, nil, nil)
	series1d := payload.SeriesByTimeframe[ChartTimeframe1D]

	if len(series1d.Points) != n {
		t.Fatalf("expected %d daily points, got %d", n, len(series1d.Points))
	}

	// First mrctvLength points must be nil.
	for i := 0; i < mrctvLength; i++ {
		if series1d.Points[i].MRC != nil {
			t.Errorf("1D[%d]: expected nil MRC during warmup, got non-nil", i)
		}
	}

	// Points after warmup must be non-nil with valid band ordering.
	for i := mrctvLength; i < n; i++ {
		p := series1d.Points[i]
		if p.MRC == nil {
			t.Errorf("1D[%d]: expected non-nil MRC after warmup", i)
			continue
		}
		if p.MRC.OuterLower > p.MRC.InnerLower+1e-6 {
			t.Errorf("1D[%d]: outerLower %f > innerLower %f", i, p.MRC.OuterLower, p.MRC.InnerLower)
		}
		if p.MRC.InnerLower > p.MRC.Center+1e-6 {
			t.Errorf("1D[%d]: innerLower %f > center %f", i, p.MRC.InnerLower, p.MRC.Center)
		}
		if p.MRC.Center > p.MRC.InnerUpper+1e-6 {
			t.Errorf("1D[%d]: center %f > innerUpper %f", i, p.MRC.Center, p.MRC.InnerUpper)
		}
		if p.MRC.InnerUpper > p.MRC.OuterUpper+1e-6 {
			t.Errorf("1D[%d]: innerUpper %f > outerUpper %f", i, p.MRC.InnerUpper, p.MRC.OuterUpper)
		}
	}

	// Wire format: mrc must appear for post-warmup bars.
	raw, err := json.Marshal(payload)
	if err != nil {
		t.Fatalf("marshal: %v", err)
	}
	var wire struct {
		SeriesByTimeframe map[string]struct {
			MRCMeta *struct {
				AlgorithmVersion string  `json:"algorithmVersion"`
				Length           int     `json:"length"`
				OuterMultiplier  float64 `json:"outerMultiplier"`
			} `json:"mrcMeta"`
			Points []struct {
				MRC *struct {
					Center     float64 `json:"center"`
					InnerUpper float64 `json:"innerUpper"`
					InnerLower float64 `json:"innerLower"`
					OuterUpper float64 `json:"outerUpper"`
					OuterLower float64 `json:"outerLower"`
				} `json:"mrc"`
			} `json:"points"`
		} `json:"seriesByTimeframe"`
	}
	if err := json.Unmarshal(raw, &wire); err != nil {
		t.Fatalf("unmarshal: %v", err)
	}

	wire1d := wire.SeriesByTimeframe["1D"]
	if wire1d.MRCMeta == nil {
		t.Fatalf("wire 1D: expected mrcMeta, got nil")
	}
	if wire1d.MRCMeta.AlgorithmVersion != MRCAlgorithmVersion {
		t.Errorf("wire 1D mrcMeta.algorithmVersion: got %q, want %q", wire1d.MRCMeta.AlgorithmVersion, MRCAlgorithmVersion)
	}
	if wire1d.MRCMeta.Length != mrctvLength {
		t.Errorf("wire 1D mrcMeta.length: got %d, want %d", wire1d.MRCMeta.Length, mrctvLength)
	}
	if wire1d.MRCMeta.OuterMultiplier != mrctvOuterMultiplier {
		t.Errorf("wire 1D mrcMeta.outerMultiplier: got %f, want %f", wire1d.MRCMeta.OuterMultiplier, mrctvOuterMultiplier)
	}

	for i := mrctvLength; i < n; i++ {
		if wire1d.Points[i].MRC == nil {
			t.Errorf("wire 1D[%d]: expected mrc present in JSON after warmup", i)
		}
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

// buildMultiDayIntradayBarsForTest generates `days` full trading days of 15M bars
// starting 2026-03-24. Each day produces 26 regular-session bars (09:30–15:45 ET).
func buildMultiDayIntradayBarsForTest(t *testing.T, days int) []massive.Bar {
	t.Helper()

	location := technicalChartLocation
	bars := make([]massive.Bar, 0, days*26)
	price := 100.0

	// Use weekdays only: Mon 2026-03-23 onward (skip weekends).
	baseDate := time.Date(2026, 3, 24, 0, 0, 0, 0, location) // Tuesday
	for d := 0; d < days; d++ {
		day := baseDate.AddDate(0, 0, d)
		sessionStart := time.Date(day.Year(), day.Month(), day.Day(), 9, 30, 0, 0, location)
		sessionEnd := time.Date(day.Year(), day.Month(), day.Day(), 16, 0, 0, 0, location)
		for cursor := sessionStart; cursor.Before(sessionEnd); cursor = cursor.Add(15 * time.Minute) {
			open := price
			close := price + 1
			bars = append(bars, massive.Bar{
				TimestampMs: cursor.UTC().UnixMilli(),
				Date:        cursor.Format("2006-01-02"),
				Open:        open,
				High:        close + 0.25,
				Low:         open - 0.25,
				Close:       close,
				Volume:      100,
			})
			price += 1
		}
	}

	return bars
}
