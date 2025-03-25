import { GeneralResponse } from "@/types/api";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { RegenciesForm } from "../types";
type RegenciesRequest = {
  data: RegenciesForm;
};
export async function CreateRegencies({ data }: RegenciesRequest) {
  const res = await axios.post<GeneralResponse<RegenciesForm>>(
    `/regencies`,
    data
  );
  return res.data;
}
type UseCreateRegenciesOptions = {
  config?: MutationConfig<typeof CreateRegencies>;
};

export function useCreateRegencies({ config }: UseCreateRegenciesOptions = {}) {
  const queryClient = useQueryClient();
  return useMutation(CreateRegencies, {
    ...config,
    onSuccess: (...args) => {
      queryClient.invalidateQueries(["indonesia"]);
      queryClient.invalidateQueries(["regencies"]);
      if (config?.onSuccess) {
        config.onSuccess(...args);
      }
    },
  });
}
