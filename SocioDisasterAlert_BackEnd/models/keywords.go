package models

type Keywords struct {
	KeywordID int64  `gorm:"primaryKey;autoIncrement" json:"keyword_id"`
	Keyword   string `gorm:"type:varchar(255);not null" json:"keyword"`
}
