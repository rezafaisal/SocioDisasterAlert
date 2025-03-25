import { GeneralResponse } from "@/types/api";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { Regencies } from "../types";

type RegenciesRequest = {
  id: number;
};

export async function deleteRegencies({ id }: RegenciesRequest) {
  const res = await axios.delete<GeneralResponse<Regencies>>(
    `/regencies/${id}`
  );
  return res.data;
}
type UseDeleteRegenciesOptions = {
  config?: MutationConfig<typeof deleteRegencies>;
};

export function useDeleteRegencies({ config }: UseDeleteRegenciesOptions = {}) {
  const queryClient = useQueryClient();
  return useMutation(deleteRegencies, {
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
