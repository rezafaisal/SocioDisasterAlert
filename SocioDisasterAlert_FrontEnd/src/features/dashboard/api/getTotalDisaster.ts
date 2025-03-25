import { useQuery } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";
import { ChartResult } from "@/types/api";
import { ChartType } from "../data";

export type QueryTotalDisaster = {
  year?: string;
};
type reqTotal = {
  params?: QueryTotalDisaster;
};
export async function getTotalDisaster({ params }: reqTotal) {
  const res = await axios.get<ChartResult<ChartType>>(`/tweet/disaster/total`, {
    params,
  });

  return res.data.data;
}

type QueryFnType = typeof getTotalDisaster;

type UseTotalDisasterCard = {
  params?: QueryTotalDisaster;
  config?: QueryConfig<QueryFnType>;
};

export function useTotalDisaster({
  config,
  params,
}: UseTotalDisasterCard = {}) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["tweets_time", params],
    queryFn: () => getTotalDisaster({ params }),
  });
}
