import { useQuery } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";
import { GeneralResponse, Pagination } from "@/types/api";
import { CardIndonesia } from "../types";

export async function getIndonesia() {
  const res = await axios.get<GeneralResponse<CardIndonesia>>(`/indonesia`);

  return res.data.data;
}

type QueryFnType = typeof getIndonesia;

type UseIndonesiaCard = {
  params?: Pagination;
  config?: QueryConfig<QueryFnType>;
};

export function useIndonesia({ config }: UseIndonesiaCard = {}) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["indonesia"],
    queryFn: getIndonesia,
  });
}
