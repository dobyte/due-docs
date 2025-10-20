package gorm

import (
	"fmt"
	"strings"
	"time"

	_ "third-gorm-example/gorm/serializer"

	"github.com/dobyte/due/v2/core/pool"
	"github.com/dobyte/due/v2/etc"
	"github.com/dobyte/due/v2/log"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	loggers "gorm.io/gorm/logger"
)

var factory = pool.NewFactory(func(name string) (*gorm.DB, error) {
	return NewInstance(fmt.Sprintf("etc.mysql.%s", name))
})

type Config struct {
	DSN             string        `json:"dsn"`
	LogLevel        string        `json:"logLevel"`
	MaxIdleConns    int           `json:"maxIdleConns"`
	MaxOpenConns    int           `json:"maxOpenConns"`
	SlowThreshold   time.Duration `json:"slowThreshold"`
	ConnMaxLifetime time.Duration `json:"connMaxLifetime"`
}

// Instance 获取实例
func Instance(name ...string) *gorm.DB {
	var (
		err error
		ins *gorm.DB
	)

	if len(name) == 0 {
		ins, err = factory.Get("default")
	} else {
		ins, err = factory.Get(name[0])
	}

	if err != nil {
		log.Fatalf("create mysql instance failed: %v", err)
	}

	return ins
}

// NewInstance 新建实例
func NewInstance[T string | Config | *Config](config T) (*gorm.DB, error) {
	var (
		conf *Config
		v    any = config
	)

	switch c := v.(type) {
	case string:
		conf = &Config{
			DSN:             etc.Get(fmt.Sprintf("%s.dsn", c)).String(),
			LogLevel:        etc.Get(fmt.Sprintf("%s.logLevel", c)).String(),
			MaxIdleConns:    etc.Get(fmt.Sprintf("%s.maxIdleConns", c)).Int(),
			MaxOpenConns:    etc.Get(fmt.Sprintf("%s.maxOpenConns", c)).Int(),
			SlowThreshold:   etc.Get(fmt.Sprintf("%s.slowThreshold", c), "2s").Duration(),
			ConnMaxLifetime: etc.Get(fmt.Sprintf("%s.connMaxLifetime", c), "1h").Duration(),
		}
	case Config:
		conf = &c
	case *Config:
		conf = c
	}

	var logLevel loggers.LogLevel
	switch strings.ToLower(conf.LogLevel) {
	case "silent":
		logLevel = loggers.Silent
	case "error":
		logLevel = loggers.Error
	case "warn":
		logLevel = loggers.Warn
	case "info":
		logLevel = loggers.Info
	default:
		logLevel = loggers.Warn
	}

	db, err := gorm.Open(mysql.New(mysql.Config{
		DSN: conf.DSN,
	}), &gorm.Config{Logger: &logger{
		logLevel:                  logLevel,
		ignoreRecordNotFoundError: true,
		slowThreshold:             conf.SlowThreshold,
	}})
	if err != nil {
		return nil, err
	}

	database, err := db.DB()
	if err != nil {
		return nil, err
	}

	if conf.MaxIdleConns > 0 {
		database.SetMaxIdleConns(conf.MaxIdleConns)
	}

	if conf.MaxOpenConns > 0 {
		database.SetMaxOpenConns(conf.MaxOpenConns)
	}

	if conf.ConnMaxLifetime > 0 {
		database.SetConnMaxLifetime(conf.ConnMaxLifetime)
	}

	return db, nil
}
