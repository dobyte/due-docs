package logic

import (
	"actor-example/app/base"
	"actor-example/app/middleware"
	"actor-example/app/route"
	"hash/fnv"

	"github.com/dobyte/due/v2/cluster/node"
	"github.com/dobyte/due/v2/codes"
	"github.com/dobyte/due/v2/errors"
	"github.com/dobyte/due/v2/log"
	"github.com/dobyte/due/v2/utils/xconv"
)

const defaultPassword = "123456"

const roomActor = "room"

type core struct {
	proxy *node.Proxy
	rooms map[int64]*room
}

func NewCore(proxy *node.Proxy) *core {
	return &core{proxy: proxy}
}

func (c *core) Init() {
	c.proxy.Router().Group(func(group *node.RouterGroup) {
		// 登录
		group.AddRouteHandler(route.Login, c.login)
		// 设置认证中间件
		group.Middleware(middleware.Auth)
		// 创建
		group.AddRouteHandler(route.Create, c.create, node.AuthorizedRoute)
		// 加入
		group.AddRouteHandler(route.Join, c.join, node.AuthorizedRoute)
		// 游戏
		group.AddRouteHandler(route.Play, c.play, node.StatefulRoute)
	})
}

// 登录
func (c *core) login(ctx node.Context) {
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
		uid, err := c.doLogin(req)
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
func (c *core) doLogin(req *loginReq) (int64, error) {
	if req.Password != defaultPassword {
		return 0, errors.NewError(codes.InvalidArgument)
	}

	fnv := fnv.New64a()
	fnv.Write([]byte(req.Account))
	uid := fnv.Sum64()

	return int64(uid), nil
}

// 创建
func (c *core) create(ctx node.Context) {
	req := &createReq{}
	res := &createRes{}
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

	// 执行创建操作
	r, err := c.doCreate(ctx, req)
	if err != nil {
		res.Code = codes.Convert(err).Code()
		return
	}

	res.Code = codes.OK.Code()
	res.Data = &createResData{RoomID: r.id}
}

// 执行创建操作
func (c *core) doCreate(ctx node.Context, req *createReq) (*room, error) {
	var (
		err   error
		actor *node.Actor
	)

	r := newRoom(int64(len(c.rooms)+1), req.Name, ctx.UID())

	if actor, err = c.proxy.Spawn(newRoomProcessor, node.WithActorID(xconv.String(r.id)), node.WithActorArgs(r), node.WithActorKind(roomActor)); err != nil {
		log.Errorf("spawn actor faile: %v", err)
		return nil, errors.NewError(err, codes.InternalError)
	}

	defer func() {
		if err != nil {
			actor.Destroy()
		}
	}()

	if err = ctx.BindActor(actor.Kind(), actor.ID()); err != nil {
		log.Errorf("bind actor failed: %v", err)
		return nil, errors.NewError(err, codes.InternalError)
	}

	defer func() {
		if err != nil {
			ctx.UnbindActor(actor.Kind())
		}
	}()

	if err = ctx.BindNode(); err != nil {
		log.Errorf("bind node failed: %v", err)
		return nil, errors.NewError(err, codes.InternalError)
	}

	c.rooms[r.id] = r

	return r, nil
}

// 加入
// 多节点场景需要借助共享存储（如Redis）来存储房间信息，以便能够通过房间ID找到对应房间所在的节点，并将消息转发至对应节点服进行处理，此处细节不再赘述。
func (c *core) join(ctx node.Context) {
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

	actor, ok := ctx.Actor(roomActor, xconv.String(req.RoomID))
	if !ok {
		res.Code = codes.NotFound.Code()
		return
	}

	actor.Next(ctx)
}

// 游戏
func (c *core) play(ctx node.Context) {
	res := &base.Res{}
	ctx.Defer(func() {
		if err := ctx.Response(res); err != nil {
			log.Errorf("response message failed: %v", err)
		}
	})

	if err := ctx.Next(); err != nil {
		log.Errorf("request next failed: uid = %v route = %v err = %v", ctx.UID(), ctx.Route(), err)
		res.Code = codes.IllegalRequest.Code()
	}
}
