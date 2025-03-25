package models

type Tweet struct {
	TweetID    int64    `gorm:"primaryKey" json:"tweet_id" `
	TweetDate  string   `gorm:"not null" json:"tweet_date"`
	FullText   string   `gorm:"type:text;not null" json:"full_text"`
	ImageURL   string   `gorm:"type:text" json:"image_url"`
	Location   string   `gorm:"type:varchar(200)" json:"location"`
	Latitude   string   `gorm:"type:varchar(200)" json:"latitude"`
	Longitude  string   `gorm:"type:varchar(200)" json:"longitude"`
	Username   string   `gorm:"type:text;not null" json:"username"`
	URLProfile string   `gorm:"type:text" json:"url_profile"`
	Category   string   `gorm:"type:varchar(100);not null" json:"category"`
	Disaster   string   `gorm:"type:varchar(100)" json:"disaster"`
	YearTweet  string   `gorm:"type:varchar(10)" json:"year"`
	ProvinceId int64    `json:"province_id"`
	Province   Province `json:"province"`
}
