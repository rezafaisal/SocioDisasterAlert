import { GeneralResponse } from "@/types/api";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { keywordForm } from "@/features/maps/types";

type KeywordRequest = {
  data: keywordForm;
};

export async function UpdateKeyword({ data }: KeywordRequest) {
  const res = await axios.put<GeneralResponse<keywordForm>>(
    `/Keywords/${data.keyword_id}`,
    data
  );
  return res.data;
}
type UseUpdateKeywordOptions = {
  config?: MutationConfig<typeof UpdateKeyword>;
};

export function useUpdateKeyword({ config }: UseUpdateKeywordOptions = {}) {
  const queryClient = useQueryClient();
  return useMutation(UpdateKeyword, {
    ...config,
    onSuccess: (...args) => {
      queryClient.invalidateQueries(["keywords"]);
      if (config?.onSuccess) {
        config.onSuccess(...args);
      }
    },
  });
}
