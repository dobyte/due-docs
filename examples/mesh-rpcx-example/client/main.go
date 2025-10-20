package main

import (
	"context"
	"mesh-rpcx-example/service/client"
	"mesh-rpcx-example/service/pb"

	"github.com/dobyte/due/registry/consul/v2"
	"github.com/dobyte/due/transport/rpcx/v2"
	"github.com/dobyte/due/v2/log"
)

func main() {
	// 创建服务发现
	registry := consul.NewRegistry()
	// 构建传输器
	transporter := rpcx.NewTransporter()
	// 设置默认的服务发现组件
	transporter.SetDefaultDiscovery(registry)

	// 构建客户端
	cli, err := client.NewClient(transporter.NewClient)
	if err != nil {
		log.Errorf("create rpc client failed: %v", err)
		return
	}

	// 发起RPC调用
	reply, err := cli.Hello(context.Background(), &pb.HelloArgs{Name: "fuxiao"})
	if err != nil {
		log.Errorf("invoke rpc func failed: %v", err)
		return
	}

	log.Infof("invoke rpc func replay: %v", reply)
}
