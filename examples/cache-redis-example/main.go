package main

import (
	"context"

	"github.com/dobyte/due/cache/redis/v2"
	"github.com/dobyte/due/v2/cache"
	"github.com/dobyte/due/v2/log"
	"github.com/dobyte/due/v2/utils/xtime"
)

func main() {
	// 设置缓存器
	cache.SetCache(redis.NewCache())

	// 从缓存中获取数据，如若缓存中不存在，则构建新的缓存
	unix, err := cache.GetSet(context.Background(), "unix", func() (any, error) {
		return xtime.Now().Unix(), nil
	}).Int64()
	if err != nil {
		log.Errorf("get set cache failed: %v", err)
		return
	}

	log.Infof("unix: %d", unix)
}
