package stocks

import (
	"context"
	"encoding/json"
	"fmt"
	"math"
	"sort"
	"time"

	"go.uber.org/zap"

	"github.com/huangchihan/deepvalue-lab-be/lib/app/turso_models"
	"github.com/huangchihan/deepvalue-lab-be/lib/pkg/indicators"
	"github.com/huangchihan/deepvalue-lab-be/lib/pkg/massive"
	"github.com/huangchihan/deepvalue-lab-be/lib/pkg/r2"
	"github.com/huangchihan/deepvalue-lab-be/lib/pkg/rabbitmq"
)

const (
	technicalChartTimezone = "America/New_York"
	technicalChartLookback = "1D"
)

var technicalChartLocation = loadTechnicalChartLocation()

type workerQueries interface {
	UpsertTechnicalSnapshot(ctx context.Context, arg turso_models.UpsertTechnicalSnapshotParams) error
}

type workerStorage interface {
	UploadJSON(ctx context.Context, key string, data []byte) error
}

const (
	phase3DailyFetchLookbackMonths    = 36
	phase3IntradayFetchLookbackMonths = 8
	intradayNativeMultiplier          = 15
)

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
	dailyFrom := publishedAt.AddDate(0, -phase3DailyFetchLookbackMonths, 0)
	intradayFrom := publishedAt.AddDate(0, -phase3IntradayFetchLookbackMonths, 0)
	to := publishedAt

	dailyBars, err := w.massive.FetchDailyBars(ctx, job.Ticker, dailyFrom, to)
	if err != nil {
		log.Error("fetch daily bars from massive", zap.Error(err))
		w.markFailed(ctx, job, fmt.Sprintf("fetch daily bars: %s", err.Error()))
		return err
	}

	log.Info("fetched daily bars from massive", zap.Int("count", len(dailyBars)))

	intradayBars, intradayErr := w.massive.FetchIntradayBars(ctx, job.Ticker, intradayNativeMultiplier, intradayFrom, to)
	if intradayErr != nil {
		log.Warn("fetch intraday bars from massive", zap.Error(intradayErr))
	} else {
		log.Info("fetched intraday bars from massive", zap.Int("count", len(intradayBars)))
	}

	weeklyBars := aggregateWeeklyBars(dailyBars)
	log.Info("derived weekly bars from daily bars", zap.Int("count", len(weeklyBars)))

	data, err := json.Marshal(dailyBars)
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

	if len(intradayBars) > 0 {
		intradayData, err := json.Marshal(intradayBars)
		if err != nil {
			log.Warn("marshal intraday ohlc bars", zap.Error(err))
		} else {
			intradayKey := r2.OHLCIntradayKey(job.Ticker, job.ReportID)
			if err := w.r2Client.UploadJSON(ctx, intradayKey, intradayData); err != nil {
				log.Warn("upload intraday ohlc to r2", zap.String("key", intradayKey), zap.Error(err))
			} else {
				log.Info("intraday ohlc bars stored to r2", zap.String("key", intradayKey))
			}
		}
	}

	if err := w.buildAndMarkReady(ctx, job, dailyBars, intradayBars, weeklyBars); err != nil {
		// markFailed already called inside buildAndMarkReady
		return err
	}

	return nil
}

func (w *TechnicalSnapshotWorker) buildAndMarkReady(ctx context.Context, job TechnicalSnapshotJob, dailyBars, intradayBars, weeklyBars []massive.Bar) error {
	log := w.logger.With(zap.String("ticker", job.Ticker), zap.String("report_id", job.ReportID))
	payload := buildTechnicalPriceChartPayload(job, dailyBars, intradayBars, weeklyBars)

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

func buildTechnicalPriceChartPayload(job TechnicalSnapshotJob, dailyBars, intradayBars, weeklyBars []massive.Bar) TechnicalPriceChartPayload {
	n := len(dailyBars)
	closes := make([]float64, n)
	highs := make([]float64, n)
	lows := make([]float64, n)
	for i, b := range dailyBars {
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

	legacyPoints := make([]TechnicalPricePoint, n)
	dailySeriesPoints := make([]OhlcPoint, n)
	for i, b := range dailyBars {
		legacyPoints[i] = TechnicalPricePoint{
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
		timestampUtc, exchangeTimestamp := buildDailyBarTimestamps(b.Date)
		dailySeriesPoints[i] = OhlcPoint{
			TimestampUtc:      timestampUtc,
			ExchangeTimestamp: exchangeTimestamp,
			Open:              b.Open,
			High:              b.High,
			Low:               b.Low,
			Close:             b.Close,
			Volume:            b.Volume,
		}
	}

	indicatorSnapshot, summary := buildIndicatorSnapshots(rsi, emaOnRsi, round2)

	weeklySeriesPoints := make([]OhlcPoint, len(weeklyBars))
	for i, b := range weeklyBars {
		timestampUtc, exchangeTimestamp := buildDailyBarTimestamps(b.Date)
		weeklySeriesPoints[i] = OhlcPoint{
			TimestampUtc:      timestampUtc,
			ExchangeTimestamp: exchangeTimestamp,
			Open:              b.Open,
			High:              b.High,
			Low:               b.Low,
			Close:             b.Close,
			Volume:            b.Volume,
		}
	}

	intraday15mBars := filterRegularMarketSessionBars(intradayBars)
	intraday15mSeriesPoints := buildIntradaySeriesPoints(intraday15mBars, intradayNativeMultiplier)
	intraday1hSeriesPoints := buildIntradaySeriesPoints(aggregateIntradayBars(intraday15mBars, 60), 60)
	intraday4hSeriesPoints := buildIntradaySeriesPoints(aggregateIntradayBars(intraday15mBars, 240), 240)

	seriesByTimeframe := make(map[ChartTimeframe]TimeframeSeries, 5)
	availableTimeframes := make([]ChartTimeframe, 0, 5)
	addSeries := func(series TimeframeSeries) {
		if len(series.Points) == 0 {
			return
		}
		seriesByTimeframe[series.Timeframe] = series
		availableTimeframes = append(availableTimeframes, series.Timeframe)
	}

	addSeries(TimeframeSeries{
		Timeframe:     ChartTimeframe15M,
		Timezone:      technicalChartTimezone,
		SessionMode:   SessionModeMarketHours,
		LookbackLabel: "15M",
		Points:        intraday15mSeriesPoints,
	})
	addSeries(TimeframeSeries{
		Timeframe:     ChartTimeframe1H,
		Timezone:      technicalChartTimezone,
		SessionMode:   SessionModeMarketHours,
		LookbackLabel: "1H",
		Points:        intraday1hSeriesPoints,
	})
	addSeries(TimeframeSeries{
		Timeframe:     ChartTimeframe4H,
		Timezone:      technicalChartTimezone,
		SessionMode:   SessionModeMarketHours,
		LookbackLabel: "4H",
		Points:        intraday4hSeriesPoints,
	})
	addSeries(TimeframeSeries{
		Timeframe:     ChartTimeframe1D,
		Timezone:      technicalChartTimezone,
		SessionMode:   SessionModeMarketHours,
		LookbackLabel: technicalChartLookback,
		Points:        dailySeriesPoints,
	})
	addSeries(TimeframeSeries{
		Timeframe:     ChartTimeframe1W,
		Timezone:      technicalChartTimezone,
		SessionMode:   SessionModeMarketHours,
		LookbackLabel: "1W",
		Points:        weeklySeriesPoints,
	})

	return TechnicalPriceChartPayload{
		Source:              "massive",
		Ticker:              job.Ticker,
		ReportID:            job.ReportID,
		DefaultTimeframe:    ChartTimeframe1D,
		AvailableTimeframes: availableTimeframes,
		SeriesByTimeframe:   seriesByTimeframe,
		Indicators:          indicatorSnapshot,
		Points:              legacyPoints,
		Latest:              summary,
	}
}

func buildIntradaySeriesPoints(bars []massive.Bar, windowMinutes int) []OhlcPoint {
	points := make([]OhlcPoint, 0, len(bars))
	for _, bar := range bars {
		if bar.TimestampMs == 0 {
			continue
		}

		start := time.UnixMilli(bar.TimestampMs).In(technicalChartLocation)
		timestampUtc, exchangeTimestamp := buildSessionBarTimestamps(start)
		points = append(points, OhlcPoint{
			TimestampUtc:      timestampUtc,
			ExchangeTimestamp: exchangeTimestamp,
			Open:              bar.Open,
			High:              bar.High,
			Low:               bar.Low,
			Close:             bar.Close,
			Volume:            bar.Volume,
		})
	}

	return points
}

func filterRegularMarketSessionBars(bars []massive.Bar) []massive.Bar {
	filtered := make([]massive.Bar, 0, len(bars))
	for _, bar := range bars {
		if bar.TimestampMs == 0 {
			continue
		}

		barTime := time.UnixMilli(bar.TimestampMs).In(technicalChartLocation)
		if !isRegularMarketSession(barTime) {
			continue
		}

		filtered = append(filtered, bar)
	}

	return filtered
}

func isRegularMarketSession(barTime time.Time) bool {
	if barTime.Weekday() == time.Saturday || barTime.Weekday() == time.Sunday {
		return false
	}

	sessionOpen := time.Date(
		barTime.Year(),
		barTime.Month(),
		barTime.Day(),
		9,
		30,
		0,
		0,
		technicalChartLocation,
	)
	sessionClose := time.Date(
		barTime.Year(),
		barTime.Month(),
		barTime.Day(),
		16,
		0,
		0,
		0,
		technicalChartLocation,
	)

	return !barTime.Before(sessionOpen) && barTime.Before(sessionClose)
}

func aggregateIntradayBars(bars []massive.Bar, windowMinutes int) []massive.Bar {
	if len(bars) == 0 {
		return nil
	}

	sorted := append([]massive.Bar(nil), bars...)
	sort.Slice(sorted, func(i, j int) bool {
		return sorted[i].TimestampMs < sorted[j].TimestampMs
	})

	aggregated := make([]massive.Bar, 0, len(sorted)/windowMinutes+1)
	var current intradayBarAggregate

	for _, bar := range sorted {
		if bar.TimestampMs == 0 {
			continue
		}

		barTime := time.UnixMilli(bar.TimestampMs).In(technicalChartLocation)
		if !isRegularMarketSession(barTime) {
			continue
		}

		bucketStart := sessionBucketStart(barTime, windowMinutes)
		bucketKey := bucketStart.Format("2006-01-02T15:04:05")

		if current.key == "" || current.key != bucketKey {
			if current.key != "" {
				aggregated = append(aggregated, current.toBar())
			}
			current = intradayBarAggregate{
				key:     bucketKey,
				open:    bar.Open,
				high:    bar.High,
				low:     bar.Low,
				close:   bar.Close,
				volume:  bar.Volume,
				startMs: bucketStart.UTC().UnixMilli(),
				start:   bucketStart,
			}
			continue
		}

		if bar.High > current.high {
			current.high = bar.High
		}
		if bar.Low < current.low {
			current.low = bar.Low
		}
		current.close = bar.Close
		current.volume += bar.Volume
	}

	if current.key != "" {
		aggregated = append(aggregated, current.toBar())
	}

	return aggregated
}

type intradayBarAggregate struct {
	key     string
	open    float64
	high    float64
	low     float64
	close   float64
	volume  float64
	startMs int64
	start   time.Time
}

func (a intradayBarAggregate) toBar() massive.Bar {
	return massive.Bar{
		TimestampMs: a.startMs,
		Date:        a.start.Format("2006-01-02"),
		Open:        a.open,
		High:        a.high,
		Low:         a.low,
		Close:       a.close,
		Volume:      a.volume,
	}
}

func sessionBucketStart(barTime time.Time, windowMinutes int) time.Time {
	sessionOpen := time.Date(
		barTime.Year(),
		barTime.Month(),
		barTime.Day(),
		9,
		30,
		0,
		0,
		technicalChartLocation,
	)

	elapsedMinutes := int(barTime.Sub(sessionOpen) / time.Minute)
	bucketIndex := elapsedMinutes / windowMinutes
	return sessionOpen.Add(time.Duration(bucketIndex*windowMinutes) * time.Minute)
}

func buildSessionBarTimestamps(start time.Time) (string, string) {
	exchangeTimestamp := start.Format(time.RFC3339)
	utcTimestamp := start.UTC().Format(time.RFC3339)

	return utcTimestamp, exchangeTimestamp
}

type weeklyBarAggregate struct {
	key    string
	open   float64
	high   float64
	low    float64
	close  float64
	volume float64
	date   string
}

func aggregateWeeklyBars(bars []massive.Bar) []massive.Bar {
	if len(bars) == 0 {
		return nil
	}

	sorted := append([]massive.Bar(nil), bars...)
	sort.Slice(sorted, func(i, j int) bool {
		return sorted[i].Date < sorted[j].Date
	})

	aggregated := make([]massive.Bar, 0, len(sorted)/5+1)
	var current weeklyBarAggregate

	for _, bar := range sorted {
		tradingDay, err := time.ParseInLocation("2006-01-02", bar.Date, technicalChartLocation)
		if err != nil {
			continue
		}

		year, week := tradingDay.ISOWeek()
		key := fmt.Sprintf("%04d-W%02d", year, week)
		if current.key == "" || current.key != key {
			if current.key != "" {
				aggregated = append(aggregated, current.toBar())
			}
			current = weeklyBarAggregate{
				key:    key,
				open:   bar.Open,
				high:   bar.High,
				low:    bar.Low,
				close:  bar.Close,
				volume: bar.Volume,
				date:   bar.Date,
			}
			continue
		}

		if bar.High > current.high {
			current.high = bar.High
		}
		if bar.Low < current.low {
			current.low = bar.Low
		}
		current.close = bar.Close
		current.volume += bar.Volume
		current.date = bar.Date
	}

	if current.key != "" {
		aggregated = append(aggregated, current.toBar())
	}

	return aggregated
}

func (a weeklyBarAggregate) toBar() massive.Bar {
	return massive.Bar{
		Date:   a.date,
		Open:   a.open,
		High:   a.high,
		Low:    a.low,
		Close:  a.close,
		Volume: a.volume,
	}
}

func buildIndicatorSnapshots(rsi []float64, emaOnRsi []float64, round2 func(float64) float64) (IndicatorSnapshot, TechnicalIndicatorSummary) {
	var latestRSI, latestEMAOnRSI float64
	latestRSI = math.NaN()
	latestEMAOnRSI = math.NaN()
	for i := len(rsi) - 1; i >= 0; i-- {
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

	indicatorSnapshot := IndicatorSnapshot{}
	if !math.IsNaN(latestRSI) {
		indicatorSnapshot.RSI = round2(latestRSI)
	}
	if !math.IsNaN(latestEMAOnRSI) {
		indicatorSnapshot.EMAOnRSI = round2(latestEMAOnRSI)
	}
	indicatorSnapshot.RSIStatus = rsiStatus

	return indicatorSnapshot, indicatorSnapshot
}

func buildDailyBarTimestamps(date string) (string, string) {
	tradingDay, err := time.ParseInLocation("2006-01-02", date, technicalChartLocation)
	if err != nil {
		return date + "T20:00:00Z", date + "T16:00:00-04:00"
	}

	exchangeClose := time.Date(
		tradingDay.Year(),
		tradingDay.Month(),
		tradingDay.Day(),
		16,
		0,
		0,
		0,
		technicalChartLocation,
	)

	return exchangeClose.UTC().Format(time.RFC3339), exchangeClose.Format(time.RFC3339)
}

func loadTechnicalChartLocation() *time.Location {
	location, err := time.LoadLocation(technicalChartTimezone)
	if err != nil {
		return time.FixedZone("EDT", -4*60*60)
	}
	return location
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
