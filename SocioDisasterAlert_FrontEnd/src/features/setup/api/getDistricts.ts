import { useQuery } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { PaginatedResult, Pagination } from "@/types/api";

import { districts } from "../types";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

type UserReq = {
  params?: Pagination;
};

export async function getDistricts({ params }: UserReq) {
  const res = await axios.get<PaginatedResult<districts>>(
    "/districts/datatable",
    {
      params,
    }
  );

  return res.data.data;
}

type QueryFnType = typeof getDistricts;

type DistrictsOptions = {
  params?: Pagination;
  config?: QueryConfig<QueryFnType>;
};

export function useDistricts({ config, params }: DistrictsOptions = {}) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["districts", params],
    queryFn: () => getDistricts({ params }),
  });
}
