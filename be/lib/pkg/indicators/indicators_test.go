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
