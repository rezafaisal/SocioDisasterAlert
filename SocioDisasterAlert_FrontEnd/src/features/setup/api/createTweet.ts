import { GeneralResponse } from "@/types/api";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { TweetsForm } from "@/features/maps/types";
type TweetRequest = {
  data: TweetsForm;
};
export async function CreateTweet({ data }: TweetRequest) {
  const res = await axios.post<GeneralResponse<TweetsForm>>(`/tweets`, data);
  return res.data;
}
type UseCreateTweetOptions = {
  config?: MutationConfig<typeof CreateTweet>;
};

export function useCreateTweet({ config }: UseCreateTweetOptions = {}) {
  const queryClient = useQueryClient();
  return useMutation(CreateTweet, {
    ...config,
    onSuccess: (...args) => {
      queryClient.invalidateQueries(["tweets"]);
      if (config?.onSuccess) {
        config.onSuccess(...args);
      }
    },
  });
}
