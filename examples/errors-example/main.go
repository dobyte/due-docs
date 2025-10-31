package main

import (
	"github.com/dobyte/due/v2/codes"
	"github.com/dobyte/due/v2/errors"
	"github.com/dobyte/due/v2/log"
)

func main() {
	err := errors.NewError(codes.NewCode(404, "not found"))

	code := codes.Convert(err)

	log.Infof("error: %s", err.Error())
	log.Infof("code: %d", code.Code())
	log.Infof("message: %s", code.Message())
}
