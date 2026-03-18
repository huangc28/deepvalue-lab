package config

import (
	"strings"

	"github.com/spf13/viper"
)

type Config struct {
	AppName  string `mapstructure:"app_name"`
	AppEnv   string `mapstructure:"app_env"`
	AppPort  int    `mapstructure:"app_port"`
	LogLevel string `mapstructure:"log_level"`
	RedisURL string `mapstructure:"redis_url"`
	PGURL    string `mapstructure:"pg_url"`

	TursoSQLite struct {
		DSN    string `mapstructure:"dsn"`
		Token  string `mapstructure:"token"`
		Path   string `mapstructure:"path"`
		Driver string `mapstructure:"driver"`
	} `mapstructure:"turso_sqlite"`

	R2 struct {
		AccountID       string `mapstructure:"account_id"`
		Bucket          string `mapstructure:"bucket"`
		AccessKeyID     string `mapstructure:"access_key_id"`
		SecretAccessKey string `mapstructure:"secret_access_key"`
		PublicBaseURL   string `mapstructure:"public_base_url"`
	} `mapstructure:"r2"`
}

func NewViper() *viper.Viper {
	v := viper.New()
	v.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))
	v.AutomaticEnv()

	v.SetDefault("app_name", "be")
	v.SetDefault("app_env", "development")
	v.SetDefault("app_port", 8080)
	v.SetDefault("log_level", "info")
	v.SetDefault("redis_url", "")
	v.SetDefault("pg_url", "")
	v.SetDefault("turso_sqlite.dsn", "")
	v.SetDefault("turso_sqlite.token", "")
	v.SetDefault("turso_sqlite.path", "")
	v.SetDefault("turso_sqlite.driver", "libsql")

	v.SetDefault("r2.account_id", "")
	v.SetDefault("r2.bucket", "")
	v.SetDefault("r2.access_key_id", "")
	v.SetDefault("r2.secret_access_key", "")
	v.SetDefault("r2.public_base_url", "")

	return v
}

func NewConfig(v *viper.Viper) (*Config, error) {
	var cfg *Config
	if err := v.Unmarshal(&cfg); err != nil {
		return &Config{}, err
	}
	return cfg, nil
}
