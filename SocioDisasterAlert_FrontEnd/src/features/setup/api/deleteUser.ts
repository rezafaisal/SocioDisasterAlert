import { GeneralResponse } from "@/types/api";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { User } from "../types";

type UserRequest = {
  id: number;
};

export async function deleteUser({ id }: UserRequest) {
  const res = await axios.delete<GeneralResponse<User>>(`/user/${id}`);
  return res.data;
}
type UseDeleteUserOptions = {
  config?: MutationConfig<typeof deleteUser>;
};

export function useDeleteUser({ config }: UseDeleteUserOptions = {}) {
  const queryClient = useQueryClient();
  return useMutation(deleteUser, {
    ...config,
    onSuccess: (...args) => {
      queryClient.invalidateQueries(["users"]);
      if (config?.onSuccess) {
        config.onSuccess(...args);
      }
    },
  });
}
