package main

import (
	"context"
	"time"

	"github.com/dobyte/due/eventbus/redis/v2"
	"github.com/dobyte/due/v2/eventbus"
	"github.com/dobyte/due/v2/log"
)

type Payload struct {
	Message string `json:"message"`
}

func main() {
	// 设置事件总线
	eventbus.SetEventbus(redis.NewEventbus())

	var (
		ctx   = context.Background()
		topic = "message"
	)

	// 订阅事件
	eventbus.Subscribe(ctx, topic, func(evt *eventbus.Event) {
		payload := &Payload{}

		if err := evt.Payload.Scan(payload); err != nil {
			log.Errorf("scan payload failed: %v", err)
			return
		}

		log.Infof("evt id: %s, topic: %s, payload message: %s", evt.ID, evt.Topic, payload.Message)
	})

	ticker := time.NewTicker(1 * time.Second)
	defer ticker.Stop()

	for {
		<-ticker.C

		// 发布事件
		eventbus.Publish(ctx, topic, &Payload{
			Message: "hello world",
		})
	}
}
