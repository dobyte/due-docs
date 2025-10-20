package main

import (
	gormcomp "third-gorm-example/gorm"

	"github.com/dobyte/due/v2/log"
	"gorm.io/gorm"
)

func main() {
	db := gormcomp.Instance("default")

	if err := db.Connection(func(tx *gorm.DB) error {
		return nil
	}); err != nil {
		log.Errorf("db connection error: %v", err)
	}
}
