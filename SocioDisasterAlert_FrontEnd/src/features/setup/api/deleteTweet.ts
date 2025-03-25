import { GeneralResponse } from "@/types/api";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { Tweets } from "@/features/maps/types";

type TweetRequest = {
  id: number;
};

export async function deleteTweet({ id }: TweetRequest) {
  const res = await axios.delete<GeneralResponse<Tweets>>(`/tweets/${id}`);
  return res.data;
}
type UseDeleteTweetOptions = {
  config?: MutationConfig<typeof deleteTweet>;
};

export function useDeleteTweet({ config }: UseDeleteTweetOptions = {}) {
  const queryClient = useQueryClient();
  return useMutation(deleteTweet, {
    ...config,
    onSuccess: (...args) => {
      queryClient.invalidateQueries(["tweets"]);
      if (config?.onSuccess) {
        config.onSuccess(...args);
      }
    },
  });
}
