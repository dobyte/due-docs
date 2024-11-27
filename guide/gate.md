# 网关服务器 {#gate}

## 基础介绍 {#gate-introduction}

网关服务器作为所有客户端的入口，通常具备以下功能：

- 为客户端提供连接支持
- 管理并维持客户端连接
- 转发客户端消息到目标节点服务器
- 下发后端服务器消息到指定客户端 

在 [due](https://github.com/dobyte/due) 框架中，网关服（Gate）采用模块化的架构思路，开发者可以根据自身的业务情况任意搭配模块化组件。

## 示例代码 {#gate-example}

以下完整示例详见：[gate](https://github.com/dobyte/due-examples/tree/master/cluster/simple/gate)

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

## 启动服务 {#gate-start}

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

## 启动配置 {#gate-etc}

这里仅展示网关服（Gate）相关配置参数，如需了解更多模块的参数配置，请查看[启动配置](/guide/etc)

```toml
# 进程号
pid = "./run/gate.pid"
# 开发模式。支持模式：debug、test、release（设置优先级：配置文件 < 环境变量 < 运行参数 < mode.SetMode()）
mode = "debug"
# 统一时区设置。项目中的时间获取请使用xtime.Now()
timezone = "Local"
# 容器关闭最大等待时间。支持单位：纳秒（ns）、微秒（us | µs）、毫秒（ms）、秒（s）、分（m）、小时（h）、天（d）。默认为0
shutdownMaxWaitTime = "0s"

[cluster.gate]
    # 实例ID，网关集群中唯一。不填写默认自动生成唯一的实例ID
    id = ""
    # 实例名称
    name = "gate"
    # 内建RPC服务器监听地址。不填写默认随机监听
    addr = ":0"
    # RPC调用超时时间
    timeout = "1s"

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

[network.ws.server]
    # 服务器监听地址
    addr = ":3553"
    # 客户端连接路径
    path = "/"
    # 服务器最大连接数
    maxConnNum = 5000
    # 秘钥文件
    keyFile = ""
    # 证书文件
    certFile = ""
    # 跨域检测，空数组时不允许任何连接升级成websocket，未设置此参数时允许所有的链接升级成websocket
    origins = ["*"]
    # 握手超时时间，支持单位：纳秒（ns）、微秒（us | µs）、毫秒（ms）、秒（s）、分（m）、小时（h）、天（d）。默认为10s
    handshakeTimeout = "10s"
    # 心跳检测间隔时间。设置为0则不启用心跳检测，支持单位：纳秒（ns）、微秒（us | µs）、毫秒（ms）、秒（s）、分（m）、小时（h）、天（d）。默认为10s
    heartbeatInterval = "10s"
    # 心跳机制，默认为resp响应式心跳。可选：resp 响应式心跳 | tick 定时主推心跳
    heartbeatMechanism = "resp"
    # 下行心跳是否携带服务器时间，默认为true
    heartbeatWithServerTime = true

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