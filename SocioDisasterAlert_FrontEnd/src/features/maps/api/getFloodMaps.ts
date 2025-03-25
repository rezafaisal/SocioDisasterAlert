import { useQuery } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";
import { GeneralResponse, Pagination } from "@/types/api";
import { Tweets } from "../types";

export async function getFloodMaps() {
  const res = await axios.get<GeneralResponse<Tweets[]>>(`/tweet/banjir`);

  return res.data.data;
}

type QueryFnType = typeof getFloodMaps;

type UseFloodMapsCard = {
  params?: Pagination;
  config?: QueryConfig<QueryFnType>;
};

export function useFloodMaps({ config }: UseFloodMapsCard = {}) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["flood"],
    queryFn: getFloodMaps,
  });
}
