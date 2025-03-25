import { useQuery } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";
import { GeneralResponse, Pagination } from "@/types/api";
import { Tweets } from "../types";

export async function getEarthQuakeMaps() {
  const res = await axios.get<GeneralResponse<Tweets[]>>(`/tweet/gempa`);

  return res.data.data;
}

type QueryFnType = typeof getEarthQuakeMaps;

type UseEarthQuakeMapsCard = {
  params?: Pagination;
  config?: QueryConfig<QueryFnType>;
};

export function useEarthQuakeMaps({ config }: UseEarthQuakeMapsCard = {}) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["earthquake"],
    queryFn: getEarthQuakeMaps,
  });
}
