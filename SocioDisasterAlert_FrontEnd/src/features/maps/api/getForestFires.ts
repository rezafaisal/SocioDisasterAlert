import { useQuery } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";
import { GeneralResponse, Pagination } from "@/types/api";
import { Tweets } from "../types";

export async function getForestMaps() {
  const res = await axios.get<GeneralResponse<Tweets[]>>(`/tweet/kebakaran`);

  return res.data.data;
}

type QueryFnType = typeof getForestMaps;

type UseForestMapsCard = {
  params?: Pagination;
  config?: QueryConfig<QueryFnType>;
};

export function useForestMaps({ config }: UseForestMapsCard = {}) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["forest"],
    queryFn: getForestMaps,
  });
}
