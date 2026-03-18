package cache

import (
	"github.com/redis/go-redis/v9"

	"github.com/huangchihan/deepvalue-lab-be/config"
)

func NewRedis(cfg config.Config) (*redis.Client, error) {
	if cfg.RedisURL == "" {
		return nil, nil
	}

	opts, err := redis.ParseURL(cfg.RedisURL)
	if err != nil {
		return nil, err
	}

	return redis.NewClient(opts), nil
}
