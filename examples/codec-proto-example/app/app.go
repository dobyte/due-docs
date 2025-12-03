package app

import (
	"codec-proto-example/app/logic"

	"github.com/dobyte/due/v2/cluster/node"
)

func Init(proxy *node.Proxy) {
	// 初始化逻辑层
	logic.NewCore(proxy).Init()
}
