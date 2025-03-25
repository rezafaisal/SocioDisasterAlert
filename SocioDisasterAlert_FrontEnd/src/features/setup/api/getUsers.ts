import { useQuery } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { PaginatedResult, Pagination } from "@/types/api";

import { User } from "../types";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

type UserReq = {
  params?: Pagination;
};

export async function getUsers({ params }: UserReq) {
  const res = await axios.get<PaginatedResult<User>>("/user/datatable", {
    params,
  });

  return res.data.data;
}

type QueryFnType = typeof getUsers;

type UseUserOptions = {
  params?: Pagination;
  config?: QueryConfig<QueryFnType>;
};

export function useUsers({ config, params }: UseUserOptions = {}) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["users", params],
    queryFn: () => getUsers({ params }),
  });
}
