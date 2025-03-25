package response

type ProvinceResponse struct {
	ProvinceId int64  `json:"province_id"`
	Name       string `json:"name"`
}

type RegencyResponse struct {
	RegencyId  int64  `json:"regency_id"`
	Name       string `json:"name"`
	ProvinceId int64  `json:"province_id"`
}

type DistrictResponse struct {
	DistrictId int64  `json:"district_id"`
	Name       string `json:"name"`
	RegencyId  int64  `json:"regency_id"`
}