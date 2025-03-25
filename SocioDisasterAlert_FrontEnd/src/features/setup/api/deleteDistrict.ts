import { GeneralResponse } from "@/types/api";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { districts } from "../types";

type DistrictRequest = {
  id: number;
};

export async function deleteDistrict({ id }: DistrictRequest) {
  const res = await axios.delete<GeneralResponse<districts>>(
    `/districts/${id}`
  );
  return res.data;
}
type UseDeleteDistrictOptions = {
  config?: MutationConfig<typeof deleteDistrict>;
};

export function useDeleteDistrict({ config }: UseDeleteDistrictOptions = {}) {
  const queryClient = useQueryClient();
  return useMutation(deleteDistrict, {
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
