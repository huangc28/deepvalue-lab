package stocks

// TechnicalPriceChartPayload is the top-level snapshot artifact stored to R2.
// This is the value stored as `snapshot` in the technical snapshot read endpoint.
type TechnicalPriceChartPayload struct {
	Source   string                    `json:"source"`
	Ticker   string                    `json:"ticker"`
	ReportID string                    `json:"reportId"`
	Points   []TechnicalPricePoint     `json:"points"`
	Latest   TechnicalIndicatorSummary `json:"latest"`
}

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

// TechnicalIndicatorSummary holds the most recent computed values and classification.
type TechnicalIndicatorSummary struct {
	RSI       float64 `json:"rsi"`       // latest RSI(22), rounded to 2dp
	EMAOnRSI  float64 `json:"emaOnRsi"`  // latest EMA(12) on RSI, rounded to 2dp
	RSIStatus string  `json:"rsiStatus"` // "oversold" | "neutral" | "overbought"
}
