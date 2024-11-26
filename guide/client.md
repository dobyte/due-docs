# 测试客户端 {#client}

## 基础介绍 {#client-introduction}

测试客户端（Client）作为日常开发调试的一种重要工具，为游戏开发者提供了非常便捷的接口方案。开发者可以借助flag包来接收不同的输入参数从而控制不同的客户端行为。同时，框架提供的测试客户端（Client）也具备非常出色的性能，可作为压测客户端提供性能压测支持。

## 示例代码 {#client-example}

```go
package main

import (
	"fmt"
	"github.com/dobyte/due/eventbus/nats/v2"
	"github.com/dobyte/due/network/ws/v2"
	"github.com/dobyte/due/v2"
	"github.com/dobyte/due/v2/cluster"
	"github.com/dobyte/due/v2/cluster/client"
	"github.com/dobyte/due/v2/eventbus"
	"github.com/dobyte/due/v2/log"
	"github.com/dobyte/due/v2/utils/xtime"
	"time"
)

// 路由号
const greet = 1

func main() {
	// 创建容器
	container := due.NewContainer()
	// 创建客户端组件
	component := client.NewClient(
		client.WithClient(ws.NewClient()),
	)
	// 初始化监听
	initListen(component.Proxy())
	// 添加客户端组件
	container.Add(component)
	// 启动容器
	container.Serve()
}

func initListen(proxy *client.Proxy) {
	// 监听组件启动
	proxy.AddHookListener(cluster.Start, startHandler)
	// 监听连接建立
	proxy.AddEventListener(cluster.Connect, connectHandler)
	// 监听消息回复
	proxy.AddRouteHandler(greet, greetHandler)
}

// 组件启动处理器
func startHandler(proxy *client.Proxy) {
	if _, err := proxy.Dial(); err != nil {
		log.Errorf("connect server failed: %v", err)
		return
	}
}

// 连接建立处理器
func connectHandler(conn *client.Conn) {
	pushMessage(conn)
}

// 消息回复处理器
func greetHandler(ctx *client.Context) {
	res := &greetRes{}

	if err := ctx.Parse(res); err != nil {
		log.Errorf("invalid response message, err: %v", err)
		return
	}

	if res.Code != 0 {
		log.Errorf("node response failed, code: %d", res.Code)
		return
	}

	log.Info(res.Message)

	time.AfterFunc(time.Second, func() {
		pushMessage(ctx.Conn())
	})
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

// 推送消息
func pushMessage(conn *client.Conn) {
	err := conn.Push(&cluster.Message{
		Route: 1,
		Data: &greetReq{
			Message: fmt.Sprintf("I'm client, and the current time is: %s", xtime.Now().Format(xtime.DateTime)),
		},
	})
	if err != nil {
		log.Errorf("push message failed: %v", err)
	}
}
```

## 启动服务 {#client-start}

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
| PID: 8576                                            |
| Mode: debug                                          |
└──────────────────────────────────────────────────────┘
┌────────────────────────Client────────────────────────┐
| Name: client                                         |
| Codec: json                                          |
| Protocol: ws                                         |
| Encryptor: -                                         |
└──────────────────────────────────────────────────────┘
INFO[2024/11/13 20:08:19.072805] main.go:72 [I'm server, and the current time is: 2024-11-13 20:08:19]
INFO[2024/11/13 20:08:20.079161] main.go:72 [I'm server, and the current time is: 2024-11-13 20:08:20]
INFO[2024/11/13 20:08:21.088877] main.go:72 [I'm server, and the current time is: 2024-11-13 20:08:21]
INFO[2024/11/13 20:08:22.095964] main.go:72 [I'm server, and the current time is: 2024-11-13 20:08:22]
INFO[2024/11/13 20:08:23.101359] main.go:72 [I'm server, and the current time is: 2024-11-13 20:08:23]
INFO[2024/11/13 20:08:24.107933] main.go:72 [I'm server, and the current time is: 2024-11-13 20:08:24]
INFO[2024/11/13 20:08:25.113744] main.go:72 [I'm server, and the current time is: 2024-11-13 20:08:25]
INFO[2024/11/13 20:08:26.124384] main.go:72 [I'm server, and the current time is: 2024-11-13 20:08:26]
INFO[2024/11/13 20:08:27.133305] main.go:72 [I'm server, and the current time is: 2024-11-13 20:08:27]
```

## 启动配置 {#client-etc}

这里仅展示测试客户端相关配置参数，如需了解更多模块的参数配置，请查看[启动配置](/guide/etc)

```toml
# 进程号
pid = "./run/client.pid"
# 开发模式。支持模式：debug、test、release（模式优先级：环境变量 < 配置文件 < 运行参数）
mode = "debug"
# 统一时区设置。项目中的时间获取请使用xtime.Now()
timezone = "Local"

# 集群客户端配置，常用于调试使用
[cluster.client]
    # 实例ID，网关集群中唯一。不填写默认自动生成唯一的实例ID
    id = ""
    # 实例名称
    name = "client"
    # 编解码器。可选：json | proto
    codec = "json"

[network.ws.client]
    # 拨号地址
    url = "ws://127.0.0.1:3553"
    # 握手超时时间，支持单位：纳秒（ns）、微秒（us | µs）、毫秒（ms）、秒（s）、分（m）、小时（h）、天（d）。默认为10s
    handshakeTimeout = "10s"
    # 心跳间隔时间。设置为0则不启用心跳检测，支持单位：纳秒（ns）、微秒（us | µs）、毫秒（ms）、秒（s）、分（m）、小时（h）、天（d）。默认为10s
    heartbeatInterval = "10s"

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
    callerFullPath = false
    # 是否启用分级存储
    classifiedStorage = false
```