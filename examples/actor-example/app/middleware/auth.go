package middleware

import (
	"actor-example/app/base"

	"github.com/dobyte/due/v2/cluster/node"
	"github.com/dobyte/due/v2/codes"
	"github.com/dobyte/due/v2/log"
)

// 认证中间件
func Auth(middleware *node.Middleware, ctx node.Context) {
	if ctx.UID() == 0 {
		if err := ctx.Response(&base.Res{Code: codes.Unauthorized.Code()}); err != nil {
			log.Errorf("response message failed, err: %v", err)
		}
	} else {
		middleware.Next(ctx)
	}
}
