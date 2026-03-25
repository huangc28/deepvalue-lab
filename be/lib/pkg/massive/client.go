package massive

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	"go.uber.org/fx"

	"github.com/huangchihan/deepvalue-lab-be/config"
)

const baseURL = "https://api.massive.com"

// Bar represents a single daily OHLC bar.
type Bar struct {
	Date   string  `json:"date"`
	Open   float64 `json:"open"`
	High   float64 `json:"high"`
	Low    float64 `json:"low"`
	Close  float64 `json:"close"`
	Volume float64 `json:"volume"`
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
// It follows pagination via next_url until all results are collected.
func (c *Client) FetchDailyBars(ctx context.Context, ticker string, from, to time.Time) ([]Bar, error) {
	url := fmt.Sprintf(
		"%s/v2/aggs/ticker/%s/range/1/day/%s/%s?adjusted=true&limit=5000",
		baseURL,
		ticker,
		from.Format("2006-01-02"),
		to.Format("2006-01-02"),
	)

	var bars []Bar
	for url != "" {
		batch, nextURL, err := c.fetchPage(ctx, url)
		if err != nil {
			return nil, err
		}
		bars = append(bars, batch...)
		url = nextURL
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
		date := time.UnixMilli(int64(r.T)).UTC().Format("2006-01-02")
		bars = append(bars, Bar{
			Date:   date,
			Open:   r.O,
			High:   r.H,
			Low:    r.L,
			Close:  r.C,
			Volume: r.V,
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
