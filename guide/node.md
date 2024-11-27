# 节点服务器 {#node}

## 基础介绍 {#node-introduction}

节点服（Node）作为游戏业务开发的核心模块，通常具备以下功能：

- 处理经由网关服（Gate）转发的来自客户端（Client）的路由消息
- 通过网关服（Gate）下发消息到指定客户端（Client）
- 为其他后端服务器提供完善的调用接口

在 [due](https://github.com/dobyte/due) 框架中，节点服（Node）采用模块化的架构思路，开发者可以根据自身的业务情况任意搭配模块化组件。

## 调度模型 {#node-scheduling}

在 [due](https://github.com/dobyte/due) 框架中，节点服（Node）处理路由消息统一采用单线程调度。开发者可以根据自身业务需要对调度模型进行动态改变。

- 单线程：在AddRouteHandler()注册的路由处理器下直接处理消息，此时调度模型就是单线程。
- 多协程：在AddRouteHandler()注册的路由处理器下调用ctx.Task()将消息投递到协程池（goroutine pool）中进行处理，此时调度模型就从单线程转变为多协程。
- Actor: 在AddRouteHandler()注册的路由处理器下调用ctx.Next()或ctx.Actor()将消息投递到actor中进行处理，此时调度模型就从单线程转变为Actor模型。

## 示例代码 {#node-example}

以下完整示例详见：[node](https://github.com/dobyte/due-examples/tree/master/cluster/simple/node)

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
	// 初始化应用
	initApp(component.Proxy())
	// 添加节点组件
	container.Add(component)
	// 启动容器
	container.Serve()
}

// 初始化应用
func initApp(proxy *node.Proxy) {
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

这里仅展示节点服（Node）相关配置参数，如需了解更多模块的参数配置，请查看[启动配置](/guide/etc)

```toml
# 进程号
pid = "./run/node.pid"
# 开发模式。支持模式：debug、test、release（设置优先级：配置文件 < 环境变量 < 运行参数 < mode.SetMode()）
mode = "debug"
# 统一时区设置。项目中的时间获取请使用xtime.Now()
timezone = "Local"
# 容器关闭最大等待时间。支持单位：纳秒（ns）、微秒（us | µs）、毫秒（ms）、秒（s）、分（m）、小时（h）、天（d）。默认为0
shutdownMaxWaitTime = "0s"

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

[locate.redis]
    # 客户端连接地址
    addrs = ["127.0.0.1:6379"]
    # 数据库号
    db = 0
    # 用户名
    username = ""
    # 密码
    password = ""
    # 最大重试次数
    maxRetries = 3
    # key前缀
    prefix = "due"

[registry.consul]
    # 客户端连接地址，默认为127.0.0.1:8500
    addr = "127.0.0.1:8500"
    # 是否启用健康检查，默认为true
    healthCheck = true
    # 健康检查时间间隔（秒），仅在启用健康检查后生效，默认为10
    healthCheckInterval = 10
    # 健康检查超时时间（秒），仅在启用健康检查后生效，默认为5
    healthCheckTimeout = 5
    # 是否启用心跳检查，默认为true
    heartbeatCheck = true
    # 心跳检查时间间隔（秒），仅在启用心跳检查后生效，默认为10
    heartbeatCheckInterval = 10
    # 健康检测失败后自动注销服务时间（秒），默认为30
    deregisterCriticalServiceAfter = 30

[packet]
    # 字节序，默认为big。可选：little | big
    byteOrder = "big"
    # 路由字节数，默认为2字节
    routeBytes = 4
    # 序列号字节数，默认为2字节
    seqBytes = 0
    # 消息字节数，默认为5000字节
    bufferBytes = 100000

[log]
    # 日志输出文件
    file = "./log/due.log"
    # 日志输出级别，可选：debug | info | warn | error | fatal | panic
    level = "debug"
    # 日志输出格式，可选：text | json
    format = "text"
    # 是否输出到终端
    stdout = true
    # 时间格式，标准库时间格式
    timeFormat = "2006/01/02 15:04:05.000000"
    # 堆栈的最低输出级别，可选：debug | info | warn | error | fatal | panic
    stackLevel = "error"
    # 文件最大留存时间，d:天、h:时、m:分、s:秒
    fileMaxAge = "7d"
    # 文件最大尺寸限制，单位（MB）
    fileMaxSize = 100
    # 文件切割方式
    fileCutRule = "day"
    # 是否启用调用文件全路径
    callerFullPath = true
    # 是否启用分级存储
    classifiedStorage = false
```