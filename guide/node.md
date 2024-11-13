# 节点服务器 {#node}

## 基础介绍 {#node-introduction}

节点服（node）作为游戏业务开发的核心模块，通常具备以下功能：

- 处理经由网关服（gate）转发的来自客户端（client）的路由消息
- 通过网关服（gate）下发消息到指定客户端（client）
- 为其他后端服务器提供完善的调用接口

在[due](https://github.com/dobyte/due)框架中，节点服（node）采用模块化的架构思路，开发者可以根据自身的业务情况任意搭配模块化组件。

## 调度模型 {#node-scheduling}

在[due](https://github.com/dobyte/due)框架中，节点服（node）处理路由消息统一采用单线程调度。开发者可以根据自身业务需要对调度模型进行动态改变。

- 单线程：在AddRouteHandler()注册的路由处理器下直接处理消息，此时调度模型就是单线程。
- 多协程：在AddRouteHandler()注册的路由处理器下调用ctx.Task()将消息投递到协程池（goroutine pool）中进行处理，此时调度模型就从单线程转变为多协程。
- Actor: 在AddRouteHandler()注册的路由处理器下调用ctx.Next()或ctx.Actor()将消息投递到actor中进行处理，此时调度模型就从单线程转变为Actor模型。

## 示例代码 {#node-example}

```go
package main

import (
	"fmt"
	"github.com/dobyte/due/locate/redis/v2"
	"github.com/dobyte/due/registry/consul/v2"
	"github.com/dobyte/due/v2"
	"github.com/dobyte/due/v2/cluster/node"
	"github.com/dobyte/due/v2/codes"
	"github.com/dobyte/due/v2/log"
	"github.com/dobyte/due/v2/utils/xtime"
)

// 路由号
const greet = 1

func main() {
	// 创建容器
	container := due.NewContainer()
	// 创建用户定位器
	locator := redis.NewLocator()
	// 创建服务发现
	registry := consul.NewRegistry()
	// 创建节点组件
	component := node.NewNode(
		node.WithLocator(locator),
		node.WithRegistry(registry),
	)
	// 初始化监听
	initListen(component.Proxy())
	// 添加节点组件
	container.Add(component)
	// 启动容器
	container.Serve()
}

// 初始化监听
func initListen(proxy *node.Proxy) {
	proxy.Router().AddRouteHandler(greet, false, greetHandler)
}

// 请求
type greetReq struct {
	Message string `json:"message"`
}

// 响应
type greetRes struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

// 路由处理器
func greetHandler(ctx node.Context) {
	req := &greetReq{}
	res := &greetRes{}
	defer func() {
		if err := ctx.Response(res); err != nil {
			log.Errorf("response message failed: %v", err)
		}
	}()

	if err := ctx.Parse(req); err != nil {
		log.Errorf("parse request message failed: %v", err)
		res.Code = codes.InternalError.Code()
		return
	}

	log.Info(req.Message)

	res.Code = codes.OK.Code()
	res.Message = fmt.Sprintf("I'm server, and the current time is: %s", xtime.Now().Format(xtime.DateTime))
}
```

## 启动服务 {#node-start}

```bash
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
| PID: 35908                                           |
| Mode: debug                                          |
└──────────────────────────────────────────────────────┘
┌─────────────────────────Node─────────────────────────┐
| Name: node                                           |
| Link: 192.168.2.202:55273                            |
| Codec: json                                          |
| Locator: redis                                       |
| Registry: consul                                     |
| Encryptor: -                                         |
| Transporter: -                                       |
└──────────────────────────────────────────────────────┘
```

## 启动配置 {#node-etc}

这里仅展示节点服（node）配置参数，如需了解更多模块的参数配置，请查看[启动配置](/guide/etc)

```toml
# 集群节点配置
[cluster.node]
    # 实例ID，网关集群中唯一。不填写默认自动生成唯一的实例ID
    id = ""
    # 实例名称
    name = "node"
    # 内建RPC服务器监听地址。不填写默认随机监听
    addr = ":0"
    # 编解码器。可选：json | proto。默认为proto
    codec = "json"
    # RPC调用超时时间，支持单位：纳秒（ns）、微秒（us | µs）、毫秒（ms）、秒（s）、分（m）、小时（h）、天（d）。默认为3s
    timeout = "3s"
```