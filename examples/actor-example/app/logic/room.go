package logic

import (
	"github.com/dobyte/due/v2/cluster/node"
	"github.com/dobyte/due/v2/codes"
	"github.com/dobyte/due/v2/errors"
	"github.com/dobyte/due/v2/log"
	"github.com/dobyte/due/v2/utils/xconv"
)

type room struct {
	id      int64
	name    string
	creator int64
	members map[int64]struct{}
}

func newRoom(id int64, name string, creator int64) *room {
	r := &room{}
	r.id = id
	r.name = name
	r.creator = creator
	r.members = make(map[int64]struct{})
	r.members[r.creator] = struct{}{}

	return r
}

// 加入
func (r *room) doJoin(ctx node.Context) (err error) {
	uid := ctx.UID()

	if _, ok := r.members[uid]; ok {
		return errors.NewError(codes.IllegalRequest)
	}

	if err = ctx.BindNode(); err != nil {
		return errors.NewError(codes.InternalError, err)
	}

	defer func() {
		if err != nil {
			ctx.UnbindNode()
		}
	}()

	if err = ctx.BindActor(roomActor, xconv.String(r.id)); err != nil {
		return errors.NewError(codes.InternalError, err)
	}

	r.members[uid] = struct{}{}

	return nil
}

// 游戏
func (r *room) doPlay(ctx node.Context, req *playReq) (err error) {
	uid := ctx.UID()

	if _, ok := r.members[uid]; !ok {
		return errors.NewError(codes.IllegalRequest)
	}

	if req.Action != "move" {
		return errors.NewError(codes.InvalidArgument)
	}

	log.Infof("play, uid: %v, action: %v", uid, req.Action)

	return nil
}
