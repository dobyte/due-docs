# 路由设计 {#route}

## 路由注册 {#route-register}

在游戏服务器中，路由（route）作为消息（message）的标识，为消息在整个业务系统中的流转提供支撑。在[due](https://github.com/dobyte/due)框架中，路由处理器会被提前添加到节点服（node）上，在节点服启动的时候随着节点服信息一同被注入到注册中心中。集群中的其他服务器会通过服务发现（discovery）获取到这一节点服（node）的相关信息。

```go
// AddRouteHandler 添加路由处理器
AddRouteHandler(route int32, stateful bool, handler RouteHandler, middlewares ...MiddlewareHandler)
```

## 路由状态 {#route-state}

在[due](https://github.com/dobyte/due)框架中，路由被设计成了无状态（stateless）和有状态（stateful）两种模式。两种路由模式分别对应着分布式集群中不同的路由分发机制。但无论是哪种路由模式，一个路由号只能对应一种路由模式。

- 无状态路由（stateless route）：无状态路由与HTTP路由比较类似。当网关（Gate）接收到无状态路由消息后会根据一定的[分发策略](/guide/route.md#route-stateless-dispatch)分发到对应的节点（Node）进行消息处理。

- 有状态路由（stateful route）：有状态路由主要解决的是游戏业务中的消息定向转发问题。


## 无状态路由分发 {#route-stateless-dispatch}

![无状态路由分发](../public/images/route-stateless-dispatch.png)


- 随机（random）：默认策略，网关（Gate）在接收到无状态路由消息后会在已注册该路由号的节点（Node）中随机选择一个节点（Node）进行消息转发。
- 轮询（rr）：网关（Gate）在接收到无状态路由消息后会在已注册该路由号的节点（Node）中按照顺序依次转发到对应的节点（Node）。
- 加权轮询（wrr）：网关（Gate）在接收到无状态路由消息后会在已注册该路由号的节点（Node）中按照节点（Node）权重高低依次转发到对应的节点（Node）。

## 有状态路由定向转发 {#route-stateful-forward}

![有状态路由定向转发](../public/images/route-stateful-forward.png)

有状态路由要实现定向转发须满足以下两个条件：

- 用户已与他所连接的网关（Gate）建立了绑定关系
- 用户已与某一个节点（Node）建立了绑定关系

在满足以上两个条件后，用户客户端后续发送的有状态路由消息均会被转发到用户绑定的节点（Node）上。

## 消息流转

以下用一个简单的流程图来模拟玩家从建立连接到发起登录、再到加入战斗、最后到攻击怪物的整个消息流转过程。


```mermaid
sequenceDiagram
participant Client as 客户端（Client）
participant Gate as 网关集群（Gate）
participant Node as 节点集群（Node）

Client ->> Gate: 建立连接
Gate --> Client: 连接建立成功
Client ->> Gate: 发送路由号为N（无状态）的登录消息
Gate ->> Node: 根据分发策略将路由消息分发到注册了该路由号N的节点服务器上
Node ->> Node: 解析登录消息，完成登录逻辑
Node ->> Gate: 调用BindGate命令，将用户与网关连接进行绑定
Gate ->> Node: 绑定网关连接成功
Node ->> Gate: 调用Push命令，将登录成功消息推送到网关
Gate ->> Client: 根据Push命令参数找到对应的连接，将登录成功消息下发到客户端

Client ->> Gate: 发送路由号为M（无状态）的加入游戏消息
Gate ->> Node: 根据分发策略将路由消息分发到注册了该路由号M的节点服务器上
Node ->> Node: 解析加入游戏消息，完成进入游戏逻辑
Node ->> Node: 调用BindNode命令，将用户与当前节点进行绑定
Node ->> Gate: 调用Push命令，将加入游戏成功消息推送到网关
Gate ->> Client: 根据Push命令参数找到对应的连接，将加入游戏成功消息下发到客户端
Client ->> Gate: 发送路由号为X（有状态）的攻击消息
Gate ->> Node: 将攻击消息转发到用户绑定好的并且已注册了路由号为X（有状态）的节点上
Node ->> Node: 解析攻击消息，完成攻击逻辑
Node ->> Gate: 调用Push命令，将攻击成功消息推送到网关
Gate ->> Client: 根据Push命令参数找到对应的连接，将攻击成功消息下发到客户端
```