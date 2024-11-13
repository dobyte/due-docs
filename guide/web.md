# Web服务器 {#web}

## 基础介绍 {#web-introduction}

在[due](https://github.com/dobyte/due)框架中，Web服务器是基于[fiber](https://github.com/gofiber/fiber)框架的二次封装。在继承[fiber](https://github.com/gofiber/fiber)框架的所有优点的同时，还提供了符合[due](https://github.com/dobyte/due)框架的调用接口，为游戏开发中的Web场景提供完善的解决方案。

## Swagger支持 {#web-swagger}

为了为广大开发者提供较好的开发体验，Web服务器已原生支持了Swagger的组件。使用方法也非常简单，只需要通过配置项开启即可打开swagger访问支持。

- 安装[swag](https://github.com/swaggo/swag)

```bash
$ go install github.com/swaggo/swag/cmd/swag@latest
```

## 示例代码 {#web-example}

```go
package main

import (
	"fmt"
	"github.com/dobyte/due/component/http/v2"
	"github.com/dobyte/due/v2"
	"github.com/dobyte/due/v2/codes"
	"github.com/dobyte/due/v2/log"
	"github.com/dobyte/due/v2/utils/xtime"
)

// @title API文档
// @version 1.0
// @host localhost:8080
// @BasePath /
func main() {
	// 创建容器
	container := due.NewContainer()
	// 创建HTTP组件
	component := http.NewServer()
	// 初始化监听
	initListen(component.Proxy())
	// 添加网格组件
	container.Add(component)
	// 启动容器
	container.Serve()
}

// 初始化监听
func initListen(proxy *http.Proxy) {
	// 路由器
	router := proxy.Router()
	// 注册路由
	router.Get("/greet", greetHandler)
}

// 请求
type greetReq struct {
	Message string `json:"message"`
}

// 响应
type greetRes struct {
	Message string `json:"message"`
}

// 路由处理器
// @Summary 测试接口
// @Tags 测试
// @Schemes
// @Accept json
// @Produce json
// @Param request body greetReq true "请求参数"
// @Response 200 {object} http.Resp{Data=greetRes} "响应参数"
// @Router /greet [get]
func greetHandler(ctx http.Context) error {
	req := &greetReq{}

	if err := ctx.Bind().JSON(req); err != nil {
		return ctx.Failure(codes.InvalidArgument)
	}

	log.Info(req.Message)

	return ctx.Success(&greetRes{
		Message: fmt.Sprintf("I'm server, and the current time is: %s", xtime.Now().Format(xtime.DateTime)),
	})
}
```

## 生成文档 {#web-swagger-init}

- 生成swagger文件

```bash
$ swag init --parseDependency
```

- 删除无用的docs.go文件

```bash
$ rm -rf ./docs/docs.go
```

## 启动服务 {#web-start}

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
| PID: 40628                                           |
| Mode: debug                                          |
└──────────────────────────────────────────────────────┘
┌─────────────────────────Http─────────────────────────┐
| Name: http                                           |
| Url: http://192.168.2.202:8080                       |
| Swagger: http://192.168.2.202:8080/swagger           |
| Registry: -                                          |
| Transporter: -                                       |
└──────────────────────────────────────────────────────┘
```

## 启动配置 {#web-etc}

这里仅展示Web服务器（web）配置参数，如需了解更多模块的参数配置，请查看[启动配置](/guide/etc)

```toml
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
  # swagger配置
  [http.swagger]
    # 是否启用文档
    enable = true
    # API文档标题
    title = "API文档"
    # URL访问基础路径
    basePath = "/swagger"
    # swagger文件路径
    filePath = "./docs/swagger.json"
```

## 更多文档 {#web-more}

[due](https://github.com/dobyte/due)框架的Web服务器严格遵循[fiber](https://github.com/gofiber/fiber)框架的开发规范，如需了解更多的开发问题请移步[fiber开发文档](https://github.com/gofiber/fiber)