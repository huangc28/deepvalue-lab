package stocks

import (
	"context"
	"encoding/json"
	"fmt"
	"math"
	"time"

	"go.uber.org/zap"

	"github.com/huangchihan/deepvalue-lab-be/lib/app/turso_models"
	"github.com/huangchihan/deepvalue-lab-be/lib/pkg/indicators"
	"github.com/huangchihan/deepvalue-lab-be/lib/pkg/massive"
	"github.com/huangchihan/deepvalue-lab-be/lib/pkg/r2"
	"github.com/huangchihan/deepvalue-lab-be/lib/pkg/rabbitmq"
)

type workerQueries interface {
	UpsertTechnicalSnapshot(ctx context.Context, arg turso_models.UpsertTechnicalSnapshotParams) error
}

type workerStorage interface {
	UploadJSON(ctx context.Context, key string, data []byte) error
}

// TechnicalSnapshotWorker consumes published-report jobs, fetches OHLC data from
// Massive, stores normalized bars to R2, computes technical indicators, and marks
// the snapshot ready (or failed on hard error).
type TechnicalSnapshotWorker struct {
	massive  *massive.Client
	consumer *rabbitmq.Consumer
	queries  workerQueries
	r2Client workerStorage
	logger   *zap.Logger
}

func NewTechnicalSnapshotWorker(
	massiveClient *massive.Client,
	consumer *rabbitmq.Consumer,
	queries *turso_models.Queries,
	r2Client *r2.Client,
	logger *zap.Logger,
) *TechnicalSnapshotWorker {
	return &TechnicalSnapshotWorker{
		massive:  massiveClient,
		consumer: consumer,
		queries:  queries,
		r2Client: r2Client,
		logger:   logger,
	}
}

// Start blocks and processes jobs until ctx is cancelled.
func (w *TechnicalSnapshotWorker) Start(ctx context.Context) error {
	w.logger.Info("technical snapshot worker starting")
	return w.consumer.Consume(ctx, TechnicalSnapshotJobQueue, func(body []byte) error {
		return w.process(ctx, body)
	})
}

func (w *TechnicalSnapshotWorker) process(ctx context.Context, body []byte) error {
	var job TechnicalSnapshotJob
	if err := json.Unmarshal(body, &job); err != nil {
		return fmt.Errorf("unmarshal job: %w", err)
	}

	log := w.logger.With(zap.String("ticker", job.Ticker), zap.String("report_id", job.ReportID))
	log.Info("processing technical snapshot job")

	publishedAt := time.UnixMilli(job.PublishedAtMs).UTC()
	from := publishedAt.AddDate(-1, 0, 0)
	to := publishedAt

	bars, err := w.massive.FetchDailyBars(ctx, job.Ticker, from, to)
	if err != nil {
		log.Error("fetch daily bars from massive", zap.Error(err))
		w.markFailed(ctx, job, fmt.Sprintf("fetch daily bars: %s", err.Error()))
		return err
	}

	log.Info("fetched daily bars from massive", zap.Int("count", len(bars)))

	data, err := json.Marshal(bars)
	if err != nil {
		log.Error("marshal ohlc bars", zap.Error(err))
		w.markFailed(ctx, job, fmt.Sprintf("marshal ohlc bars: %s", err.Error()))
		return err
	}

	ohlcKey := r2.OHLCKey(job.Ticker, job.ReportID)
	if err := w.r2Client.UploadJSON(ctx, ohlcKey, data); err != nil {
		log.Error("upload ohlc to r2", zap.String("key", ohlcKey), zap.Error(err))
		w.markFailed(ctx, job, fmt.Sprintf("upload ohlc to r2: %s", err.Error()))
		return err
	}

	log.Info("ohlc bars stored to r2", zap.String("key", ohlcKey))

	if err := w.buildAndMarkReady(ctx, job, bars); err != nil {
		// markFailed already called inside buildAndMarkReady
		return err
	}

	return nil
}

func (w *TechnicalSnapshotWorker) buildAndMarkReady(ctx context.Context, job TechnicalSnapshotJob, bars []massive.Bar) error {
	log := w.logger.With(zap.String("ticker", job.Ticker), zap.String("report_id", job.ReportID))

	n := len(bars)
	closes := make([]float64, n)
	highs := make([]float64, n)
	lows := make([]float64, n)
	for i, b := range bars {
		closes[i] = b.Close
		highs[i] = b.High
		lows[i] = b.Low
	}

	hlc3 := indicators.HLC3(highs, lows, closes)
	rsi := indicators.RSI(closes, 22)
	emaOnRsi := indicators.EMA(rsi, 12)
	mrcCenter, mrcUpper, mrcLower := indicators.MRC(hlc3, 20)

	round2 := func(v float64) float64 {
		return math.Round(v*100) / 100
	}
	toPtr := func(v float64) *float64 {
		if math.IsNaN(v) {
			return nil
		}
		rounded := round2(v)
		return &rounded
	}

	points := make([]TechnicalPricePoint, n)
	for i, b := range bars {
		points[i] = TechnicalPricePoint{
			Date:      b.Date,
			Open:      b.Open,
			High:      b.High,
			Low:       b.Low,
			Close:     b.Close,
			Volume:    b.Volume,
			HLC3:      round2(hlc3[i]),
			RSI:       toPtr(rsi[i]),
			EMAOnRSI:  toPtr(emaOnRsi[i]),
			MRCCenter: toPtr(mrcCenter[i]),
			MRCUpper:  toPtr(mrcUpper[i]),
			MRCLower:  toPtr(mrcLower[i]),
		}
	}

	// Find latest non-NaN RSI and EMAOnRSI values for the summary.
	var latestRSI, latestEMAOnRSI float64
	latestRSI = math.NaN()
	latestEMAOnRSI = math.NaN()
	for i := n - 1; i >= 0; i-- {
		if math.IsNaN(latestRSI) && !math.IsNaN(rsi[i]) {
			latestRSI = rsi[i]
		}
		if math.IsNaN(latestEMAOnRSI) && !math.IsNaN(emaOnRsi[i]) {
			latestEMAOnRSI = emaOnRsi[i]
		}
		if !math.IsNaN(latestRSI) && !math.IsNaN(latestEMAOnRSI) {
			break
		}
	}

	rsiStatus := "neutral"
	if !math.IsNaN(latestRSI) {
		switch {
		case latestRSI < 30:
			rsiStatus = "oversold"
		case latestRSI > 70:
			rsiStatus = "overbought"
		}
	}

	summary := TechnicalIndicatorSummary{
		RSI:       round2(latestRSI),
		EMAOnRSI:  round2(latestEMAOnRSI),
		RSIStatus: rsiStatus,
	}

	payload := TechnicalPriceChartPayload{
		Source:   "massive",
		Ticker:   job.Ticker,
		ReportID: job.ReportID,
		Points:   points,
		Latest:   summary,
	}

	payloadData, err := json.Marshal(payload)
	if err != nil {
		msg := fmt.Sprintf("marshal technical snapshot payload: %s", err.Error())
		log.Error("marshal technical snapshot payload", zap.Error(err))
		w.markFailed(ctx, job, msg)
		return err
	}

	dateStr := time.UnixMilli(job.PublishedAtMs).UTC().Format("20060102")
	snapshotKey := r2.TechnicalSnapshotKey(job.Ticker, dateStr, job.ReportID)

	if err := w.r2Client.UploadJSON(ctx, snapshotKey, payloadData); err != nil {
		msg := fmt.Sprintf("upload technical snapshot to r2: %s", err.Error())
		log.Error("upload technical snapshot to r2", zap.String("key", snapshotKey), zap.Error(err))
		w.markFailed(ctx, job, msg)
		return err
	}

	log.Info("technical snapshot stored to r2", zap.String("key", snapshotKey))

	if err := w.queries.UpsertTechnicalSnapshot(ctx, turso_models.UpsertTechnicalSnapshotParams{
		Ticker:            job.Ticker,
		ReportID:          job.ReportID,
		Status:            "ready",
		Source:            "massive",
		Provider:          "massive",
		R2SnapshotKey:     snapshotKey,
		R2SnapshotZhTwKey: "",
		ErrorMessage:      "",
		PublishedAtMs:     job.PublishedAtMs,
	}); err != nil {
		msg := fmt.Sprintf("upsert technical snapshot ready: %s", err.Error())
		log.Error("upsert technical snapshot ready", zap.Error(err))
		w.markFailed(ctx, job, msg)
		return err
	}

	log.Info("technical snapshot marked ready")
	return nil
}

func (w *TechnicalSnapshotWorker) markFailed(ctx context.Context, job TechnicalSnapshotJob, errMsg string) {
	if err := w.queries.UpsertTechnicalSnapshot(ctx, turso_models.UpsertTechnicalSnapshotParams{
		Ticker:        job.Ticker,
		ReportID:      job.ReportID,
		Status:        "failed",
		Source:        "massive",
		Provider:      "massive",
		ErrorMessage:  errMsg,
		PublishedAtMs: job.PublishedAtMs,
	}); err != nil {
		w.logger.Error("mark technical snapshot failed", zap.String("ticker", job.Ticker), zap.String("report_id", job.ReportID), zap.Error(err))
	}
}
