package indicators

import "math"

// HLC3 computes (High + Low + Close) / 3 for each bar.
// All three slices must have equal length. Returns same-length slice.
func HLC3(highs, lows, closes []float64) []float64 {
	n := len(closes)
	out := make([]float64, n)
	for i := range n {
		out[i] = (highs[i] + lows[i] + closes[i]) / 3.0
	}
	return out
}

// RSI computes the Wilder RSI for the given period (typically 22).
// Uses Wilder's smoothing: first avg = simple mean of first `period` changes,
// then subsequent: avgGain = (prevGain*(period-1) + gain) / period.
// Returns same-length slice as closes; first `period` elements are NaN (warmup).
func RSI(closes []float64, period int) []float64 {
	n := len(closes)
	out := make([]float64, n)
	for i := range out {
		out[i] = math.NaN()
	}

	if period <= 0 || n <= period {
		return out
	}

	// Compute initial average gain and loss over the first `period` changes.
	var sumGain, sumLoss float64
	for i := 1; i <= period; i++ {
		change := closes[i] - closes[i-1]
		if change > 0 {
			sumGain += change
		} else {
			sumLoss -= change // store as positive
		}
	}
	avgGain := sumGain / float64(period)
	avgLoss := sumLoss / float64(period)

	// The first valid RSI is at index `period`.
	if avgLoss == 0 {
		out[period] = 100
	} else {
		rs := avgGain / avgLoss
		out[period] = 100 - (100 / (1 + rs))
	}

	// Wilder smoothing for subsequent values.
	for i := period + 1; i < n; i++ {
		change := closes[i] - closes[i-1]
		gain := 0.0
		loss := 0.0
		if change > 0 {
			gain = change
		} else {
			loss = -change
		}
		avgGain = (avgGain*float64(period-1) + gain) / float64(period)
		avgLoss = (avgLoss*float64(period-1) + loss) / float64(period)

		if avgLoss == 0 {
			out[i] = 100
		} else {
			rs := avgGain / avgLoss
			out[i] = 100 - (100 / (1 + rs))
		}
	}

	return out
}

// EMA computes exponential moving average with the given period.
// Seed: first value is SMA of first `period` elements.
// Multiplier: 2 / (period + 1).
// Returns same-length slice; first `period-1` elements are NaN (warmup).
func EMA(values []float64, period int) []float64 {
	n := len(values)
	out := make([]float64, n)
	for i := range out {
		out[i] = math.NaN()
	}

	if period <= 0 || n < period {
		return out
	}

	// Seed with SMA of first `period` elements.
	var sum float64
	for i := range period {
		sum += values[i]
	}
	ema := sum / float64(period)
	out[period-1] = ema

	k := 2.0 / float64(period+1)
	for i := period; i < n; i++ {
		ema = values[i]*k + ema*(1-k)
		out[i] = ema
	}

	return out
}

// MRC computes the Mean Reversion Channel over `period` bars using `series` as input (typically HLC3).
// Centerline: SMA(series, period)
// Upper: center + 2 * rolling population stddev(series, period)
// Lower: center - 2 * rolling population stddev(series, period)
// Returns three same-length slices (center, upper, lower); first `period-1` elements are NaN.
func MRC(series []float64, period int) (center, upper, lower []float64) {
	n := len(series)
	center = make([]float64, n)
	upper = make([]float64, n)
	lower = make([]float64, n)

	nan := math.NaN()
	for i := range center {
		center[i] = nan
		upper[i] = nan
		lower[i] = nan
	}

	if period <= 0 || n < period {
		return
	}

	for i := period - 1; i < n; i++ {
		// Compute mean over window [i-period+1, i].
		var mean float64
		for j := i - period + 1; j <= i; j++ {
			mean += series[j]
		}
		mean /= float64(period)

		// Compute population variance.
		var variance float64
		for j := i - period + 1; j <= i; j++ {
			diff := series[j] - mean
			variance += diff * diff
		}
		variance /= float64(period)
		stddev := math.Sqrt(variance)

		center[i] = mean
		upper[i] = mean + 2*stddev
		lower[i] = mean - 2*stddev
	}

	return
}
