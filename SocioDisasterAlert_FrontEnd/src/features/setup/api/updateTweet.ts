import { GeneralResponse } from "@/types/api";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { TweetsForm } from "@/features/maps/types";

type TweetRequest = {
  data: TweetsForm;
};

export async function UpdateTweet({ data }: TweetRequest) {
  const res = await axios.put<GeneralResponse<TweetsForm>>(
    `/tweets/${data.tweet_id}`,
    data
  );
  return res.data;
}
type UseUpdateTweetOptions = {
  config?: MutationConfig<typeof UpdateTweet>;
};

export function useUpdateTweet({ config }: UseUpdateTweetOptions = {}) {
  const queryClient = useQueryClient();
  return useMutation(UpdateTweet, {
    ...config,
    onSuccess: (...args) => {
      queryClient.invalidateQueries(["tweets"]);
      if (config?.onSuccess) {
        config.onSuccess(...args);
      }
    },
  });
}
