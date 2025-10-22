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
const (
	login = 1 // 登录
	join  = 2 // 加入
	play  = 3 // 游戏
)

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
	proxy.Router().Group(func(group *node.RouterGroup) {
		// 登录
		group.AddRouteHandler(login, loginHandler)
		// 设置认证中间件
		group.Middleware(auth)
		// 加入
		group.AddRouteHandler(join, joinHandler, node.AuthorizedRoute)
		// 游戏
		group.AddRouteHandler(play, playHandler, node.StatefulRoute)
	})
}

// 基础响应
type baseRes struct {
	Code int `json:"code"`
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
		ctx.Defer(func() {
			if err := ctx.Response(res); err != nil {
				log.Errorf("response message failed: %v", err)
			}
		})

		if err := ctx.Parse(req); err != nil {
			log.Errorf("parse request message failed: %v", err)
			res.Code = codes.InternalError.Code()
			return
		}

		// 执行登录操作
		uid, err := doLogin(req)
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

// 请求
type joinReq struct {
	RoomID int64 `json:"roomID"`
}

// 响应
type joinRes struct {
	Code int `json:"code"`
}

// 加入
func joinHandler(ctx node.Context) {
	req := &joinReq{}
	res := &joinRes{}
	ctx.Defer(func() {
		if err := ctx.Response(res); err != nil {
			log.Errorf("response message failed: %v", err)
		}
	})

	if err := ctx.Parse(req); err != nil {
		log.Errorf("parse request message failed: %v", err)
		res.Code = codes.InternalError.Code()
		return
	}

	// 执行加入游戏操作
	if err := doJoin(ctx.UID(), req); err != nil {
		res.Code = codes.Convert(err).Code()
		return
	}

	// 绑定节点
	if err := ctx.BindNode(ctx.UID()); err != nil {
		log.Errorf("bind node failed: %v", err)
		res.Code = codes.InternalError.Code()
		return
	}

	res.Code = codes.OK.Code()
}

// 游戏
func playHandler(ctx node.Context) {
	req := &playReq{}
	res := &playRes{}
	ctx.Defer(func() {
		if err := ctx.Response(res); err != nil {
			log.Errorf("response message failed: %v", err)
		}
	})

	if err := ctx.Parse(req); err != nil {
		log.Errorf("parse request message failed: %v", err)
		res.Code = codes.InternalError.Code()
		return
	}

	// 执行游戏操作
	if err := doPlay(ctx.UID(), req); err != nil {
		res.Code = codes.Convert(err).Code()
		return
	}

	res.Code = codes.OK.Code()
}

// 请求
type playReq struct {
	Action string `json:"action"`
}

// 响应
type playRes struct {
	Code int `json:"code"`
}

// 认证中间件
func auth(middleware *node.Middleware, ctx node.Context) {
	if ctx.UID() == 0 {
		if err := ctx.Response(&baseRes{Code: codes.Unauthorized.Code()}); err != nil {
			log.Errorf("response message failed, err: %v", err)
		}
	} else {
		middleware.Next(ctx)
	}
}

// 执行登录操作
func doLogin(req *loginReq) (int64, error) {
	if req.Account != defaultAccount || req.Password != defaultPassword {
		return 0, errors.NewError(codes.InvalidArgument)
	}

	return defaultUID, nil
}

// 执行加入游戏操作
func doJoin(uid int64, req *joinReq) error {
	if req.RoomID != 1 {
		return errors.NewError(codes.InvalidArgument)
	}

	log.Infof("join room, uid: %v, roomID: %v", uid, req.RoomID)

	return nil
}

// 执行游戏操作
func doPlay(uid int64, req *playReq) error {
	if req.Action != "move" {
		return errors.NewError(codes.InvalidArgument)
	}

	log.Infof("play, uid: %v, action: %v", uid, req.Action)

	return nil
}
