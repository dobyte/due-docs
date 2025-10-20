package main

import (
	"context"
	"third-mongo-example/mongo"

	"github.com/dobyte/due/v2/log"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

func main() {
	client := mongo.Instance("default")

	if err := client.Ping(context.Background(), readpref.Primary()); err != nil {
		log.Errorf("mongo connection error: %v", err)
	} else {
		log.Infof("mongo connection success")
	}
}
