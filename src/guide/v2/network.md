# 网络模块 {#network}

## 基本介绍 {#network-introduction}

网络模块（network）作为网关服（gate）和测试客户端（client）的核心模块，主要负责为各种客户端提供连接和通信支持。目前框架已提供了 [TCP](https://github.com/dobyte/due/tree/main/network/tcp)、[KCP](https://github.com/dobyte/due/tree/main/network/kcp)、[WS](https://github.com/dobyte/due/tree/main/network/ws) 三种常用的网络层支持。你可以根据自生业务需要来选择合适的网络模块，也可以根据框架的网络层接口来实现自己的网络模块。

## 网络服务器示例 {#network-server-example}

网络服务器主要作为网关服（gate）的网络模块而存在，这里就不再做相关示例的文档说明，如需了解如何使用可以移步[网关服务器](/guide/gate.md#示例代码-gate-example)

## 自定义网络服务器 {#network-custom-server}

如果你想在自己的业务中使用自定义的网络服务器，你可以通过实现以下接口来构建一个属于自己的网络服务器库，然后应用到自己的网关服（gate）上。

```go
type (
	StartHandler      func()
	CloseHandler      func()
	ConnectHandler    func(conn Conn)
	DisconnectHandler func(conn Conn)
	ReceiveHandler    func(conn Conn, msg []byte)
)

type Server interface {
	// Addr 监听地址
	Addr() string
	// Start 启动服务器
	Start() error
	// Stop 关闭服务器
	Stop() error
	// Protocol 协议
	Protocol() string
	// OnStart 监听服务器启动
	OnStart(handler StartHandler)
	// OnStop 监听服务器关闭
	OnStop(handler CloseHandler)
	// OnConnect 监听连接打开
	OnConnect(handler ConnectHandler)
	// OnReceive 监听接收消息
	OnReceive(handler ReceiveHandler)
	// OnDisconnect 监听连接断开
	OnDisconnect(handler DisconnectHandler)
}
```

## 网络客户端示例 {#network-client-example}

网络客户端主要作为测试客户端（client）的网络模块而存在，这里就不再做相关示例的文档说明，如需了解如何使用可以移步[测试客户端](/guide/client.md#示例代码-client-example)

## 自定义网络客户端 {#network-custom-client}

如果你想在自己的业务中使用自定义的网络客户端，你可以通过实现以下接口来构建一个属于自己的网络客户端库，然后应用到自己的测试客户端（client）上。

```go
type Client interface {
	// Dial 拨号连接
	Dial(addr ...string) (Conn, error)
	// Protocol 协议
	Protocol() string
	// OnConnect 监听连接打开
	OnConnect(handler ConnectHandler)
	// OnReceive 监听接收消息
	OnReceive(handler ReceiveHandler)
	// OnDisconnect 监听连接断开
	OnDisconnect(handler DisconnectHandler)
}
```