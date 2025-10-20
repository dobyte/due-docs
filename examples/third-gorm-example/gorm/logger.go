package gorm

import (
	"context"
	"fmt"
	"time"

	"github.com/dobyte/due/v2/errors"
	"github.com/dobyte/due/v2/log"
	loggers "gorm.io/gorm/logger"
)

const traceStr = "%s\n[%.3fms] [rows:%v] %s"

type logger struct {
	logLevel                  loggers.LogLevel
	ignoreRecordNotFoundError bool
	slowThreshold             time.Duration
}

var _ loggers.Interface = &logger{}

func (l *logger) LogMode(level loggers.LogLevel) loggers.Interface {
	newLogger := *l
	newLogger.logLevel = level
	return &newLogger
}

func (l *logger) Info(ctx context.Context, msg string, data ...any) {
	if l.logLevel >= loggers.Info {
		log.Printf(log.LevelInfo, msg, data)
	}
}

func (l *logger) Warn(ctx context.Context, msg string, data ...any) {
	if l.logLevel >= loggers.Warn {
		log.Printf(log.LevelWarn, msg, data)
	}
}

func (l *logger) Error(ctx context.Context, msg string, data ...any) {
	if l.logLevel >= loggers.Error {
		log.Printf(log.LevelError, msg, data)
	}
}

// Trace print sql message
func (l *logger) Trace(ctx context.Context, begin time.Time, fc func() (string, int64), err error) {
	if l.logLevel <= loggers.Silent {
		return
	}

	switch elapsed := time.Since(begin); {
	case err != nil && l.logLevel >= loggers.Error && (!errors.Is(err, loggers.ErrRecordNotFound) || !l.ignoreRecordNotFoundError):
		sql, rows := fc()
		if rows == -1 {
			log.Printf(log.LevelError, traceStr, err, float64(elapsed.Nanoseconds())/1e6, "-", sql)
		} else {
			log.Printf(log.LevelError, traceStr, err, float64(elapsed.Nanoseconds())/1e6, rows, sql)
		}
	case elapsed > l.slowThreshold && l.slowThreshold != 0 && l.logLevel >= loggers.Error:
		sql, rows := fc()
		slowLog := fmt.Sprintf("SLOW SQL >= %v", l.slowThreshold)
		if rows == -1 {
			log.Printf(log.LevelWarn, traceStr, slowLog, float64(elapsed.Nanoseconds())/1e6, "-", sql)
		} else {
			log.Printf(log.LevelWarn, traceStr, slowLog, float64(elapsed.Nanoseconds())/1e6, rows, sql)
		}
	case l.logLevel == loggers.Info:
		sql, rows := fc()
		if rows == -1 {
			log.Printf(log.LevelInfo, traceStr, "", float64(elapsed.Nanoseconds())/1e6, "-", sql)
		} else {
			log.Printf(log.LevelInfo, traceStr, "", float64(elapsed.Nanoseconds())/1e6, rows, sql)
		}
	}
}
