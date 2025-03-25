package models

type Province struct {
	ProvinceId int64     `gorm:"primaryKey;autoIncrement" json:"province_id"`
	Name       string    `gorm:"type:varchar(255);not null" json:"name" validate:"required"`
	Regencies  []Regency `json:"regencies"`
}
