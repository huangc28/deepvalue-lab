package stocks

// SnapshotVersion identifies the technical chart payload format version.
// Consumers use this to distinguish canonical MRC snapshots (v2) from legacy approximate ones.
// v2 snapshots carry MRC data inside seriesByTimeframe[*].points[*].mrc and include mrcMeta
// per timeframe. Legacy snapshots omit this field or carry a different value.
const SnapshotVersion = "technical-chart.v2"

// MRCAlgorithmVersion is the algorithm identifier embedded in MRCMetadata.
const MRCAlgorithmVersion = "tradingview-mrc-v1"

// mrctvLength is the canonical SuperSmoother period for the TradingView-aligned MRC.
// innerMult and outerMult are the canonical band multipliers.
const (
	mrctvLength          = 200
	mrctvInnerMultiplier = 1.0
	mrctvOuterMultiplier = 2.415
)

// MRCMetadata describes the algorithm and parameters used to compute canonical MRC values.
// Emitted once per timeframe series that carries canonical MRC data.
type MRCMetadata struct {
	// AlgorithmVersion is a stable identifier for the computation method.
	AlgorithmVersion string `json:"algorithmVersion"`
	// Source is the price series input to the meanline smoother ("hlc3").
	Source string `json:"source"`
	// Smoother identifies the filter type ("SuperSmoother" = Ehlers 2-pole IIR).
	Smoother string `json:"smoother"`
	// Length is the SuperSmoother period applied to both meanLine and meanRange.
	Length int `json:"length"`
	// InnerMultiplier is the band width multiplier for the inner channel.
	InnerMultiplier float64 `json:"innerMultiplier"`
	// OuterMultiplier is the band width multiplier for the outer channel (≈ Silver Ratio).
	OuterMultiplier float64 `json:"outerMultiplier"`
}

// MRCPoint holds the five canonical TradingView-aligned MRC band values for one bar.
// Embedded as a pointer in OhlcPoint; nil during SuperSmoother warmup (first Length bars).
type MRCPoint struct {
	Center     float64 `json:"center"`
	InnerUpper float64 `json:"innerUpper"`
	InnerLower float64 `json:"innerLower"`
	OuterUpper float64 `json:"outerUpper"`
	OuterLower float64 `json:"outerLower"`
}

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
//
// SnapshotVersion == "technical-chart.v2" indicates canonical MRC is present in
// seriesByTimeframe. Consumers should check this field before reading mrc fields.
type TechnicalPriceChartPayload struct {
	SnapshotVersion     string                             `json:"snapshotVersion,omitempty"`
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
// MRCMeta is present when this series carries canonical TradingView-aligned MRC data
// in each point's MRC field.
type TimeframeSeries struct {
	Timeframe     ChartTimeframe `json:"timeframe"`
	Timezone      string         `json:"timezone"`
	SessionMode   SessionMode    `json:"sessionMode"`
	LookbackLabel string         `json:"lookbackLabel"`
	MRCMeta       *MRCMetadata   `json:"mrcMeta,omitempty"`
	Points        []OhlcPoint    `json:"points"`
}

// OhlcPoint is a candle with explicit timestamp semantics.
// RSI, EMAOnRSI, and legacy MRC fields are omitted during indicator warmup.
type OhlcPoint struct {
	TimestampUtc      string    `json:"timestampUtc"`
	ExchangeTimestamp string    `json:"exchangeTimestamp"`
	Open              float64   `json:"open"`
	High              float64   `json:"high"`
	Low               float64   `json:"low"`
	Close             float64   `json:"close"`
	Volume            float64   `json:"volume,omitempty"`
	RSI               *float64  `json:"rsi,omitempty"`
	EMAOnRSI          *float64  `json:"emaOnRsi,omitempty"`
	MRC               *MRCPoint `json:"mrc,omitempty"`
	MRCCenter         *float64  `json:"mrcCenter,omitempty"`
	MRCUpper          *float64  `json:"mrcUpper,omitempty"`
	MRCLower          *float64  `json:"mrcLower,omitempty"`
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
