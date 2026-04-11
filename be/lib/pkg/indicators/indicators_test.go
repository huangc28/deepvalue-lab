package indicators

import (
	"math"
	"testing"
)

// almostEqual checks two floats are within epsilon of each other.
func almostEqual(a, b, epsilon float64) bool {
	return math.Abs(a-b) <= epsilon
}

// TestHLC3 verifies basic HLC3 calculation.
func TestHLC3(t *testing.T) {
	tests := []struct {
		name   string
		highs  []float64
		lows   []float64
		closes []float64
		want   []float64
	}{
		{
			name:   "basic three bars",
			highs:  []float64{10, 20, 30},
			lows:   []float64{5, 15, 25},
			closes: []float64{8, 18, 28},
			// (10+5+8)/3=7.667, (20+15+18)/3=17.667, (30+25+28)/3=27.667
			want: []float64{23.0 / 3.0, 53.0 / 3.0, 83.0 / 3.0},
		},
		{
			name:   "single bar",
			highs:  []float64{100},
			lows:   []float64{80},
			closes: []float64{90},
			want:   []float64{90.0},
		},
		{
			name:   "empty",
			highs:  []float64{},
			lows:   []float64{},
			closes: []float64{},
			want:   []float64{},
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			got := HLC3(tc.highs, tc.lows, tc.closes)
			if len(got) != len(tc.want) {
				t.Fatalf("len mismatch: got %d, want %d", len(got), len(tc.want))
			}
			for i, w := range tc.want {
				if !almostEqual(got[i], w, 1e-9) {
					t.Errorf("index %d: got %.10f, want %.10f", i, got[i], w)
				}
			}
		})
	}
}

// TestRSI verifies RSI warmup, range, and extreme-up case.
func TestRSI(t *testing.T) {
	t.Run("warmup positions are NaN", func(t *testing.T) {
		// 20 bars with period=14; first 14 should be NaN.
		closes := make([]float64, 20)
		for i := range closes {
			closes[i] = float64(i + 1)
		}
		period := 14
		out := RSI(closes, period)
		if len(out) != len(closes) {
			t.Fatalf("length mismatch")
		}
		for i := range period {
			if !math.IsNaN(out[i]) {
				t.Errorf("index %d should be NaN, got %f", i, out[i])
			}
		}
	})

	t.Run("non-warmup values in [0, 100]", func(t *testing.T) {
		closes := make([]float64, 50)
		for i := range closes {
			// Zigzag prices
			if i%2 == 0 {
				closes[i] = 100 + float64(i)*0.5
			} else {
				closes[i] = 100 - float64(i)*0.3
			}
		}
		period := 14
		out := RSI(closes, period)
		for i := period; i < len(out); i++ {
			if math.IsNaN(out[i]) {
				t.Errorf("index %d unexpectedly NaN", i)
				continue
			}
			if out[i] < 0 || out[i] > 100 {
				t.Errorf("index %d: RSI %f out of [0, 100]", i, out[i])
			}
		}
	})

	t.Run("all up-moves approach RSI 100", func(t *testing.T) {
		// 14 identical up-moves of +1 each: no losses, RSI should be 100.
		period := 14
		// Need period+1 closes to get period changes; add one more to get first valid output.
		closes := make([]float64, period+1)
		for i := range closes {
			closes[i] = float64(i) // strictly increasing
		}
		out := RSI(closes, period)
		// Only one valid value at index `period`.
		v := out[period]
		if math.IsNaN(v) {
			t.Fatalf("expected valid RSI at index %d, got NaN", period)
		}
		if !almostEqual(v, 100.0, 1e-9) {
			t.Errorf("expected RSI ≈ 100, got %f", v)
		}
	})

	t.Run("period > len returns all NaN", func(t *testing.T) {
		closes := []float64{1, 2, 3}
		out := RSI(closes, 10)
		for i, v := range out {
			if !math.IsNaN(v) {
				t.Errorf("index %d should be NaN, got %f", i, v)
			}
		}
	})

	t.Run("empty input", func(t *testing.T) {
		out := RSI([]float64{}, 14)
		if len(out) != 0 {
			t.Errorf("expected empty slice, got len %d", len(out))
		}
	})
}

// TestEMA verifies EMA warmup and constant-series behavior.
func TestEMA(t *testing.T) {
	t.Run("warmup positions are NaN", func(t *testing.T) {
		period := 5
		values := make([]float64, 20)
		for i := range values {
			values[i] = float64(i + 1)
		}
		out := EMA(values, period)
		if len(out) != len(values) {
			t.Fatalf("length mismatch")
		}
		// First period-1 should be NaN; index period-1 is first valid.
		for i := 0; i < period-1; i++ {
			if !math.IsNaN(out[i]) {
				t.Errorf("index %d should be NaN, got %f", i, out[i])
			}
		}
		if math.IsNaN(out[period-1]) {
			t.Errorf("index %d should be valid, got NaN", period-1)
		}
	})

	t.Run("EMA of constant series equals constant", func(t *testing.T) {
		period := 5
		const c = 42.0
		values := make([]float64, 20)
		for i := range values {
			values[i] = c
		}
		out := EMA(values, period)
		for i := period - 1; i < len(out); i++ {
			if !almostEqual(out[i], c, 1e-9) {
				t.Errorf("index %d: EMA of constant got %f, want %f", i, out[i], c)
			}
		}
	})

	t.Run("period > len returns all NaN", func(t *testing.T) {
		out := EMA([]float64{1, 2}, 5)
		for i, v := range out {
			if !math.IsNaN(v) {
				t.Errorf("index %d should be NaN, got %f", i, v)
			}
		}
	})

	t.Run("empty input", func(t *testing.T) {
		out := EMA([]float64{}, 5)
		if len(out) != 0 {
			t.Errorf("expected empty slice, got len %d", len(out))
		}
	})
}

// TestTrueRange verifies TrueRange first-bar fallback and standard TR formula.
func TestTrueRange(t *testing.T) {
	t.Run("empty input", func(t *testing.T) {
		out := TrueRange([]float64{}, []float64{}, []float64{})
		if len(out) != 0 {
			t.Errorf("expected empty, got len %d", len(out))
		}
	})

	t.Run("first bar uses high-low fallback", func(t *testing.T) {
		// No prior close available; TR = high - low.
		out := TrueRange([]float64{110}, []float64{90}, []float64{100})
		if !almostEqual(out[0], 20.0, 1e-9) {
			t.Errorf("first bar TR: got %f, want 20.0", out[0])
		}
	})

	t.Run("gap-up bar dominated by high-prevClose", func(t *testing.T) {
		// close[0]=100, high[1]=130, low[1]=105
		// hl=25, hpc=|130-100|=30, lpc=|105-100|=5 => TR=30
		highs := []float64{110, 130}
		lows := []float64{90, 105}
		closes := []float64{100, 115}
		out := TrueRange(highs, lows, closes)
		if !almostEqual(out[1], 30.0, 1e-9) {
			t.Errorf("gap-up bar TR: got %f, want 30.0", out[1])
		}
	})

	t.Run("gap-down bar dominated by low-prevClose", func(t *testing.T) {
		// close[0]=100, high[1]=85, low[1]=70
		// hl=15, hpc=|85-100|=15, lpc=|70-100|=30 => TR=30
		highs := []float64{110, 85}
		lows := []float64{90, 70}
		closes := []float64{100, 75}
		out := TrueRange(highs, lows, closes)
		if !almostEqual(out[1], 30.0, 1e-9) {
			t.Errorf("gap-down bar TR: got %f, want 30.0", out[1])
		}
	})

	t.Run("normal bar dominated by high-low", func(t *testing.T) {
		// close[0]=100, high[1]=108, low[1]=95
		// hl=13, hpc=8, lpc=5 => TR=13
		highs := []float64{105, 108}
		lows := []float64{95, 95}
		closes := []float64{100, 102}
		out := TrueRange(highs, lows, closes)
		if !almostEqual(out[1], 13.0, 1e-9) {
			t.Errorf("normal bar TR: got %f, want 13.0", out[1])
		}
	})
}

// TestSuperSmoother verifies the Ehlers 2-pole SuperSmoother filter.
func TestSuperSmoother(t *testing.T) {
	t.Run("empty input", func(t *testing.T) {
		out := SuperSmoother([]float64{}, 200)
		if len(out) != 0 {
			t.Errorf("expected empty, got len %d", len(out))
		}
	})

	t.Run("zero or negative period returns zero-filled", func(t *testing.T) {
		out := SuperSmoother([]float64{1, 2, 3}, 0)
		for i, v := range out {
			if v != 0 {
				t.Errorf("index %d: got %f, want 0", i, v)
			}
		}
	})

	t.Run("constant series converges to constant", func(t *testing.T) {
		// After warmup the SuperSmoother of a constant series must equal the constant.
		const c = 42.0
		const n = 500
		src := make([]float64, n)
		for i := range src {
			src[i] = c
		}
		out := SuperSmoother(src, 200)
		// Check the last 50 values are close to c.
		for i := n - 50; i < n; i++ {
			if !almostEqual(out[i], c, 1e-6) {
				t.Errorf("index %d: got %f, want %f (tolerance 1e-6)", i, out[i], c)
			}
		}
	})

	t.Run("output length equals input length", func(t *testing.T) {
		src := make([]float64, 30)
		for i := range src {
			src[i] = float64(i)
		}
		out := SuperSmoother(src, 10)
		if len(out) != len(src) {
			t.Errorf("length mismatch: got %d, want %d", len(out), len(src))
		}
	})

	t.Run("single element returns that element", func(t *testing.T) {
		out := SuperSmoother([]float64{7.5}, 200)
		if len(out) != 1 || !almostEqual(out[0], 7.5, 1e-9) {
			t.Errorf("single element: got %v, want [7.5]", out)
		}
	})

	t.Run("smoothed output is smoother than input", func(t *testing.T) {
		// Noisy zigzag: the SS output range should be much narrower than input range.
		n := 300
		src := make([]float64, n)
		for i := range src {
			if i%2 == 0 {
				src[i] = 100.0
			} else {
				src[i] = 110.0
			}
		}
		out := SuperSmoother(src, 20)
		// After warmup the SS values should be tightly clustered between 100 and 110.
		for i := 100; i < n; i++ {
			if out[i] < 99 || out[i] > 111 {
				t.Errorf("index %d: SS value %f outside expected range [99,111]", i, out[i])
			}
		}
	})
}

// TestMRCTV verifies the TradingView-aligned MRC computation.
func TestMRCTV(t *testing.T) {
	t.Run("empty input", func(t *testing.T) {
		out := MRCTV([]float64{}, []float64{}, []float64{}, 200, 1.0, 2.415)
		if len(out) != 0 {
			t.Errorf("expected empty, got len %d", len(out))
		}
	})

	t.Run("output length equals input length", func(t *testing.T) {
		n := 50
		highs := make([]float64, n)
		lows := make([]float64, n)
		closes := make([]float64, n)
		for i := range n {
			closes[i] = float64(100 + i)
			highs[i] = closes[i] + 2
			lows[i] = closes[i] - 2
		}
		out := MRCTV(highs, lows, closes, 10, 1.0, 2.415)
		if len(out) != n {
			t.Errorf("length mismatch: got %d, want %d", len(out), n)
		}
	})

	t.Run("band ordering: outerLower <= innerLower <= center <= innerUpper <= outerUpper", func(t *testing.T) {
		// After warmup the band ordering must always hold (non-trivial series).
		n := 500
		highs := make([]float64, n)
		lows := make([]float64, n)
		closes := make([]float64, n)
		for i := range n {
			closes[i] = 100 + float64(i%13)*1.5
			highs[i] = closes[i] + 3
			lows[i] = closes[i] - 2
		}
		out := MRCTV(highs, lows, closes, 20, 1.0, 2.415)
		for i := 20; i < n; i++ {
			p := out[i]
			if p.OuterLower > p.InnerLower+1e-9 {
				t.Errorf("index %d: outerLower %f > innerLower %f", i, p.OuterLower, p.InnerLower)
			}
			if p.InnerLower > p.Center+1e-9 {
				t.Errorf("index %d: innerLower %f > center %f", i, p.InnerLower, p.Center)
			}
			if p.Center > p.InnerUpper+1e-9 {
				t.Errorf("index %d: center %f > innerUpper %f", i, p.Center, p.InnerUpper)
			}
			if p.InnerUpper > p.OuterUpper+1e-9 {
				t.Errorf("index %d: innerUpper %f > outerUpper %f", i, p.InnerUpper, p.OuterUpper)
			}
		}
	})

	t.Run("constant price series: all bands equal center", func(t *testing.T) {
		// Constant OHLC => TR=0 => meanRange=0 => all bands = center.
		n := 500
		const price = 150.0
		highs := make([]float64, n)
		lows := make([]float64, n)
		closes := make([]float64, n)
		for i := range n {
			highs[i] = price
			lows[i] = price
			closes[i] = price
		}
		out := MRCTV(highs, lows, closes, 20, 1.0, 2.415)
		for i := 100; i < n; i++ {
			p := out[i]
			if !almostEqual(p.Center, price, 1e-6) {
				t.Errorf("index %d: center %f != %f", i, p.Center, price)
			}
			if !almostEqual(p.InnerUpper, price, 1e-6) {
				t.Errorf("index %d: innerUpper %f != %f", i, p.InnerUpper, price)
			}
			if !almostEqual(p.InnerLower, price, 1e-6) {
				t.Errorf("index %d: innerLower %f != %f", i, p.InnerLower, price)
			}
			if !almostEqual(p.OuterUpper, price, 1e-6) {
				t.Errorf("index %d: outerUpper %f != %f", i, p.OuterUpper, price)
			}
			if !almostEqual(p.OuterLower, price, 1e-6) {
				t.Errorf("index %d: outerLower %f != %f", i, p.OuterLower, price)
			}
		}
	})

	t.Run("outer bands are wider than inner bands by outerMult/innerMult ratio", func(t *testing.T) {
		// For non-zero meanRange: outerWidth / innerWidth should approach outerMult / innerMult.
		n := 500
		highs := make([]float64, n)
		lows := make([]float64, n)
		closes := make([]float64, n)
		for i := range n {
			closes[i] = 100 + float64(i%17)*2.0
			highs[i] = closes[i] + 5
			lows[i] = closes[i] - 3
		}
		innerMult := 1.0
		outerMult := 2.415
		out := MRCTV(highs, lows, closes, 20, innerMult, outerMult)
		for i := 100; i < n; i++ {
			p := out[i]
			innerWidth := p.InnerUpper - p.Center
			outerWidth := p.OuterUpper - p.Center
			if innerWidth < 1e-9 {
				continue // skip degenerate bars
			}
			ratio := outerWidth / innerWidth
			if !almostEqual(ratio, outerMult/innerMult, 1e-6) {
				t.Errorf("index %d: band ratio %f, want %f", i, ratio, outerMult/innerMult)
			}
		}
	})
}

// TestMRC verifies MRC warmup and constant-series behavior.
func TestMRC(t *testing.T) {
	t.Run("warmup positions are NaN", func(t *testing.T) {
		period := 5
		series := make([]float64, 20)
		for i := range series {
			series[i] = float64(i + 1)
		}
		center, upper, lower := MRC(series, period)
		if len(center) != len(series) || len(upper) != len(series) || len(lower) != len(series) {
			t.Fatalf("length mismatch")
		}
		for i := 0; i < period-1; i++ {
			if !math.IsNaN(center[i]) {
				t.Errorf("center[%d] should be NaN, got %f", i, center[i])
			}
			if !math.IsNaN(upper[i]) {
				t.Errorf("upper[%d] should be NaN, got %f", i, upper[i])
			}
			if !math.IsNaN(lower[i]) {
				t.Errorf("lower[%d] should be NaN, got %f", i, lower[i])
			}
		}
	})

	t.Run("constant series: upper == lower == center", func(t *testing.T) {
		period := 5
		const c = 50.0
		series := make([]float64, 20)
		for i := range series {
			series[i] = c
		}
		center, upper, lower := MRC(series, period)
		for i := period - 1; i < len(series); i++ {
			if !almostEqual(center[i], c, 1e-9) {
				t.Errorf("center[%d]: got %f, want %f", i, center[i], c)
			}
			if !almostEqual(upper[i], c, 1e-9) {
				t.Errorf("upper[%d]: got %f, want %f", i, upper[i], c)
			}
			if !almostEqual(lower[i], c, 1e-9) {
				t.Errorf("lower[%d]: got %f, want %f", i, lower[i], c)
			}
		}
	})

	t.Run("period > len returns all NaN", func(t *testing.T) {
		center, upper, lower := MRC([]float64{1, 2}, 10)
		for i := range center {
			if !math.IsNaN(center[i]) || !math.IsNaN(upper[i]) || !math.IsNaN(lower[i]) {
				t.Errorf("index %d should all be NaN", i)
			}
		}
	})

	t.Run("empty input", func(t *testing.T) {
		center, upper, lower := MRC([]float64{}, 5)
		if len(center) != 0 || len(upper) != 0 || len(lower) != 0 {
			t.Errorf("expected empty slices")
		}
	})

	t.Run("upper >= center >= lower for non-constant series", func(t *testing.T) {
		period := 10
		series := make([]float64, 50)
		for i := range series {
			series[i] = float64(i%7) * 3.14
		}
		center, upper, lower := MRC(series, period)
		for i := period - 1; i < len(series); i++ {
			if upper[i] < center[i]-1e-9 {
				t.Errorf("upper[%d] < center[%d]: %f < %f", i, i, upper[i], center[i])
			}
			if center[i] < lower[i]-1e-9 {
				t.Errorf("center[%d] < lower[%d]: %f < %f", i, i, center[i], lower[i])
			}
		}
	})
}
