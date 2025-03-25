import { Pagination } from "@/types/api";

export type Province = {
  province_id: number;
  name: string;
};
export type ProvinceForm = {
  province_id?: number;
  name: string;
};
export type Regencies = {
  regency_id: number;
  name: string;
  province: string;
  province_id: number;
};
export type RegenciesForm = {
  regency_id?: number;
  name: string;
  province_id: number;
};
export type districts = {
  district_id: number;
  name: string;
  regencies: string;
  regency_id: number;
};
export type DistrictsForm = {
  district_id?: number;
  name: string;
  regency_id: number;
};

export type QueryTweet = {
  category?: string | "Berita" | "Saksi Mata";
  disaster?: string | "Kebakaran Hutan" | "Banjir" | "Gempa Bumi";
} & Pagination;

export type Tweet = {
  tweet_id: number;
  tweet_date: string;
  full_text: string;
  image_url: string;
  location: string;
  latitude: number;
  longitude: number;
  username: string;
  url_profile: string;
  category: string;
  disaster: string;
  created_at: string;
  updated_at: string;
};

export type SelectString = {
  value: string;
  label: string;
};
export type SelectValue = {
  value: number;
  label: string;
};

export type User = {
  user_id: number;
  full_name: string;
  username: string;
  password: string;
  email: string;
  role: string;
  created_at: Date;
  updated_at: Date;
};
export type UserForm = {
  user_id?: number;
  full_name: string;
  username: string;
  password?: string;
  email: string;
  role: string;
  created_at?: Date;
  updated_at?: Date;
};
export const Category: SelectString[] = [
  { value: "Berita", label: "Berita" },
  { value: "Saksi Mata", label: "Saksi Mata" },
];
export const Disaster: SelectString[] = [
  { value: "Gempa Bumi", label: "Gempa Bumi" },
  { value: "Banjir", label: "Banjir" },
  { value: "Kebakaran Hutan", label: "Kebakaran Hutan" },
];
export const role: SelectString[] = [
  { value: "Customer", label: "Customer" },
  { value: "Admin", label: "Admin" },
];
export const years: SelectString[] = [
  { value: "2017", label: "2017" },
  { value: "2018", label: "2018" },
  { value: "2019", label: "2019" },
  { value: "2020", label: "2020" },
  { value: "2021", label: "2021" },
  { value: "2022", label: "2022" },
  { value: "2023", label: "2023" },
  { value: "2024", label: "2024" },
];
