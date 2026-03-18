package r2

import (
	"context"
	"fmt"
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

// ReportKey returns the canonical R2 key for a report artifact.
// Format: reports/{ticker}/{YYYYMMDD}/{reportID}.md
func ReportKey(ticker, date, reportID string) string {
	return fmt.Sprintf("reports/%s/%s/%s.md", ticker, date, reportID)
}

var Module = fx.Provide(NewClient)
