import { GeneralResponse } from "@/types/api";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { keyword } from "@/features/maps/types";

type KeywordRequest = {
  id: number;
};

export async function deleteKeyword({ id }: KeywordRequest) {
  const res = await axios.delete<GeneralResponse<keyword>>(`/Keywords/${id}`);
  return res.data;
}
type UseDeleteKeywordOptions = {
  config?: MutationConfig<typeof deleteKeyword>;
};

export function useDeleteKeyword({ config }: UseDeleteKeywordOptions = {}) {
  const queryClient = useQueryClient();
  return useMutation(deleteKeyword, {
    ...config,
    onSuccess: (...args) => {
      queryClient.invalidateQueries(["keywords"]);
      if (config?.onSuccess) {
        config.onSuccess(...args);
      }
    },
  });
}
