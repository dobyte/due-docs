package main

import (
	"github.com/dobyte/due/locate/redis/v2"
	"github.com/dobyte/due/registry/consul/v2"
	"github.com/dobyte/due/v2"
	"github.com/dobyte/due/v2/cluster/node"
	"github.com/dobyte/due/v2/codes"
	"github.com/dobyte/due/v2/errors"
	"github.com/dobyte/due/v2/log"
)

const (
	defaultUID      = 1
	defaultAccount  = "fuxiao"
	defaultPassword = "123456"
)

// 路由号
const login = 1

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
	proxy.Router().AddRouteHandler(login, loginHandler)
}

// 请求
type loginReq struct {
	Account  string `json:"account"`
	Password string `json:"password"`
}

// 响应
type loginRes struct {
	Code int `json:"code"`
}

// 路由处理器
func loginHandler(ctx node.Context) {
	ctx.Task(func(ctx node.Context) {
		req := &loginReq{}
		res := &loginRes{}
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

		// 执行登录操作
		uid, err := doLogin(req.Account, req.Password)
		if err != nil {
			res.Code = codes.Convert(err).Code()
			return
		}

		// 绑定网关
		if err = ctx.BindGate(uid); err != nil {
			log.Errorf("bind gate failed: %v", err)
			res.Code = codes.InternalError.Code()
			return
		}

		res.Code = codes.OK.Code()
	})
}

// 执行登录操作
func doLogin(account string, password string) (int64, error) {
	if account != defaultAccount || password != defaultPassword {
		return 0, errors.NewError(codes.InvalidArgument)
	}

	return defaultUID, nil
}
