import { useQuery } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { PaginatedResult, Pagination } from "@/types/api";

import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";
import { keyword } from "@/features/maps/types";

type KeywordReq = {
  params?: Pagination;
};

export async function getKeywords({ params }: KeywordReq) {
  const res = await axios.get<PaginatedResult<keyword>>("/keywords/datatable", {
    params,
  });

  return res.data.data;
}

type QueryFnType = typeof getKeywords;

type UseKeywordOptions = {
  params?: Pagination;
  config?: QueryConfig<QueryFnType>;
};

export function useKeywords({ config, params }: UseKeywordOptions = {}) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["keywords", params],
    queryFn: () => getKeywords({ params }),
  });
}
