import { fetcher } from "@/lib/utils";
import useSWR from "swr";
import { Answer, Question } from "@/lib/types/question";

export function useQuestion(ids: string[], id?: string) {
  let api = `/api/next-question`;
  const { data, error, isLoading } = useSWR<Question>(api, () =>
    fetcher(api, {
      method: "POST",
      body: JSON.stringify({
        id,
        ids,
      }),
    }),
  );

  return {
    question: data,
    isLoading,
    isError: error,
  };
}

export function useAnswers(questionId: string) {
  let api = `/api/answers?id=${questionId}`;
  const { data, error, isLoading } = useSWR<[Answer]>(api, () =>
    fetcher(api, {
      method: "GET",
    }),
  );

  return {
    answers: data,
    isLoading,
    isError: error,
  };
}
