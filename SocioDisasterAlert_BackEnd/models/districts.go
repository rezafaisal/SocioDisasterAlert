package models

type District struct {
	DistrictsId int64   `gorm:"primaryKey;autoIncrement" json:"districts_id"`
	Name        string  `gorm:"type:varchar(255);not null" json:"name" validate:"required"`
	RegencyId   int64   `json:"regency_id"`
	Regency     Regency `json:"regency"`
}
