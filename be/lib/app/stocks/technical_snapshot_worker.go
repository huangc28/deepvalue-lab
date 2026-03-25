package stocks

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"go.uber.org/zap"

	"github.com/huangchihan/deepvalue-lab-be/lib/app/turso_models"
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
// Massive, stores normalized bars to R2, and marks the snapshot failed on hard error.
// It leaves the snapshot in the pending state until Phase 4 adds indicator computation.
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
	// Snapshot stays pending — Phase 4 will compute indicators and mark it ready.
	return nil
}

func (w *TechnicalSnapshotWorker) markFailed(ctx context.Context, job TechnicalSnapshotJob, errMsg string) {
	if err := w.queries.UpsertTechnicalSnapshot(ctx, turso_models.UpsertTechnicalSnapshotParams{
		Ticker:       job.Ticker,
		ReportID:     job.ReportID,
		Status:       "failed",
		Source:       "massive",
		Provider:     "massive",
		ErrorMessage: errMsg,
		PublishedAtMs: job.PublishedAtMs,
	}); err != nil {
		w.logger.Error("mark technical snapshot failed", zap.String("ticker", job.Ticker), zap.String("report_id", job.ReportID), zap.Error(err))
	}
}
