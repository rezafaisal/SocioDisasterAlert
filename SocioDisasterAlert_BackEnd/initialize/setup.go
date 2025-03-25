package initialize

import (
	"fmt"
	"log"
	"sociadis/config"
	"sociadis/models"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Could not load config: %v", err)
	}

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true",
		cfg.DBUser, cfg.DBPassword, cfg.DBHost, cfg.DBPort, cfg.DBName)
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("Failed to connect to database!")
	}

	err = db.AutoMigrate(&models.User{}, &models.Province{}, &models.Regency{}, &models.District{}, &models.Tweet{}, &models.Keywords{})
	if err != nil {
		panic("Failed to migrate database!")
	}

	DB = db
}
