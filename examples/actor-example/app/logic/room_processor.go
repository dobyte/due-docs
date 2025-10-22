package logic

import (
	"actor-example/app/route"

	"github.com/dobyte/due/v2/cluster/node"
	"github.com/dobyte/due/v2/codes"
	"github.com/dobyte/due/v2/log"
)

type roomProcessor struct {
	node.BaseProcessor
	actor *node.Actor
	room  *room
}

func newRoomProcessor(actor *node.Actor, args ...any) node.Processor {
	return &roomProcessor{
		actor: actor,
		room:  args[0].(*room),
	}
}

// Init 初始化处理器
func (p *roomProcessor) Init() {
	// 加入
	p.actor.AddRouteHandler(route.Join, p.join)
	// 游戏
	p.actor.AddRouteHandler(route.Play, p.play)
}

// 加入
func (p *roomProcessor) join(ctx node.Context) {
	res := &joinRes{}
	ctx.Defer(func() {
		if err := ctx.Response(res); err != nil {
			log.Errorf("response message failed: %v", err)
		}
	})

	// 执行加入操作
	if err := p.room.doJoin(ctx); err != nil {
		res.Code = codes.Convert(err).Code()
		return
	}

	res.Code = codes.OK.Code()
}

// 游戏
func (p *roomProcessor) play(ctx node.Context) {
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
	if err := p.room.doPlay(ctx, req); err != nil {
		res.Code = codes.Convert(err).Code()
		return
	}

	res.Code = codes.OK.Code()
}
