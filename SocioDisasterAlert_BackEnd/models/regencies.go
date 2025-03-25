package models

type Regency struct {
	RegencyId  int64      `gorm:"primaryKey;autoIncrement" json:"regency_id"`
	Name       string     `gorm:"type:varchar(255);not null" json:"name" validate:"required"`
	ProvinceId int64      `json:"province_id"`
	Province   Province   `json:"province"`
	Districts  []District `json:"districts"`
}
