import { fetcher } from "@/lib/utils";
import useSWR from "swr";
import { Answer, Question } from "@/lib/types/question";

export function useRandomQuestion() {
  let api = `/api/question`;
  const { data, error, isLoading } = useSWR<Question>(api, () =>
    fetcher(api, {
      method: "GET",
    }),
  );

  return {
    question: data,
    isLoading,
    isError: error,
  };
}

export function useAnswers(questionId: string) {
  let api = `/api/answers`;
  const { data, error, isLoading } = useSWR<[Answer]>(api, () =>
    fetcher(api, {
      method: "POST",
      body: JSON.stringify({
        id: questionId,
      }),
    }),
  );

  return {
    answers: data,
    isLoading,
    isError: error,
  };
}
