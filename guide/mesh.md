# 网格服务器 {#mesh}

## 基础介绍 {#mesh-introduction}

网格服（Mesh）其实就是我们日常口中所说的微服务（Micro Service），主要用于构建一些无状态的业务逻辑开发。开发者可用于游戏服务器集群的中台开发，为集群中的其他服务提供数据业务支撑。

[due](https://github.com/dobyte/due) 框架目前已实现了 [GRPC](https://grpc.io/) 和 [RPCX](https://rpcx.io/) 两款主流RPC框架的接入。所有的开发方式和接入方式都保持了原有RPC框架的高度一致性，这样在保证用户开发习惯的同时可以极大地保证项目的稳定性。

## GRPC示例 {#mesh-grpc-example}

以下完整示例详见：[service](https://github.com/dobyte/due-examples/tree/master/cluster/service)

创建PB协议文件

```proto
syntax = "proto3";

option go_package = "./pb";

package pb;

service Greeter {
  rpc Hello (HelloArgs) returns (HelloReply) {}
}

message HelloArgs {
  string Name = 1;
}

message HelloReply {
  string Message = 1;
}
```

生成go文件

```bash
protoc --go_out=.. --go-grpc_out=.. *.proto
```

构建服务端逻辑

```go
package server

import (
	"context"
	"due-examples/cluster/service/internal/service/grpc/greeter/pb"
	"github.com/dobyte/due/v2/cluster/mesh"
)

type Server struct {
	pb.UnimplementedGreeterServer
	proxy *mesh.Proxy
}

var _ pb.GreeterServer = &Server{}

func NewServer(proxy *mesh.Proxy) *Server {
	return &Server{
		proxy: proxy,
	}
}

func (s *Server) Init() {
	s.proxy.AddServiceProvider("greeter", &pb.Greeter_ServiceDesc, s)
}

func (s *Server) Hello(_ context.Context, args *pb.HelloArgs) (*pb.HelloReply, error) {
	return &pb.HelloReply{Message: "Hello " + args.Name}, nil
}
```

构建调用客户端

```go
package client

import (
	"due-examples/cluster/service/internal/service/grpc/greeter/pb"
	"github.com/dobyte/due/v2/transport"
	"google.golang.org/grpc"
)

const target = "discovery://greeter"

func NewClient(fn transport.NewMeshClient) (pb.GreeterClient, error) {
	client, err := fn(target)
	if err != nil {
		return nil, err
	}

	return pb.NewGreeterClient(client.Client().(grpc.ClientConnInterface)), nil
}
```

构建网格服务器

```go
package main

import (
	"due-examples/cluster/service/internal/service/grpc/greeter/server"
	"github.com/dobyte/due/locate/redis/v2"
	"github.com/dobyte/due/registry/consul/v2"
	"github.com/dobyte/due/transport/grpc/v2"
	"github.com/dobyte/due/v2"
	"github.com/dobyte/due/v2/cluster/mesh"
)

func main() {
	// 创建容器
	container := due.NewContainer()
	// 创建用户定位器
	locator := redis.NewLocator()
	// 创建服务发现
	registry := consul.NewRegistry()
	// 创建RPC传输器
	transporter := grpc.NewTransporter()
	// 创建网格组件
	component := mesh.NewMesh(
		mesh.WithLocator(locator),
		mesh.WithRegistry(registry),
		mesh.WithTransporter(transporter),
	)
	// 初始化应用
	initGRPCServer(component.Proxy())
	// 添加网格组件
	container.Add(component)
	// 启动容器
	container.Serve()
}

// 初始化应用
func initGRPCServer(proxy *mesh.Proxy) {
	server.NewServer(proxy).Init()
}
```

调用方示例

```go
// 构建客户端
cli, err := client.NewClient(proxy.NewMeshClient)
if err != nil {
  log.Errorf("create rpc client failed: %v", err)
  return
}

// 发起RPC调用
reply, err := cli.Hello(ctx.Context(), &pb.HelloArgs{Name: req.Name})
if err != nil {
  log.Errorf("invoke rpc func failed: %v", err)
  return
}

log.Infof("invoke rpc func replay: %v", reply)
```

也可通过ctx.NewMeshClient来创建RPC客户端

```go
// 构建客户端
cli, _ := client.NewClient(ctx.NewMeshClient)
```

如果你的调用方压根不在节点服（Node）、网格服（Mesh）、Web服（Http）中，你也可以通过直接构建传输器来实现调用

```go
// 创建服务发现
registry := consul.NewRegistry()
// 构建传输器
transporter := rpcx.NewTransporter()
// 设置默认的服务发现组件
transporter.SetDefaultDiscovery(registry)
// 构建客户端
cli, _ := client.NewClient(transporter.NewClient)
```

## RPCX示例 {#mesh-rpcx-example}

以下完整示例详见：[service](https://github.com/dobyte/due-examples/tree/master/cluster/service)

创建PB协议文件

```proto
syntax = "proto3";

option go_package = "./pb";

package pb;

service Greeter {
  rpc Hello (HelloArgs) returns (HelloReply) {}
}

message HelloArgs {
  string Name = 1;
}

message HelloReply {
  string Message = 1;
}
```

生成go文件

```bash
protoc --go_out=.. --rpcx_out=.. *.proto
```

构建服务端逻辑

```go
package server

import (
	"context"
	"due-examples/cluster/service/internal/service/rpcx/greeter/pb"
	"github.com/dobyte/due/v2/cluster/mesh"
)

const (
	service     = "greeter" // 用于客户端定位服务，例如discovery://greeter
	servicePath = "Greeter" // 服务路径要与pb中的服务路径保持一致
)

type Server struct {
	proxy *mesh.Proxy
}

var _ pb.GreeterAble = &Server{}

func NewServer(proxy *mesh.Proxy) *Server {
	return &Server{
		proxy: proxy,
	}
}

func (s *Server) Init() {
	s.proxy.AddServiceProvider(service, servicePath, s)
}

func (s *Server) Hello(ctx context.Context, args *pb.HelloArgs, reply *pb.HelloReply) (err error) {
	reply.Message = "Hello " + args.Name
	return
}
```

构建调用客户端

```go
package client

import (
	"due-examples/cluster/service/internal/service/rpcx/greeter/pb"
	"github.com/dobyte/due/v2/transport"
	"github.com/smallnest/rpcx/client"
)

const target = "discovery://greeter"

func NewClient(fn transport.NewMeshClient) (*pb.GreeterOneClient, error) {
	c, err := fn(target)
	if err != nil {
		return nil, err
	}

	return pb.NewGreeterOneClient(c.Client().(*client.OneClient)), nil
}
```

构建网格服务器

```go
package main

import (
	"due-examples/cluster/service/internal/service/rpcx/greeter/server"
	"github.com/dobyte/due/locate/redis/v2"
	"github.com/dobyte/due/registry/consul/v2"
	"github.com/dobyte/due/transport/rpcx/v2"
	"github.com/dobyte/due/v2"
	"github.com/dobyte/due/v2/cluster/mesh"
)

func main() {
	// 创建容器
	container := due.NewContainer()
	// 创建用户定位器
	locator := redis.NewLocator()
	// 创建服务发现
	registry := consul.NewRegistry()
	// 创建RPC传输器
	transporter := rpcx.NewTransporter()
	// 创建网格组件
	component := mesh.NewMesh(
		mesh.WithLocator(locator),
		mesh.WithRegistry(registry),
		mesh.WithTransporter(transporter),
	)
	// 初始化应用
	initRPCXServer(component.Proxy())
	// 添加网格组件
	container.Add(component)
	// 启动容器
	container.Serve()
}

// 初始化应用
func initRPCXServer(proxy *mesh.Proxy) {
	server.NewServer(proxy).Init()
}
```

调用方示例

```go
// 构建客户端
cli, err := client.NewClient(proxy.NewMeshClient)
if err != nil {
  log.Errorf("create rpc client failed: %v", err)
  return
}

// 发起RPC调用
reply, err := cli.Hello(ctx.Context(), &pb.HelloArgs{Name: req.Name})
if err != nil {
  log.Errorf("invoke rpc func failed: %v", err)
  return
}

log.Infof("invoke rpc func replay: %v", reply)
```

你也可通过ctx.NewMeshClient来创建RPC客户端

```go
cli, _ := client.NewClient(ctx.NewMeshClient)
```

如果你的调用方压根不在节点服（Node）、网格服（Mesh）、Web服（Http）中，你也可以通过直接构建传输器来实现调用

```go
// 创建服务发现
registry := consul.NewRegistry()
// 构建传输器
transporter := rpcx.NewTransporter()
// 设置默认的服务发现组件
transporter.SetDefaultDiscovery(registry)
// 构建客户端
cli, _ := client.NewClient(transporter.NewClient)
```

## 启动服务 {#mesh-start}

启动GRPC网格服

```bash
$ go run grpc.go
                    ____  __  ________
                   / __ \/ / / / ____/
                  / / / / / / / __/
                 / /_/ / /_/ / /___
                /_____/\____/_____/
┌──────────────────────────────────────────────────────┐
| [Website] https://github.com/dobyte/due              |
| [Version] v2.2.3                                     |
└──────────────────────────────────────────────────────┘
┌────────────────────────Global────────────────────────┐
| PID: 21628                                           |
| Mode: debug                                          |
└──────────────────────────────────────────────────────┘
┌─────────────────────────Mesh─────────────────────────┐
| Name: mesh                                           |
| Codec: json                                          |
| Locator: redis                                       |
| Registry: consul                                     |
| Encryptor: -                                         |
| Transporter: grpc                                    |
└──────────────────────────────────────────────────────┘
```

启动RPCX网格服

```bash
$ go run rpcx.go
                    ____  __  ________
                   / __ \/ / / / ____/
                  / / / / / / / __/
                 / /_/ / /_/ / /___
                /_____/\____/_____/
┌──────────────────────────────────────────────────────┐
| [Website] https://github.com/dobyte/due              |
| [Version] v2.2.3                                     |
└──────────────────────────────────────────────────────┘
┌────────────────────────Global────────────────────────┐
| PID: 26436                                           |
| Mode: debug                                          |
└──────────────────────────────────────────────────────┘
┌─────────────────────────Mesh─────────────────────────┐
| Name: mesh                                           |
| Codec: json                                          |
| Locator: redis                                       |
| Registry: consul                                     |
| Encryptor: -                                         |
| Transporter: rpcx                                    |
└──────────────────────────────────────────────────────┘
````

## 启动配置

这里仅展示网格服（Mesh）相关配置参数，如需了解更多模块的参数配置，请查看[启动配置](/guide/etc)

```toml
# 进程号
pid = "./run/mesh.pid"
# 开发模式。支持模式：debug、test、release（设置优先级：配置文件 < 环境变量 < 运行参数 < mode.SetMode()）
mode = "debug"
# 统一时区设置。项目中的时间获取请使用xtime.Now()
timezone = "Local"
# 容器关闭最大等待时间。支持单位：纳秒（ns）、微秒（us | µs）、毫秒（ms）、秒（s）、分（m）、小时（h）、天（d）。默认为0
shutdownMaxWaitTime = "0s"

[cluster.mesh]
    # 实例ID，网关集群中唯一。不填写默认自动生成唯一的实例ID
    id = ""
    # 实例名称
    name = "mesh"
    # 编解码器。可选：json | proto。默认json
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


[transport]
    # GRPC相关配置
    [transport.grpc]
        # GRPC服务器相关配置
        [transport.grpc.server]
            # 服务器监听地址。空或:0时系统将会随机端口号
            addr = ":0"
            # 秘钥文件
            keyFile = ""
            # 证书文件
            certFile = ""
        # GRPC客户端相关配置
        [transport.grpc.client]
            # 证书文件
            certFile = ""
            # 证书域名
            serverName = ""
    # RPCX相关配置
    [transport.rpcx]
        # RPCX服务器相关配置
        [transport.rpcx.server]
            # 服务器监听地址。空或:0时系统将会随机端口号
            addr = ":0"
            # 秘钥文件
            keyFile = ""
            # 证书文件
            certFile = ""
        # RPCX客户端相关配置
        [transport.rpcx.client]
            # 证书文件
            certFile = ""
            # 证书域名
            serverName = ""
            # 连接池大小，默认为10
            poolSize = 10
```