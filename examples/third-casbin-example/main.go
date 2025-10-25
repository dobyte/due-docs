package main

import (
	casbincomp "third-casbin-example/casbin"

	"github.com/dobyte/due/v2/log"
)

func main() {
	enforcer := casbincomp.Instance("default")

	// add a permission node for role
	ok, err := enforcer.AddPolicy("role_1", "node_1")
	if err != nil {
		log.Fatalf("Add policy exception:%s \n", err.Error())
	}

	if ok {
		log.Info("Add policy successful")
	} else {
		log.Info("Add policy failure")
	}
}
