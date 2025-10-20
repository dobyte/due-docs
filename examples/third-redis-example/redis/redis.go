package redis

import (
	"fmt"
	"time"

	"github.com/dobyte/due/v2/core/pool"
	"github.com/dobyte/due/v2/core/tls"
	"github.com/dobyte/due/v2/etc"
	"github.com/dobyte/due/v2/log"
	"github.com/go-redis/redis/v8"
)

var factory = pool.NewFactory(func(name string) (Redis, error) {
	return NewInstance(fmt.Sprintf("etc.redis.%s", name))
})

type (
	Redis  = redis.UniversalClient
	Script = redis.Script
)

type Config struct {
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

// Instance 获取实例
func Instance(name ...string) Redis {
	var (
		err error
		ins Redis
	)

	if len(name) == 0 {
		ins, err = factory.Get("default")
	} else {
		ins, err = factory.Get(name[0])
	}

	if err != nil {
		log.Fatalf("create redis instance failed: %v", err)
	}

	return ins
}

// NewInstance 新建实例
func NewInstance[T string | Config | *Config](config T) (Redis, error) {
	var (
		conf *Config
		v    any = config
	)

	switch c := v.(type) {
	case string:
		conf = &Config{
			Addrs:        etc.Get(fmt.Sprintf("%s.addrs", c)).Strings(),
			DB:           etc.Get(fmt.Sprintf("%s.db", c)).Int(),
			CertFile:     etc.Get(fmt.Sprintf("%s.certFile", c)).String(),
			KeyFile:      etc.Get(fmt.Sprintf("%s.keyFile", c)).String(),
			CaFile:       etc.Get(fmt.Sprintf("%s.caFile", c)).String(),
			Username:     etc.Get(fmt.Sprintf("%s.username", c)).String(),
			Password:     etc.Get(fmt.Sprintf("%s.password", c)).String(),
			MaxRetries:   etc.Get(fmt.Sprintf("%s.maxRetries", c), 3).Int(),
			PoolSize:     etc.Get(fmt.Sprintf("%s.poolSize", c), 200).Int(),
			MinIdleConns: etc.Get(fmt.Sprintf("%s.minIdleConns", c), 20).Int(),
			DialTimeout:  etc.Get(fmt.Sprintf("%s.dialTimeout", c), "3s").Duration(),
			IdleTimeout:  etc.Get(fmt.Sprintf("%s.idleTimeout", c)).Duration(),
			ReadTimeout:  etc.Get(fmt.Sprintf("%s.readTimeout", c), "1s").Duration(),
			WriteTimeout: etc.Get(fmt.Sprintf("%s.writeTimeout", c), "1s").Duration(),
		}
	case Config:
		conf = &c
	case *Config:
		conf = c
	}

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

	return redis.NewUniversalClient(options), nil
}
