package main

import (
	"context"
	"fmt"
	"sync"
	"time"

	"github.com/dobyte/due/lock/redis/v2"
	"github.com/dobyte/due/v2/lock"
)

func main() {
	// 设置锁制造商
	lock.SetMaker(redis.NewMaker())

	var (
		wg      sync.WaitGroup
		ctx     = context.Background()
		total   = 100
		counter int
	)

	wg.Add(total)

	startTime := time.Now().UnixNano()

	for range total {
		go func() {
			defer wg.Done()

			locker := lock.Make("lock")

			if err := locker.Acquire(ctx); err == nil {
				defer locker.Release(ctx)

				counter++
			}
		}()
	}

	wg.Wait()

	fmt.Printf("total	: %d\n", total)
	fmt.Printf("latency	: %fs\n", float64(time.Now().UnixNano()-startTime)/float64(time.Second))
}
