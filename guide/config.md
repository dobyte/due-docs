# 配置中心 {#config}

## 基本介绍 {#config-introduction}

配置中心（config）区别于启动配置（etc）主要用于业务逻辑配置的读取、修改和监听。用法和启动配置（etc）完全一致，提供了 [file](https://github.com/dobyte/due/tree/main/config/file)、[consul](https://github.com/dobyte/due/tree/main/config/consul)、[etcd](https://github.com/dobyte/due/tree/main/config/etcd)、[nacos](https://github.com/dobyte/due/tree/main/config/nacos) 等多种配置源方案。你可以根据自身业务特点选择不同的配置源，也可以同时组合使用多种配置源来构建自己的配置方案。

## 支持格式 {#config-format}

配置中心默认支持 [toml](https://toml.io/)、[yaml](https://yaml.org/)、[json](https://www.json.org/)、[xml](https://developer.mozilla.org/zh-CN/docs/Web/XML/XML_introduction) 等多种文件格式。你可以根据自身喜好自由选择文件格式。

> 注：yaml格式的配置支持.yaml和.yml两种后缀名

## 读写规则 {#config-read-write-rule}

框架中的配置文件均是以 **文件名[.参数名1[.参数名2...[.参数名n]]]** 的方式进行读写的。

> 注：例如a.b.c.d.toml这样的配置文件同样也是被支持的。读写时你只需要将a.b.c.d看成一个完整的文件名即可。

## 相关接口 {#config-interface}

```bash
github.com/dobyte/due/v2/config
```

```go
// SetConfigurator 设置配置器
func SetConfigurator(configurator Configurator)

// GetConfigurator 获取配置器
func GetConfigurator() Configurator

// SetConfiguratorWithSources 通过设置配置源来设置配置器
func SetConfiguratorWithSources(sources ...Source)

// Has 检测多个匹配规则中是否存在配置
func Has(pattern string) bool

// Get 获取配置值
func Get(pattern string, def ...interface{}) value.Value

// Set 设置配置值
func Set(pattern string, value interface{}) error

// Match 匹配多个规则
func Match(patterns ...string) Matcher

// Watch 设置监听回调
func Watch(cb WatchCallbackFunc, names ...string)

// Load 加载配置项
func Load(ctx context.Context, source string, file ...string) ([]*Configuration, error)

// Store 保存配置项
func Store(ctx context.Context, source string, file string, content interface{}, override ...bool) error

// Close 关闭配置监听
func Close()
```

## 自定义配置源 {#config-custom-source}

如果你想使用其他的配置中心，[due](https://github.com/dobyte/due) 框架也提供相应的解决方案。你只需要实现以下配置源接口，然后通过config.SetConfigurator()设置一个新的附带自定义配置源的配置器，即可实现使用自定义配置了。

```go
type Source interface {
	// Name 配置源名称
	Name() string
	// Load 加载配置项
	Load(ctx context.Context, file ...string) ([]*Configuration, error)
	// Store 保存配置项
	Store(ctx context.Context, file string, content []byte) error
	// Watch 监听配置项
	Watch(ctx context.Context) (Watcher, error)
	// Close 关闭配置源
	Close() error
}

type Watcher interface {
	// Next 返回配置列表
	Next() ([]*Configuration, error)
	// Stop 停止监听
	Stop() error
}
```

## 文件配置源示例 {#config-file-example}

以下完整示例详见：[file](https://github.com/dobyte/due-examples/tree/master/config/file)


创建config.toml配置文件

```toml
timezone = "UTC"
```

构建配置读写示例

```go
package main

import (
	"context"
	"github.com/dobyte/due/v2/config"
	"github.com/dobyte/due/v2/config/file"
	"github.com/dobyte/due/v2/log"
	"time"
)

const filename = "config.toml"

func main() {
	// 设置文件配置中心
	config.SetConfigurator(config.NewConfigurator(config.WithSources(file.NewSource())))

	// 更新配置
	if err := config.Store(context.Background(), file.Name, filename, map[string]interface{}{
		"timezone": "Local",
	}); err != nil {
		log.Errorf("store config failed: %v", err)
		return
	}

	// 读取配置
	timezone := config.Get("config.timezone", "UTC").String()
	log.Infof("timezone: %s", timezone)

	// 更新配置
	if err := config.Store(context.Background(), file.Name, filename, map[string]interface{}{
		"timezone": "UTC",
	}); err != nil {
		log.Errorf("store config failed: %v", err)
		return
	}

	// 读取配置
	timezone = config.Get("config.timezone", "UTC").String()
	log.Infof("timezone: %s", timezone)
}
```

## consul配置源示例 {#config-consul-example}

以下完整示例详见：[consul](https://github.com/dobyte/due-examples/tree/master/config/consul)

构建配置读写示例

```go
package main

import (
	"context"
	"github.com/dobyte/due/config/consul/v2"
	"github.com/dobyte/due/v2/config"
	"github.com/dobyte/due/v2/log"
	"time"
)

const filename = "config.toml"

func main() {
	// 设置consul配置中心
	config.SetConfigurator(config.NewConfigurator(config.WithSources(consul.NewSource())))

	// 更新配置
	if err := config.Store(context.Background(), consul.Name, filename, map[string]interface{}{
		"timezone": "Local",
	}); err != nil {
		log.Errorf("store config failed: %v", err)
		return
	}

	// 读取配置
	timezone := config.Get("config.timezone", "UTC").String()
	log.Infof("timezone: %s", timezone)

	// 更新配置
	if err := config.Store(context.Background(), consul.Name, filename, map[string]interface{}{
		"timezone": "UTC",
	}); err != nil {
		log.Errorf("store config failed: %v", err)
		return
	}

	// 读取配置
	timezone = config.Get("config.timezone", "UTC").String()
	log.Infof("timezone: %s", timezone)
}
```

## etcd配置源示例 {#config-etcd-example}

以下完整示例详见：[etcd](https://github.com/dobyte/due-examples/tree/master/config/etcd)

```go
package main

import (
	"context"
	"github.com/dobyte/due/config/etcd/v2"
	"github.com/dobyte/due/v2/config"
	"github.com/dobyte/due/v2/log"
	"time"
)

const filename = "config.toml"

func main() {
	// 设置etcd配置中心
	config.SetConfigurator(config.NewConfigurator(config.WithSources(etcd.NewSource())))

	// 更新配置
	if err := config.Store(context.Background(), etcd.Name, filename, map[string]interface{}{
		"timezone": "Local",
	}); err != nil {
		log.Errorf("store config failed: %v", err)
		return
	}

	// 读取配置
	timezone := config.Get("config.timezone", "UTC").String()
	log.Infof("timezone: %s", timezone)

	// 更新配置
	if err := config.Store(context.Background(), etcd.Name, filename, map[string]interface{}{
		"timezone": "UTC",
	}); err != nil {
		log.Errorf("store config failed: %v", err)
		return
	}

	// 读取配置
	timezone = config.Get("config.timezone", "UTC").String()
	log.Infof("timezone: %s", timezone)
}
```

## nacos配置源示例 {#config-nacos-example}

以下完整示例详见：[nacos](https://github.com/dobyte/due-examples/tree/master/config/nacos)

```go
package main

import (
	"context"
	"github.com/dobyte/due/config/nacos/v2"
	"github.com/dobyte/due/v2/config"
	"github.com/dobyte/due/v2/log"
)

const filename = "config.toml"

func main() {
	// 设置文件配置中心
	config.SetConfigurator(config.NewConfigurator(config.WithSources(nacos.NewSource())))

	// 更新配置
	if err := config.Store(context.Background(), nacos.Name, filename, map[string]interface{}{
		"timezone": "Local",
	}); err != nil {
		log.Errorf("store config failed: %v", err)
		return
	}

	// 读取配置
	timezone := config.Get("config.timezone", "UTC").String()
	log.Infof("timezone: %s", timezone)

	// 更新配置
	if err := config.Store(context.Background(), nacos.Name, filename, map[string]interface{}{
		"timezone": "UTC",
	}); err != nil {
		log.Errorf("store config failed: %v", err)
		return
	}

	// 读取配置
	timezone = config.Get("config.timezone", "UTC").String()
	log.Infof("timezone: %s", timezone)
}
```

## 自定义配置源示例 {#config-custom-example}

以下完整示例详见：[custom](https://github.com/dobyte/due-examples/tree/master/config/custom)

创建自定义的Zookeeper源

```go
package zookeeper

import (
	"context"
	"github.com/dobyte/due/v2/config"
)

const Name = "zookeeper"

type Source struct {
}

func NewSource() *Source {
	return &Source{}
}

// Name 配置源名称
func (s *Source) Name() string {
	return Name
}

// Load 加载配置项
func (s *Source) Load(ctx context.Context, file ...string) ([]*config.Configuration, error) {
	return nil, nil
}

// Store 保存配置项
func (s *Source) Store(ctx context.Context, file string, content []byte) error {
	return nil
}

// Watch 监听配置项
func (s *Source) Watch(ctx context.Context) (config.Watcher, error) {
	return &Watcher{}, nil
}

// Close 关闭配置源
func (s *Source) Close() error {
	return nil
}

type Watcher struct {
}

// Next 返回配置列表
func (w *Watcher) Next() ([]*config.Configuration, error) {
	return nil, nil
}

// Stop 停止监听
func (w *Watcher) Stop() error {
	return nil
}
```

使用自定义的Zookeeper配置源

```go
package main

import (
	"context"
	"due-examples/config/custom/zookeeper"
	"github.com/dobyte/due/v2/config"
	"github.com/dobyte/due/v2/log"
)

const filename = "config.toml"

func main() {
	// 设置zookeeper配置源
	config.SetConfigurator(config.NewConfigurator(config.WithSources(zookeeper.NewSource())))

	// 更新配置
	if err := config.Store(context.Background(), zookeeper.Name, filename, map[string]interface{}{
		"timezone": "Local",
	}); err != nil {
		log.Errorf("store config failed: %v", err)
		return
	}

	// 读取配置
	timezone := config.Get("config.timezone", "UTC").String()
	log.Infof("timezone: %s", timezone)

	// 更新配置
	if err := config.Store(context.Background(), zookeeper.Name, filename, map[string]interface{}{
		"timezone": "UTC",
	}); err != nil {
		log.Errorf("store config failed: %v", err)
		return
	}

	// 读取配置
	timezone = config.Get("config.timezone", "UTC").String()
	log.Infof("timezone: %s", timezone)
}
```

## 启动配置 {#config-etc}

这里仅展示配置中心（config）相关配置参数，如需了解更多模块的参数配置，请查看[启动配置](/guide/etc)

```toml
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
```