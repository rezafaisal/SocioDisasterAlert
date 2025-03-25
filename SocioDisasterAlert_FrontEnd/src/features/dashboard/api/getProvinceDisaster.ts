import { useQuery } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";
import { ChartResult } from "@/types/api";
import { ChartTypeProvince } from "../data";

export type QueryDisasterProvince = {
  year?: string;
};
type reqTotal = {
  params?: QueryDisasterProvince;
};
export async function getDisasterProvince({ params }: reqTotal) {
  const res = await axios.get<ChartResult<ChartTypeProvince>>(
    `/tweet/disaster/province`,
    {
      params,
    }
  );

  return res.data.data;
}

type QueryFnType = typeof getDisasterProvince;

type UseDisasterProvinceCard = {
  params?: QueryDisasterProvince;
  config?: QueryConfig<QueryFnType>;
};

export function useDisasterProvince({
  config,
  params,
}: UseDisasterProvinceCard = {}) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["tweets_province", params],
    queryFn: () => getDisasterProvince({ params }),
  });
}
