import { useQuery } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";
import { ChartResult } from "@/types/api";
import { ChartType } from "../data";

export type QueryDisaster = {
  year?: string;
};
type Request = {
  params?: QueryDisaster;
};
export async function getDisaster({ params }: Request) {
  const res = await axios.get<ChartResult<ChartType>>(`/tweet/disaster`, {
    params,
  });

  return res.data.data;
}

type QueryFnType = typeof getDisaster;

type UseDisasterCard = {
  params?: QueryDisaster;
  config?: QueryConfig<QueryFnType>;
};

export function useDisaster({ config, params }: UseDisasterCard = {}) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["tweets_disaster", params],
    queryFn: () => getDisaster({ params }),
  });
}
