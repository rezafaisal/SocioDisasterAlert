import { useQuery } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";
import { GeneralResponse, Pagination } from "@/types/api";
import { CardDisaster } from "../types";

export async function getCardDisaster() {
  const res = await axios.get<GeneralResponse<CardDisaster>>(
    `/tweet/disaster/card`
  );

  return res.data.data;
}

type QueryFnType = typeof getCardDisaster;

type UseCardDisasterCard = {
  params?: Pagination;
  config?: QueryConfig<QueryFnType>;
};

export function useCardDisaster({ config }: UseCardDisasterCard = {}) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["card_disaster"],
    queryFn: getCardDisaster,
  });
}
