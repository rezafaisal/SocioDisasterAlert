import { useQuery } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { PaginatedResult, Pagination } from "@/types/api";

import { Regencies } from "../types";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

type UserReq = {
  params?: Pagination;
};

export async function getRegencies({ params }: UserReq) {
  const res = await axios.get<PaginatedResult<Regencies>>(
    "/regencies/datatable",
    {
      params,
    }
  );

  return res.data.data;
}

type QueryFnType = typeof getRegencies;

type RegenciesOptions = {
  params?: Pagination;
  config?: QueryConfig<QueryFnType>;
};

export function useRegencies({ config, params }: RegenciesOptions = {}) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["regencies", params],
    queryFn: () => getRegencies({ params }),
  });
}
