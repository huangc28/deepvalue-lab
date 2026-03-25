package stocks

const TechnicalSnapshotJobQueue = "technical_snapshot_jobs"

// TechnicalSnapshotJob is the message enqueued after a report is published.
type TechnicalSnapshotJob struct {
	Ticker        string `json:"ticker"`
	ReportID      string `json:"reportId"`
	PublishedAtMs int64  `json:"publishedAtMs"`
}
