package main

import (
	"os"
	"sociadis/controllers"
	"sociadis/initialize"
	"sociadis/middleware"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	initialize.ConnectDatabase()

	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowMethods: "*",
	}))
	// Base
	api := app.Group("/api")
	app.Static("/public", "./public")
	// auth
	api.Post("/auth", controllers.LoginUser)
	api.Get("/auth/profile", middleware.MultiRoleMiddleware("Customer", "Admin"), controllers.GetProfile)

	api.Get("/provinces", controllers.GetAllProvinces)
	api.Get("/provinces/select", middleware.MultiRoleMiddleware("Admin"), controllers.GetProvinceSelect)
	api.Post("/provinces", middleware.MultiRoleMiddleware("Admin"), controllers.CreateProvince)
	api.Put("/provinces/:id", middleware.MultiRoleMiddleware("Admin"), controllers.UpdateProvince)
	api.Delete("/provinces/:id", middleware.MultiRoleMiddleware("Admin"), controllers.DeleteProvince)

	api.Get("/provinces/datatable", middleware.MultiRoleMiddleware("Admin"), controllers.GetDatatableProvinces)
	api.Get("/regencies/datatable", middleware.MultiRoleMiddleware("Admin"), controllers.GetDatatableRegencies)
	api.Get("/districts/datatable", middleware.MultiRoleMiddleware("Admin"), controllers.GetDatatableDistricts)
	api.Get("/tweet/datatable", middleware.MultiRoleMiddleware("Admin"), controllers.GetDatatableTweets)
	api.Get("/tweet/disaster", controllers.GetTweetStatistics)
	api.Get("/tweet/disaster/total", controllers.GetMonthlyDisasterCounts)
	api.Get("/tweet/disaster/province", controllers.GetProvinceDisasterCounts)
	api.Get("/tweet/disaster/card", controllers.GetTotalCard)
	api.Get("/tweet/banjir", controllers.GetBanjirTweets)
	api.Get("/tweet/kebakaran", controllers.GetKebakaranTweets)
	api.Get("/tweet/gempa", controllers.GetGempaTweets)
	api.Get("/tweets", controllers.GetAllTweets)
	api.Post("/tweets", middleware.MultiRoleMiddleware("Admin"), controllers.CreateTweet)
	api.Delete("/tweets/:id", middleware.MultiRoleMiddleware("Admin"), controllers.DeleteTweet)
	api.Put("/tweets/:id", middleware.MultiRoleMiddleware("Admin"), controllers.UpdateTweet)
	api.Get("/indonesia", middleware.MultiRoleMiddleware("Admin"), middleware.MultiRoleMiddleware("Admin"), controllers.GetIndonesia)
	api.Get("/regencies/select", middleware.MultiRoleMiddleware("Admin"), controllers.GetRegencySelect)
	api.Post("/regencies", middleware.MultiRoleMiddleware("Admin"), controllers.CreateRegency)
	api.Put("/regencies/:id", middleware.MultiRoleMiddleware("Admin"), controllers.UpdateRegency)
	api.Delete("/regencies/:id", middleware.MultiRoleMiddleware("Admin"), controllers.DeleteRegency)
	api.Get("/districts/:regencyId", middleware.MultiRoleMiddleware("Admin"), controllers.GetDistrictsByRegencyId)
	api.Put("/districts/:id", middleware.MultiRoleMiddleware("Admin"), controllers.UpdateDistrict)
	api.Delete("/districts/:id", middleware.MultiRoleMiddleware("Admin"), controllers.DeleteDistrict)
	api.Post("/districts/", middleware.MultiRoleMiddleware("Admin"), controllers.CreateDistrict)

	api.Post("/keywords", middleware.MultiRoleMiddleware("Admin"), controllers.CreateKeyword)
	api.Get("/keywords", middleware.MultiRoleMiddleware("Admin"), controllers.GetKeywords)
	api.Get("/keywords/datatable", middleware.MultiRoleMiddleware("Admin"), controllers.GetDatatableKeywords)
	api.Get("/keywords/:id", middleware.MultiRoleMiddleware("Admin"), controllers.GetKeyword)
	api.Put("/keywords/:id", middleware.MultiRoleMiddleware("Admin"), controllers.UpdateKeyword)
	api.Delete("/keywords/:id", middleware.MultiRoleMiddleware("Admin"), controllers.DeleteKeyword)

	user := api.Group("/user")
	user.Get("/", middleware.MultiRoleMiddleware("Admin"), controllers.GetAllUser)
	user.Post("/", middleware.MultiRoleMiddleware("Admin"), controllers.CreateUser)
	user.Put("/:id", middleware.MultiRoleMiddleware("Admin"), controllers.UpdateUser)
	user.Delete("/:id", middleware.MultiRoleMiddleware("Admin"), controllers.DeleteUser)
	user.Get("/datatable", middleware.MultiRoleMiddleware("Admin"), controllers.GetDatatableUsers)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8000" // Default port jika variabel lingkungan PORT tidak ditemukan
	}

	app.Listen(":" + port)
}
