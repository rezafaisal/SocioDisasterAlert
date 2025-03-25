import { GeneralResponse } from "@/types/api";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { DistrictsForm } from "../types";
type DistrictRequest = {
  data: DistrictsForm;
};
export async function UpdateDistrict({ data }: DistrictRequest) {
  const res = await axios.put<GeneralResponse<DistrictsForm>>(
    `/districts/${data.district_id}`,
    data
  );
  return res.data;
}
type UseUpdateDistrictOptions = {
  config?: MutationConfig<typeof UpdateDistrict>;
};

export function useUpdateDistrict({ config }: UseUpdateDistrictOptions = {}) {
  const queryClient = useQueryClient();
  return useMutation(UpdateDistrict, {
    ...config,
    onSuccess: (...args) => {
      queryClient.invalidateQueries(["districts"]);
      if (config?.onSuccess) {
        config.onSuccess(...args);
      }
    },
  });
}
