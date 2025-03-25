import { GeneralResponse } from "@/types/api";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { RegenciesForm } from "../types";
type RegenciesRequest = {
  data: RegenciesForm;
};
export async function UpdateRegencies({ data }: RegenciesRequest) {
  const res = await axios.put<GeneralResponse<RegenciesForm>>(
    `/regencies/${data.regency_id}`,
    data
  );
  return res.data;
}
type UseUpdateRegenciesOptions = {
  config?: MutationConfig<typeof UpdateRegencies>;
};

export function useUpdateRegencies({ config }: UseUpdateRegenciesOptions = {}) {
  const queryClient = useQueryClient();
  return useMutation(UpdateRegencies, {
    ...config,
    onSuccess: (...args) => {
      queryClient.invalidateQueries(["regencies"]);
      if (config?.onSuccess) {
        config.onSuccess(...args);
      }
    },
  });
}
