package main

import (
	"context"
	"time"

	"github.com/dobyte/due/config/consul/v2"
	"github.com/dobyte/due/v2/config"
	"github.com/dobyte/due/v2/log"
)

const filename = "config.toml"

func main() {
	// 设置consul配置中心
	config.SetConfigurator(config.NewConfigurator(config.WithSources(consul.NewSource())))

	// 更新配置
	if err := config.Store(context.Background(), consul.Name, filename, map[string]any{
		"timezone": "Local",
	}); err != nil {
		log.Errorf("store config failed: %v", err)
		return
	}

	// 等待配置文件写入
	time.Sleep(time.Second)

	// 读取配置
	timezone := config.Get("config.timezone").String()
	log.Infof("timezone: %s", timezone)

	// 更新配置
	if err := config.Store(context.Background(), consul.Name, filename, map[string]any{
		"timezone": "UTC",
	}); err != nil {
		log.Errorf("store config failed: %v", err)
		return
	}

	// 等待配置文件写入
	time.Sleep(time.Second)

	// 读取配置
	timezone = config.Get("config.timezone").String()
	log.Infof("timezone: %s", timezone)
}
