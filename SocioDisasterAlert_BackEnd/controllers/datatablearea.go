package controllers

import (
	"fmt"
	"math"
	"sociadis/helpers"
	"sociadis/initialize"
	"sociadis/models"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

func GetDatatableProvinces(c *fiber.Ctx) error {
	// Ambil nilai parameter limit, page, sort, sort_by, dan search dari query string
	limit, _ := strconv.Atoi(c.Query("limit"))
	page, _ := strconv.Atoi(c.Query("page"))
	sort := c.Query("sort")
	sortBy := c.Query("sort_by")
	search := c.Query("search")

	// Tentukan default nilai jika parameter tidak ada
	if limit <= 0 {
		limit = 10 // Nilai default untuk limit adalah 10
	}
	if page <= 0 {
		page = 1 // Halaman default adalah 1
	}

	// Hitung offset berdasarkan halaman dan limit
	offset := (page - 1) * limit

	// Lakukan pengambilan data dari database dengan menggunakan parameter limit, offset, sort, dan sort_by
	var provinces []models.Province
	query := initialize.DB.Model(&models.Province{})

	// Jika parameter search tidak kosong, tambahkan filter pencarian
	if search != "" {
		query = query.Where("name LIKE ?", "%"+search+"%")
	}

	// Jika parameter sort dan sort_by disediakan, lakukan pengurutan berdasarkan kolom yang dimaksud
	if sort != "" && sortBy != "" {
		query = query.Order(fmt.Sprintf("%s %s", sortBy, sort))
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

	// Limit jumlah data yang diambil sesuai dengan nilai parameter limit dan offset
	query = query.Limit(limit).Offset(offset)

	// Lakukan pengambilan data
	if err := query.Find(&provinces).Error; err != nil {
		// Jika terjadi kesalahan saat mengambil produk, kirim respons kesalahan ke klien
		response := helpers.GeneralResponse{
			Code:   500,
			Status: "Internal Server Error",
			Data:   nil,
		}
		return c.Status(fiber.StatusInternalServerError).JSON(response)
	}

	// Hitung total jumlah record tanpa paginasi

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
		To:           offset + len(provinces),
		Total:        int(totalRecords),
		Data:         make([]interface{}, len(provinces)),
	}

	for i, province := range provinces {
		// Buat map untuk setiap provinsi
		provinceMap := map[string]interface{}{
			"province_id": province.ProvinceId,
			"name":        province.Name,
		}

		// Tambahkan map provinsi ke dalam slice Data pada respons
		response.Data[i] = provinceMap
	}

	// Kembalikan respons JSON dengan format datatable
	return c.JSON(helpers.GeneralResponse{
		Code:   200,
		Status: "OK",
		Data:   response,
	})
}

func GetDatatableRegencies(c *fiber.Ctx) error {
	// Ambil nilai parameter limit, page, sort, sort_by, dan search dari query string
	limit, _ := strconv.Atoi(c.Query("limit"))
	page, _ := strconv.Atoi(c.Query("page"))
	sort := c.Query("sort")
	sortBy := c.Query("sort_by")
	search := c.Query("search")

	// Tentukan default nilai jika parameter tidak ada
	if limit <= 0 {
		limit = 10 // Nilai default untuk limit adalah 10
	}
	if page <= 0 {
		page = 1 // Halaman default adalah 1
	}

	// Hitung offset berdasarkan halaman dan limit
	offset := (page - 1) * limit

	// Lakukan pengambilan data dari database dengan menggunakan parameter limit, offset, sort, dan sort_by
	var regencies []models.Regency
	query := initialize.DB.Preload("Province").Model(&models.Regency{})

	// Jika parameter search tidak kosong, tambahkan filter pencarian
	if search != "" {
		query = query.Where("name LIKE ?", "%"+search+"%")
	}

	// Jika parameter sort dan sort_by disediakan, lakukan pengurutan berdasarkan kolom yang dimaksud
	if sort != "" && sortBy != "" {
		query = query.Order(fmt.Sprintf("%s %s", sortBy, sort))
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
	// Limit jumlah data yang diambil sesuai dengan nilai parameter limit dan offset
	query = query.Limit(limit).Offset(offset)

	// Lakukan pengambilan data
	if err := query.Find(&regencies).Error; err != nil {
		response := helpers.ResponseMessage{
			Code:    500,
			Status:  "Internal Server Error",
			Message: "Kesalahan Server",
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
		To:           offset + len(regencies),
		Total:        int(totalRecords),
		Data:         make([]interface{}, len(regencies)),
	}

	for i, regency := range regencies {
		// Buat map untuk setiap regency
		regencyMap := map[string]interface{}{
			"regency_id":  regency.RegencyId,
			"name":        regency.Name,
			"province":    regency.Province.Name,
			"province_id": strconv.FormatInt(regency.Province.ProvinceId, 10),
		}

		// Tambahkan map regency ke dalam slice Data pada respons
		response.Data[i] = regencyMap
	}

	// Kembalikan respons JSON dengan format datatable
	return c.JSON(helpers.GeneralResponse{
		Code:   200,
		Status: "OK",
		Data:   response,
	})
}

func GetDatatableDistricts(c *fiber.Ctx) error {
	// Ambil nilai parameter limit, page, sort, sort_by, dan search dari query string
	limit, _ := strconv.Atoi(c.Query("limit"))
	page, _ := strconv.Atoi(c.Query("page"))
	sort := c.Query("sort")
	sortBy := c.Query("sort_by")
	search := c.Query("search")

	// Tentukan default nilai jika parameter tidak ada
	if limit <= 0 {
		limit = 10 // Nilai default untuk limit adalah 10
	}
	if page <= 0 {
		page = 1 // Halaman default adalah 1
	}

	// Hitung offset berdasarkan halaman dan limit
	offset := (page - 1) * limit

	// Lakukan pengambilan data dari database dengan menggunakan parameter limit, offset, sort, dan sort_by
	var districts []models.District
	query := initialize.DB.Preload("Regency").Model(&models.District{})

	// Jika parameter search tidak kosong, tambahkan filter pencarian
	if search != "" {
		query = query.Where("name LIKE ?", "%"+search+"%")
	}

	// Jika parameter sort dan sort_by disediakan, lakukan pengurutan berdasarkan kolom yang dimaksud
	if sort != "" && sortBy != "" {
		query = query.Order(fmt.Sprintf("%s %s", sortBy, sort))
	}

	// Hitung total jumlah record setelah filter diterapkan
	var totalRecords int64
	if err := query.Count(&totalRecords).Error; err != nil {
		response := helpers.ResponseMessage{
			Code:    500,
			Status:  "Internal Server Error",
			Message: "Gagal Menghitung Pagination",
		}
		return c.Status(fiber.StatusInternalServerError).JSON(response)
	}

	// Limit jumlah data yang diambil sesuai dengan nilai parameter limit dan offset
	query = query.Limit(limit).Offset(offset)

	// Lakukan pengambilan data
	if err := query.Find(&districts).Error; err != nil {
		// Jika terjadi kesalahan saat mengambil produk, kirim respons kesalahan ke klien
		response := helpers.ResponseMessage{
			Code:    500,
			Status:  "Internal Server Error",
			Message: "Gagal Mendapatkan Data",
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
		To:           offset + len(districts),
		Total:        int(totalRecords),
		Data:         make([]interface{}, len(districts)),
	}

	for i, district := range districts {
		// Buat map untuk setiap district
		districtMap := map[string]interface{}{
			"district_id": district.DistrictsId,
			"name":        district.Name,
			"regencies":   district.Regency.Name,
			"regency_id":  strconv.FormatInt(district.Regency.RegencyId, 10),
		}

		// Tambahkan map district ke dalam slice Data pada respons
		response.Data[i] = districtMap
	}

	// Kembalikan respons JSON dengan format datatable
	return c.JSON(helpers.GeneralResponse{
		Code:   200,
		Status: "OK",
		Data:   response,
	})
}
