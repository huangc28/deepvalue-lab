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

	// Find the first non-NaN index to start seeding from.
	// This handles cases where the input slice begins with NaN warmup values
	// (e.g., when computing EMA on RSI output).
	firstValid := -1
	for i := range n {
		if !math.IsNaN(values[i]) {
			firstValid = i
			break
		}
	}
	// Not enough non-NaN values to form a seed.
	if firstValid < 0 || n-firstValid < period {
		return out
	}

	// Seed with SMA of `period` non-NaN elements starting at firstValid.
	var sum float64
	for i := firstValid; i < firstValid+period; i++ {
		sum += values[i]
	}
	ema := sum / float64(period)
	seedIdx := firstValid + period - 1
	out[seedIdx] = ema

	k := 2.0 / float64(period+1)
	for i := seedIdx + 1; i < n; i++ {
		ema = values[i]*k + ema*(1-k)
		out[i] = ema
	}

	return out
}

// TrueRange computes True Range for each bar.
// First bar (no prior close): TrueRange = high - low.
// Subsequent bars: max(high-low, |high-prevClose|, |low-prevClose|).
func TrueRange(highs, lows, closes []float64) []float64 {
	n := len(closes)
	out := make([]float64, n)
	if n == 0 {
		return out
	}
	out[0] = highs[0] - lows[0]
	for i := 1; i < n; i++ {
		hl := highs[i] - lows[i]
		hpc := math.Abs(highs[i] - closes[i-1])
		lpc := math.Abs(lows[i] - closes[i-1])
		out[i] = math.Max(hl, math.Max(hpc, lpc))
	}
	return out
}

// SuperSmoother applies the John Ehlers 2-pole SuperSmoother IIR filter to src with the given period.
//
// Coefficients follow Ehlers (2013) "Cycle Analytics for Traders":
//
//	a1 = exp(-sqrt(2) * π / period)
//	b1 = 2 * a1 * cos(sqrt(2) * π / period)
//	c2 = b1
//	c3 = -a1²
//	c1 = 1 - c2 - c3
//	ss[i] = c1 * (src[i] + src[i-1]) / 2 + c2 * ss[i-1] + c3 * ss[i-2]
//
// Seeded from src[0] using the Pine Script nz() fallback convention:
// bars before the series starts are treated as if they equal the first src value.
// This matches the fareidzulkifli MRI Variant Pine implementation.
func SuperSmoother(src []float64, period int) []float64 {
	n := len(src)
	out := make([]float64, n)
	if n == 0 || period <= 0 {
		return out
	}

	a1 := math.Exp(-math.Sqrt2 * math.Pi / float64(period))
	b1 := 2 * a1 * math.Cos(math.Sqrt2*math.Pi/float64(period))
	c2 := b1
	c3 := -a1 * a1
	c1 := 1 - c2 - c3

	// bar 0: all prior ss and src values fall back to src[0]
	// simplifies to: out[0] = src[0] * (c1 + c2 + c3) = src[0]
	out[0] = src[0]
	if n > 1 {
		// bar 1: ss[-1] = out[0], ss[-2] falls back to src[1] (Pine nz convention)
		out[1] = c1*(src[1]+src[0])/2 + c2*out[0] + c3*src[1]
	}
	for i := 2; i < n; i++ {
		out[i] = c1*(src[i]+src[i-1])/2 + c2*out[i-1] + c3*out[i-2]
	}
	return out
}

// MRCTVPoint holds the five canonical TradingView-aligned MRC band values for one bar.
// Produced by MRCTV; caller should treat the first `period` values as warmup.
type MRCTVPoint struct {
	Center     float64
	InnerUpper float64
	InnerLower float64
	OuterUpper float64
	OuterLower float64
}

// MRCTV computes the TradingView-aligned Mean Reversion Channel using SuperSmoother.
//
// Provisional algorithm (fareidzulkifli MRI Variant — pending fixture-grade confirmation):
//
//	meanLine  = SuperSmoother(hlc3, period)
//	meanRange = SuperSmoother(TrueRange, period)
//	innerUpper = meanLine + meanRange * innerMult
//	innerLower = meanLine - meanRange * innerMult
//	outerUpper = meanLine + meanRange * outerMult
//	outerLower = meanLine - meanRange * outerMult
//
// Canonical parameters: period=200, innerMult=1.0, outerMult=2.415.
// SuperSmoother implementation source: Ehlers (2013), coefficients confirmed via Pine reconstruction.
// Algorithm status: PROVISIONAL — parity cannot be declared complete without fixture-grade TradingView artifacts.
func MRCTV(highs, lows, closes []float64, period int, innerMult, outerMult float64) []MRCTVPoint {
	n := len(closes)
	out := make([]MRCTVPoint, n)
	if n == 0 {
		return out
	}
	hlc3 := HLC3(highs, lows, closes)
	tr := TrueRange(highs, lows, closes)
	meanLine := SuperSmoother(hlc3, period)
	meanRange := SuperSmoother(tr, period)
	for i := range out {
		ml := meanLine[i]
		mr := meanRange[i]
		out[i] = MRCTVPoint{
			Center:     ml,
			InnerUpper: ml + mr*innerMult,
			InnerLower: ml - mr*innerMult,
			OuterUpper: ml + mr*outerMult,
			OuterLower: ml - mr*outerMult,
		}
	}
	return out
}

// MRC computes the Mean Reversion Channel over `period` bars using `series` as input (typically HLC3).
// Centerline: SMA(series, period)
// Upper: center + 2 * rolling population stddev(series, period)
// Lower: center - 2 * rolling population stddev(series, period)
// Returns three same-length slices (center, upper, lower); first `period-1` elements are NaN.
//
// Deprecated: This is the legacy approximate MRC. Use MRCTV for the TradingView-aligned implementation.
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
