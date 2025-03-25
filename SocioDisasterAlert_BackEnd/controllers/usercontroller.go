package controllers

import (
	"math"
	"os"
	"sociadis/body"
	"sociadis/helpers"
	"sociadis/initialize"
	"sociadis/models"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func GetAllUser(c *fiber.Ctx) error {
	var user []models.User
	initialize.DB.Find(&user)

	response := helpers.ResponseGetAll{
		Code:   200,
		Status: "OK",
		Data:   user,
	}

	return c.JSON(response)
}
func LoginUser(c *fiber.Ctx) error {
	var req body.LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(helpers.ResponseMessage{
			Code:    fiber.StatusBadRequest,
			Status:  "Bad Request",
			Message: "Invalid request body",
		})
	}

	// Ambil data pengguna dari database berdasarkan email
	var user models.User
	if err := initialize.DB.Where("user_name = ?", req.Username).First(&user).Error; err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(helpers.ResponseMessage{
			Code:    fiber.StatusUnauthorized,
			Status:  "Unauthorized",
			Message: "Invalid Username or password",
		})
	}

	// Periksa kecocokan password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(helpers.ResponseMessage{
			Code:    fiber.StatusUnauthorized,
			Status:  "Unauthorized",
			Message: "Invalid username or password",
		})
	}
	token := jwt.New(jwt.SigningMethodHS256)

	// Set klaim JWT
	claims := token.Claims.(jwt.MapClaims)
	claims["user_id"] = user.UserId
	claims["username"] = user.UserName
	claims["email"] = user.Email
	claims["full_name"] = user.FullName
	claims["role"] = user.Role
	claims["exp"] = time.Now().Add(time.Hour * 24).Unix() // Token berlaku selama 24 jam

	// Tanda tangani token dengan secret key
	secret := []byte(os.Getenv("JWT_SECRET"))
	if secret == nil {
		return c.Status(fiber.StatusInternalServerError).JSON(helpers.ResponseMessage{
			Code:    fiber.StatusInternalServerError,
			Status:  "Internal Server Error",
			Message: "JWT secret key not found",
		})
	}
	tokenString, err := token.SignedString(secret)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(helpers.ResponseMessage{
			Code:    fiber.StatusInternalServerError,
			Status:  "Internal Server Error",
			Message: "Failed to sign JWT token",
		})
	}
	c.Set("Authorization", "Bearer "+tokenString)
	// Kirim token JWT dan model User dalam respons
	res := helpers.GeneralResponse{
		Code:   fiber.StatusOK,
		Status: "OK",
		Data: map[string]interface{}{
			"access_token": tokenString,
			"user":         user,
		},
	}
	return c.JSON(res)
}
func GetProfile(c *fiber.Ctx) error {
	// Ambil ID pengguna dari lokal konteks
	userID, ok := c.Locals("userID").(float64)
	if !ok {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"code":    fiber.StatusInternalServerError,
			"status":  "Internal Server Error",
			"message": "Failed to get user ID from token",
		})
	}

	// Query database untuk mendapatkan profil pengguna berdasarkan ID
	var user models.User
	if err := initialize.DB.Where("user_id = ?", int64(userID)).First(&user).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"code":    fiber.StatusNotFound,
			"status":  "Not Found",
			"message": "User not found",
		})
	}

	// Kirim respons dengan profil pengguna
	return c.JSON(fiber.Map{
		"code":   fiber.StatusOK,
		"status": "OK",
		"data":   user,
	})
}
func GetDatatableUsers(c *fiber.Ctx) error {
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
	var users []models.User
	query := initialize.DB.Model(&models.User{})

	// Jika parameter search tidak kosong, tambahkan filter pencarian
	if search != "" {
		query = query.Where("full_name LIKE ? OR user_name LIKE ? OR email LIKE ?", "%"+search+"%", "%"+search+"%", "%"+search+"%")
	}

	// Jika parameter sort dan sort_by disediakan, lakukan pengurutan berdasarkan kolom yang dimaksud
	if sort != "" && sortBy != "" {
		query = query.Order(sortBy + " " + sort)
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
	if err := query.Find(&users).Error; err != nil {
		// Jika terjadi kesalahan saat mengambil data, kirim respons kesalahan ke klien
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
		To:           offset + len(users),
		Total:        int(totalRecords),
		Data:         make([]interface{}, len(users)),
	}

	for i, user := range users {
		// Buat map untuk setiap pengguna
		userMap := map[string]interface{}{
			"user_id":    user.UserId,
			"full_name":  user.FullName,
			"username":   user.UserName,
			"email":      user.Email,
			"role":       user.Role,
			"created_at": user.CreatedAt,
			"updated_at": user.UpdatedAt,
		}

		// Tambahkan map pengguna ke dalam slice Data pada respons
		response.Data[i] = userMap
	}

	// Kembalikan respons JSON dengan format datatable
	return c.JSON(helpers.GeneralResponse{
		Code:   200,
		Status: "OK",
		Data:   response,
	})
}
func CreateUser(c *fiber.Ctx) error {
	var user models.User

	// Parsing body request
	if err := c.BodyParser(&user); err != nil {
		response := helpers.ResponseError{
			Code:   fiber.StatusBadRequest,
			Status: "error",
			Error:  map[string][]string{"message": {"Failed to parse request body"}},
		}
		return c.Status(fiber.StatusBadRequest).JSON(response)
	}

	// Validasi field yang diperlukan
	validationErrors := make(map[string][]string)
	if user.FullName == "" {
		validationErrors["full_name"] = append(validationErrors["full_name"], "Nama Lengkap Wajib Diisi")
	}
	if user.UserName == "" {
		validationErrors["username"] = append(validationErrors["username"], "Username Wajib Diisi")
	}
	if user.Password == "" {
		validationErrors["password"] = append(validationErrors["password"], "Password Wajib Diisi")
	}
	if user.Email == "" {
		validationErrors["email"] = append(validationErrors["email"], "Email Wajib Diisi")
	}
	if user.Role == "" {
		validationErrors["role"] = append(validationErrors["role"], "Role Wajib Diisi")
	}

	// Jika ada kesalahan validasi, kembalikan respons kesalahan
	if len(validationErrors) > 0 {
		response := helpers.ResponseError{
			Code:   fiber.StatusBadRequest,
			Status: "error",
			Error:  validationErrors,
		}
		return c.Status(fiber.StatusBadRequest).JSON(response)
	}
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		response := helpers.ResponseError{
			Code:   fiber.StatusInternalServerError,
			Status: "error",
			Error:  map[string][]string{"message": {"Failed to hash password"}},
		}
		return c.Status(fiber.StatusInternalServerError).JSON(response)
	}
	user.Password = string(hashedPassword)

	// Simpan data user ke database
	if err := initialize.DB.Create(&user).Error; err != nil {
		response := helpers.ResponseError{
			Code:   fiber.StatusInternalServerError,
			Status: "error",
			Error:  map[string][]string{"message": {err.Error()}},
		}
		return c.Status(fiber.StatusInternalServerError).JSON(response)
	}

	// Membuat respons sukses dengan data user yang baru
	response := helpers.GeneralResponse{
		Code:   fiber.StatusOK,
		Status: "success",
		Data:   user,
	}

	return c.JSON(response)
}
func UpdateUser(c *fiber.Ctx) error {
	userIDParam := c.Params("id")

	// Validasi apakah userID adalah integer
	userID, err := strconv.ParseInt(userIDParam, 10, 64)
	if err != nil {
		response := helpers.ResponseError{
			Code:   fiber.StatusBadRequest,
			Status: "error",
			Error:  map[string][]string{"message": {"Invalid user ID"}},
		}
		return c.Status(fiber.StatusBadRequest).JSON(response)
	}

	// Cari user berdasarkan user_id
	var user models.User
	if err := initialize.DB.First(&user, userID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			response := helpers.ResponseError{
				Code:   fiber.StatusNotFound,
				Status: "error",
				Error:  map[string][]string{"message": {"User not found"}},
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
	var updateData models.User
	if err := c.BodyParser(&updateData); err != nil {
		response := helpers.ResponseError{
			Code:   fiber.StatusBadRequest,
			Status: "error",
			Error:  map[string][]string{"message": {"Failed to parse request body"}},
		}
		return c.Status(fiber.StatusBadRequest).JSON(response)
	}

	// Validasi field yang diperlukan
	validationErrors := make(map[string][]string)
	if updateData.FullName == "" {
		validationErrors["full_name"] = append(validationErrors["full_name"], "Nama Lengkap Wajib Diisi")
	}
	if updateData.UserName == "" {
		validationErrors["username"] = append(validationErrors["username"], "Username Wajib Diisi")
	}
	if updateData.Email == "" {
		validationErrors["email"] = append(validationErrors["email"], "Email Wajib Diisi")
	}
	if updateData.Role == "" {
		validationErrors["role"] = append(validationErrors["role"], "Role Wajib Diisi")
	}

	// Jika ada kesalahan validasi, kembalikan respons kesalahan
	if len(validationErrors) > 0 {
		response := helpers.ResponseError{
			Code:   fiber.StatusBadRequest,
			Status: "error",
			Error:  validationErrors,
		}
		return c.Status(fiber.StatusBadRequest).JSON(response)
	}

	// Perbarui user dengan data yang baru
	user.FullName = updateData.FullName
	user.UserName = updateData.UserName
	user.Email = updateData.Email
	user.Role = updateData.Role

	if err := initialize.DB.Save(&user).Error; err != nil {
		response := helpers.ResponseError{
			Code:   fiber.StatusInternalServerError,
			Status: "error",
			Error:  map[string][]string{"message": {err.Error()}},
		}
		return c.Status(fiber.StatusInternalServerError).JSON(response)
	}

	// Membuat respons sukses dengan data user yang diperbarui
	response := helpers.GeneralResponse{
		Code:   fiber.StatusOK,
		Status: "success",
		Data:   user,
	}

	return c.JSON(response)
}

func DeleteUser(c *fiber.Ctx) error {
	userIDParam := c.Params("id")

	// Validasi apakah userID adalah integer
	userID, err := strconv.ParseInt(userIDParam, 10, 64)
	if err != nil {
		response := helpers.ResponseError{
			Code:   fiber.StatusBadRequest,
			Status: "error",
			Error:  map[string][]string{"message": {"Invalid user ID"}},
		}
		return c.Status(fiber.StatusBadRequest).JSON(response)
	}

	// Cari user berdasarkan user_id
	var user models.User
	if err := initialize.DB.First(&user, userID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			response := helpers.ResponseError{
				Code:   fiber.StatusNotFound,
				Status: "error",
				Error:  map[string][]string{"message": {"User not found"}},
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

	// Hapus user dari database
	if err := initialize.DB.Delete(&user).Error; err != nil {
		response := helpers.ResponseError{
			Code:   fiber.StatusInternalServerError,
			Status: "error",
			Error:  map[string][]string{"message": {err.Error()}},
		}
		return c.Status(fiber.StatusInternalServerError).JSON(response)
	}

	// Membuat respons sukses setelah user dihapus
	response := helpers.GeneralResponse{
		Code:   fiber.StatusOK,
		Status: "success",
		Data:   map[string]string{"message": "User deleted successfully"},
	}

	return c.JSON(response)
}
