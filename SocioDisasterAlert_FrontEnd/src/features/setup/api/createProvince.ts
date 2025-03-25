import { GeneralResponse } from "@/types/api";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { ProvinceForm } from "../types";
type ProvinceRequest = {
  data: ProvinceForm;
};
export async function CreateProvince({ data }: ProvinceRequest) {
  const res = await axios.post<GeneralResponse<ProvinceForm>>(
    `/provinces`,
    data
  );
  return res.data;
}
type UseCreateProvinceOptions = {
  config?: MutationConfig<typeof CreateProvince>;
};

export function useCreateProvince({ config }: UseCreateProvinceOptions = {}) {
  const queryClient = useQueryClient();
  return useMutation(CreateProvince, {
    ...config,
    onSuccess: (...args) => {
      queryClient.invalidateQueries(["indonesia"]);
      queryClient.invalidateQueries(["provinces"]);
      if (config?.onSuccess) {
        config.onSuccess(...args);
      }
    },
  });
}
