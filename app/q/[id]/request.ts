import { fetcher } from "@/lib/utils";
import useSWR from "swr";
import { UserStory } from "@/lib/types/story";

export function useUserList() {
  let api = `/api/users`;
  const { data, error, isLoading } = useSWR<UserStory>(api, () =>
    fetcher(api, {
      method: "GET",
      // cache: "no-store",
    }),
  );

  return {
    users: data,
    isLoading,
    isError: error,
  };
}
