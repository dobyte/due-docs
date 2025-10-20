package main

import (
	"third-jwt-example/jwt"

	"github.com/dobyte/due/v2/log"
)

func main() {
	ins := jwt.Instance("default")

	token, err := ins.GenerateToken(jwt.Payload{
		ins.IdentityKey(): 1,
		"nickname":        "fuxiao",
	})
	if err != nil {
		log.Errorf("generate token error: %v", err)
	} else {
		log.Infof("generate token success: %s", token.Token)
	}

	payload, err := ins.ExtractPayload(token.Token)
	if err != nil {
		log.Errorf("extract payload error: %v", err)
	} else {
		log.Infof("extract payload success: %v", payload)
	}
}
