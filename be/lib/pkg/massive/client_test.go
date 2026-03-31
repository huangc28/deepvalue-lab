package massive

import (
	"net/url"
	"testing"
	"time"
)

func TestBuildAggregatesURL(t *testing.T) {
	from := time.Date(2026, 3, 1, 0, 0, 0, 0, time.UTC)
	to := time.Date(2026, 3, 31, 0, 0, 0, 0, time.UTC)

	rawURL, err := buildAggregatesURL("TSM", 15, "minute", from, to)
	if err != nil {
		t.Fatalf("buildAggregatesURL: %v", err)
	}

	parsed, err := url.Parse(rawURL)
	if err != nil {
		t.Fatalf("parse url: %v", err)
	}

	if got := parsed.Path; got != "/v2/aggs/ticker/TSM/range/15/minute/2026-03-01/2026-03-31" {
		t.Fatalf("unexpected path: %q", got)
	}

	query := parsed.Query()
	if got := query.Get("adjusted"); got != "true" {
		t.Fatalf("unexpected adjusted param: %q", got)
	}
	if got := query.Get("sort"); got != "asc" {
		t.Fatalf("unexpected sort param: %q", got)
	}
	if got := query.Get("limit"); got != "50000" {
		t.Fatalf("unexpected limit param: %q", got)
	}
}
