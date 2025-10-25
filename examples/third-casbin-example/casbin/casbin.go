package casbin

import (
	"fmt"
	"log"

	"github.com/dobyte/due/v2/core/pool"
	"github.com/dobyte/due/v2/etc"
	casbin "github.com/dobyte/gorm-casbin"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var factory = pool.NewFactory(func(name string) (*Enforcer, error) {
	return NewInstance(fmt.Sprintf("etc.casbin.%s", name))
})

type Enforcer = casbin.Enforcer

type Config struct {
	DSN   string `json:"dsn"`
	Table string `json:"table"`
	Model string `json:"model"`
}

// Instance 获取实例
func Instance(name ...string) *Enforcer {
	var (
		err error
		ins *Enforcer
	)

	if len(name) == 0 {
		ins, err = factory.Get("default")
	} else {
		ins, err = factory.Get(name[0])
	}

	if err != nil {
		log.Fatalf("create casbin instance failed: %v", err)
	}

	return ins
}

// NewInstance 新建实例
func NewInstance[T string | Config | *Config](config T) (*Enforcer, error) {
	var (
		conf *Config
		v    any = config
	)

	switch c := v.(type) {
	case string:
		conf = &Config{
			DSN:   etc.Get(fmt.Sprintf("%s.dsn", c)).String(),
			Table: etc.Get(fmt.Sprintf("%s.table", c)).String(),
			Model: etc.Get(fmt.Sprintf("%s.model", c)).String(),
		}
	case Config:
		conf = &c
	case *Config:
		conf = c
	}

	db, err := gorm.Open(mysql.New(mysql.Config{
		DSN: conf.DSN,
	}))
	if err != nil {
		return nil, err
	}

	return casbin.NewEnforcer(&casbin.Options{
		Model:    conf.Model,
		Enable:   true,
		Autoload: true,
		Table:    conf.Table,
		Database: db,
	})
}
