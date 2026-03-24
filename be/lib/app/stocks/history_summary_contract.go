package stocks

import (
	"encoding/json"

	"github.com/huangchihan/deepvalue-lab-be/lib/app/turso_models"
)

// summaryFields mirrors StockSummary from the frontend type system.
// LocalizedText fields use json.RawMessage to pass through without interpretation.
type summaryFields struct {
	ID                   string          `json:"id"`
	Ticker               string          `json:"ticker"`
	CompanyName          string          `json:"companyName"`
	BusinessType         json.RawMessage `json:"businessType"`
	CurrentPrice         float64         `json:"currentPrice"`
	ValuationStatus      string          `json:"valuationStatus"`
	NewsImpactStatus     string          `json:"newsImpactStatus"`
	ThesisStatus         string          `json:"thesisStatus"`
	TechnicalEntryStatus string          `json:"technicalEntryStatus"`
	ActionState          string          `json:"actionState"`
	DashboardBucket      string          `json:"dashboardBucket"`
	BaseFairValue        float64         `json:"baseFairValue"`
	BearFairValue        float64         `json:"bearFairValue"`
	BullFairValue        float64         `json:"bullFairValue"`
	DiscountToBase       float64         `json:"discountToBase"`
	Summary              json.RawMessage `json:"summary"`
	LastUpdated          string          `json:"lastUpdated"`
}

type historicalReportSummaryResponse struct {
	ReportID             string          `json:"reportId"`
	PublishedAtMs        int64           `json:"publishedAtMs"`
	Provenance           string          `json:"provenance"`
	ValuationStatus      string          `json:"valuationStatus"`
	ThesisStatus         string          `json:"thesisStatus"`
	TechnicalEntryStatus string          `json:"technicalEntryStatus"`
	CurrentPrice         float64         `json:"currentPrice"`
	BearFairValue        float64         `json:"bearFairValue"`
	BaseFairValue        float64         `json:"baseFairValue"`
	BullFairValue        float64         `json:"bullFairValue"`
	Summary              json.RawMessage `json:"summary"`
	LocaleHasFallback    bool            `json:"localeHasFallback"`
	Latest               bool            `json:"latest,omitempty"`
}

func buildHistoricalReportSummary(
	row turso_models.StockReport,
	useZhTW bool,
	latest bool,
) (historicalReportSummaryResponse, error) {
	summaryJSON := row.SummaryJson
	localeHasFallback := false
	if useZhTW {
		if hasNonEmptySummaryJSON(row.SummaryJsonZhTw) {
			summaryJSON = row.SummaryJsonZhTw
		} else {
			localeHasFallback = true
		}
	}

	var fields summaryFields
	if err := json.Unmarshal([]byte(summaryJSON), &fields); err != nil {
		return historicalReportSummaryResponse{}, err
	}

	return historicalReportSummaryResponse{
		ReportID:             row.ID,
		PublishedAtMs:        row.PublishedAtMs,
		Provenance:           row.Provenance,
		ValuationStatus:      fields.ValuationStatus,
		ThesisStatus:         fields.ThesisStatus,
		TechnicalEntryStatus: fields.TechnicalEntryStatus,
		CurrentPrice:         fields.CurrentPrice,
		BearFairValue:        fields.BearFairValue,
		BaseFairValue:        fields.BaseFairValue,
		BullFairValue:        fields.BullFairValue,
		Summary:              fields.Summary,
		LocaleHasFallback:    localeHasFallback,
		Latest:               latest,
	}, nil
}
