package controllers

import (
	"fmt"
	"math"
	"sociadis/helpers"
	"sociadis/initialize"
	"sociadis/models"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

// CreateKeyword handles the creation of a new keyword
func CreateKeyword(c *fiber.Ctx) error {
	var keyword models.Keywords

	if err := c.BodyParser(&keyword); err != nil {
		response := helpers.ResponseError{
			Code:   fiber.StatusBadRequest,
			Status: "error",
			Error:  map[string][]string{"message": {err.Error()}},
		}
		return c.Status(fiber.StatusBadRequest).JSON(response)
	}

	if keyword.Keyword == "" {
		response := helpers.ResponseError{
			Code:   fiber.StatusBadRequest,
			Status: "error",
			Error:  map[string][]string{"keyword": {"Keyword is required"}},
		}
		return c.Status(fiber.StatusBadRequest).JSON(response)
	}

	if err := initialize.DB.Create(&keyword).Error; err != nil {
		response := helpers.ResponseError{
			Code:   fiber.StatusInternalServerError,
			Status: "error",
			Error:  map[string][]string{"database": {err.Error()}},
		}
		return c.Status(fiber.StatusInternalServerError).JSON(response)
	}

	return c.JSON(helpers.GeneralResponse{
		Code:   fiber.StatusOK,
		Status: "success",
		Data:   keyword,
	})
}

// GetKeywords retrieves all keywords
func GetKeywords(c *fiber.Ctx) error {
	var keywords []models.Keywords

	if err := initialize.DB.Find(&keywords).Error; err != nil {
		response := helpers.ResponseError{
			Code:   fiber.StatusInternalServerError,
			Status: "error",
			Error:  map[string][]string{"database": {err.Error()}},
		}
		return c.Status(fiber.StatusInternalServerError).JSON(response)
	}

	return c.JSON(helpers.GeneralResponse{
		Code:   fiber.StatusOK,
		Status: "success",
		Data:   keywords,
	})
}

// GetKeyword retrieves a single keyword by ID
func GetKeyword(c *fiber.Ctx) error {
	id, err := strconv.ParseInt(c.Params("id"), 10, 64)
	if err != nil {
		response := helpers.ResponseError{
			Code:   fiber.StatusBadRequest,
			Status: "error",
			Error:  map[string][]string{"id": {"Invalid keyword ID"}},
		}
		return c.Status(fiber.StatusBadRequest).JSON(response)
	}

	var keyword models.Keywords
	if err := initialize.DB.First(&keyword, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			response := helpers.ResponseError{
				Code:   fiber.StatusNotFound,
				Status: "error",
				Error:  map[string][]string{"id": {"Keyword not found"}},
			}
			return c.Status(fiber.StatusNotFound).JSON(response)
		}
		response := helpers.ResponseError{
			Code:   fiber.StatusInternalServerError,
			Status: "error",
			Error:  map[string][]string{"database": {err.Error()}},
		}
		return c.Status(fiber.StatusInternalServerError).JSON(response)
	}

	return c.JSON(helpers.GeneralResponse{
		Code:   fiber.StatusOK,
		Status: "success",
		Data:   keyword,
	})
}

// UpdateKeyword updates an existing keyword
func UpdateKeyword(c *fiber.Ctx) error {
	id, err := strconv.ParseInt(c.Params("id"), 10, 64)
	if err != nil {
		response := helpers.ResponseError{
			Code:   fiber.StatusBadRequest,
			Status: "error",
			Error:  map[string][]string{"id": {"Invalid keyword ID"}},
		}
		return c.Status(fiber.StatusBadRequest).JSON(response)
	}

	var keyword models.Keywords
	if err := initialize.DB.First(&keyword, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			response := helpers.ResponseError{
				Code:   fiber.StatusNotFound,
				Status: "error",
				Error:  map[string][]string{"id": {"Keyword not found"}},
			}
			return c.Status(fiber.StatusNotFound).JSON(response)
		}
		response := helpers.ResponseError{
			Code:   fiber.StatusInternalServerError,
			Status: "error",
			Error:  map[string][]string{"database": {err.Error()}},
		}
		return c.Status(fiber.StatusInternalServerError).JSON(response)
	}

	if err := c.BodyParser(&keyword); err != nil {
		response := helpers.ResponseError{
			Code:   fiber.StatusBadRequest,
			Status: "error",
			Error:  map[string][]string{"message": {err.Error()}},
		}
		return c.Status(fiber.StatusBadRequest).JSON(response)
	}

	if keyword.Keyword == "" {
		response := helpers.ResponseError{
			Code:   fiber.StatusBadRequest,
			Status: "error",
			Error:  map[string][]string{"keyword": {"Keyword is required"}},
		}
		return c.Status(fiber.StatusBadRequest).JSON(response)
	}

	if err := initialize.DB.Save(&keyword).Error; err != nil {
		response := helpers.ResponseError{
			Code:   fiber.StatusInternalServerError,
			Status: "error",
			Error:  map[string][]string{"database": {err.Error()}},
		}
		return c.Status(fiber.StatusInternalServerError).JSON(response)
	}

	return c.JSON(helpers.GeneralResponse{
		Code:   fiber.StatusOK,
		Status: "success",
		Data:   keyword,
	})
}

// DeleteKeyword deletes a keyword by ID
func DeleteKeyword(c *fiber.Ctx) error {
	id, err := strconv.ParseInt(c.Params("id"), 10, 64)
	if err != nil {
		response := helpers.ResponseError{
			Code:   fiber.StatusBadRequest,
			Status: "error",
			Error:  map[string][]string{"id": {"Invalid keyword ID"}},
		}
		return c.Status(fiber.StatusBadRequest).JSON(response)
	}

	if err := initialize.DB.Delete(&models.Keywords{}, id).Error; err != nil {
		response := helpers.ResponseError{
			Code:   fiber.StatusInternalServerError,
			Status: "error",
			Error:  map[string][]string{"database": {err.Error()}},
		}
		return c.Status(fiber.StatusInternalServerError).JSON(response)
	}

	return c.JSON(helpers.GeneralResponse{
		Code:   fiber.StatusOK,
		Status: "success",
		Data:   nil,
	})
}
func GetDatatableKeywords(c *fiber.Ctx) error {
	// Ambil nilai parameter limit, page, sort, sort_by, dan search dari query string
	limit, err := strconv.Atoi(c.Query("limit", "10"))
	if err != nil {
		limit = 10 // Nilai default untuk limit adalah 10
	}
	page, err := strconv.Atoi(c.Query("page", "1"))
	if err != nil {
		page = 1 // Halaman default adalah 1
	}
	sort := c.Query("sort", "keyword_id")
	sortBy := c.Query("sort_by", "asc")
	search := c.Query("search", "")

	// Hitung offset berdasarkan halaman dan limit
	offset := (page - 1) * limit

	// Lakukan pengambilan data dari database dengan menggunakan parameter limit, offset, sort, dan sort_by
	var keywords []models.Keywords
	query := initialize.DB.Model(&models.Keywords{})

	// Jika parameter search tidak kosong, tambahkan filter pencarian
	if search != "" {
		query = query.Where("keyword LIKE ?", "%"+search+"%")
	}

	// Jika parameter sort dan sort_by disediakan, lakukan pengurutan berdasarkan kolom yang dimaksud
	if sort != "" && sortBy != "" {
		query = query.Order(fmt.Sprintf("%s %s", sort, sortBy))
	}

	// Limit jumlah data yang diambil sesuai dengan nilai parameter limit dan offset
	query = query.Limit(limit).Offset(offset)

	// Lakukan pengambilan data
	if err := query.Find(&keywords).Error; err != nil {
		// Jika terjadi kesalahan saat mengambil data, kirim respons kesalahan ke klien
		response := helpers.ResponseError{
			Code:   500,
			Status: "Internal Server Error",
			Error:  map[string][]string{"message": {err.Error()}},
		}
		return c.Status(fiber.StatusInternalServerError).JSON(response)
	}

	// Hitung total jumlah record dengan filter pencarian
	var totalRecords int64
	countQuery := initialize.DB.Model(&models.Keywords{})
	if search != "" {
		countQuery = countQuery.Where("keyword LIKE ?", "%"+search+"%")
	}
	if err := countQuery.Count(&totalRecords).Error; err != nil {
		response := helpers.ResponseError{
			Code:   500,
			Status: "Internal Server Error",
			Error:  map[string][]string{"message": {err.Error()}},
		}
		return c.Status(fiber.StatusInternalServerError).JSON(response)
	}

	// Hitung total jumlah halaman berdasarkan total jumlah record dan limit
	totalPages := int(math.Ceil(float64(totalRecords) / float64(limit)))

	response := helpers.DataTableResponse{
		CurrentPage:  page,
		FirstPageURL: "", // Anda bisa menentukan URL halaman pertama jika perlu
		From:         offset + 1,
		LastPage:     totalPages,
		LastPageURL:  "", // Anda bisa menentukan URL halaman terakhir jika perlu
		NextPageURL:  "", // Anda bisa menentukan URL halaman berikutnya jika perlu
		PrevPageURL:  "", // Anda bisa menentukan URL halaman sebelumnya jika perlu
		To:           offset + len(keywords),
		Total:        int(totalRecords),
		Data:         make([]interface{}, len(keywords)),
	}

	for i, keyword := range keywords {
		// Buat map untuk setiap keyword
		keywordMap := map[string]interface{}{
			"keyword_id": keyword.KeywordID,
			"keyword":    keyword.Keyword,
		}

		// Tambahkan map keyword ke dalam slice Data pada respons
		response.Data[i] = keywordMap
	}

	// Kembalikan respons JSON dengan format datatable
	return c.JSON(helpers.GeneralResponse{
		Code:   200,
		Status: "OK",
		Data:   response,
	})
}
