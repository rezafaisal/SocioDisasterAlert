import { useQuery } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";
import { GeneralResponse, Pagination } from "@/types/api";
import { Tweets } from "../types";

export async function getMaps() {
  const res = await axios.get<GeneralResponse<Tweets[]>>(`/tweets`);

  return res.data.data;
}

type QueryFnType = typeof getMaps;

type UseMapsCard = {
  params?: Pagination;
  config?: QueryConfig<QueryFnType>;
};

export function useMaps({ config }: UseMapsCard = {}) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["maps"],
    queryFn: getMaps,
  });
}
