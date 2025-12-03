package logic

import (
	"codec-proto-example/app/protocol"
	"fmt"

	"github.com/dobyte/due/v2/cluster/node"
	"github.com/dobyte/due/v2/codes"
	"github.com/dobyte/due/v2/log"
	"github.com/dobyte/due/v2/utils/xtime"
)

type core struct {
	proxy *node.Proxy
}

func NewCore(proxy *node.Proxy) *core {
	return &core{proxy: proxy}
}

func (c *core) Init() {
	c.proxy.Router().Group(func(group *node.RouterGroup) {
		// 登录
		group.AddRouteHandler(int32(protocol.Route_Greet), c.greet)
	})
}

func (c *core) greet(ctx node.Context) {
	req := &protocol.GreetReq{}
	res := &protocol.GreetRes{}
	ctx.Defer(func() {
		if err := ctx.Response(res); err != nil {
			log.Errorf("response message failed: %v", err)
		}
	})

	if err := ctx.Parse(req); err != nil {
		log.Errorf("parse request message failed: %v", err)
		res.Code = int32(codes.InternalError.Code())
		return
	}

	log.Info(req.Message)

	res.Code = int32(codes.OK.Code())
	res.Message = fmt.Sprintf("I'm tcp server, and the current time is: %s", xtime.Now().Format(xtime.DateTime))
}
