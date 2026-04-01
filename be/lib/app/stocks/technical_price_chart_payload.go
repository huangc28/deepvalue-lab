package stocks

// ChartTimeframe identifies the candle interval exposed by the technical chart.
type ChartTimeframe string

const (
	ChartTimeframe15M ChartTimeframe = "15M"
	ChartTimeframe1H  ChartTimeframe = "1H"
	ChartTimeframe4H  ChartTimeframe = "4H"
	ChartTimeframe1D  ChartTimeframe = "1D"
	ChartTimeframe1W  ChartTimeframe = "1W"
)

// SessionMode identifies the market session coverage for a timeframe series.
type SessionMode string

const (
	SessionModeMarketHours SessionMode = "market-hours"
	SessionModeExtended    SessionMode = "extended"
	SessionModeUnknown     SessionMode = "unknown"
)

// TechnicalPriceChartPayload is the top-level snapshot artifact stored to R2.
// This is the value stored as `snapshot` in the technical snapshot read endpoint.
//
// The timeframe-aware fields are additive so older consumers can keep using
// the legacy daily points path during the frontend transition.
type TechnicalPriceChartPayload struct {
	Source              string                             `json:"source"`
	Ticker              string                             `json:"ticker"`
	ReportID            string                             `json:"reportId"`
	DefaultTimeframe    ChartTimeframe                     `json:"defaultTimeframe"`
	AvailableTimeframes []ChartTimeframe                   `json:"availableTimeframes"`
	SeriesByTimeframe   map[ChartTimeframe]TimeframeSeries `json:"seriesByTimeframe"`
	Indicators          IndicatorSnapshot                  `json:"indicators"`
	Points              []TechnicalPricePoint              `json:"points,omitempty"`
	Latest              TechnicalIndicatorSummary          `json:"latest,omitempty"`
}

// TimeframeSeries is the canonical OHLC series for one chart timeframe.
type TimeframeSeries struct {
	Timeframe     ChartTimeframe `json:"timeframe"`
	Timezone      string         `json:"timezone"`
	SessionMode   SessionMode    `json:"sessionMode"`
	LookbackLabel string         `json:"lookbackLabel"`
	Points        []OhlcPoint    `json:"points"`
}

// OhlcPoint is a candle with explicit timestamp semantics.
// RSI and EMAOnRSI are omitted during indicator warmup (not enough prior bars).
type OhlcPoint struct {
	TimestampUtc      string   `json:"timestampUtc"`
	ExchangeTimestamp string   `json:"exchangeTimestamp"`
	Open              float64  `json:"open"`
	High              float64  `json:"high"`
	Low               float64  `json:"low"`
	Close             float64  `json:"close"`
	Volume            float64  `json:"volume,omitempty"`
	RSI               *float64 `json:"rsi,omitempty"`
	EMAOnRSI          *float64 `json:"emaOnRsi,omitempty"`
}

// IndicatorSnapshot holds the latest computed values and classification.
type IndicatorSnapshot struct {
	RSI       float64 `json:"rsi"`
	EMAOnRSI  float64 `json:"emaOnRsi"`
	RSIStatus string  `json:"rsiStatus"` // "oversold" | "neutral" | "overbought"
}

// TechnicalIndicatorSummary is kept as a legacy alias while the frontend migrates.
type TechnicalIndicatorSummary = IndicatorSnapshot

// TechnicalPricePoint is one daily bar with all indicator values aligned to the same date.
// Pointer fields are nil/omitted during indicator warmup period.
type TechnicalPricePoint struct {
	Date      string   `json:"date"`
	Open      float64  `json:"open"`
	High      float64  `json:"high"`
	Low       float64  `json:"low"`
	Close     float64  `json:"close"`
	Volume    float64  `json:"volume"`
	HLC3      float64  `json:"hlc3"`
	RSI       *float64 `json:"rsi,omitempty"`
	EMAOnRSI  *float64 `json:"emaOnRsi,omitempty"`
	MRCCenter *float64 `json:"mrcCenter,omitempty"`
	MRCUpper  *float64 `json:"mrcUpper,omitempty"`
	MRCLower  *float64 `json:"mrcLower,omitempty"`
}
