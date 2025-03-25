package models

import "time"

type User struct {
	UserId    int64      `gorm:"primaryKey" json:"user_id"`
	FullName  string     `gorm:"type:varchar(100);index" json:"full_name"`
	UserName  string     `gorm:"type:varchar(100);index" json:"username" `
	Password  string     `gorm:"type:varchar(100)" json:"password"`
	Email     string     `gorm:"type:varchar(100)" json:"email"`
	Role      string     `gorm:"type:ENUM('Admin','Customer'); default:'Customer'" json:"role"`
	CreatedAt *time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt *time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}
