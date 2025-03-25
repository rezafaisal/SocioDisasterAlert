import { GeneralResponse } from "@/types/api";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { ProvinceForm } from "../types";
type ProvinceRequest = {
  data: ProvinceForm;
};
export async function UpdateProvince({ data }: ProvinceRequest) {
  const res = await axios.put<GeneralResponse<ProvinceForm>>(
    `/provinces/${data.province_id}`,
    data
  );
  return res.data;
}
type UseUpdateProvinceOptions = {
  config?: MutationConfig<typeof UpdateProvince>;
};

export function useUpdateProvince({ config }: UseUpdateProvinceOptions = {}) {
  const queryClient = useQueryClient();
  return useMutation(UpdateProvince, {
    ...config,
    onSuccess: (...args) => {
      queryClient.invalidateQueries(["provinces"]);
      if (config?.onSuccess) {
        config.onSuccess(...args);
      }
    },
  });
}
