package controllers

import (
	"encoding/csv"
	"math"
	"sociadis/helpers"
	"sociadis/initialize"
	"sociadis/models"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func GetDatatableTweets(c *fiber.Ctx) error {
	// Ambil nilai parameter limit, page, sort, sort_by, dan search dari query string
	limit, err := strconv.Atoi(c.Query("limit", "10"))
	if err != nil {
		limit = 10 // Nilai default untuk limit adalah 10
	}
	page, err := strconv.Atoi(c.Query("page", "1"))
	if err != nil {
		page = 1 // Halaman default adalah 1
	}
	// sort := c.Query("sort", "created_at")
	// sortBy := c.Query("sort_by", "desc")
	search := c.Query("search", "")
	category := c.Query("category", "")
	disaster := c.Query("disaster", "")

	// Hitung offset berdasarkan halaman dan limit
	offset := (page - 1) * limit

	// Lakukan pengambilan data dari database dengan menggunakan parameter limit, offset, sort, dan sort_by
	var tweets []models.Tweet
	query := initialize.DB.Model(&models.Tweet{})

	// Jika parameter search tidak kosong, tambahkan filter pencarian
	if search != "" {
		query = query.Where("full_text LIKE ?", "%"+search+"%")
	}

	// Jika parameter category tidak kosong, tambahkan filter berdasarkan category
	if category != "" {
		query = query.Where("category = ?", category)
	}

	// Jika parameter disaster tidak kosong, tambahkan filter berdasarkan disaster
	if disaster != "" {
		query = query.Where("disaster = ?", disaster)
	}

	var totalRecords int64
	if err := query.Count(&totalRecords).Error; err != nil {
		response := helpers.GeneralResponse{
			Code:   500,
			Status: "Internal Server Error",
			Data:   nil,
		}
		return c.Status(fiber.StatusInternalServerError).JSON(response)
	}
	// // Jika parameter sort dan sort_by disediakan, lakukan pengurutan berdasarkan kolom yang dimaksud
	// if sort != "" && sortBy != "" {
	// 	query = query.Order(fmt.Sprintf("%s %s", sort, sortBy))
	// }

	// Limit jumlah data yang diambil sesuai dengan nilai parameter limit dan offset
	query = query.Limit(limit).Offset(offset)

	// Lakukan pengambilan data
	if err := query.Find(&tweets).Error; err != nil {
		// Jika terjadi kesalahan saat mengambil data, kirim respons kesalahan ke klien
		response := helpers.GeneralResponse{
			Code:   500,
			Status: "Internal Server Error",
			Data:   nil,
		}
		return c.Status(fiber.StatusInternalServerError).JSON(response)
	}

	// Hitung total jumlah halaman berdasarkan total jumlah record dan limit
	totalPages := int(math.Ceil(float64(totalRecords) / float64(limit)))

	// Buat respons dalam format datatable
	response := helpers.DataTableResponse{
		CurrentPage:  page,
		FirstPageURL: "", // Anda bisa menentukan URL halaman pertama jika perlu
		From:         offset + 1,
		LastPage:     totalPages,
		LastPageURL:  "", // Anda bisa menentukan URL halaman terakhir jika perlu
		NextPageURL:  "", // Anda bisa menentukan URL halaman berikutnya jika perlu
		PrevPageURL:  "", // Anda bisa menentukan URL halaman sebelumnya jika perlu
		To:           offset + len(tweets),
		Total:        int(totalRecords),
		Data:         make([]interface{}, len(tweets)),
	}

	for i, tweet := range tweets {
		// Buat map untuk setiap tweet
		tweetMap := map[string]interface{}{
			"tweet_id":    tweet.TweetID,
			"tweet_date":  tweet.TweetDate,
			"full_text":   tweet.FullText,
			"image_url":   tweet.ImageURL,
			"year":        tweet.YearTweet,
			"location":    tweet.Location,
			"latitude":    tweet.Latitude,
			"longitude":   tweet.Longitude,
			"username":    tweet.Username,
			"url_profile": tweet.URLProfile,
			"category":    tweet.Category,
			"disaster":    tweet.Disaster,
			"province_id": strconv.FormatInt(tweet.ProvinceId, 10),
		}

		// Tambahkan map tweet ke dalam slice Data pada respons
		response.Data[i] = tweetMap
	}

	// Kembalikan respons JSON dengan format datatable
	return c.JSON(helpers.GeneralResponse{
		Code:   200,
		Status: "OK",
		Data:   response,
	})
}

func GetAllTweets(c *fiber.Ctx) error {
	var tweets []models.Tweet

	// Query untuk mengambil semua tweet
	if err := initialize.DB.Find(&tweets).Error; err != nil {
		response := helpers.ResponseError{
			Code:   fiber.StatusInternalServerError,
			Status: "error",
			Error:  map[string][]string{"message": {err.Error()}},
		}
		return c.Status(fiber.StatusInternalServerError).JSON(response)
	}

	// Membuat respons sukses dengan data tweet
	response := helpers.GeneralResponse{
		Code:   fiber.StatusOK,
		Status: "success",
		Data:   tweets,
	}

	return c.JSON(response)
}
func GetTweetsByDisasterType(c *fiber.Ctx, disasterType string) error {
	var tweets []models.Tweet

	// Query untuk mengambil semua tweet berdasarkan jenis bencana
	if err := initialize.DB.Where("disaster = ?", disasterType).Find(&tweets).Error; err != nil {
		response := helpers.ResponseError{
			Code:   fiber.StatusInternalServerError,
			Status: "error",
			Error:  map[string][]string{"message": {err.Error()}},
		}
		return c.Status(fiber.StatusInternalServerError).JSON(response)
	}

	// Membuat respons sukses dengan data tweet
	response := helpers.GeneralResponse{
		Code:   fiber.StatusOK,
		Status: "success",
		Data:   tweets,
	}

	return c.JSON(response)
}
func GetBanjirTweets(c *fiber.Ctx) error {
	return GetTweetsByDisasterType(c, "Banjir")
}
func GetKebakaranTweets(c *fiber.Ctx) error {
	return GetTweetsByDisasterType(c, "Kebakaran Hutan")
}
func GetGempaTweets(c *fiber.Ctx) error {
	return GetTweetsByDisasterType(c, "Gempa Bumi")
}
func GetProvinceDisasterCounts(c *fiber.Ctx) error {
	// Ambil parameter tahun dari query string
	yearParam := c.Query("year", "2024")

	var results []map[string]interface{}

	query := `
		SELECT 
			p.province_id,
			p.name AS province_name,
			COUNT(*) AS total_bencana
		FROM tweets t
		LEFT JOIN provinces p ON t.province_id = p.province_id
		WHERE t.year_tweet = ?
		AND p.province_id IS NOT NULL -- Pastikan tidak mengambil data dengan province_id NULL
		GROUP BY p.province_id, p.name
		ORDER BY p.name
	`

	if err := initialize.DB.Raw(query, yearParam).Scan(&results).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  "error",
			"message": "Failed to execute query",
			"error":   err.Error(),
		})
	}
	if len(results) == 0 {
		results = []map[string]interface{}{}
	}
	response := fiber.Map{
		"code":   fiber.StatusOK,
		"status": "success",
		"data": fiber.Map{
			"year": yearParam,
			"data": results,
		},
	}
	return c.JSON(response)
}

func GetTweetStatistics(c *fiber.Ctx) error {
	// Ambil parameter tahun dari query string
	year := c.Query("year", "2024")

	// Query untuk menghitung jumlah tweet per bulan berdasarkan jenis bencana
	query := `
		SELECT 
			LEFT(DATE_FORMAT(tweet_date, '%b'), 3) AS month_short,
			COUNT(CASE WHEN disaster = 'Kebakaran Hutan' THEN 1 END) AS kebakaran_hutan,
			COUNT(CASE WHEN disaster = 'Banjir' THEN 1 END) AS banjir,
			COUNT(CASE WHEN disaster = 'Gempa Bumi' THEN 1 END) AS gempa_bumi
		FROM tweets
		WHERE year_tweet = ? AND tweet_date IS NOT NULL
		GROUP BY month_short
		ORDER BY FIELD(month_short, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec')
	`

	rows, err := initialize.DB.Raw(query, year).Rows()
	if err != nil {
		response := helpers.ResponseError{
			Code:   fiber.StatusInternalServerError,
			Status: "error",
			Error:  map[string][]string{"message": {err.Error()}},
		}
		return c.Status(fiber.StatusInternalServerError).JSON(response)
	}
	defer rows.Close()

	// Parsing hasil query ke dalam format yang diinginkan
	var statistics []map[string]interface{}
	for rows.Next() {
		var month string
		var kebakaranHutan, banjir, gempaBumi int

		if err := rows.Scan(&month, &kebakaranHutan, &banjir, &gempaBumi); err != nil {
			response := helpers.ResponseError{
				Code:   fiber.StatusInternalServerError,
				Status: "error",
				Error:  map[string][]string{"message": {err.Error()}},
			}
			return c.Status(fiber.StatusInternalServerError).JSON(response)
		}

		statistics = append(statistics, map[string]interface{}{
			"month":           month,
			"kebakaran_hutan": kebakaranHutan,
			"banjir":          banjir,
			"gempa_bumi":      gempaBumi,
		})
	}

	if statistics == nil {
		statistics = []map[string]interface{}{}
	}
	response := fiber.Map{
		"code":   fiber.StatusOK,
		"status": "success",
		"data": fiber.Map{
			"year": year,
			"data": statistics,
		},
	}

	return c.JSON(response)
}
func GetMonthlyDisasterCounts(c *fiber.Ctx) error {
	yearParam := c.Query("year")
	if yearParam == "" {
		yearParam = strconv.Itoa(2024) // Default to 2023 if no year is specified
	}

	var results []map[string]interface{}

	query := `
		SELECT 
			LEFT(DATE_FORMAT(tweet_date, '%b'), 3) AS month_short,
			COUNT(*) AS bencana
		FROM tweets
		WHERE year_tweet = ?
		GROUP BY month_short
		ORDER BY FIELD(month_short, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec')
	`

	if err := initialize.DB.Raw(query, yearParam).Scan(&results).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"status":  "error",
			"message": "Failed to execute query",
			"error":   err.Error(),
		})
	}
	if results == nil {
		results = []map[string]interface{}{}
	}

	response := fiber.Map{
		"code":   fiber.StatusOK,
		"status": "success",
		"data": fiber.Map{
			"year": yearParam,
			"data": results,
		},
	}
	return c.JSON(response)
}

func GetTotalCard(c *fiber.Ctx) error {
	query := `
		SELECT 
			COUNT(*) AS total_disaster,
			SUM(CASE WHEN disaster = 'Gempa Bumi' THEN 1 ELSE 0 END) AS total_gempa,
			SUM(CASE WHEN disaster = 'Banjir' THEN 1 ELSE 0 END) AS total_banjir,
			SUM(CASE WHEN disaster = 'Kebakaran Hutan' THEN 1 ELSE 0 END) AS total_kebakaran
		FROM tweets
	`

	// Struktur untuk menyimpan hasil query
	type Result struct {
		TotalDisaster  int `json:"total_disaster"`
		TotalGempa     int `json:"total_gempa"`
		TotalBanjir    int `json:"total_banjir"`
		TotalKebakaran int `json:"total_kebakaran"`
	}

	// Variabel untuk menyimpan hasil query
	var result Result

	// Eksekusi query ke database
	if err := initialize.DB.Raw(query).First(&result).Error; err != nil {
		response := helpers.ResponseError{
			Code:   fiber.StatusInternalServerError,
			Status: "error",
			Error:  map[string][]string{"message": {err.Error()}},
		}
		return c.Status(fiber.StatusInternalServerError).JSON(response)
	}

	// Buat respons sukses dengan data statistik
	response := helpers.GeneralResponse{
		Code:   fiber.StatusOK,
		Status: "success",
		Data: map[string]interface{}{
			"total_disaster":  result.TotalDisaster,
			"total_gempa":     result.TotalGempa,
			"total_banjir":    result.TotalBanjir,
			"total_kebakaran": result.TotalKebakaran,
		},
	}

	return c.JSON(response)
}

func CreateTweet(c *fiber.Ctx) error {
	var tweet models.Tweet

	// Parsing JSON input
	if err := c.BodyParser(&tweet); err != nil {
		response := helpers.ResponseError{
			Code:   fiber.StatusBadRequest,
			Status: "error",
			Error:  map[string][]string{"message": {"Invalid JSON format"}},
		}
		return c.Status(fiber.StatusBadRequest).JSON(response)
	}

	// Validasi inputan field
	errors := make(map[string][]string)
	if tweet.TweetDate == "" {
		errors["tweet_date"] = append(errors["tweet_date"], "Tanggal Tweet Wajib Diisi")
	}
	if tweet.FullText == "" {
		errors["full_text"] = append(errors["full_text"], "Judul Wajib Diisi")
	}
	if tweet.Username == "" {
		errors["username"] = append(errors["username"], "Username Wajib Diisi")
	}
	if tweet.Category == "" {
		errors["category"] = append(errors["category"], "Category Wajib Diisi")
	}
	if tweet.Latitude == "" {
		errors["latitude"] = append(errors["latitude"], "Latitude Wajib Diisi")
	}
	if tweet.Longitude == "" {
		errors["longitude"] = append(errors["longitude"], "Longitude Wajib Diisi")
	}
	if tweet.Location == "" {
		errors["location"] = append(errors["location"], "Lokasi Wajib Diisi")
	}
	if tweet.Disaster == "" {
		errors["disaster"] = append(errors["disaster"], "Bencana Wajib Diisi")
	}
	if tweet.ProvinceId == 0 {
		errors["province_id"] = append(errors["province_id"], "Provinsi Wajib Diisi")
	}
	if tweet.YearTweet == "" {
		errors["year"] = append(errors["year"], "Tahun Wajib Diisi")
	}

	if len(errors) > 0 {
		response := helpers.ResponseError{
			Code:   fiber.StatusBadRequest,
			Status: "error",
			Error:  errors,
		}
		return c.Status(fiber.StatusBadRequest).JSON(response)
	}

	// Menyimpan data ke database
	if err := initialize.DB.Create(&tweet).Error; err != nil {
		response := helpers.ResponseError{
			Code:   fiber.StatusInternalServerError,
			Status: "error",
			Error:  map[string][]string{"message": {err.Error()}},
		}
		return c.Status(fiber.StatusInternalServerError).JSON(response)
	}

	// Membuat respons sukses
	response := helpers.GeneralResponse{
		Code:   fiber.StatusOK,
		Status: "success",
		Data:   tweet,
	}

	return c.JSON(response)
}

func DeleteTweet(c *fiber.Ctx) error {
	tweetIDParam := c.Params("id")

	tweetID, err := strconv.ParseInt(tweetIDParam, 10, 64)
	if err != nil {
		response := helpers.ResponseError{
			Code:   fiber.StatusBadRequest,
			Status: "error",
			Error:  map[string][]string{"message": {"Invalid tweet ID"}},
		}
		return c.Status(fiber.StatusBadRequest).JSON(response)
	}
	// Cari tweet berdasarkan tweet_id
	var tweet models.Tweet
	if err := initialize.DB.First(&tweet, tweetID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			response := helpers.ResponseError{
				Code:   fiber.StatusNotFound,
				Status: "error",
				Error:  map[string][]string{"message": {"Tweet not found"}},
			}
			return c.Status(fiber.StatusNotFound).JSON(response)
		}

		response := helpers.ResponseError{
			Code:   fiber.StatusInternalServerError,
			Status: "error",
			Error:  map[string][]string{"message": {err.Error()}},
		}
		return c.Status(fiber.StatusInternalServerError).JSON(response)
	}

	// Hapus tweet
	if err := initialize.DB.Delete(&tweet).Error; err != nil {
		response := helpers.ResponseError{
			Code:   fiber.StatusInternalServerError,
			Status: "error",
			Error:  map[string][]string{"message": {err.Error()}},
		}
		return c.Status(fiber.StatusInternalServerError).JSON(response)
	}

	// Membuat respons sukses
	response := helpers.ResponseMessage{
		Code:    fiber.StatusOK,
		Status:  "success",
		Message: "Success Menghapus",
	}

	return c.JSON(response)
}
func UpdateTweet(c *fiber.Ctx) error {
	tweetIDParam := c.Params("id")

	// Validasi apakah tweetID adalah integer
	tweetID, err := strconv.ParseInt(tweetIDParam, 10, 64)
	if err != nil {
		response := helpers.ResponseError{
			Code:   fiber.StatusBadRequest,
			Status: "error",
			Error:  map[string][]string{"message": {"Invalid tweet ID"}},
		}
		return c.Status(fiber.StatusBadRequest).JSON(response)
	}

	// Cari tweet berdasarkan tweet_id
	var tweet models.Tweet
	if err := initialize.DB.First(&tweet, tweetID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			response := helpers.ResponseError{
				Code:   fiber.StatusNotFound,
				Status: "error",
				Error:  map[string][]string{"message": {"Tweet not found"}},
			}
			return c.Status(fiber.StatusNotFound).JSON(response)
		}

		response := helpers.ResponseError{
			Code:   fiber.StatusInternalServerError,
			Status: "error",
			Error:  map[string][]string{"message": {err.Error()}},
		}
		return c.Status(fiber.StatusInternalServerError).JSON(response)
	}

	// Parsing body request
	var updateData models.Tweet
	if err := c.BodyParser(&updateData); err != nil {
		response := helpers.ResponseError{
			Code:   fiber.StatusBadRequest,
			Status: "error",
			Error:  map[string][]string{"message": {"Failed to parse request body"}},
		}
		return c.Status(fiber.StatusBadRequest).JSON(response)
	}

	// Validasi field yang diperlukan
	errors := make(map[string][]string)
	if updateData.TweetDate == "" {
		errors["tweet_date"] = append(errors["tweet_date"], "Tanggal Tweet Wajib Diisi")
	}
	if updateData.FullText == "" {
		errors["full_text"] = append(errors["full_text"], "Judul Wajib Diisi")
	}
	if updateData.Username == "" {
		errors["username"] = append(errors["username"], "Username Wajib Diisi")
	}
	if updateData.Category == "" {
		errors["category"] = append(errors["category"], "Category Wajib Diisi")
	}
	if updateData.Latitude == "" {
		errors["latitude"] = append(errors["latitude"], "Latitude Wajib Diisi")
	}
	if updateData.Longitude == "" {
		errors["longitude"] = append(errors["longitude"], "Longitude Wajib Diisi")
	}
	if updateData.Location == "" {
		errors["location"] = append(errors["location"], "Lokasi Wajib Diisi")
	}
	if updateData.Disaster == "" {
		errors["disaster"] = append(errors["disaster"], "Bencana Wajib Diisi")
	}
	if updateData.YearTweet == "" {
		errors["year"] = append(errors["year"], "Tahun Wajib Diisi")
	}
	if updateData.ProvinceId == 0 {
		errors["province_id"] = append(errors["province_id"], "Provinsi Wajib Diisi")
	}

	// Jika ada kesalahan validasi, kembalikan respons kesalahan
	if len(errors) > 0 {
		response := helpers.ResponseError{
			Code:   fiber.StatusBadRequest,
			Status: "error",
			Error:  errors,
		}
		return c.Status(fiber.StatusBadRequest).JSON(response)
	}

	// Perbarui tweet dengan data yang baru
	tweet.TweetDate = updateData.TweetDate
	tweet.FullText = updateData.FullText
	tweet.ImageURL = updateData.ImageURL
	tweet.Location = updateData.Location
	tweet.Latitude = updateData.Latitude
	tweet.Longitude = updateData.Longitude
	tweet.Username = updateData.Username
	tweet.URLProfile = updateData.URLProfile
	tweet.Category = updateData.Category
	tweet.Disaster = updateData.Disaster
	tweet.YearTweet = updateData.YearTweet
	tweet.ProvinceId = updateData.ProvinceId

	if err := initialize.DB.Save(&tweet).Error; err != nil {
		response := helpers.ResponseError{
			Code:   fiber.StatusInternalServerError,
			Status: "error",
			Error:  map[string][]string{"message": {err.Error()}},
		}
		return c.Status(fiber.StatusInternalServerError).JSON(response)
	}

	// Membuat respons sukses dengan data tweet yang diperbarui
	response := helpers.GeneralResponse{
		Code:   fiber.StatusOK,
		Status: "success",
		Data:   tweet,
	}

	return c.JSON(response)
}
func parseInt64(s string) int64 {
	i, _ := strconv.ParseInt(s, 10, 64)
	return i
}

func ImportTweetsFromCSV(c *fiber.Ctx) error {
	// Parse file from multipart form
	file, err := c.FormFile("file")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(helpers.ResponseError{
			Code:   fiber.StatusBadRequest,
			Status: "error",
			Error:  map[string][]string{"file": {"Failed to get file"}},
		})
	}

	// Open the uploaded file
	f, err := file.Open()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(helpers.ResponseError{
			Code:   fiber.StatusInternalServerError,
			Status: "error",
			Error:  map[string][]string{"file": {"Failed to open file"}},
		})
	}
	defer f.Close()

	// Create a new CSV reader with ';' as the delimiter
	reader := csv.NewReader(f)
	reader.Comma = ';' // Set the delimiter to ';'

	// Read all records
	records, err := reader.ReadAll()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(helpers.ResponseError{
			Code:   fiber.StatusInternalServerError,
			Status: "error",
			Error:  map[string][]string{"file": {"Failed to read CSV file"}},
		})
	}

	var tweets []models.Tweet

	// Skip header and iterate over the records
	for i, record := range records {
		if i == 0 {
			continue // skip header row
		}

		// Parse each record into a Tweet struct
		tweet := models.Tweet{
			TweetID:    parseInt64(record[0]),
			TweetDate:  record[1],
			FullText:   record[2],
			ImageURL:   record[3],
			Location:   record[4],
			Latitude:   record[5],
			Longitude:  record[6],
			Username:   record[7],
			URLProfile: record[8],
			Category:   record[9],
			Disaster:   record[10],
			YearTweet:  record[11],
		}

		// Append tweet to the slice
		tweets = append(tweets, tweet)
	}

	// Save all tweets to the database
	if err := initialize.DB.Create(&tweets).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(helpers.ResponseError{
			Code:   fiber.StatusInternalServerError,
			Status: "error",
			Error:  map[string][]string{"database": {"Failed to save tweets"}},
		})
	}

	// Return success response
	return c.JSON(helpers.GeneralResponse{
		Code:   fiber.StatusOK,
		Status: "success",
		Data:   tweets,
	})
}
