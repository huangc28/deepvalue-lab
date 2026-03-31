package r2

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"strings"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"go.uber.org/fx"

	"github.com/huangchihan/deepvalue-lab-be/config"
)

type Client struct {
	s3     *s3.Client
	bucket string
}

func NewClient(cfg *config.Config) (*Client, error) {
	accountID := strings.TrimSpace(cfg.R2.AccountID)
	if accountID == "" {
		return nil, fmt.Errorf("r2: R2_ACCOUNT_ID is required")
	}
	if strings.TrimSpace(cfg.R2.Bucket) == "" {
		return nil, fmt.Errorf("r2: R2_BUCKET is required")
	}
	if strings.TrimSpace(cfg.R2.AccessKeyID) == "" || strings.TrimSpace(cfg.R2.SecretAccessKey) == "" {
		return nil, fmt.Errorf("r2: R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY are required")
	}

	endpoint := fmt.Sprintf("https://%s.r2.cloudflarestorage.com", accountID)

	s3Client := s3.New(s3.Options{
		BaseEndpoint: aws.String(endpoint),
		Region:       "auto",
		Credentials:  credentials.NewStaticCredentialsProvider(cfg.R2.AccessKeyID, cfg.R2.SecretAccessKey, ""),
	})

	return &Client{
		s3:     s3Client,
		bucket: cfg.R2.Bucket,
	}, nil
}

// UploadMarkdown uploads raw markdown content to R2 and returns the object key.
func (c *Client) UploadMarkdown(ctx context.Context, key, content string) error {
	_, err := c.s3.PutObject(ctx, &s3.PutObjectInput{
		Bucket:      aws.String(c.bucket),
		Key:         aws.String(key),
		Body:        strings.NewReader(content),
		ContentType: aws.String("text/markdown; charset=utf-8"),
	})
	return err
}

// UploadJSON uploads raw JSON content to R2.
func (c *Client) UploadJSON(ctx context.Context, key string, data []byte) error {
	_, err := c.s3.PutObject(ctx, &s3.PutObjectInput{
		Bucket:      aws.String(c.bucket),
		Key:         aws.String(key),
		Body:        bytes.NewReader(data),
		ContentType: aws.String("application/json"),
	})
	return err
}

// Download fetches an object from R2 and returns its contents.
func (c *Client) Download(ctx context.Context, key string) ([]byte, error) {
	out, err := c.s3.GetObject(ctx, &s3.GetObjectInput{
		Bucket: aws.String(c.bucket),
		Key:    aws.String(key),
	})
	if err != nil {
		return nil, err
	}
	defer out.Body.Close()
	return io.ReadAll(out.Body)
}

// Ping validates R2 connectivity by issuing a HeadBucket request.
func (c *Client) Ping(ctx context.Context) error {
	_, err := c.s3.HeadBucket(ctx, &s3.HeadBucketInput{
		Bucket: aws.String(c.bucket),
	})
	return err
}

// ReportKey returns the canonical R2 key for a report artifact.
// Format: reports/{ticker}/{YYYYMMDD}/{reportID}.md
func ReportKey(ticker, date, reportID string) string {
	return fmt.Sprintf("reports/%s/%s/%s.md", ticker, date, reportID)
}

// DetailKey returns the canonical R2 key for a StockDetail JSON artifact.
// Format: reports/{ticker}/{YYYYMMDD}/{reportID}.json
func DetailKey(ticker, date, reportID string) string {
	return fmt.Sprintf("reports/%s/%s/%s.json", ticker, date, reportID)
}

// DetailKeyZhTW returns the canonical R2 key for a zh-TW StockDetail JSON artifact.
// Format: reports/{ticker}/{YYYYMMDD}/{reportID}.zh-TW.json
func DetailKeyZhTW(ticker, date, reportID string) string {
	return fmt.Sprintf("reports/%s/%s/%s.zh-TW.json", ticker, date, reportID)
}

// TechnicalSnapshotKey returns the canonical R2 key for a technical snapshot JSON artifact.
// Format: reports/{ticker}/{YYYYMMDD}/{reportID}.technical-snapshot.json
func TechnicalSnapshotKey(ticker, date, reportID string) string {
	return fmt.Sprintf("reports/%s/%s/%s.technical-snapshot.json", ticker, date, reportID)
}

// TechnicalSnapshotKeyZhTW returns the canonical R2 key for a zh-TW technical snapshot artifact.
// Format: reports/{ticker}/{YYYYMMDD}/{reportID}.technical-snapshot.zh-TW.json
func TechnicalSnapshotKeyZhTW(ticker, date, reportID string) string {
	return fmt.Sprintf("reports/%s/%s/%s.technical-snapshot.zh-TW.json", ticker, date, reportID)
}

// OHLCKey returns the R2 key for the raw normalized OHLC bars for a report.
// This is an intermediate artifact produced by the ingestion pipeline and consumed by the indicator pipeline.
// Format: stocks/{ticker}/ohlc/{reportID}.json
func OHLCKey(ticker, reportID string) string {
	return fmt.Sprintf("stocks/%s/ohlc/%s.json", ticker, reportID)
}

// OHLCIntradayKey returns the R2 key for the raw native intraday OHLC bars for a report.
// Format: stocks/{ticker}/ohlc-15m/{reportID}.json
func OHLCIntradayKey(ticker, reportID string) string {
	return fmt.Sprintf("stocks/%s/ohlc-15m/%s.json", ticker, reportID)
}

var Module = fx.Provide(NewClient)
