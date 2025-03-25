import { GeneralResponse } from "@/types/api";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { Province } from "../types";

type ProvinceRequest = {
  id: number;
};

export async function deleteProvince({ id }: ProvinceRequest) {
  const res = await axios.delete<GeneralResponse<Province>>(`/provinces/${id}`);
  return res.data;
}
type UseDeleteProvinceOptions = {
  config?: MutationConfig<typeof deleteProvince>;
};

export function useDeleteProvince({ config }: UseDeleteProvinceOptions = {}) {
  const queryClient = useQueryClient();
  return useMutation(deleteProvince, {
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
