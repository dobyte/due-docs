package jwt

import (
	"context"
	"time"

	"github.com/dobyte/due/v2/core/tls"
	"github.com/dobyte/due/v2/utils/xconv"
	"github.com/go-redis/redis/v8"
)

type StoreConfig struct {
	Addrs        []string      `json:"addrs"`
	DB           int           `json:"db"`
	Username     string        `json:"username"`
	Password     string        `json:"password"`
	CertFile     string        `json:"certFile"`
	KeyFile      string        `json:"keyFile"`
	CaFile       string        `json:"caFile"`
	MaxRetries   int           `json:"maxRetries"`
	PoolSize     int           `json:"poolSize"`
	MinIdleConns int           `json:"minIdleConns"`
	IdleTimeout  time.Duration `json:"idleTimeout"`
	DialTimeout  time.Duration `json:"dialTimeout"`
	ReadTimeout  time.Duration `json:"readTimeout"`
	WriteTimeout time.Duration `json:"writeTimeout"`
}

type Store struct {
	redis redis.UniversalClient
}

func NewStore(conf *StoreConfig) (*Store, error) {
	options := &redis.UniversalOptions{
		Addrs:        conf.Addrs,
		DB:           conf.DB,
		Username:     conf.Username,
		Password:     conf.Password,
		MaxRetries:   conf.MaxRetries,
		PoolSize:     conf.PoolSize,
		MinIdleConns: conf.MinIdleConns,
		IdleTimeout:  conf.IdleTimeout,
		DialTimeout:  conf.DialTimeout,
		ReadTimeout:  conf.ReadTimeout,
		WriteTimeout: conf.WriteTimeout,
	}

	if conf.CertFile != "" && conf.KeyFile != "" && conf.CaFile != "" {
		if tlsConfig, err := tls.MakeRedisTLSConfig(conf.CertFile, conf.KeyFile, conf.CaFile); err != nil {
			return nil, err
		} else {
			options.TLSConfig = tlsConfig
		}
	}

	return &Store{redis: redis.NewUniversalClient(options)}, nil
}

func (s *Store) Get(ctx context.Context, key any) (any, error) {
	return s.redis.Get(ctx, xconv.String(key)).Result()
}

func (s *Store) Set(ctx context.Context, key any, value any, duration time.Duration) error {
	return s.redis.Set(ctx, xconv.String(key), value, duration).Err()
}

func (s *Store) Remove(ctx context.Context, keys ...any) (value any, err error) {
	list := make([]string, 0, len(keys))
	for _, key := range keys {
		list = append(list, xconv.String(key))
	}

	return s.redis.Del(ctx, list...).Result()
}
