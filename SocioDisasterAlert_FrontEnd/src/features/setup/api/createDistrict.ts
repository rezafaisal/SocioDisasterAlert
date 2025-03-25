import { GeneralResponse } from "@/types/api";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { DistrictsForm } from "../types";
type DistrictRequest = {
  data: DistrictsForm;
};
export async function CreateDisctrict({ data }: DistrictRequest) {
  const res = await axios.post<GeneralResponse<DistrictsForm>>(
    `/districts`,
    data
  );
  return res.data;
}
type UseCreateDisctrictOptions = {
  config?: MutationConfig<typeof CreateDisctrict>;
};

export function useCreateDisctrict({ config }: UseCreateDisctrictOptions = {}) {
  const queryClient = useQueryClient();
  return useMutation(CreateDisctrict, {
    ...config,
    onSuccess: (...args) => {
      queryClient.invalidateQueries(["districts"]);
      queryClient.invalidateQueries(["indonesia"]);
      if (config?.onSuccess) {
        config.onSuccess(...args);
      }
    },
  });
}
