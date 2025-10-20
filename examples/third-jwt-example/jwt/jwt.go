package jwt

import (
	"fmt"

	"github.com/dobyte/due/v2/core/pool"
	"github.com/dobyte/due/v2/etc"
	"github.com/dobyte/due/v2/log"
	"github.com/dobyte/jwt"
)

var factory = pool.NewFactory(func(name string) (*JWT, error) {
	return NewInstance(fmt.Sprintf("etc.jwt.%s", name))
})

type (
	JWT     = jwt.JWT
	Token   = jwt.Token
	Payload = jwt.Payload
)

type Config struct {
	Issuer        string       `json:"issuer"`
	SecretKey     string       `json:"secretKey"`
	IdentityKey   string       `json:"identityKey"`
	Locations     string       `json:"locations"`
	ValidDuration int          `json:"validDuration"`
	Store         *StoreConfig `json:"store"`
}

// Instance JWT实例
func Instance(name ...string) *JWT {
	var (
		err error
		ins *JWT
	)

	if len(name) == 0 {
		ins, err = factory.Get("default")
	} else {
		ins, err = factory.Get(name[0])
	}

	if err != nil {
		log.Fatalf("create jwt instance failed: %v", err)
	}

	return ins
}

// NewInstance 创建实例
func NewInstance[T string | Config | *Config](config T) (*JWT, error) {
	var (
		conf *Config
		v    any = config
	)

	switch c := v.(type) {
	case string:
		conf = &Config{
			Issuer:        etc.Get(fmt.Sprintf("%s.issuer", c)).String(),
			SecretKey:     etc.Get(fmt.Sprintf("%s.secretKey", c)).String(),
			IdentityKey:   etc.Get(fmt.Sprintf("%s.identityKey", c)).String(),
			Locations:     etc.Get(fmt.Sprintf("%s.locations", c)).String(),
			ValidDuration: etc.Get(fmt.Sprintf("%s.validDuration", c)).Int(),
		}

		if etc.Has(fmt.Sprintf("%s.store", c)) {
			conf.Store = &StoreConfig{
				Addrs:        etc.Get(fmt.Sprintf("%s.store.addrs", c)).Strings(),
				DB:           etc.Get(fmt.Sprintf("%s.store.db", c)).Int(),
				CertFile:     etc.Get(fmt.Sprintf("%s.store.certFile", c)).String(),
				KeyFile:      etc.Get(fmt.Sprintf("%s.store.keyFile", c)).String(),
				CaFile:       etc.Get(fmt.Sprintf("%s.store.caFile", c)).String(),
				Username:     etc.Get(fmt.Sprintf("%s.store.username", c)).String(),
				Password:     etc.Get(fmt.Sprintf("%s.store.password", c)).String(),
				MaxRetries:   etc.Get(fmt.Sprintf("%s.store.maxRetries", c), 3).Int(),
				PoolSize:     etc.Get(fmt.Sprintf("%s.store.poolSize", c), 200).Int(),
				MinIdleConns: etc.Get(fmt.Sprintf("%s.store.minIdleConns", c), 20).Int(),
				DialTimeout:  etc.Get(fmt.Sprintf("%s.store.dialTimeout", c), "3s").Duration(),
				IdleTimeout:  etc.Get(fmt.Sprintf("%s.store.idleTimeout", c)).Duration(),
				ReadTimeout:  etc.Get(fmt.Sprintf("%s.store.readTimeout", c), "1s").Duration(),
				WriteTimeout: etc.Get(fmt.Sprintf("%s.store.writeTimeout", c), "1s").Duration(),
			}
		}
	case Config:
		conf = &c
	case *Config:
		conf = c
	}

	opts := make([]jwt.Option, 0, 6)
	opts = append(opts, jwt.WithIssuer(conf.Issuer))
	opts = append(opts, jwt.WithIdentityKey(conf.IdentityKey))
	opts = append(opts, jwt.WithSecretKey(conf.SecretKey))
	opts = append(opts, jwt.WithValidDuration(conf.ValidDuration))
	opts = append(opts, jwt.WithLookupLocations(conf.Locations))

	if conf.Store != nil {
		store, err := NewStore(conf.Store)
		if err != nil {
			return nil, err
		}

		opts = append(opts, jwt.WithStore(store))
	}

	return jwt.NewJWT(opts...)
}
