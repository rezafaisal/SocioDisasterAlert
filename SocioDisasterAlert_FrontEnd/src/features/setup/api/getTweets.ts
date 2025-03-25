import { useQuery } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { PaginatedResult, Pagination } from "@/types/api";

import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";
import { Tweets } from "@/features/maps/types";

type TweetReq = {
  params?: Pagination;
};

export async function getTweets({ params }: TweetReq) {
  const res = await axios.get<PaginatedResult<Tweets>>("/tweet/datatable", {
    params,
  });

  return res.data.data;
}

type QueryFnType = typeof getTweets;

type UseTweetOptions = {
  params?: Pagination;
  config?: QueryConfig<QueryFnType>;
};

export function useTweets({ config, params }: UseTweetOptions = {}) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["tweets", params],
    queryFn: () => getTweets({ params }),
  });
}
