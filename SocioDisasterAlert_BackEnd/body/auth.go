package body

type LoginRequest struct {
	Username string `gorm:"type:varchar(100)" json:"username" validate:"required"`
	Password string `gorm:"type:varchar(100)" json:"password" validate:"required"`
}
