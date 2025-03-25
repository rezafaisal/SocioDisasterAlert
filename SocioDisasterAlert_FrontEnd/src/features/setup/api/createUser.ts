import { GeneralResponse } from "@/types/api";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { UserForm } from "../types";
type UserRequest = {
  data: UserForm;
};
export async function CreateUser({ data }: UserRequest) {
  const res = await axios.post<GeneralResponse<UserForm>>(`/user`, data);
  return res.data;
}
type UseCreateUserOptions = {
  config?: MutationConfig<typeof CreateUser>;
};

export function useCreateUser({ config }: UseCreateUserOptions = {}) {
  const queryClient = useQueryClient();
  return useMutation(CreateUser, {
    ...config,
    onSuccess: (...args) => {
      queryClient.invalidateQueries(["users"]);
      if (config?.onSuccess) {
        config.onSuccess(...args);
      }
    },
  });
}
