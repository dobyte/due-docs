package mongo

import (
	"context"
	"fmt"
	"log"

	"github.com/dobyte/due/v2/core/pool"
	"github.com/dobyte/due/v2/etc"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var factory = pool.NewFactory(func(name string) (*Client, error) {
	return NewInstance(fmt.Sprintf("etc.mongo.%s", name))
})

type (
	Client = mongo.Client
)

type Config struct {
	DSN string `json:"dsn"` // 连接串
}

// Instance 获取实例
func Instance(name ...string) *Client {
	var (
		err error
		ins *Client
	)

	if len(name) == 0 {
		ins, err = factory.Get("default")
	} else {
		ins, err = factory.Get(name[0])
	}

	if err != nil {
		log.Fatalf("create mongo instance failed: %v", err)
	}

	return ins
}

// NewInstance 新建实例
func NewInstance[T string | Config | *Config](config T) (*Client, error) {
	var (
		conf *Config
		v    any = config
		ctx      = context.Background()
	)

	switch c := v.(type) {
	case string:
		conf = &Config{DSN: etc.Get(fmt.Sprintf("%s.dsn", c)).String()}
	case Config:
		conf = &c
	case *Config:
		conf = c
	}

	opts := options.Client().ApplyURI(conf.DSN)

	client, err := mongo.Connect(ctx, opts)
	if err != nil {
		return nil, err
	}

	return client, nil
}
