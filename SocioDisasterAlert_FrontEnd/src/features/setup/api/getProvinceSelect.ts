import { useQuery } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";
import { GeneralResponse, Pagination } from "@/types/api";
import { SelectString } from "../types";

export async function getProvinceSelect() {
  const res = await axios.get<GeneralResponse<SelectString[]>>(
    `/provinces/select`
  );

  return res.data.data;
}

type QueryFnType = typeof getProvinceSelect;

type UseProvincesCard = {
  params?: Pagination;
  config?: QueryConfig<QueryFnType>;
};

export function useProvinceSelect({ config }: UseProvincesCard = {}) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["provinces"],
    queryFn: getProvinceSelect,
  });
}
