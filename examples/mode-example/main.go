package main

import (
	"github.com/dobyte/due/v2/log"
	"github.com/dobyte/due/v2/mode"
)

func main() {
	log.Infof("mode: %s", mode.GetMode())
	log.Infof("debug mode: %v", mode.IsDebugMode())
	log.Infof("test mode: %v", mode.IsTestMode())
	log.Infof("release mode: %v", mode.IsReleaseMode())
}
