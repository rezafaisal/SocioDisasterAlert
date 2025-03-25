import { useQuery } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";
import { GeneralResponse, Pagination } from "@/types/api";
import { SelectString } from "../types";

export async function getRegencieselect() {
  const res = await axios.get<GeneralResponse<SelectString[]>>(
    `/regencies/select`
  );

  return res.data.data;
}

type QueryFnType = typeof getRegencieselect;

type UseRegenciesCard = {
  params?: Pagination;
  config?: QueryConfig<QueryFnType>;
};

export function useRegencieSelect({ config }: UseRegenciesCard = {}) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["regencies"],
    queryFn: getRegencieselect,
  });
}
