package massive

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"

	"go.uber.org/fx"

	"github.com/huangchihan/deepvalue-lab-be/config"
)

const baseURL = "https://api.massive.com"

// Bar represents a single aggregate OHLC bar.
type Bar struct {
	TimestampMs int64   `json:"t"`
	Date        string  `json:"date"`
	Open        float64 `json:"open"`
	High        float64 `json:"high"`
	Low         float64 `json:"low"`
	Close       float64 `json:"close"`
	Volume      float64 `json:"volume"`
}

// Client fetches historical market data from the Massive API.
type Client struct {
	apiKey     string
	httpClient *http.Client
}

// NewClient constructs a Massive client. Requires MASSIVE_API_KEY.
func NewClient(cfg *config.Config) (*Client, error) {
	key := strings.TrimSpace(cfg.Massive.APIKey)
	if key == "" {
		return nil, fmt.Errorf("massive: MASSIVE_API_KEY is required")
	}
	return &Client{
		apiKey:     key,
		httpClient: &http.Client{Timeout: 30 * time.Second},
	}, nil
}

// FetchDailyBars returns adjusted daily OHLC bars for ticker between from and to (inclusive).
func (c *Client) FetchDailyBars(ctx context.Context, ticker string, from, to time.Time) ([]Bar, error) {
	return c.FetchAggregates(ctx, ticker, 1, "day", from, to)
}

// FetchIntradayBars returns adjusted intraday OHLC bars for ticker between from and to (inclusive).
// The multiplier should be a minute interval such as 15 for native 15M source bars.
func (c *Client) FetchIntradayBars(ctx context.Context, ticker string, multiplier int, from, to time.Time) ([]Bar, error) {
	return c.FetchAggregates(ctx, ticker, multiplier, "minute", from, to)
}

// FetchAggregates returns adjusted OHLC bars for a ticker over a given range.
// It follows pagination via next_url until all results are collected.
func (c *Client) FetchAggregates(ctx context.Context, ticker string, multiplier int, timespan string, from, to time.Time) ([]Bar, error) {
	requestURL, err := buildAggregatesURL(ticker, multiplier, timespan, from, to)
	if err != nil {
		return nil, err
	}

	var bars []Bar
	for requestURL != "" {
		batch, nextURL, err := c.fetchPage(ctx, requestURL)
		if err != nil {
			return nil, err
		}
		bars = append(bars, batch...)
		requestURL = nextURL
	}

	return bars, nil
}

type aggregatesResponse struct {
	Status  string `json:"status"`
	Results []struct {
		T float64 `json:"t"` // unix millisecond timestamp
		O float64 `json:"o"`
		H float64 `json:"h"`
		L float64 `json:"l"`
		C float64 `json:"c"`
		V float64 `json:"v"`
	} `json:"results"`
	NextURL string `json:"next_url"`
}

func buildAggregatesURL(ticker string, multiplier int, timespan string, from, to time.Time) (string, error) {
	if multiplier <= 0 {
		return "", fmt.Errorf("massive: multiplier must be positive")
	}

	if timespan == "" {
		return "", fmt.Errorf("massive: timespan is required")
	}

	requestURL, err := url.Parse(fmt.Sprintf(
		"%s/v2/aggs/ticker/%s/range/%d/%s/%s/%s",
		baseURL,
		url.PathEscape(ticker),
		multiplier,
		timespan,
		from.Format("2006-01-02"),
		to.Format("2006-01-02"),
	))
	if err != nil {
		return "", fmt.Errorf("massive: build request url: %w", err)
	}

	params := requestURL.Query()
	params.Set("adjusted", "true")
	params.Set("sort", "asc")
	params.Set("limit", "50000")
	requestURL.RawQuery = params.Encode()

	return requestURL.String(), nil
}

func (c *Client) fetchPage(ctx context.Context, url string) ([]Bar, string, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return nil, "", fmt.Errorf("massive: build request: %w", err)
	}
	req.Header.Set("Authorization", "Bearer "+c.apiKey)

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, "", fmt.Errorf("massive: request failed: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, "", fmt.Errorf("massive: read response body: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		return nil, "", fmt.Errorf("massive: unexpected status %d: %s", resp.StatusCode, string(body))
	}

	var result aggregatesResponse
	if err := json.Unmarshal(body, &result); err != nil {
		return nil, "", fmt.Errorf("massive: decode response: %w", err)
	}

	bars := make([]Bar, 0, len(result.Results))
	for _, r := range result.Results {
		timestampMs := int64(r.T)
		date := time.UnixMilli(timestampMs).UTC().Format("2006-01-02")
		bars = append(bars, Bar{
			TimestampMs: timestampMs,
			Date:        date,
			Open:        r.O,
			High:        r.H,
			Low:         r.L,
			Close:       r.C,
			Volume:      r.V,
		})
	}

	// Append API key to next_url if present (Massive requires it).
	nextURL := result.NextURL
	if nextURL != "" && !strings.Contains(nextURL, "apiKey=") {
		sep := "&"
		if !strings.Contains(nextURL, "?") {
			sep = "?"
		}
		nextURL = nextURL + sep + "apiKey=" + c.apiKey
	}

	return bars, nextURL, nil
}

var Module = fx.Provide(NewClient)
