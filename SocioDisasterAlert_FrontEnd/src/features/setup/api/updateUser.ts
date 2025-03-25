import { GeneralResponse } from "@/types/api";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { UserForm } from "../types";

type UserRequest = {
  data: UserForm;
};

export async function UpdateUser({ data }: UserRequest) {
  const res = await axios.put<GeneralResponse<UserForm>>(
    `/user/${data.user_id}`,
    data
  );
  return res.data;
}
type UseUpdateUserOptions = {
  config?: MutationConfig<typeof UpdateUser>;
};

export function useUpdateUser({ config }: UseUpdateUserOptions = {}) {
  const queryClient = useQueryClient();
  return useMutation(UpdateUser, {
    ...config,
    onSuccess: (...args) => {
      queryClient.invalidateQueries(["users"]);
      if (config?.onSuccess) {
        config.onSuccess(...args);
      }
    },
  });
}
