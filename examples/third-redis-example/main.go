package main

import (
	"context"
	"third-redis-example/redis"

	"github.com/dobyte/due/v2/log"
)

func main() {
	rds := redis.Instance("default")

	if result, err := rds.Ping(context.Background()).Result(); err != nil {
		log.Errorf("redis connection error: %v", err)
	} else {
		log.Infof("redis ping result: %v", result)
	}
}
