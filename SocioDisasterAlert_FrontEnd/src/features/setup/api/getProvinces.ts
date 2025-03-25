import { useQuery } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { PaginatedResult, Pagination } from "@/types/api";

import { Province } from "../types";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

type UserReq = {
  params?: Pagination;
};

export async function getProvinces({ params }: UserReq) {
  const res = await axios.get<PaginatedResult<Province>>(
    "/provinces/datatable",
    {
      params,
    }
  );

  return res.data.data;
}

type QueryFnType = typeof getProvinces;

type UseUserOptions = {
  params?: Pagination;
  config?: QueryConfig<QueryFnType>;
};

export function useProvinces({ config, params }: UseUserOptions = {}) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["provinces", params],
    queryFn: () => getProvinces({ params }),
  });
}
