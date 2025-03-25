import { GeneralResponse } from "@/types/api";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { keywordForm } from "@/features/maps/types";
type KeywordRequest = {
  data: keywordForm;
};
export async function CreateKeyword({ data }: KeywordRequest) {
  const res = await axios.post<GeneralResponse<keywordForm>>(`/Keywords`, data);
  return res.data;
}
type UseCreateKeywordOptions = {
  config?: MutationConfig<typeof CreateKeyword>;
};

export function useCreateKeyword({ config }: UseCreateKeywordOptions = {}) {
  const queryClient = useQueryClient();
  return useMutation(CreateKeyword, {
    ...config,
    onSuccess: (...args) => {
      queryClient.invalidateQueries(["keywords"]);
      if (config?.onSuccess) {
        config.onSuccess(...args);
      }
    },
  });
}
