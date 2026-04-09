package rabbitmq

import (
	"context"
	"fmt"
	"net/url"
	"strings"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
	"go.uber.org/fx"
	"go.uber.org/zap"

	"github.com/huangchihan/deepvalue-lab-be/config"
)

// NewConnection creates an AMQP connection and registers a shutdown hook.
func NewConnection(cfg *config.Config, lc fx.Lifecycle, logger *zap.Logger) (*amqp.Connection, error) {
	url := strings.TrimSpace(cfg.RabbitMQ.URL)
	if url == "" {
		return nil, fmt.Errorf("rabbitmq: RABBITMQ_URL is required")
	}

	logger.Info("connecting rabbitmq",
		zap.String("target", summarizeURL(url)),
	)

	conn, err := amqp.Dial(url)
	if err != nil {
		return nil, fmt.Errorf("rabbitmq: dial: %w", err)
	}

	lc.Append(fx.Hook{
		OnStop: func(ctx context.Context) error {
			logger.Info("closing rabbitmq connection")
			return conn.Close()
		},
	})

	return conn, nil
}

func summarizeURL(raw string) string {
	parsed, err := url.Parse(raw)
	if err != nil {
		return "invalid"
	}

	host := parsed.Hostname()
	if host == "" {
		host = parsed.Host
	}

	port := parsed.Port()
	vhost := strings.TrimPrefix(parsed.Path, "/")
	if vhost == "" {
		vhost = "(default)"
	}

	if port != "" {
		return fmt.Sprintf("%s://%s:%s/%s", parsed.Scheme, host, port, vhost)
	}

	return fmt.Sprintf("%s://%s/%s", parsed.Scheme, host, vhost)
}

// Publisher publishes messages to a durable queue.
type Publisher struct {
	conn   *amqp.Connection
	logger *zap.Logger
}

func NewPublisher(conn *amqp.Connection, logger *zap.Logger) *Publisher {
	return &Publisher{conn: conn, logger: logger}
}

// Publish declares the queue and publishes body as a persistent message.
func (p *Publisher) Publish(ctx context.Context, queue string, body []byte) error {
	ch, err := p.conn.Channel()
	if err != nil {
		return fmt.Errorf("rabbitmq: open channel: %w", err)
	}
	defer ch.Close()

	if _, err := ch.QueueDeclare(queue, true, false, false, false, nil); err != nil {
		return fmt.Errorf("rabbitmq: declare queue %q: %w", queue, err)
	}

	return ch.PublishWithContext(ctx, "", queue, false, false, amqp.Publishing{
		ContentType:  "application/json",
		DeliveryMode: amqp.Persistent,
		Body:         body,
	})
}

// Consumer consumes messages from a durable queue with manual ack.
type Consumer struct {
	conn   *amqp.Connection
	logger *zap.Logger
}

func NewConsumer(conn *amqp.Connection, logger *zap.Logger) *Consumer {
	return &Consumer{conn: conn, logger: logger}
}

const maxRetries = 3

// Consume subscribes to queue and calls handler for each delivery.
// On handler error it retries up to maxRetries times before nacking without requeue.
// Blocks until ctx is cancelled or the channel closes.
func (c *Consumer) Consume(ctx context.Context, queue string, handler func([]byte) error) error {
	ch, err := c.conn.Channel()
	if err != nil {
		return fmt.Errorf("rabbitmq: open channel: %w", err)
	}
	defer ch.Close()

	if _, err := ch.QueueDeclare(queue, true, false, false, false, nil); err != nil {
		return fmt.Errorf("rabbitmq: declare queue %q: %w", queue, err)
	}

	if err := ch.Qos(1, 0, false); err != nil {
		return fmt.Errorf("rabbitmq: set qos: %w", err)
	}

	deliveries, err := ch.Consume(queue, "", false, false, false, false, nil)
	if err != nil {
		return fmt.Errorf("rabbitmq: start consume: %w", err)
	}

	for {
		select {
		case <-ctx.Done():
			return ctx.Err()
		case d, ok := <-deliveries:
			if !ok {
				return fmt.Errorf("rabbitmq: delivery channel closed")
			}
			c.handleWithRetry(d, handler)
		}
	}
}

func (c *Consumer) handleWithRetry(d amqp.Delivery, handler func([]byte) error) {
	var lastErr error
	for attempt := 1; attempt <= maxRetries; attempt++ {
		if err := handler(d.Body); err != nil {
			lastErr = err
			c.logger.Warn("rabbitmq handler error, retrying",
				zap.Int("attempt", attempt),
				zap.Int("max_retries", maxRetries),
				zap.Error(err),
			)
			time.Sleep(time.Duration(attempt) * 500 * time.Millisecond)
			continue
		}
		_ = d.Ack(false)
		return
	}
	c.logger.Error("rabbitmq handler failed after max retries, nacking",
		zap.Int("max_retries", maxRetries),
		zap.Error(lastErr),
	)
	_ = d.Nack(false, false)
}

var Module = fx.Options(
	fx.Provide(NewConnection),
	fx.Provide(NewPublisher),
	fx.Provide(NewConsumer),
)
