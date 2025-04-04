# 启动配置 {#etc}

## 基本介绍 {#etc-introduction}

启动配置（etc）主要用于引导程序启动的配置，默认启动配置文件为./etc/etc.toml。当然你也可以在配置目录添加自己额外的业务配置并进行读取（不推荐）。启动配置支持热更，但这仅限于通过[接口](#读取接口-etc-interface)读取的形式。服务器组件一旦启动后，即便启动配置发生了变更，服务器组件也不再进行更新。

## 指定目录 {#etc-specify-directory}

你可以通过以下方式来指定指定配置目录：

1. 通过环境变量指定 DUE_ETC=/run/etc
2. 通过启动参数指定 --etc=./etc

设置优先级：环境变量 < 运行参数

> 注：无论你如何指定启动配置目录，etc.[toml|yaml|yml|json|xml]作为框架集群唯一的启动文件，一定不能修改，修改后会导致配置不生效或不可预期的后果。

## 支持格式 {#etc-format}

启动配置默认支持 [toml](https://toml.io/)、[yaml](https://yaml.org/)、[json](https://www.json.org/)、[xml](https://developer.mozilla.org/zh-CN/docs/Web/XML/XML_introduction) 等多种文件格式。你可以根据自身喜好自由选择文件格式。

> 注：yaml格式的配置支持.yaml和.yml两种后缀名

## 读写规则 {#etc-read-rule}

框架中的配置文件均是以 **文件名[.参数名1[.参数名2...[.参数名n]]]** 的方式进行读写的。

> 注：例如a.b.c.d.toml这样的配置文件同样也是被支持的。读写时你只需要将a.b.c.d看成一个完整的文件名即可。

## 读取接口 {#etc-interface}

启动配置（etc）不单单可以作为引导程序启动的配置存在，你也可以通过以下接口读取在配置目录中添加的额外配置文件参数。

```bash
github.com/dobyte/due/v2/etc
```

```go
// Has 是否存在配置
func Has(pattern string) bool

// Get 获取配置值
func Get(pattern string, def ...interface{}) value.Value

// Set 设置配置值
func Set(pattern string, value interface{}) error

// Match 匹配多个规则
func Match(patterns ...string) config.Matcher
```

## 示例代码 {#etc-example}

以下完整示例详见：[etc](https://github.com/dobyte/due-examples/tree/master/etc)

编写配置文件

```toml
[mysql]
    # dsn连接信息
    dsn = "root:123456@tcp(127.0.0.1:3306)/game?charset=utf8mb4&parseTime=True&loc=Local"
    # 日志级别; silent | error | warn | info
    logLevel = "error"
    # 慢日志阈值;ms
    slowThreshold = 2000
    # 最大空闲连接数
    maxIdleConns = 50
    # 最大打开连接数
    maxOpenConns = 50
    # 连接最大存活时间
    connMaxLifetime = 3600
```

编写读取示例

```go
package main

import (
	"fmt"
	"github.com/dobyte/due/v2/etc"
	"github.com/dobyte/due/v2/log"
)

type config struct {
	DSN             string `json:"dsn"`
	LogLevel        string `json:"logLevel"`
	SlowThreshold   int    `json:"slowThreshold"`
	MaxIdleConns    int    `json:"maxIdleConns"`
	MaxOpenConns    int    `json:"maxOpenConns"`
	ConnMaxLifetime int    `json:"connMaxLifetime"`
}

func main() {
	// 读取单个配置参数
	logLevel := etc.Get("db.mysql.logLevel").String()

	fmt.Printf("mysql log-level: %s\n", logLevel)

	// 读取多个配置参数
	conf := &config{}

	if err := etc.Get("db.mysql").Scan(conf); err != nil {
		log.Errorf("get mysql error: %s", err)
	}

	fmt.Printf("mysql config: %+v\n", conf)

	// 修改配置参数
	if err := etc.Set("db.mysql.logLevel", "info"); err != nil {
		log.Errorf("set mysql log-level error: %s", err)
	}

	// 读取单个配置参数
	logLevel = etc.Get("db.mysql.logLevel").String()

	fmt.Printf("mysql log-level: %s\n", logLevel)
}
```

运行示例

```bash
$ go run main.go
mysql log-level: error
mysql config: &{DSN:root:123456@tcp(127.0.0.1:3306)/game?charset=utf8mb4&parseTime=True&loc=Local LogLevel:error SlowThreshold:2000 MaxIdleConns:50 MaxOpenConns:50 ConnMaxLifetime:3600}
mysql log-level: info
```

## 全部配置 {#etc-all-config}

以下配置示例详见：[etc.toml](https://github.com/dobyte/due/blob/main/testdata/etc/etc.toml)

```toml
# 进程号
pid = "./run/cluster.pid"
# 开发模式。支持模式：debug、test、release（设置优先级：配置文件 < 环境变量 < 运行参数 < mode.SetMode()）
mode = "debug"
# 统一时区设置。项目中的时间获取请使用xtime.Now()
timezone = "Local"
# 容器关闭最大等待时间。支持单位：纳秒（ns）、微秒（us | µs）、毫秒（ms）、秒（s）、分（m）、小时（h）、天（d）。默认为0
shutdownMaxWaitTime = "0s"

# 任务池
[task]
    # 任务池大小(goroutine)
    size = 100000
    # 是否非阻塞
    nonblocking = true
    # 是否禁用清除。
    disablePurge = true

# 配置中心
[config]
    # 文件配置
    [config.file]
        # 配置文件或配置目录路径
        path = "./config"
        # 读写模式。可选：read-only | write-only | read-write，默认为read-only
        mode = "read-only"
    # etcd配置中心
    [config.etcd]
        # 客户端连接地址，默认为["127.0.0.1:2379"]
        addrs = ["127.0.0.1:2379"]
        # 客户端拨号超时时间，支持单位：纳秒（ns）、微秒（us | µs）、毫秒（ms）、秒（s）、分（m）、小时（h）、天（d）。默认为5s
        dialTimeout = "5s"
        # 路径。默认为/config
        path = "/config"
        # 读写模式。可选：read-only | write-only | read-write，默认为read-only
        mode = "read-only"
    # consul配置中心
    [config.consul]
        # 客户端连接地址
        addr = "127.0.0.1:8500"
        # 路径。默认为config
        path = "config"
        # 读写模式。可选：read-only | write-only | read-write，默认为read-only
        mode = "read-only"
    # nacos配置中心
    [config.nacos]
        # 读写模式。可选：read-only | write-only | read-write，默认为read-only
        mode = "read-only"
        # 服务器地址 [scheme://]ip:port[/nacos]。默认为["http://127.0.0.1:8848/nacos"]
        urls = ["http://127.0.0.1:8848/nacos"]
        # 集群名称。默认为DEFAULT
        clusterName = "DEFAULT"
        # 群组名称。默认为DEFAULT_GROUP
        groupName = "DEFAULT_GROUP"
        # 请求Nacos服务端超时时间，支持单位：纳秒（ns）、微秒（us | µs）、毫秒（ms）、秒（s）、分（m）、小时（h）、天（d）。默认为3秒
        timeout = "3s"
        # ACM的命名空间Id。默认为空
        namespaceId = ""
        # 当使用ACM时，需要该配置，默认为空。详见：https://help.aliyun.com/document_detail/130146.html
        endpoint = ""
        # ACM&KMS的regionId，用于配置中心的鉴权。默认为空
        regionId = ""
        # ACM&KMS的AccessKey，用于配置中心的鉴权。默认为空
        accessKey = ""
        # ACM&KMS的SecretKey，用于配置中心的鉴权。默认为空
        secretKey = ""
        # 是否开启kms，同时DataId必须以"cipher-"作为前缀才会启动加解密逻辑。kms可以参考文档：https://help.aliyun.com/product/28933.html
        openKMS = false
        # 缓存service信息的目录。默认为./run/nacos/naming/cache
        cacheDir = "./run/nacos/config/cache"
        # Nacos服务端的API鉴权Username。默认为空
        username = ""
        # Nacos服务端的API鉴权Password。默认为空
        password = ""
        # 日志存储路径。默认为./run/nacos/naming/log
        logDir = "./run/nacos/config/log"
        # 日志输出级别，可选：debug、info、warn、error。默认为info
        logLevel = "info"

[cluster]
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
    # 集群节点配置
    [cluster.node]
        # 实例ID，节点集群中唯一。不填写默认自动生成唯一的实例ID
        id = ""
        # 实例名称
        name = "node"
        # 内建RPC服务器监听地址。不填写默认随机监听
        addr = ":0"
        # 编解码器。可选：json | proto。默认为proto
        codec = "proto"
        # RPC调用超时时间，支持单位：纳秒（ns）、微秒（us | µs）、毫秒（ms）、秒（s）、分（m）、小时（h）、天（d）。默认为3s
        timeout = "3s"
    # 集群管理节点配置
    [cluster.master]
        # 实例ID，网关集群中唯一。不填写默认自动生成唯一的实例ID
        id = ""
        # 实例名称
        name = "master"
        # 编解码器。可选：json | proto。默认为proto
        codec = "proto"
        # 加密器。可选：rsa | ecc
        encryptor = "ecc"
        # 解密器。可选：rsa | ecc
        decryptor = "ecc"
    # 集群网格配置
    [cluster.mesh]
        # 实例名称
        name = "mesh"
        # 编解码器。可选：json | proto。默认为proto
        codec = "proto"
    # 集群客户端配置，常用于调试使用
    [cluster.client]
        # 实例ID，网关集群中唯一。不填写默认自动生成唯一的实例ID
        id = ""
        # 实例名称
        name = "client"
        # 编解码器。可选：json | proto。默认为proto
        codec = "proto"

# http服务器配置
[http]
    # 服务器名称
    name = "http"
    # 服务器监听地址，默认为:8080
    addr = ":8080"
    # 秘钥文件
    keyFile = ""
    # 证书文件
    certFile = ""
    # 跨域配置
    [http.cors]
        # 是否启用跨域
        enable = false
        # 允许跨域的请求源。默认为[]，即为允许所有请求源
        allowOrigins = []
        # 允许跨域的请求方法。默认为["GET", "POST", "HEAD", "PUT", "DELETE", "PATCH"]
        allowMethods = []
        # 允许跨域的请求头部。默认为[]，即为允许所有请求头部
        allowHeaders = []
        # 当允许所有源时，根据CORS规范不允许携带凭据。默认为false
        allowCredentials = false
        # 允许暴露给客户端的头部。默认为[]，即为允许暴露所有头部
        exposeHeaders = []
        # 浏览器缓存预检请求结果的时间。默认为0
        maxAge = 0
        # 是否允许来自私有网络的请求。设置为true时，响应头Access-Control-Allow-Private-Network会被设置为true。默认为false
        allowPrivateNetwork = false
    # swagger文档配置
    [http.swagger]
        # 是否启用文档
        enable = true
        # API文档标题
        title = "API文档"
        # URL访问基础路径
        basePath = "/swagger"
        # swagger文件路径
        filePath = "./docs/swagger.json"

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

# 框架默认打包器统一采用以下的打包格式，自定义打包器可自行定义打包规则
# -------------------------
# | route | seq | message |
# -------------------------
[packet]
    # 字节序，默认为big。可选：little | big
    byteOrder = "big"
    # 路由字节数，默认为2字节
    routeBytes = 2
    # 序列号字节数，默认为2字节
    seqBytes = 2
    # 消息字节数，默认为5000字节
    bufferBytes = 5000
[log]
    # 日志输出文件
    file = "../../testdata/log/due.log"
    # 日志输出级别，可选：debug | info | warn | error | fatal | panic
    level = "info"
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
    classifiedStorage = true
    # 阿里云SLS日志服务。以下配置项如果不存在，则会使用log域中的默认配置项；如果都未配置，则会使用系统默认配置
    [log.aliyun]
        # 服务域名，公网使用公网域名，内网使用私网域名
        endpoint = "cn-chengdu.log.aliyuncs.com"
        # 访问密钥ID
        accessKeyID = ""
        # 访问密钥密码
        accessKeySecret = ""
        # 项目名称
        project = "due-test"
        # 日志存储
        logstore = "app"
        # 主题标签，默认为空
        topic = ""
        # 来源标签，默认为空
        source = ""
        # 日志输出级别，可选：debug | info | warn | error | fatal | panic
        level = "info"
        # 是否输出到终端
        stdout = true
        # 是否同步输出到远端
        syncout = false
        # 时间格式，标准库时间格式
        timeFormat = "2006/01/02 15:04:05.000000"
        # 堆栈的最低输出级别，可选：debug | info | warn | error | fatal | panic
        stackLevel = "error"
        # 是否启用调用文件全路径
        callerFullPath = true
    # logrus日志组件。以下配置项如果不存在，则会使用log域中的默认配置项；如果均未配置，则会使用系统默认配置
    [log.logrus]
        # 日志输出文件
        file = "../../testdata/log/due.log"
        # 日志输出级别，可选：debug | info | warn | error | fatal | panic
        level = "info"
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
        classifiedStorage = true
    # 腾讯云云CLS日志服务。以下配置项如果不存在，则会使用log域中的默认配置项；如果都未配置，则会使用系统默认配置
    [log.tencent]
        # 服务域名，公网使用公网域名，内网使用私网域名
        endpoint = "ap-guangzhou.cls.tencentcs.com"
        # 访问密钥ID
        accessKeyID = ""
        # 访问密钥密码
        accessKeySecret = ""
        # 主题ID
        topicID = ""
        # 日志输出级别，可选：debug | info | warn | error | fatal | panic
        level = "info"
        # 是否输出到终端
        stdout = true
        # 是否同步输出到远端
        syncout = false
        # 时间格式，标准库时间格式
        timeFormat = "2006/01/02 15:04:05.000000"
        # 堆栈的最低输出级别，可选：debug | info | warn | error | fatal | panic
        stackLevel = "error"
        # 是否启用调用文件全路径
        callerFullPath = true
    # zap日志组件。以下配置项如果不存在，则会使用log域中的默认配置项；如果均未配置，则会使用系统默认配置
    [log.zap]
        # 日志输出文件
        file = "../../testdata/log/due.log"
        # 日志输出级别，可选：debug | info | warn | error | fatal | panic
        level = "info"
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
        classifiedStorage = true
[registry]
    [registry.etcd]
        # 客户端连接地址，默认为["127.0.0.1:2379"]
        addrs = ["127.0.0.1:2379"]
        # 客户端拨号超时时间，支持单位：纳秒（ns）、微秒（us | µs）、毫秒（ms）、秒（s）、分（m）、小时（h）、天（d）。默认为5s
        dialTimeout = "5s"
        # 命名空间，默认为services
        namespace = "services"
        # 超时时间，支持单位：纳秒（ns）、微秒（us | µs）、毫秒（ms）、秒（s）、分（m）、小时（h）、天（d）。默认为3s
        timeout = "3s"
        # 心跳重试次数，默认为3
        retryTimes = 3
        # 心跳重试间隔，支持单位：纳秒（ns）、微秒（us | µs）、毫秒（ms）、秒（s）、分（m）、小时（h）、天（d）。默认为10s
        retryInterval = "10s"
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
    [registry.nacos]
        # 服务器地址 [scheme://]ip:port[/nacos]。默认为["http://127.0.0.1:8848/nacos"]
        urls = ["http://127.0.0.1:8848/nacos"]
        # 集群名称。默认为DEFAULT
        clusterName = "DEFAULT"
        # 群组名称。默认为DEFAULT_GROUP
        groupName = "DEFAULT_GROUP"
        # 请求Nacos服务端超时时间，支持单位：纳秒（ns）、微秒（us | µs）、毫秒（ms）、秒（s）、分（m）、小时（h）、天（d）。默认为3秒
        timeout = "3s"
        # ACM的命名空间Id。默认为空
        namespaceId = ""
        # 当使用ACM时，需要该配置，默认为空。详见：https://help.aliyun.com/document_detail/130146.html
        endpoint = ""
        # ACM&KMS的regionId，用于配置中心的鉴权。默认为空
        regionId = ""
        # ACM&KMS的AccessKey，用于配置中心的鉴权。默认为空
        accessKey = ""
        # ACM&KMS的SecretKey，用于配置中心的鉴权。默认为空
        secretKey = ""
        # 是否开启kms，同时DataId必须以"cipher-"作为前缀才会启动加解密逻辑。kms可以参考文档：https://help.aliyun.com/product/28933.html
        openKMS = false
        # 缓存service信息的目录。默认为./run/nacos/naming/cache
        cacheDir = "./run/nacos/naming/cache"
        # Nacos服务端的API鉴权Username。默认为空
        username = ""
        # Nacos服务端的API鉴权Password。默认为空
        password = ""
        # 日志存储路径。默认为./run/nacos/naming/log
        logDir = "./run/nacos/naming/log"
        # 日志输出级别，可选：debug、info、warn、error。默认为info
        logLevel = "info"
[network]
    [network.ws]
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
        [network.ws.client]
            # 拨号地址
            url = "ws://127.0.0.1:3553"
            # 握手超时时间，支持单位：纳秒（ns）、微秒（us | µs）、毫秒（ms）、秒（s）、分（m）、小时（h）、天（d）。默认为10s
            handshakeTimeout = "10s"
            # 心跳间隔时间。设置为0则不启用心跳检测，支持单位：纳秒（ns）、微秒（us | µs）、毫秒（ms）、秒（s）、分（m）、小时（h）、天（d）。默认为10s
            heartbeatInterval = "10s"
    [network.tcp]
        [network.tcp.server]
            # 服务器监听地址
            addr = ":3553"
            # 服务器最大连接数
            maxConnNum = 5000
            # 心跳检测间隔时间（秒），默认为10秒。设置为0则不启用心跳检测
            heartbeatInterval = 10
            # 心跳机制，默认resp
            heartbeatMechanism = "resp"
        [network.tcp.client]
            # 拨号地址
            addr = "127.0.0.1:3553"
            # 拨号超时时间，默认5s
            timeout = "5s"
            # 心跳间隔时间（秒），默认为10秒。设置为0则不启用心跳检测
            heartbeatInterval = 10
[locate]
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

[cache]
    [cache.redis]
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
        # key前缀，默认为cache
        prefix = "cache"
        # 空值，默认为cache@nil
        nilValue = "cache@nil"
        # 空值过期时间，默认为10s
        nilExpiration = "10s"
        # 最小过期时间，默认为1h
        minExpiration = "1h"
        # 最大过期时间，默认为24h
        maxExpiration = "24h"
[crypto]
    # RSA设置
    [crypto.rsa]
        [crypto.rsa.encryptor]
            # hash算法，不区分大小写。可选：SHA1 | SHA224 | SHA256 | SHA384 | SHA512
            hash = "SHA256"
            # 填充规则，不区分大小写。可选：NORMAL | OAEP
            padding = "NORMAL"
            # 标签，加解密时必需一致
            label = ""
            # 加密数据块大小，单位字节。由于加密数据长度限制，需要对加密数据进行分块儿加密
            blockSize = 0
            # 公钥，可设置文件路径或公钥串
            publicKey = ""
        [crypto.rsa.decryptor]
            # hash算法，不区分大小写。可选：SHA1 | SHA224 | SHA256 | SHA384 | SHA512
            hash = "SHA256"
            # 填充规则，不区分大小写。可选：NORMAL | OAEP
            padding = "NORMAL"
            # 标签。加解密时必需一致
            label = ""
            # 私钥。可设置文件路径或私钥串
            privateKey = ""
        [crypto.rsa.signer]
            # hash算法，不区分大小写。可选：SHA1 | SHA224 | SHA256 | SHA384 | SHA512
            hash = "SHA256"
            # 填充规则，不区分大小写。可选：PKCS | PSS
            padding = "PSS"
            # 私钥。可设置文件路径或私钥串
            privateKey = ""
        [crypto.rsa.verifier]
            # hash算法，不区分大小写。可选：SHA1 | SHA224 | SHA256 | SHA384 | SHA512
            hash = "SHA256"
            # 填充规则，不区分大小写。可选：PKCS | PSS
            padding = "PSS"
            # 公钥，可设置文件路径或公钥串
            publicKey = ""
    # ECC设置
    [crypto.ecc]
        [crypto.ecc.encryptor]
            # 共享信息。加解密时必需一致
            s1 = ""
            # 共享信息。加解密时必需一致
            s2 = ""
            # 公钥，可设置文件路径或公钥串
            publicKey = ""
        [crypto.ecc.decryptor]
            # 共享信息。加解密时必需一致
            s1 = ""
            # 共享信息。加解密时必需一致
            s2 = ""
            # 私钥。可设置文件路径或私钥串
            privateKey = ""
        [crypto.ecc.signer]
            # hash算法，不区分大小写。可选：SHA1 | SHA224 | SHA256 | SHA384 | SHA512
            hash = "SHA256"
            # 签名分隔符。由于ECDSA签名算法会产生两段签名串，因此需要通过分隔符将其拼接为一个签名
            delimiter = " "
            # 私钥。可设置文件路径或私钥串
            privateKey = ""
        [crypto.ecc.verifier]
            # hash算法，不区分大小写。可选：SHA1 | SHA224 | SHA256 | SHA384 | SHA512
            hash = "SHA256"
            # 签名分隔符。由于ECDSA签名算法会产生两段签名串，因此需要通过分隔符将其拼接为一个签名
            delimiter = " "
            # 公钥，可设置文件路径或公钥串
            publicKey = ""
[eventbus]
    [eventbus.nats]
        # 客户端连接地址，默认为nats://127.0.0.1:4222
        url = "nats://127.0.0.1:4222"
        # 客户端连接超时时间，支持单位：纳秒（ns）、微秒（us | µs）、毫秒（ms）、秒（s）、分（m）、小时（h）、天（d）。默认为2s
        timeout = "2s"
    [eventbus.redis]
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
    [eventbus.kafka]
        # 客户端连接地址
        addrs = ["127.0.0.1:9092"]
        # Kafka版本，默认为无版本
        version = ""
```