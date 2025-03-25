package controllers

import (
	"sociadis/helpers"
	"sociadis/initialize"
	"sociadis/models"
	"sociadis/response"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

func GetAllProvinces(c *fiber.Ctx) error {
	var provinces []models.Province
	result := initialize.DB.Select("province_id", "name").Find(&provinces)

	if result.Error != nil {
		response := helpers.ResponseError{
			Code:   500,
			Status: "error",
			Error:  map[string][]string{"message": {result.Error.Error()}},
		}
		return c.Status(500).JSON(response)
	}

	if result.RowsAffected == 0 {
		response := helpers.ResponseMessage{
			Code:    404,
			Status:  "error",
			Message: "No provinces found",
		}
		return c.Status(404).JSON(response)
	}
	var provinceResponses []response.ProvinceResponse
	for _, province := range provinces {
		provinceResponses = append(provinceResponses, response.ProvinceResponse{
			ProvinceId: province.ProvinceId,
			Name:       province.Name,
		})
	}

	response := helpers.ResponseGetAll{
		Code:   200,
		Status: "OK",
		Data:   provinceResponses,
	}

	return c.JSON(response)
}

// Get regencies by province ID
func GetRegenciesByProvinceId(c *fiber.Ctx) error {
	provinceId := c.Params("provinceId")
	var regencies []models.Regency
	result := initialize.DB.Select("regency_id", "name", "province_id").Where("province_id = ?", provinceId).Find(&regencies)

	if result.Error != nil {
		response := helpers.ResponseError{
			Code:   500,
			Status: "error",
			Error:  map[string][]string{"message": {result.Error.Error()}},
		}
		return c.Status(500).JSON(response)
	}

	if result.RowsAffected == 0 {
		response := helpers.ResponseMessage{
			Code:    404,
			Status:  "error",
			Message: "No regencies found for the given province ID",
		}
		return c.Status(404).JSON(response)
	}
	var regencyResponses []response.RegencyResponse
	for _, regency := range regencies {
		regencyResponses = append(regencyResponses, response.RegencyResponse{
			RegencyId:  regency.RegencyId,
			Name:       regency.Name,
			ProvinceId: regency.ProvinceId,
		})
	}

	response := helpers.ResponseGetAll{
		Code:   200,
		Status: "OK",
		Data:   regencyResponses,
	}

	return c.JSON(response)
}

// Get districts by regency ID
func GetDistrictsByRegencyId(c *fiber.Ctx) error {
	regencyId := c.Params("regencyId")
	var districts []models.District
	result := initialize.DB.Select("districts_id", "name", "regency_id").Where("regency_id = ?", regencyId).Find(&districts)

	if result.Error != nil {
		response := helpers.ResponseError{
			Code:   500,
			Status: "error",
			Error:  map[string][]string{"message": {result.Error.Error()}},
		}
		return c.Status(500).JSON(response)
	}

	if result.RowsAffected == 0 {
		response := helpers.ResponseMessage{
			Code:    404,
			Status:  "error",
			Message: "No districts found for the given regency ID",
		}
		return c.Status(404).JSON(response)
	}
	var districtResponses []response.DistrictResponse
	for _, district := range districts {
		districtResponses = append(districtResponses, response.DistrictResponse{
			DistrictId: district.DistrictsId,
			Name:       district.Name,
			RegencyId:  district.RegencyId,
		})
	}

	response := helpers.ResponseGetAll{
		Code:   200,
		Status: "OK",
		Data:   districtResponses,
	}

	return c.JSON(response)
}

func GetIndonesia(c *fiber.Ctx) error {
	var totalProvince, totalRegency, totalDistrict, totalKeyword int64

	// Count total provinces
	if err := initialize.DB.Model(&models.Province{}).Count(&totalProvince).Error; err != nil {
		response := fiber.Map{
			"code":    500,
			"status":  "error",
			"message": "Failed to get total provinces",
		}
		return c.Status(fiber.StatusInternalServerError).JSON(response)
	}

	// Count total regencies
	if err := initialize.DB.Model(&models.Regency{}).Count(&totalRegency).Error; err != nil {
		response := fiber.Map{
			"code":    500,
			"status":  "error",
			"message": "Failed to get total regencies",
		}
		return c.Status(fiber.StatusInternalServerError).JSON(response)
	}

	// Count total districts
	if err := initialize.DB.Model(&models.District{}).Count(&totalDistrict).Error; err != nil {
		response := fiber.Map{
			"code":    500,
			"status":  "error",
			"message": "Failed to get total districts",
		}
		return c.Status(fiber.StatusInternalServerError).JSON(response)
	}

	// Count total keywords
	if err := initialize.DB.Model(&models.Keywords{}).Count(&totalKeyword).Error; err != nil {
		response := fiber.Map{
			"code":    500,
			"status":  "error",
			"message": "Failed to get total keywords",
		}
		return c.Status(fiber.StatusInternalServerError).JSON(response)
	}

	response := fiber.Map{
		"code":   200,
		"status": "OK",
		"data": fiber.Map{
			"total_province": totalProvince,
			"total_regency":  totalRegency,
			"total_district": totalDistrict,
			"total_keyword":  totalKeyword,
		},
	}

	return c.JSON(response)
}

func CreateProvince(c *fiber.Ctx) error {
	// Bind request body ke struct Province
	var req models.Province
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "Invalid request body",
			"error":   err.Error(),
		})
	}

	if req.Name == "" {
		response := helpers.ResponseError{
			Code:   500,
			Status: "error",
			Error:  map[string][]string{"name": {"Provinsi Wajib diisi"}},
		}
		return c.Status(500).JSON(response)
	}

	// Simpan Province ke database
	if err := initialize.DB.Create(&req).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  "error",
			"message": "Failed to create Province",
			"error":   err.Error(),
		})
	}

	// Kirim respons sukses
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"status":  "success",
		"code":    200,
		"message": "Province created successfully",
		"data":    req,
	})
}

func DeleteProvince(c *fiber.Ctx) error {
	// Ambil ID Province dari URL parameter
	id := c.Params("id")

	// Cari Province berdasarkan ID
	var province models.Province
	if err := initialize.DB.Preload("Regencies").First(&province, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"status":  "error",
				"message": "Province Tidak Ada",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  "error",
			"message": "Failed to find Province",
			"error":   err.Error(),
		})
	}

	// Cek apakah Province memiliki relasi Regencies
	if len(province.Regencies) > 0 {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"status":  "error",
			"code":    404,
			"message": "Masih Terdapat Relasi",
		})
	}

	// Hapus Province dari database
	if err := initialize.DB.Delete(&province).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  "error",
			"message": "Failed to delete Province",
			"error":   err.Error(),
		})
	}

	// Kirim respons sukses
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status":  "success",
		"code":    200,
		"message": "Provinsi Berhasil Di Hapus",
	})
}

func UpdateProvince(c *fiber.Ctx) error {
	// Ambil ID Province dari URL parameter
	id := c.Params("id")

	// Bind request body ke struct Province
	var req models.Province
	if err := c.BodyParser(&req); err != nil {
		errResponse := helpers.ResponseError{
			Code:   fiber.StatusBadRequest,
			Status: "error",
			Error:  map[string][]string{"message": {err.Error()}},
		}
		return c.Status(fiber.StatusBadRequest).JSON(errResponse)
	}

	// Validasi bahwa nama Province tidak boleh kosong
	if req.Name == "" {
		errResponse := helpers.ResponseError{
			Code:   fiber.StatusBadRequest,
			Status: "error",
			Error:  map[string][]string{"name": {"Province Wajib Diisi"}},
		}
		return c.Status(fiber.StatusBadRequest).JSON(errResponse)
	}

	// Cari Province yang akan diupdate berdasarkan ID
	var province models.Province
	if err := initialize.DB.Preload("Regencies").First(&province, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			errResponse := helpers.ResponseError{
				Code:   fiber.StatusNotFound,
				Status: "error",
				Error:  map[string][]string{"message": {"Province not found"}},
			}
			return c.Status(fiber.StatusNotFound).JSON(errResponse)
		}
		errResponse := helpers.ResponseError{
			Code:   fiber.StatusInternalServerError,
			Status: "error",
			Error:  map[string][]string{"message": {err.Error()}},
		}
		return c.Status(fiber.StatusInternalServerError).JSON(errResponse)
	}
	// Update nama Province
	province.Name = req.Name

	// Mulai transaksi database
	tx := initialize.DB.Begin()

	// Simpan perubahan ke database dalam transaksi
	if err := tx.Save(&province).Error; err != nil {
		tx.Rollback()
		errResponse := helpers.ResponseError{
			Code:   fiber.StatusInternalServerError,
			Status: "error",
			Error:  map[string][]string{"message": {err.Error()}},
		}
		return c.Status(fiber.StatusInternalServerError).JSON(errResponse)
	}

	// Commit transaksi jika tidak ada error
	tx.Commit()

	// Kirim respons sukses
	response := helpers.GeneralResponse{
		Code:   fiber.StatusOK,
		Status: "success",
		Data:   province,
	}
	return c.Status(fiber.StatusOK).JSON(response)
}

type Select struct {
	Value string `json:"value"`
	Label string `json:"label"`
}

func GetProvinceSelect(c *fiber.Ctx) error {
	// Query database untuk mengambil data Province
	var provinces []models.Province
	if err := initialize.DB.Find(&provinces).Error; err != nil {
		errResponse := helpers.ResponseError{
			Code:   fiber.StatusInternalServerError,
			Status: "error",
			Error:  map[string][]string{"message": {err.Error()}},
		}
		return c.Status(fiber.StatusInternalServerError).JSON(errResponse)
	}

	// Konversi data ke format yang diinginkan
	var result []Select
	for _, p := range provinces {
		provinceSelect := Select{
			Value: strconv.FormatInt(p.ProvinceId, 10),
			Label: p.Name,
		}
		result = append(result, provinceSelect)
	}

	// Kirim response JSON
	response := helpers.GeneralResponse{
		Code:   fiber.StatusOK,
		Status: "success",
		Data:   result,
	}
	return c.Status(fiber.StatusOK).JSON(response)
}

func GetRegencySelect(c *fiber.Ctx) error {
	// Query database untuk mengambil semua data Regency
	var regencies []models.Regency
	if err := initialize.DB.Find(&regencies).Error; err != nil {
		errResponse := helpers.ResponseError{
			Code:   fiber.StatusInternalServerError,
			Status: "error",
			Error:  map[string][]string{"message": {err.Error()}},
		}
		return c.Status(fiber.StatusInternalServerError).JSON(errResponse)
	}

	// Konversi data ke format yang diinginkan
	var result []Select
	for _, r := range regencies {
		regencySelect := Select{
			Value: strconv.FormatInt(r.RegencyId, 10),
			Label: r.Name,
		}
		result = append(result, regencySelect)
	}

	// Kirim response JSON
	response := helpers.GeneralResponse{
		Code:   fiber.StatusOK,
		Status: "success",
		Data:   result,
	}
	return c.Status(fiber.StatusOK).JSON(response)
}

func CreateRegency(c *fiber.Ctx) error {
	// Bind request body ke struct Regency
	var req struct {
		Name       string `json:"name" validate:"required"`
		ProvinceID int64  `json:"province_id" validate:"required"`
	}
	if err := c.BodyParser(&req); err != nil {
		errResponse := helpers.ResponseError{
			Code:   fiber.StatusBadRequest,
			Status: "error",
			Error:  map[string][]string{"message": {"Invalid request body"}},
		}
		return c.Status(fiber.StatusBadRequest).JSON(errResponse)
	}

	// Validasi input
	errors := make(map[string][]string)
	if req.Name == "" {
		errors["name"] = append(errors["name"], "Nama Kota Wajib Diisi")
	}
	if req.ProvinceID == 0 {
		errors["province_id"] = append(errors["province_id"], "Provinsi Wajib Diisi")
	}
	if len(errors) > 0 {
		errResponse := helpers.ResponseError{
			Code:   fiber.StatusBadRequest,
			Status: "error",
			Error:  errors,
		}
		return c.Status(fiber.StatusBadRequest).JSON(errResponse)
	}

	// Simpan Regency ke database
	regency := models.Regency{
		Name:       req.Name,
		ProvinceId: req.ProvinceID,
	}
	if err := initialize.DB.Create(&regency).Error; err != nil {
		errResponse := helpers.ResponseError{
			Code:   fiber.StatusInternalServerError,
			Status: "error",
			Error:  map[string][]string{"message": {"Failed to create Regency", err.Error()}},
		}
		return c.Status(fiber.StatusInternalServerError).JSON(errResponse)
	}

	// Kirim respons sukses
	response := helpers.GeneralResponse{
		Code:   fiber.StatusCreated,
		Status: "success",
		Data:   regency,
	}
	return c.Status(fiber.StatusCreated).JSON(response)
}

func UpdateRegency(c *fiber.Ctx) error {
	// Ambil ID Regency dari parameter URL
	regencyIDParam := c.Params("id")
	regencyID, err := strconv.ParseInt(regencyIDParam, 10, 64)
	if err != nil {
		errResponse := helpers.ResponseError{
			Code:   fiber.StatusBadRequest,
			Status: "error",
			Error:  map[string][]string{"province_id": {"Kesalahan Format Id"}},
		}
		return c.Status(fiber.StatusBadRequest).JSON(errResponse)
	}

	// Bind request body ke struct Regency
	var req struct {
		Name       string `json:"name" validate:"required"`
		ProvinceID int64  `json:"province_id" validate:"required"`
	}
	if err := c.BodyParser(&req); err != nil {
		errResponse := helpers.ResponseError{
			Code:   fiber.StatusBadRequest,
			Status: "error",
			Error:  map[string][]string{"message": {"Invalid request body"}},
		}
		return c.Status(fiber.StatusBadRequest).JSON(errResponse)
	}

	// Validasi input
	errors := make(map[string][]string)
	if req.Name == "" {
		errors["name"] = append(errors["name"], "Nama Kota Tidak Boleh Kosong")
	}
	if req.ProvinceID == 0 {
		errors["province_id"] = append(errors["province_id"], "Provinsi Wajib Diisi")
	}
	if len(errors) > 0 {
		errResponse := helpers.ResponseError{
			Code:   fiber.StatusBadRequest,
			Status: "error",
			Error:  errors,
		}
		return c.Status(fiber.StatusBadRequest).JSON(errResponse)
	}

	// Cari Regency berdasarkan ID
	var regency models.Regency
	if err := initialize.DB.First(&regency, regencyID).Error; err != nil {
		errResponse := helpers.ResponseMessage{
			Code:    fiber.StatusNotFound,
			Status:  "error",
			Message: "Regency Tidak Tersedia",
		}
		return c.Status(fiber.StatusNotFound).JSON(errResponse)
	}

	// Update data Regency
	regency.Name = req.Name
	regency.ProvinceId = req.ProvinceID
	if err := initialize.DB.Save(&regency).Error; err != nil {
		errResponse := helpers.ResponseMessage{
			Code:    fiber.StatusInternalServerError,
			Status:  "error",
			Message: "Gagal Memperbaharui Kota",
		}
		return c.Status(fiber.StatusInternalServerError).JSON(errResponse)
	}

	// Kirim respons sukses
	response := helpers.ResponseMessage{
		Code:    fiber.StatusOK,
		Status:  "success",
		Message: "Berhasil Memperbaharui Kota",
	}
	return c.Status(fiber.StatusOK).JSON(response)
}
func DeleteRegency(c *fiber.Ctx) error {
	// Ambil ID Regency dari parameter URL
	regencyIDParam := c.Params("id")
	regencyID, err := strconv.ParseInt(regencyIDParam, 10, 64)
	if err != nil {
		errResponse := helpers.ResponseError{
			Code:   fiber.StatusBadRequest,
			Status: "error",
			Error:  map[string][]string{"message": {"Invalid regency_id"}},
		}
		return c.Status(fiber.StatusBadRequest).JSON(errResponse)
	}

	// Cari Regency berdasarkan ID
	var regency models.Regency
	if err := initialize.DB.Preload(clause.Associations).First(&regency, regencyID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			errResponse := helpers.ResponseError{
				Code:   fiber.StatusNotFound,
				Status: "error",
				Error:  map[string][]string{"message": {"Regency not found"}},
			}
			return c.Status(fiber.StatusNotFound).JSON(errResponse)
		}
		errResponse := helpers.ResponseError{
			Code:   fiber.StatusInternalServerError,
			Status: "error",
			Error:  map[string][]string{"message": {err.Error()}},
		}
		return c.Status(fiber.StatusInternalServerError).JSON(errResponse)
	}

	// Cek apakah Regency masih memiliki relasi dengan tabel Districts
	if len(regency.Districts) > 0 {
		errResponse := helpers.ResponseMessage{
			Code:    fiber.StatusBadRequest,
			Status:  "error",
			Message: "Data Masih Memiliki Relasi",
		}
		return c.Status(fiber.StatusBadRequest).JSON(errResponse)
	}

	// Hapus Regency dari database
	if err := initialize.DB.Delete(&regency).Error; err != nil {
		errResponse := helpers.ResponseError{
			Code:   fiber.StatusInternalServerError,
			Status: "error",
			Error:  map[string][]string{"message": {"Failed to delete Regency", err.Error()}},
		}
		return c.Status(fiber.StatusInternalServerError).JSON(errResponse)
	}

	// Kirim respons sukses
	response := helpers.GeneralResponse{
		Code:   fiber.StatusOK,
		Status: "success",
		Data:   map[string]string{"message": "Regency deleted successfully"},
	}
	return c.Status(fiber.StatusOK).JSON(response)
}

func CreateDistrict(c *fiber.Ctx) error {
	// Bind request body ke struct District
	var req struct {
		Name      string `json:"name" validate:"required"`
		RegencyID int64  `json:"regency_id" validate:"required"`
	}
	if err := c.BodyParser(&req); err != nil {
		errResponse := helpers.ResponseError{
			Code:   fiber.StatusBadRequest,
			Status: "error",
			Error:  map[string][]string{"message": {"Invalid request body"}},
		}
		return c.Status(fiber.StatusBadRequest).JSON(errResponse)
	}

	// Validasi input
	errors := make(map[string][]string)
	if req.Name == "" {
		errors["name"] = append(errors["name"], "Nama Distrik Wajib diisi")
	}
	if req.RegencyID == 0 {
		errors["regency_id"] = append(errors["regency_id"], "Nama Kota Wajib Diisi")
	}
	if len(errors) > 0 {
		errResponse := helpers.ResponseError{
			Code:   fiber.StatusBadRequest,
			Status: "error",
			Error:  errors,
		}
		return c.Status(fiber.StatusBadRequest).JSON(errResponse)
	}

	// Simpan District ke database
	district := models.District{
		Name:      req.Name,
		RegencyId: req.RegencyID,
	}
	if err := initialize.DB.Create(&district).Error; err != nil {
		errResponse := helpers.ResponseMessage{
			Code:    fiber.StatusInternalServerError,
			Status:  "error",
			Message: "Gagal Menambahkan Data",
		}
		return c.Status(fiber.StatusInternalServerError).JSON(errResponse)
	}

	// Kirim respons sukses
	response := helpers.GeneralResponse{
		Code:   fiber.StatusCreated,
		Status: "success",
		Data:   district,
	}
	return c.Status(fiber.StatusCreated).JSON(response)
}
func UpdateDistrict(c *fiber.Ctx) error {
	// Ambil ID District dari parameter URL
	districtIDParam := c.Params("id")
	districtID, err := strconv.ParseInt(districtIDParam, 10, 64)
	if err != nil {
		errResponse := helpers.ResponseError{
			Code:   fiber.StatusBadRequest,
			Status: "error",
			Error:  map[string][]string{"message": {"Invalid district_id"}},
		}
		return c.Status(fiber.StatusBadRequest).JSON(errResponse)
	}

	// Bind request body ke struct District
	var req struct {
		Name      string `json:"name" validate:"required"`
		RegencyID int64  `json:"regency_id" validate:"required"`
	}
	if err := c.BodyParser(&req); err != nil {
		errResponse := helpers.ResponseError{
			Code:   fiber.StatusBadRequest,
			Status: "error",
			Error:  map[string][]string{"message": {"Invalid request body"}},
		}
		return c.Status(fiber.StatusBadRequest).JSON(errResponse)
	}

	// Validasi input
	errors := make(map[string][]string)
	if req.Name == "" {
		errors["name"] = append(errors["name"], "Nama Distrik Wajib Diisi")
	}
	if req.RegencyID == 0 {
		errors["regency_id"] = append(errors["regency_id"], "Nama Kota / Kabupaten Wajib Diisi")
	}
	if len(errors) > 0 {
		errResponse := helpers.ResponseError{
			Code:   fiber.StatusBadRequest,
			Status: "error",
			Error:  errors,
		}
		return c.Status(fiber.StatusBadRequest).JSON(errResponse)
	}

	// Cari District berdasarkan ID
	var district models.District
	if err := initialize.DB.First(&district, districtID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			errResponse := helpers.ResponseError{
				Code:   fiber.StatusNotFound,
				Status: "error",
				Error:  map[string][]string{"message": {"District not found"}},
			}
			return c.Status(fiber.StatusNotFound).JSON(errResponse)
		}
		errResponse := helpers.ResponseError{
			Code:   fiber.StatusInternalServerError,
			Status: "error",
			Error:  map[string][]string{"message": {err.Error()}},
		}
		return c.Status(fiber.StatusInternalServerError).JSON(errResponse)
	}

	// Update District
	district.Name = req.Name
	district.RegencyId = req.RegencyID
	if err := initialize.DB.Save(&district).Error; err != nil {
		errResponse := helpers.ResponseMessage{
			Code:    fiber.StatusInternalServerError,
			Status:  "error",
			Message: "Gagal Memperbaharui Data",
		}
		return c.Status(fiber.StatusInternalServerError).JSON(errResponse)
	}

	// Kirim respons sukses
	response := helpers.GeneralResponse{
		Code:   fiber.StatusOK,
		Status: "success",
		Data:   district,
	}
	return c.Status(fiber.StatusOK).JSON(response)
}
func DeleteDistrict(c *fiber.Ctx) error {
	// Ambil ID District dari parameter URL
	districtIDParam := c.Params("id")
	districtID, err := strconv.ParseInt(districtIDParam, 10, 64)
	if err != nil {
		errResponse := helpers.ResponseMessage{
			Code:    fiber.StatusBadRequest,
			Status:  "error",
			Message: "Invalid Data",
		}
		return c.Status(fiber.StatusBadRequest).JSON(errResponse)
	}

	// Cari District berdasarkan ID
	var district models.District
	if err := initialize.DB.First(&district, districtID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			errResponse := helpers.ResponseMessage{
				Code:    fiber.StatusNotFound,
				Status:  "error",
				Message: "Data Distrik Tidak Ada",
			}
			return c.Status(fiber.StatusNotFound).JSON(errResponse)
		}
		errResponse := helpers.ResponseError{
			Code:   fiber.StatusInternalServerError,
			Status: "error",
			Error:  map[string][]string{"message": {err.Error()}},
		}
		return c.Status(fiber.StatusInternalServerError).JSON(errResponse)
	}

	// Hapus District dari database
	if err := initialize.DB.Delete(&district).Error; err != nil {
		errResponse := helpers.ResponseMessage{
			Code:    fiber.StatusInternalServerError,
			Status:  "error",
			Message: "Data Distrik Gagal Dihapus",
		}
		return c.Status(fiber.StatusInternalServerError).JSON(errResponse)
	}

	// Kirim respons sukses
	response := helpers.GeneralResponse{
		Code:   fiber.StatusOK,
		Status: "success",
		Data:   map[string]string{"message": "District deleted successfully"},
	}
	return c.Status(fiber.StatusOK).JSON(response)
}
