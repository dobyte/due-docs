# 网关服务器 {#gate}

## 介绍 {#gate-introduction}

网关服务器作为所有客户端的入口，通常具备以下功能：

- 为客户端提供连接支持
- 管理并维持客户端连接
- 转发客户端消息到目标节点服务器
- 下发后端服务器消息到指定客户端 

[due](https://github.com/dobyte/due)的网关服务器采用模块化的架构思路，开发者可以根据自身的业务情况任意搭配模块化组件。

## 示例 {#gate-example}

```go
package main

import (
	"github.com/dobyte/due/locate/redis/v2"
	"github.com/dobyte/due/network/ws/v2"
	"github.com/dobyte/due/registry/consul/v2"
	"github.com/dobyte/due/v2"
	"github.com/dobyte/due/v2/cluster/gate"
)

func main() {
	// 创建容器
	container := due.NewContainer()
	// 创建服务器
	server := ws.NewServer()
	// 创建用户定位器
	locator := redis.NewLocator()
	// 创建服务发现
	registry := consul.NewRegistry()
	// 创建网关组件
	component := gate.NewGate(
		gate.WithServer(server),
		gate.WithLocator(locator),
		gate.WithRegistry(registry),
	)
	// 添加网关组件
	container.Add(component)
	// 启动容器
	container.Serve()
}
```

## 启动 {#gate-start}

```shell
$ go run main.go
                    ____  __  ________
                   / __ \/ / / / ____/
                  / / / / / / / __/
                 / /_/ / /_/ / /___
                /_____/\____/_____/
┌──────────────────────────────────────────────────────┐
| [Website] https://github.com/dobyte/due              |
| [Version] v2.2.1                                     |
└──────────────────────────────────────────────────────┘
┌────────────────────────Global────────────────────────┐
| PID: 27159                                           |
| Mode: debug                                          |
└──────────────────────────────────────────────────────┘
┌─────────────────────────Gate─────────────────────────┐
| Name: gate                                           |
| Link: 172.22.243.151:46545                           |
| Server: [ws] 0.0.0.0:3553                            |
| Locator: redis                                       |
| Registry: consul                                     |
└──────────────────────────────────────────────────────┘
```

## 配置 {#gate-etc}

这里仅展示网关服务器配置参数，如需了解更多模块的参数配置，请查看[启动配置](/guide/etc)

```toml
# 集群网关配置
[cluster.gate]
    # 实例ID，网关集群中唯一。不填写默认自动生成唯一的实例ID
    id = ""
    # 实例名称
    name = "gate"
    # 内建RPC服务器监听地址。不填写默认随机监听
    addr = ":0"
    # RPC调用超时时间，支持单位：纳秒（ns）、微秒（us | µs）、毫秒（ms）、秒（s）、分（m）、小时（h）、天（d）。默认为3s
    timeout = "3s"
```